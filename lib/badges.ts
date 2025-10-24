// Rozet kontrol ve kazanma servisi
import { prisma } from './prisma'
import { BADGE_DEFINITIONS } from './badge-definitions'

interface BadgeCheckResult {
  badgeId: string
  badgeName: string
  earned: boolean
  newlyEarned?: boolean
}

// Kullanıcının tüm rozetlerini ve ilerlemesini kontrol et
export async function checkAndAwardBadges(userId: string): Promise<BadgeCheckResult[]> {
  const results: BadgeCheckResult[] = []

  // Kullanıcıyı ve ilişkili verileri al
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      readingLists: true,
      forumTopics: { include: { likes: true } },
      forumReplies: true,
      eventRSVPs: { where: { status: 'going' } },
      userBadges: { include: { badge: true } },
    },
  })

  if (!user) return results

  // Her rozet kategorisi için kontrol yap
  for (const badgeDef of BADGE_DEFINITIONS) {
    // Özel rozetleri atla (sadece admin verebilir)
    if (badgeDef.isSpecial) continue

    // Badge veritabanında var mı kontrol et, yoksa oluştur
    let badge = await prisma.badge.findUnique({
      where: { name: badgeDef.name },
    })

    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeDef.name,
          description: badgeDef.description,
          icon: badgeDef.icon,
          color: badgeDef.color,
          category: badgeDef.category,
          requirement: badgeDef.requirement,
          isActive: true,
          isSpecial: badgeDef.isSpecial || false,
          order: badgeDef.order,
        },
      })
    }

    // Kullanıcı bu rozeti kazanmış mı?
    const hasEarned = user.userBadges.some((ub: any) => ub.badgeId === badge!.id)

    // Rozet koşullarını kontrol et
    const meetsRequirement = await checkBadgeRequirement(
      user,
      badgeDef.category,
      badgeDef.requirement || 0
    )

    // Yeni kazanılan rozet mi?
    let newlyEarned = false
    if (meetsRequirement && !hasEarned) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: badge.id,
        },
      })
      newlyEarned = true
    }

    results.push({
      badgeId: badge.id,
      badgeName: badge.name,
      earned: hasEarned || newlyEarned,
      newlyEarned,
    })
  }

  return results
}

// Rozet gereksinimini kontrol et
async function checkBadgeRequirement(
  user: any,
  category: string,
  requirement: number
): Promise<boolean> {
  switch (category) {
    case 'READING': {
      // Okuma listesindeki kitap sayısı
      const booksRead = user.readingLists.filter(
        (rl: any) => rl.status === 'COMPLETED'
      ).length
      return booksRead >= requirement
    }

    case 'FORUM': {
      // Forum konusu veya yanıtları
      if (requirement <= 10) {
        // Konu sayısı
        return user.forumTopics.length >= requirement
      } else if (requirement === 50 || requirement === 100) {
        // Yanıt sayısı
        return user.forumReplies.length >= requirement
      } else if (requirement === 100) {
        // Toplam beğeni sayısı
        const totalLikes = user.forumTopics.reduce(
          (sum: number, topic: any) => sum + topic.likes.length,
          0
        )
        return totalLikes >= requirement
      }
      return false
    }

    case 'EVENT': {
      // Katıldığı etkinlik sayısı
      return user.eventRSVPs.length >= requirement
    }

    case 'PROFILE': {
      // Profil tamamlanma ve üyelik süresi
      if (requirement === 1) {
        // Hoş geldin rozeti - her yeni kullanıcıya
        return true
      } else if (requirement === 0) {
        // Profil tamamlandı - bio ve image var mı?
        return !!user.bio && !!user.image
      } else if (requirement === 30) {
        // 30 gün üyelik
        const daysSinceJoined = Math.floor(
          (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysSinceJoined >= 30
      } else if (requirement === 365) {
        // 1 yıl üyelik
        const daysSinceJoined = Math.floor(
          (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysSinceJoined >= 365
      }
      return false
    }

    case 'ACHIEVEMENT': {
      // Özel başarılar
      // Bu rozetler için daha karmaşık kontroller gerekebilir
      // Şimdilik basit versiyon
      return false
    }

    case 'SPECIAL': {
      // Özel rozetler sadece admin verebilir
      return false
    }

    default:
      return false
  }
}

// Kullanıcının tüm rozetlerini al
export async function getUserBadges(userId: string) {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: {
      earnedAt: 'desc',
    },
  })

  return userBadges
}

// Tüm mevcut rozetleri al
export async function getAllBadges() {
  const badges = await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })

  return badges
}

// Kullanıcının rozet ilerlemesini al
export async function getUserBadgeProgress(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      readingLists: true,
      forumTopics: { include: { likes: true } },
      forumReplies: true,
      eventRSVPs: { where: { status: 'going' } },
      userBadges: { include: { badge: true } },
    },
  })

  if (!user) return null

  const progress = {
    booksRead: user.readingLists.filter((rl: any) => rl.status === 'COMPLETED').length,
    forumTopics: user.forumTopics.length,
    forumReplies: user.forumReplies.length,
    forumLikes: user.forumTopics.reduce((sum: number, topic: any) => sum + topic.likes.length, 0),
    eventsAttended: user.eventRSVPs.length,
    profileComplete: !!user.bio && !!user.image,
    membershipDays: Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ),
    earnedBadges: user.userBadges.length,
  }

  return progress
}

// Admin: Kullanıcıya özel rozet ver
export async function grantSpecialBadge(userId: string, badgeName: string) {
  const badge = await prisma.badge.findUnique({
    where: { name: badgeName },
  })

  if (!badge || !badge.isSpecial) {
    throw new Error('Geçersiz özel rozet')
  }

  // Kullanıcı zaten bu rozeti kazanmış mı?
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
  })

  if (existing) {
    throw new Error('Kullanıcı zaten bu rozeti kazanmış')
  }

  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  })

  return userBadge
}

// Admin: Kullanıcıya herhangi bir rozet ver (özel veya otomatik)
export async function grantBadgeByAdmin(userId: string, badgeName: string) {
  const badge = await prisma.badge.findUnique({
    where: { name: badgeName },
  })

  if (!badge) {
    throw new Error('Geçersiz rozet')
  }

  // Kullanıcı zaten bu rozeti kazanmış mı?
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
  })

  if (existing) {
    throw new Error('Kullanıcı zaten bu rozeti kazanmış')
  }

  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  })

  return userBadge
}
