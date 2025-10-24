import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const bookId = params.id

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if the current user borrowed this book
    if (book.borrowedBy !== session.user.id) {
      return NextResponse.json({ error: "You did not borrow this book" }, { status: 403 })
    }

    const now = new Date()
    const isOverdue = book.dueDate ? now > book.dueDate : false

    // Update borrow log
    const activeLog = await prisma.borrowLog.findFirst({
      where: {
        bookId: bookId,
        userId: session.user.id,
        status: "BORROWED"
      },
      orderBy: { borrowedAt: 'desc' }
    })

    if (activeLog) {
      await prisma.borrowLog.update({
        where: { id: activeLog.id },
        data: {
          returnedAt: now,
          status: isOverdue ? "OVERDUE" : "RETURNED"
        }
      })
    }

    // Return the book
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        available: true,
        borrowedBy: null,
        borrowedAt: null,
        dueDate: null
      }
    })

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error('Error returning book:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
