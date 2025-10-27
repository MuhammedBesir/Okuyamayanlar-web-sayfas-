import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin } from "@/lib/admin"
import AdminBadgesClientPage from "./badges-client"

export default async function AdminBadgesPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/auth/signin")
  }

  // Süper admin kontrolü
  if (!isSuperAdmin(session.user.email)) {
    redirect("/")
  }

  // Tüm rozetleri al
  const badges = await prisma.badge.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { userBadges: true },
      },
    },
  })

  // JSON serileştirilebilir hale getir
  const badgesData = badges.map(badge => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    color: badge.color,
    category: badge.category,
    requirement: badge.requirement || undefined,
    isSpecial: badge.isSpecial,
    _count: badge._count,
  }))

  return <AdminBadgesClientPage initialBadges={badgesData} />
}
