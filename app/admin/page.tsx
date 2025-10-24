import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Calendar, MessageSquare, Plus, Settings, TrendingUp, Star, Award } from "lucide-react"

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

  type User = typeof recentUsers[0]
  type Book = typeof recentBooks[0]

  return (
    <div className="container py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-lg">
            Hoş geldiniz, <span className="font-semibold text-blue-600 dark:text-blue-400">{session.user.name}</span>
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
          className="h-auto py-6 flex flex-col gap-2 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          asChild
        >
          <Link href="/admin/books">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold">Kitapları Yönet</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          asChild
        >
          <Link href="/admin/events">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold">Etkinlikleri Yönet</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          asChild
        >
          <Link href="/admin/forum">
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold">Forum Yönet</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30"
          asChild
        >
          <Link href="/admin/featured-book">
            <TrendingUp className="h-6 w-6" />
            <span className="font-semibold">Bu Ayın Kitabı</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          asChild
        >
          <Link href="/admin/badges">
            <Award className="h-6 w-6" />
            <span className="font-semibold">Rozetleri Yönet</span>
          </Link>
        </Button>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
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
          className="h-auto py-6 flex flex-col gap-2 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          asChild
        >
          <Link href="/admin/borrow-logs">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold">Ödünç Kayıtları</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30"
          asChild
        >
          <Link href="/admin/homepage-discussions">
            <Star className="h-6 w-6" />
            <span className="font-semibold">Ana Sayfa Tartışmaları</span>
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          className="h-auto py-6 flex flex-col gap-2 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          asChild
        >
          <Link href="/admin/users">
            <Users className="h-6 w-6" />
            <span className="font-semibold">Kullanıcı Yönetimi</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-blue-950/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kitap</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{booksCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Kütüphanede mevcut
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Üye</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{usersCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Kayıtlı kullanıcı
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-violet-950/20 border-violet-200 dark:border-violet-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Etkinlikler</CardTitle>
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
              <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-700 dark:text-violet-400">{eventsCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              Toplam etkinlik
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-amber-950/20 border-amber-200 dark:border-amber-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forum Konuları</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{topicsCount}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MessageSquare className="h-3 w-3" />
              Aktif tartışma
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-b">
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
              {recentUsers.map((user: User) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
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

        <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-b">
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
              {recentBooks.map((book: Book) => (
                <div 
                  key={book.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors border border-transparent hover:border-violet-200 dark:hover:border-violet-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
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
