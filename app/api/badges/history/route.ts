import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/admin'

// GET /api/badges/history - Rozet verilme geçmişi
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Süper admin kontrolü
    if (!isSuperAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const badgeId = searchParams.get('badgeId')
    const userId = searchParams.get('userId')

    // Filtre oluştur
    const where: any = {}
    if (badgeId) where.badgeId = badgeId
    if (userId) where.userId = userId

    // Son verilen rozetleri getir
    const badgeHistory = await prisma.userBadge.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        badge: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            category: true,
            isSpecial: true,
          },
        },
      },
      orderBy: {
        earnedAt: 'desc',
      },
      take: limit,
    })

    // İstatistikler
    const stats = {
      total: await prisma.userBadge.count(),
      today: await prisma.userBadge.count({
        where: {
          earnedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      thisWeek: await prisma.userBadge.count({
        where: {
          earnedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      thisMonth: await prisma.userBadge.count({
        where: {
          earnedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    }

    return NextResponse.json({
      history: badgeHistory,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Rozet geçmişi alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
