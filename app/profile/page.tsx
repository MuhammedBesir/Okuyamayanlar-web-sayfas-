import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileClient from "./profile-client"

// Cache'i devre dışı bırak - her zaman güncel veri çek
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      readingLists: {
        take: 10,
        orderBy: { createdAt: "desc" }, // En son eklenenler önce
        include: {
          book: true,
        },
      },
      forumTopics: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      forumReplies: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          topic: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // İstatistik hesaplamaları
  // Tüm okuma listesini sayma için ayrı sorgu
  const totalReadingListCount = await prisma.readingList.count({
    where: { userId: user.id }
  })
  
  // Tamamlanan kitapları sayma - COMPLETED veya completed
  const completedBooksCount = await prisma.readingList.count({
    where: { 
      userId: user.id,
      OR: [
        { status: 'COMPLETED' },
        { status: 'completed' }
      ]
    }
  })
  
  // Okunan kitapları sayma
  const readingBooksCount = await prisma.readingList.count({
    where: { 
      userId: user.id,
      status: 'reading'
    }
  })
  
  const totalBooks = totalReadingListCount
  const completedBooks = completedBooksCount
  const readingBooks = readingBooksCount
  
  // Forum istatistikleri için ayrı sayma
  const totalTopics = await prisma.forumTopic.count({
    where: { userId: user.id }
  })
  const totalReplies = await prisma.forumReply.count({
    where: { userId: user.id }
  })
  
  const memberSince = new Date(user.createdAt)
  const daysSinceMember = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24))
  const readingStreak = Math.min(completedBooks * 2, 30)
  const activityScore = (completedBooks * 10) + (totalTopics * 5) + (totalReplies * 2)
  const level = Math.floor(activityScore / 100) + 1
  const progressToNextLevel = (activityScore % 100)

  return (
    <ProfileClient 
      user={{
        ...user,
        createdAt: user.createdAt.toISOString(),
      }}
      stats={{
        totalBooks,
        completedBooks,
        readingBooks,
        totalTopics,
        totalReplies,
        daysSinceMember,
        readingStreak,
        activityScore,
        level,
        progressToNextLevel,
      }}
    />
  )
}
