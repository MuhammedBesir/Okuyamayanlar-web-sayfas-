"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MessageCircle, Eye, TrendingUp, User as UserIcon } from "lucide-react"
import Link from "next/link"

interface ForumTopic {
  id: string
  title: string
  content: string
  category: string
  featured: boolean
  pinned: boolean
  createdAt: string
  user: {
    name: string | null
  }
  _count: {
    replies: number
  }
}

export default function HomepageDiscussionsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/")
    } else {
      fetchTopics()
    }
  }, [session, status, router])

  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/admin/forum")
      if (res.ok) {
        const data = await res.json()
        setTopics(data.topics || [])
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (topicId: string, currentStatus: boolean) => {
    setUpdatingId(topicId)
    try {
      const res = await fetch(`/api/admin/forum/${topicId}/featured`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentStatus })
      })

      if (res.ok) {
        fetchTopics()
      } else {
        const data = await res.json()
        alert(data.error || "İşlem başarısız")
      }
    } catch (error) {
      console.error("Error toggling featured:", error)
      alert("Bir hata oluştu")
    } finally {
      setUpdatingId(null)
    }
  }

  const featuredTopics = topics.filter(t => t.featured)
  const otherTopics = topics.filter(t => !t.featured)

  if (loading || status === "loading") {
    return (
      <div className="container py-8 px-4 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Admin Panele Dön
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Ana Sayfa Tartışmaları
            </h1>
            <p className="text-muted-foreground">
              Ana sayfada gösterilecek tartışmaları yönetin ({featuredTopics.length} aktif)
            </p>
          </div>
        </div>
      </div>

      {/* Bilgilendirme Kartı */}
      <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Ana Sayfa Gösterimi
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ⭐ işareti olan tartışmalar ana sayfada &quot;Aktif Tartışmalar&quot; bölümünde görünür. 
                En fazla 6 tartışma gösterilir. Daha fazla işaretlerseniz, en yeniler gösterilir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ana Sayfada Gösterilenler */}
      {featuredTopics.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            Ana Sayfada Gösterilenler
            <Badge variant="secondary">{featuredTopics.length}</Badge>
          </h2>
          <div className="grid gap-4">
            {featuredTopics.map((topic) => (
              <Card key={topic.id} className="border-2 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/10 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        <MessageCircle className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className="bg-orange-500">{topic.category}</Badge>
                          {topic.pinned && (
                            <Badge variant="secondary">
                              📌 Sabitlenmiş
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">
                          {topic.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {topic.content}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{topic.user?.name || "Anonim"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{topic._count.replies} yanıt</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{new Date(topic.createdAt).toLocaleDateString("tr-TR")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400"
                        onClick={() => toggleFeatured(topic.id, topic.featured)}
                        disabled={updatingId === topic.id}
                      >
                        <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                        {updatingId === topic.id ? "İşleniyor..." : "Ana Sayfadan Kaldır"}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/forum/${topic.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Diğer Tartışmalar */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-gray-500" />
          Diğer Tartışmalar
          <Badge variant="secondary">{otherTopics.length}</Badge>
        </h2>
        
        {otherTopics.length > 0 ? (
          <div className="grid gap-4">
            {otherTopics.map((topic) => (
              <Card key={topic.id} className="hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        <MessageCircle className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="outline">{topic.category}</Badge>
                          {topic.pinned && (
                            <Badge variant="secondary">
                              📌 Sabitlenmiş
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {topic.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {topic.content}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{topic.user?.name || "Anonim"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{topic._count.replies} yanıt</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{new Date(topic.createdAt).toLocaleDateString("tr-TR")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-gradient-to-r from-orange-500 to-red-600"
                        onClick={() => toggleFeatured(topic.id, topic.featured)}
                        disabled={updatingId === topic.id}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {updatingId === topic.id ? "İşleniyor..." : "Ana Sayfaya Ekle"}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/forum/${topic.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Tüm tartışmalar ana sayfada gösteriliyor</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
