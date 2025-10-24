import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      )
    }

    // Kullanıcının admin olup olmadığını kontrol et
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için admin yetkisi gerekiyor" },
        { status: 403 }
      )
    }

    // Tüm forum konularını getir
    const topics = await prisma.forumTopic.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featured: true,
        pinned: true,
        locked: true,
        views: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { pinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ topics })
  } catch (error) {
    console.error("Forum konuları getirilirken hata:", error)
    return NextResponse.json(
      { error: "Forum konuları getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
