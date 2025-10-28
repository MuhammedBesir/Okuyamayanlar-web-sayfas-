"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Trash2, Pin, Lock, Unlock, Eye, MessageSquare, 
  Calendar, User, Search, Filter, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { isSuperAdmin } from "@/lib/admin"

interface ForumTopic {
  id: string
  title: string
  content: string
  category: string | null
  image: string | null
  views: number
  pinned: boolean
  locked: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
  }
  _count: {
    replies: number
  }
}

export default function AdminForumPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("Tümü")

  const categories = ["Tümü", "Tartışma", "Kitap Önerisi", "Soru", "Duyuru", "İnceleme"]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin')
    } else if (status === "authenticated") {
      if (!isSuperAdmin(session?.user?.email)) {
        router.push('/forum')
      } else {
        fetchTopics()
      }
    }
  }, [status, session])

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/forum')
      if (res.ok) {
        const data = await res.json()
        setTopics(data.topics || data) // Yeni API formatı ile uyumlu
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePin = async (topicId: string, currentPinned: boolean) => {
    try {
      const res = await fetch(`/api/forum/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !currentPinned })
      })

      if (res.ok) {
        fetchTopics()
      }
    } catch (error) {
    }
  }

  const handleToggleLock = async (topicId: string, currentLocked: boolean) => {
    try {
      const res = await fetch(`/api/forum/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: !currentLocked })
      })

      if (res.ok) {
        fetchTopics()
      }
    } catch (error) {
    }
  }

  const handleDelete = async (topicId: string) => {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz? Tüm yanıtlar da silinecektir.')) {
      return
    }

    try {
      const res = await fetch(`/api/forum/${topicId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchTopics()
      }
    } catch (error) {
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      "Tartışma": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "Kitap Önerisi": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "Soru": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Duyuru": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      "İnceleme": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    }
    return colors[category || ""] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "Tümü" || topic.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!isSuperAdmin(session?.user?.email)) {
    return null
  }

  return (
    <div className="container py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Forum Yönetimi</h1>
          <p className="text-muted-foreground">
            Forum konularını yönetin, sabitleyin veya kilitleyin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/forum/replies">
              <MessageSquare className="h-4 w-4 mr-2" />
              Yorumlar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Admin Paneli
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Konu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sabitlenmiş
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.filter(t => t.pinned).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kilitli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.filter(t => t.locked).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Görüntüleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.reduce((sum, t) => sum + t.views, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Konu ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Filter className="h-5 w-5 text-muted-foreground mt-2" />
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Konu</th>
                  <th className="text-left p-4 font-medium">Kategori</th>
                  <th className="text-left p-4 font-medium">Yazar</th>
                  <th className="text-left p-4 font-medium">İstatistikler</th>
                  <th className="text-left p-4 font-medium">Tarih</th>
                  <th className="text-right p-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic) => (
                  <tr key={topic.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {topic.pinned && (
                          <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        )}
                        {topic.locked && (
                          <Lock className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <Link 
                            href={`/forum/${topic.id}`}
                            className="font-medium hover:underline line-clamp-1"
                          >
                            {topic.title}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {topic.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {topic.category && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(topic.category)}`}>
                          {topic.category}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{topic.user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {topic.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {topic._count.replies}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(topic.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant={topic.pinned ? "default" : "outline"}
                          onClick={() => handleTogglePin(topic.id, topic.pinned)}
                          title={topic.pinned ? "Sabitlemeyi Kaldır" : "Sabitle"}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={topic.locked ? "default" : "outline"}
                          onClick={() => handleToggleLock(topic.id, topic.locked)}
                          title={topic.locked ? "Kilidi Aç" : "Kilitle"}
                        >
                          {topic.locked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(topic.id)}
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTopics.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Konu bulunamadı</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
