import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getUserBadges, getUserBadgeProgress, checkAndAwardBadges } from '@/lib/badges'
import { getAllBadges } from '@/lib/badges'

// GET /api/badges/user - Kullanıcının rozetlerini al
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    // İlerleme bilgisi istendi mi?
    if (action === 'progress') {
      const progress = await getUserBadgeProgress(user.id)
      return NextResponse.json(progress)
    }

    // Rozet kontrolü ve kazanma
    if (action === 'check') {
      const results = await checkAndAwardBadges(user.id)
      const newBadges = results.filter((r) => r.newlyEarned)

      // Yeni rozet kazanıldıysa bildirim ve email gönder
      for (const newBadge of newBadges) {
        // Rozet detaylarını al
        const badge = await prisma.badge.findFirst({
          where: { name: newBadge.badgeName },
        })

        if (badge) {
          // Bildirim oluştur
          await prisma.notification.create({
            data: {
              userId: user.id,
              title: 'Yeni Rozet Kazandın! 🎉',
              message: `"${badge.name}" rozetini kazandın!`,
              link: `/profile`,
            },
          })

          // Email gönder
          const { sendBadgeEarnedEmail } = await import('@/lib/email')
          const currentUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { email: true, username: true, name: true },
          })

          if (currentUser && currentUser.email) {
            sendBadgeEarnedEmail(
              currentUser.email,
              currentUser.username || currentUser.name || 'Değerli Kullanıcı',
              badge.name,
              badge.icon,
              badge.description
            ).catch((error) => {
              console.error('Rozet emaili gönderme hatası:', error)
            })
          }
        }
      }

      return NextResponse.json({
        message: newBadges.length > 0 ? 'Yeni rozetler kazandın!' : 'Yeni rozet yok',
        newBadges: newBadges.map((b) => b.badgeName),
        totalBadges: results.filter((r) => r.earned).length,
      })
    }

    // Kullanıcının kazandığı rozetler
    const earnedBadges = await getUserBadges(user.id)

    // Tüm rozetleri al
    const allBadges = await getAllBadges()

    // Kazanılmamış rozetleri de göster
    const earnedBadgeIds = new Set(earnedBadges.map((ub: any) => ub.badgeId))
    const lockedBadges = allBadges
      .filter((b: any) => !earnedBadgeIds.has(b.id) && !b.isSpecial)
      .map((b: any) => ({
        ...b,
        locked: true,
      }))

    return NextResponse.json({
      earnedBadges: earnedBadges.map((ub: any) => ({
        ...ub.badge,
        earnedAt: ub.earnedAt,
        locked: false,
      })),
      lockedBadges,
      totalEarned: earnedBadges.length,
      totalAvailable: allBadges.filter((b: any) => !b.isSpecial).length,
    })
  } catch (error) {
    console.error('Kullanıcı rozet hatası:', error)
    return NextResponse.json(
      { error: 'Rozetler getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
