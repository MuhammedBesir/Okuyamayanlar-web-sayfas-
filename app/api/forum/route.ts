import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { calculateUserLevelFromDB } from "@/lib/user-level"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Öne çıkan tartışmalar için: featured=true olanlar
    if (featured) {
      const topics = await prisma.forumTopic.findMany({
        where: {
          featured: true // Ana sayfada gösterilmek üzere işaretlenenler
        },
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
                    order: 'asc'
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
            },
          },
          _count: {
            select: { 
              replies: true,
              likes: true
            },
          },
        },
        orderBy: [
          { pinned: "desc" },
          { createdAt: "desc" },
        ],
        take: limit || 6,
      })

      // Add user levels to featured topics
      const topicsWithLevels = await Promise.all(
        topics.map(async topic => {
          const userLevel = await calculateUserLevelFromDB(topic.user.id, prisma)
          return {
            ...topic,
            user: {
              ...topic.user,
              userLevel
            }
          }
        })
      )

      return NextResponse.json({ topics: topicsWithLevels })
    }

    // Normal liste
    const topics = await prisma.forumTopic.findMany({
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
                  order: 'asc'
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
          },
        },
        _count: {
          select: { 
            replies: true,
            likes: true
          },
        },
      },
      orderBy: [
        { pinned: "desc" },           // 1. Sabitlenenler en üstte
        { likes: { _count: "desc" } }, // 2. En çok beğenilen
        { createdAt: "desc" },         // 3. En yeni
      ],
      take: limit,
    })

    // Add user levels to all topics
    const topicsWithLevels = await Promise.all(
      topics.map(async topic => {
        const userLevel = await calculateUserLevelFromDB(topic.user.id, prisma)
        return {
          ...topic,
          user: {
            ...topic.user,
            userLevel
          }
        }
      })
    )

    return NextResponse.json({ topics: topicsWithLevels })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, image } = body

    const topic = await prisma.forumTopic.create({
      data: {
        title,
        content,
        category: category || null,
        image: image || null,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { 
            replies: true,
            likes: true
          },
        },
      },
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 })
  }
}
