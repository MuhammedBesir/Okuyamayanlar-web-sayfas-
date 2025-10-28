import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { grantBadgeByAdmin } from '@/lib/badges'

// POST /api/badges/grant - Admin rozet ver
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Admin kontrolü
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { userId, badgeName } = await request.json()

    if (!userId || !badgeName) {
      return NextResponse.json(
        { error: 'Kullanıcı ID ve rozet adı gerekli' },
        { status: 400 }
      )
    }

    const userBadge = await grantBadgeByAdmin(userId, badgeName)

    // Bildirim oluştur
    await prisma.notification.create({
      data: {
        userId,
        title: 'Yeni Rozet Kazandın! 🎁',
        message: `"${badgeName}" rozetini kazandın!`,
        link: `/profile`,
      },
    })

    return NextResponse.json({
      message: 'Rozet başarıyla verildi',
      userBadge,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Rozet verilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
