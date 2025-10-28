import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: topicId } = await params

    // Check if already liked
    const existingLike = await prisma.forumTopicLike.findUnique({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId: topicId
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.forumTopicLike.delete({
        where: { id: existingLike.id }
      })
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.forumTopicLike.create({
        data: {
          userId: session.user.id,
          topicId: topicId
        }
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
