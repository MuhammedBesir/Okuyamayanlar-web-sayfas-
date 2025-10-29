import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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

    // Profil sayfasını yeniden doğrula
    revalidatePath('/profile')
    revalidatePath('/reading-list')

    return NextResponse.json(readingListItem)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    // Find and delete the reading list item
    const deleted = await prisma.readingList.deleteMany({
      where: {
        userId: session.user.id,
        bookId: bookId
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Book not found in reading list" }, { status: 404 })
    }

    // Profil sayfasını yeniden doğrula
    revalidatePath('/profile')
    revalidatePath('/reading-list')

    return NextResponse.json({ success: true, message: "Book removed from reading list" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
