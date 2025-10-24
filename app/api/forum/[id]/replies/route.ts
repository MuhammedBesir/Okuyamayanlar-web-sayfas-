import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: topicId } = await params
    const body = await request.json()
    const { content, image, link, parentReplyId } = body

    // Check if topic exists and is not locked
    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      select: { locked: true }
    })

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    if (topic.locked) {
      return NextResponse.json({ error: "Topic is locked" }, { status: 403 })
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        image: image || null,
        link: link || null,
        topicId,
        userId: session.user.id,
        parentReplyId: parentReplyId || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Bildirim gönder - topic sahibine ve parent reply sahibine
    const fullTopic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      select: { userId: true, title: true }
    })

    // Topic sahibine bildirim (kendi yorumu değilse)
    if (fullTopic && fullTopic.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: fullTopic.userId,
          title: "Yeni Yorum",
          message: `"${fullTopic.title}" başlığına ${session.user.name || 'Bir kullanıcı'} yorum yaptı.`,
          link: `/forum/${topicId}`
        }
      })
    }

    // Parent reply sahibine bildirim (varsa ve kendi yorumu değilse)
    if (parentReplyId) {
      const parentReply = await prisma.forumReply.findUnique({
        where: { id: parentReplyId },
        select: { userId: true, content: true }
      })

      if (parentReply && parentReply.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: parentReply.userId,
            title: "Yorumunuza Yanıt",
            message: `${session.user.name || 'Bir kullanıcı'} yorumunuza yanıt verdi.`,
            link: `/forum/${topicId}`
          }
        })
      }
    }

    return NextResponse.json(reply)
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
