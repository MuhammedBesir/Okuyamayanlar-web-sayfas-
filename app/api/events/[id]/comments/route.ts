import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Yorumları getir
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const eventId = params.id

    const comments = await prisma.eventComment.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                readingLists: true,
                forumTopics: true,
                forumReplies: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Her yorum için kullanıcı seviyesini hesapla
    const commentsWithLevel = await Promise.all(
      comments.map(async (comment) => {
        const completedBooks = await prisma.readingList.count({
          where: { 
            userId: comment.user.id,
            OR: [
              { status: 'COMPLETED' },
              { status: 'completed' }
            ]
          }
        })

        const activityScore = (completedBooks * 10) + 
                            (comment.user._count.forumTopics * 5) + 
                            (comment.user._count.forumReplies * 2)
        const level = Math.floor(activityScore / 100) + 1

        return {
          ...comment,
          user: {
            ...comment.user,
            level,
            activityScore,
          },
        }
      })
    )

    return NextResponse.json({ comments: commentsWithLevel })
  } catch (error) {
    console.error("Comments fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// Yorum ekle
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const eventId = params.id
    const body = await request.json()
    const { content, rating } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Etkinliğin COMPLETED olduğunu kontrol et
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { status: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.status !== 'COMPLETED') {
      return NextResponse.json({ 
        error: "Comments can only be added to completed events" 
      }, { status: 400 })
    }

    // Kullanıcının bu etkinliğe daha önce yorum yapıp yapmadığını kontrol et
    const existingComment = await prisma.eventComment.findFirst({
      where: {
        eventId,
        userId: session.user.id,
      },
    })

    if (existingComment) {
      return NextResponse.json({ 
        error: "Bu etkinliğe zaten yorum yaptınız. Her etkinliğe sadece bir kez yorum yapabilirsiniz." 
      }, { status: 400 })
    }

    const comment = await prisma.eventComment.create({
      data: {
        eventId,
        userId: session.user.id,
        content: content.trim(),
        rating: rating ? parseInt(rating) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

// Yorum güncelle
export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    const body = await request.json()
    const { content, rating } = body

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Yorumun sahibini kontrol et
    const comment = await prisma.eventComment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Sadece yorum sahibi düzenleyebilir
    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedComment = await prisma.eventComment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        rating: rating ? parseInt(rating) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ comment: updatedComment })
  } catch (error) {
    console.error("Comment update error:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

// Yorum sil
export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    // Yorumun sahibini kontrol et
    const comment = await prisma.eventComment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Sadece yorum sahibi veya admin silebilir
    if (comment.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.eventComment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error) {
    console.error("Comment deletion error:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
