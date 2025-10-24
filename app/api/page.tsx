import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Calendar, MessageSquare, Plus, Settings, TrendingUp, Award } from "lucide-react"

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // İstatistikleri al
  const [booksCount, usersCount, eventsCount, topicsCount] = await Promise.all([
    prisma.book.count(),
    prisma.user.count(),
    prisma.event.count(),
    prisma.forumTopic.count(),
  ])

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  const recentBooks = await prisma.book.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      createdAt: true,
    },
  })

  return (
    <div className="container py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-lg">
            Hoş geldiniz, <span className="font-semibold text-amber-600">{session.user.name}</span>
          </p>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
            Ayarlar
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button 
          size="lg" 
          className="h-auto py-6 flex flex-col gap-2 bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          asChild
        >
          <Link href="/admin/books/new">
            <Plus className="h-6 w-6" />
            <span className="font-semibold">Kitap Ekle</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-blue-300 dark:hover:border-blue-700"
          asChild
        >
          <Link href="/admin/events/new">
            <Plus className="h-6 w-6" />
            <span className="font-semibold">Etkinlik Ekle</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-green-300 dark:hover:border-green-700"
          asChild
        >
          <Link href="/admin/comments">
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold">Yorumları Yönet</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-purple-300 dark:hover:border-purple-700"
          asChild
        >
          <Link href="/admin/users">
            <Users className="h-6 w-6" />
            <span className="font-semibold">Üyeleri Yönet</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards - Geliştirilmiş */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-amber-950/20 border-amber-200 dark:border-amber-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kitap</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{booksCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Kütüphanede mevcut
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-blue-950/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Üye</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{usersCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Kayıtlı kullanıcı
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Etkinlikler</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">{eventsCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              Toplam etkinlik
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forum Konuları</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">{topicsCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MessageSquare className="h-3 w-3" />
              Aktif tartışma
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Geliştirilmiş */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Son Kullanıcılar</CardTitle>
                <CardDescription>En son kayıt olan üyeler</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">Tümü</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Son Eklenen Kitaplar</CardTitle>
                <CardDescription>Kütüphaneye eklenen son kitaplar</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/books">Tümü</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold line-clamp-1">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(book.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
