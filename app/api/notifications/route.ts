import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notifications - Kullanıcının bildirimlerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", notifications: [], unreadCount: 0 },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found", notifications: [], unreadCount: 0 },
        { status: 404 }
      )
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50, // Son 50 bildirim
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications", notifications: [], unreadCount: 0 },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Yeni bildirim oluştur (internal use)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, title, message, link } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        link,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
}
