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

    const { id: replyId } = await params

    // Check if already liked
    const existingLike = await prisma.forumReplyLike.findUnique({
      where: {
        userId_replyId: {
          userId: session.user.id,
          replyId: replyId
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.forumReplyLike.delete({
        where: { id: existingLike.id }
      })
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.forumReplyLike.create({
        data: {
          userId: session.user.id,
          replyId: replyId
        }
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling reply like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
