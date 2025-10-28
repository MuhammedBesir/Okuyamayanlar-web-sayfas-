import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reviews = await prisma.review.findMany({
      where: { bookId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { rating, content } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user already reviewed this book
    const existingReview = await prisma.review.findFirst({
      where: {
        bookId: id,
        userId: session.user.id
      }
    })

    if (existingReview) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          content: content || null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      })
      return NextResponse.json(updatedReview)
    } else {
      // Create new review
      const review = await prisma.review.create({
        data: {
          bookId: id,
          userId: session.user.id,
          rating,
          content: content || null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      })
      return NextResponse.json(review, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 })
    }

    // Check if review exists and belongs to user or user is admin
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.review.delete({
      where: { id: reviewId }
    })

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
