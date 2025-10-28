import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin } from "@/lib/admin"
import { calculateUserLevelFromDB } from "@/lib/user-level"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: topicId } = await params
    const { searchParams } = new URL(request.url)
    const incrementView = searchParams.get('incrementView') === 'true'

    // Increment views only on initial page load, not on refreshes
    if (incrementView) {
      await prisma.forumTopic.update({
        where: { id: topicId },
        data: { views: { increment: 1 } }
      })
    }

    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            userBadges: {
              take: 1,
              orderBy: {
                badge: {
                  order: 'asc' // En düşük order numarası = en önemli rozet
                }
              },
              include: {
                badge: {
                  select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true,
                    isSpecial: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                userBadges: {
                  take: 1,
                  orderBy: {
                    badge: {
                      order: 'asc' // En düşük order numarası = en önemli rozet
                    }
                  },
                  include: {
                    badge: {
                      select: {
                        id: true,
                        name: true,
                        icon: true,
                        color: true,
                        isSpecial: true
                      }
                    }
                  }
                }
              }
            },
            parentReply: {
              select: {
                id: true,
                content: true,
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          },
          orderBy: [
            { likes: { _count: 'desc' } }, // En çok beğenilen önce
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    // Calculate user levels for topic author and all reply authors
    const topicAuthorLevel = await calculateUserLevelFromDB(topic.userId, prisma)
    
    const replyUserIds = [...new Set(topic.replies.map(reply => reply.userId))]
    const replyUserLevels = await Promise.all(
      replyUserIds.map(async userId => ({
        userId,
        level: await calculateUserLevelFromDB(userId, prisma)
      }))
    )
    const levelMap = Object.fromEntries(replyUserLevels.map(u => [u.userId, u.level]))

    // Add level info to topic and replies
    const enrichedTopic = {
      ...topic,
      user: {
        ...topic.user,
        userLevel: topicAuthorLevel
      },
      replies: topic.replies.map(reply => ({
        ...reply,
        user: {
          ...reply.user,
          userLevel: levelMap[reply.userId]
        }
      }))
    }

    return NextResponse.json(enrichedTopic)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: topicId } = await params
    const body = await request.json()
    const { title, content, category, image, pinned, locked } = body

    // Check if user is admin or topic owner
    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      select: { 
        userId: true,
        title: true,
        content: true
      }
    })

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    const isAdmin = isSuperAdmin(session.user.email)
    const isOwner = topic.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only admin can change pinned/locked status
    const updateData: any = {}
    let contentChanged = false
    
    if (isOwner) {
      if (title && title !== topic.title) {
        updateData.title = title
        contentChanged = true
      }
      if (content && content !== topic.content) {
        updateData.content = content
        contentChanged = true
      }
      if (category !== undefined) updateData.category = category
      if (image !== undefined) updateData.image = image
      
      // İçerik değiştiyse edited flag'ini true yap
      if (contentChanged) {
        updateData.edited = true
      }
    }
    if (isAdmin) {
      if (pinned !== undefined) updateData.pinned = pinned
      if (locked !== undefined) updateData.locked = locked
    }

    const updatedTopic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: updateData
    })

    return NextResponse.json(updatedTopic)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: topicId } = await params

    // Check if user is admin or topic owner
    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      select: { userId: true }
    })

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    const isAdmin = isSuperAdmin(session.user.email)
    const isOwner = topic.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete all replies first
    await prisma.forumReply.deleteMany({
      where: { topicId }
    })

    // Delete topic
    await prisma.forumTopic.delete({
      where: { id: topicId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
