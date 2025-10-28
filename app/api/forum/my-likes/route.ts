import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const likes = await prisma.forumTopicLike.findMany({
      where: { userId: session.user.id },
      select: { topicId: true }
    })

    const likedTopicIds = likes.map(like => like.topicId)
    
    return NextResponse.json({ likedTopicIds })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
