import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin } from "@/lib/admin"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; replyId: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const replyId = params.replyId
    const body = await request.json()
    const { content, image, link } = body

    // Check if reply exists and user is owner
    const reply = await prisma.forumReply.findUnique({
      where: { id: replyId },
      select: { userId: true }
    })

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    if (reply.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedReply = await prisma.forumReply.update({
      where: { id: replyId },
      data: {
        content,
        image: image || null,
        link: link || null
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

    return NextResponse.json(updatedReply)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; replyId: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const replyId = params.replyId

    // Check if reply exists
    const reply = await prisma.forumReply.findUnique({
      where: { id: replyId },
      select: { userId: true }
    })

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    // Check if user is owner or admin
    const isAdmin = isSuperAdmin(session.user.email)
    const isOwner = reply.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.forumReply.delete({
      where: { id: replyId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
