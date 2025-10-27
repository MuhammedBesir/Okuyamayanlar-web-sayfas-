/**
 * Kullanıcı seviye sistemi
 * Aktivite skoruna göre seviye hesaplaması yapar
 */

export interface UserLevel {
  level: number
  title: string
  color: string
  icon: string
  minScore: number
  maxScore: number
}

export interface UserLevelInfo {
  level: number
  activityScore: number
  levelTitle: string
  levelIcon: string
  levelColor: string
}

// Seviye tanımları
export const USER_LEVELS: UserLevel[] = [
  { level: 1, title: "Yeni Üye", color: "gray", icon: "📚", minScore: 0, maxScore: 99 },
  { level: 2, title: "Okur", color: "blue", icon: "📖", minScore: 100, maxScore: 199 },
  { level: 3, title: "Kitap Kurdu", color: "green", icon: "🐛", minScore: 200, maxScore: 299 },
  { level: 4, title: "Kütüphane Faresi", color: "amber", icon: "🐭", minScore: 300, maxScore: 499 },
  { level: 5, title: "Edebiyat Sever", color: "orange", icon: "📜", minScore: 500, maxScore: 749 },
  { level: 6, title: "Bilge", color: "purple", icon: "🎓", minScore: 750, maxScore: 999 },
  { level: 7, title: "Usta Okuyucu", color: "pink", icon: "⭐", minScore: 1000, maxScore: 1499 },
  { level: 8, title: "Kütüphane Bekçisi", color: "indigo", icon: "🏛️", minScore: 1500, maxScore: 1999 },
  { level: 9, title: "Efsane", color: "red", icon: "🔥", minScore: 2000, maxScore: 2999 },
  { level: 10, title: "Kitap Tanrısı", color: "yellow", icon: "👑", minScore: 3000, maxScore: Infinity },
]

/**
 * Aktivite skorundan seviye bilgisi döndürür
 */
export function getUserLevel(activityScore: number): UserLevel {
  for (const level of USER_LEVELS) {
    if (activityScore >= level.minScore && activityScore <= level.maxScore) {
      return level
    }
  }
  return USER_LEVELS[0] // Varsayılan olarak ilk seviye
}

/**
 * Kullanıcı istatistiklerinden aktivite skoru hesaplar
 */
export function calculateActivityScore(stats: {
  completedBooks?: number
  readingBooks?: number
  totalTopics?: number
  totalReplies?: number
  totalLikes?: number
  badges?: number
}): number {
  const {
    completedBooks = 0,
    readingBooks = 0,
    totalTopics = 0,
    totalReplies = 0,
    totalLikes = 0,
    badges = 0
  } = stats

  return (
    (completedBooks * 10) +      // Tamamlanan kitap başına 10 puan
    (readingBooks * 3) +          // Okunan kitap başına 3 puan
    (totalTopics * 5) +           // Forum konusu başına 5 puan
    (totalReplies * 2) +          // Yorum başına 2 puan
    (totalLikes * 1) +            // Beğeni başına 1 puan
    (badges * 15)                 // Rozet başına 15 puan
  )
}

/**
 * Tailwind CSS renk sınıflarını döndürür
 */
export function getLevelColorClasses(color: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    gray: { 
      bg: "bg-gray-100 dark:bg-gray-900/30", 
      text: "text-gray-700 dark:text-gray-300", 
      border: "border-gray-200 dark:border-gray-800" 
    },
    blue: { 
      bg: "bg-blue-100 dark:bg-blue-900/30", 
      text: "text-blue-700 dark:text-blue-300", 
      border: "border-blue-200 dark:border-blue-800" 
    },
    green: { 
      bg: "bg-green-100 dark:bg-green-900/30", 
      text: "text-green-700 dark:text-green-300", 
      border: "border-green-200 dark:border-green-800" 
    },
    amber: { 
      bg: "bg-amber-100 dark:bg-amber-900/30", 
      text: "text-amber-700 dark:text-amber-300", 
      border: "border-amber-200 dark:border-amber-800" 
    },
    orange: { 
      bg: "bg-orange-100 dark:bg-orange-900/30", 
      text: "text-orange-700 dark:text-orange-300", 
      border: "border-orange-200 dark:border-orange-800" 
    },
    purple: { 
      bg: "bg-purple-100 dark:bg-purple-900/30", 
      text: "text-purple-700 dark:text-purple-300", 
      border: "border-purple-200 dark:border-purple-800" 
    },
    pink: { 
      bg: "bg-pink-100 dark:bg-pink-900/30", 
      text: "text-pink-700 dark:text-pink-300", 
      border: "border-pink-200 dark:border-pink-800" 
    },
    indigo: { 
      bg: "bg-indigo-100 dark:bg-indigo-900/30", 
      text: "text-indigo-700 dark:text-indigo-300", 
      border: "border-indigo-200 dark:border-indigo-800" 
    },
    red: { 
      bg: "bg-red-100 dark:bg-red-900/30", 
      text: "text-red-700 dark:text-red-300", 
      border: "border-red-200 dark:border-red-800" 
    },
    yellow: { 
      bg: "bg-yellow-100 dark:bg-yellow-900/30", 
      text: "text-yellow-700 dark:text-yellow-300", 
      border: "border-yellow-200 dark:border-yellow-800" 
    },
  }

  return colorMap[color] || colorMap.gray
}

/**
 * Prisma ile kullanıcı seviye bilgisini hesapla
 * Forum API'lerinde kullanmak için
 */
export async function calculateUserLevelFromDB(userId: string, prisma: any): Promise<UserLevelInfo> {
  try {
    // Paralel olarak tüm istatistikleri çek
    const [completedBooks, totalTopics, totalReplies, badgeCount] = await Promise.all([
      prisma.readingList.count({
        where: { 
          userId,
          OR: [
            { status: 'COMPLETED' },
            { status: 'completed' }
          ]
        }
      }),
      prisma.forumTopic.count({ where: { userId } }),
      prisma.forumReply.count({ where: { userId } }),
      prisma.userBadge.count({ where: { userId } })
    ])

    const activityScore = calculateActivityScore({
      completedBooks,
      totalTopics,
      totalReplies,
      badges: badgeCount
    })

    const userLevel = getUserLevel(activityScore)

    return {
      level: userLevel.level,
      activityScore,
      levelTitle: userLevel.title,
      levelIcon: userLevel.icon,
      levelColor: userLevel.color
    }
  } catch (error) {
    console.error('Error calculating user level:', error)
    // Varsayılan seviye döndür
    return {
      level: 1,
      activityScore: 0,
      levelTitle: 'Yeni Üye',
      levelIcon: '📚',
      levelColor: 'gray'
    }
  }
}
