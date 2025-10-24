import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const readingList = await prisma.readingList.findMany({
      where: { userId: session.user.id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
            genre: true,
            publishedYear: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(readingList)
  } catch (error) {
    console.error('Error fetching reading list:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bookId } = body

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if already in reading list
    const existing = await prisma.readingList.findFirst({
      where: {
        userId: session.user.id,
        bookId: bookId
      }
    })

    if (existing) {
      return NextResponse.json({ error: "Book already in reading list" }, { status: 400 })
    }

    // Add to reading list
    const readingListItem = await prisma.readingList.create({
      data: {
        userId: session.user.id,
        bookId: bookId,
        status: "to-read"
      },
      include: {
        book: true
      }
    })

    return NextResponse.json(readingListItem)
  } catch (error) {
    console.error('Error adding to reading list:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
