import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Users } from "lucide-react"
import Link from "next/link"

export default async function AdminBadgesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Admin kontrolü
  const admin = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  })

  if (!admin || admin.role !== "ADMIN") {
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

  // Kategori bazında grupla
  const badgesByCategory = badges.reduce((acc: any, badge: any) => {
    if (!acc[badge.category]) {
      acc[badge.category] = []
    }
    acc[badge.category].push(badge)
    return acc
  }, {})

  const categoryNames: Record<string, string> = {
    READING: "📚 Kitap Okuma",
    FORUM: "💬 Forum Aktivitesi",
    EVENT: "🎉 Etkinlik Katılımı",
    PROFILE: "👤 Profil",
    ACHIEVEMENT: "🏆 Başarılar",
    SPECIAL: "🎁 Özel Rozetler",
  }

  return (
    <div className="container py-8 px-4 max-w-7xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rozet Yönetimi</h1>
          <p className="text-muted-foreground">
            Kullanıcılara rozet ver ve rozet sistemini yönet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Panele Dön</Link>
          </Button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Rozet</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges.length}</div>
            <p className="text-xs text-muted-foreground">Tüm kategorilerde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Özel Rozetler</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {badges.filter((b: any) => b.isSpecial).length}
            </div>
            <p className="text-xs text-muted-foreground">Sadece admin verebilir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {badges.reduce((sum: number, b: any) => sum + b._count.userBadges, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Toplam kazanılan rozet</p>
          </CardContent>
        </Card>
      </div>

      {/* Rozetler Kategori Bazında */}
      <div className="space-y-6">
        {Object.entries(badgesByCategory).map(([category, categoryBadges]: [string, any]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categoryNames[category] || category}
              </CardTitle>
              <CardDescription>
                {(categoryBadges as any[]).length} rozet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {(categoryBadges as any[]).map((badge: any) => (
                  <div
                    key={badge.id}
                    className="group relative p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{
                      borderColor: badge.color + "40",
                      backgroundColor: badge.color + "05",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {badge.description}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {badge._count.userBadges} kullanıcı
                        </Badge>
                        {badge.isSpecial && (
                          <Badge className="text-[10px] bg-purple-100 text-purple-700">
                            🎁 Özel
                          </Badge>
                        )}
                      </div>
                      {badge.requirement && (
                        <div className="text-[10px] text-gray-500">
                          Gereksinim: {badge.requirement}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kullanıcıya Özel Rozet Ver */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎁 Kullanıcıya Özel Rozet Ver</CardTitle>
          <CardDescription>
            Kullanıcılar sayfasından kullanıcı seçip özel rozet verebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/admin/users">Kullanıcılar Sayfasına Git</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
