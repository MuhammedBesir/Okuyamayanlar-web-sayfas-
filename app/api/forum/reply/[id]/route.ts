import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: replyId } = await params
    const body = await request.json()
    const { content, image, link } = body

    // Check if user is owner or admin
    const reply = await prisma.forumReply.findUnique({
      where: { id: replyId },
      select: { 
        userId: true,
        content: true
      }
    })

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const isAdmin = session.user.role === "ADMIN"
    const isOwner = reply.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if content changed
    const contentChanged = content && content !== reply.content

    const updatedReply = await prisma.forumReply.update({
      where: { id: replyId },
      data: {
        content,
        image: image !== undefined ? image : undefined,
        link: link !== undefined ? link : undefined,
        edited: contentChanged ? true : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    return NextResponse.json(updatedReply)
  } catch (error) {
    console.error('Error updating reply:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: replyId } = await params

    // Check if user is owner or admin
    const reply = await prisma.forumReply.findUnique({
      where: { id: replyId },
      select: { userId: true }
    })

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const isAdmin = session.user.role === "ADMIN"
    const isOwner = reply.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.forumReply.delete({
      where: { id: replyId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reply:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
