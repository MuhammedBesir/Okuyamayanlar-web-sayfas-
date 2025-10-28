import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/admin'

// DELETE /api/badges/revoke - Admin rozet geri al
export async function DELETE(request: NextRequest) {
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

    const { userId, badgeId } = await request.json()

    if (!userId || !badgeId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID ve rozet ID gerekli' },
        { status: 400 }
      )
    }

    // UserBadge ilişkisini bul ve sil
    const userBadge = await prisma.userBadge.findFirst({
      where: {
        userId,
        badgeId,
      },
      include: {
        badge: true,
        user: true,
      },
    })

    if (!userBadge) {
      return NextResponse.json(
        { error: 'Bu kullanıcıda bu rozet bulunamadı' },
        { status: 404 }
      )
    }

    // Rozeti sil
    await prisma.userBadge.delete({
      where: {
        id: userBadge.id,
      },
    })

    // Bildirim oluştur
    await prisma.notification.create({
      data: {
        userId,
        title: 'Rozet Geri Alındı',
        message: `"${userBadge.badge.name}" rozetiniz yönetici tarafından geri alındı.`,
        link: `/profile`,
      },
    })

    return NextResponse.json({
      message: 'Rozet başarıyla geri alındı',
      badge: userBadge.badge.name,
      user: userBadge.user.name,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Rozet geri alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
