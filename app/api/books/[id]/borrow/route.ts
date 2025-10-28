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

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (!book.available) {
      return NextResponse.json({ error: "Book is not available" }, { status: 400 })
    }

    // Set due date to 30 days from now
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)
    const borrowedAt = new Date()

    // Get user details for log
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    })

    // Update book status
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        available: false,
        borrowedBy: session.user.id,
        borrowedAt: borrowedAt,
        dueDate: dueDate
      }
    })

    // Create borrow log
    if (user) {
      await prisma.borrowLog.create({
        data: {
          bookId: bookId,
          bookTitle: book.title,
          bookAuthor: book.author,
          userId: session.user.id,
          userName: user.name || "Bilinmiyor",
          userEmail: user.email,
          borrowedAt: borrowedAt,
          dueDate: dueDate,
          status: "BORROWED"
        }
      })
    }

    return NextResponse.json(updatedBook)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
