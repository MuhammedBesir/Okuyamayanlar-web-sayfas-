import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileClient from "./profile-client"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      readingLists: {
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
  const totalBooks = user.readingLists.length
  const completedBooks = user.readingLists.filter((item: any) => item.status === 'COMPLETED').length
  const readingBooks = user.readingLists.filter((item: any) => item.status === 'reading').length
  const totalTopics = user.forumTopics.length
  const totalReplies = user.forumReplies.length
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
