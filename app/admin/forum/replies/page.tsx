"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Trash2, Eye, MessageSquare, Calendar, User, Search, ArrowLeft, Edit2, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { isSuperAdmin } from "@/lib/admin"

interface Reply {
  id: string
  content: string
  image: string | null
  link: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
  }
  topic: {
    id: string
    title: string
  }
}

export default function AdminRepliesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin')
    } else if (status === "authenticated") {
      if (!isSuperAdmin(session?.user?.email)) {
        router.push('/forum')
      } else {
        fetchReplies()
      }
    }
  }, [status, session])

  const fetchReplies = async () => {
    try {
      const res = await fetch('/api/forum/replies')
      if (res.ok) {
        const data = await res.json()
        setReplies(data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (topicId: string, replyId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const res = await fetch(`/api/forum/${topicId}/replies/${replyId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchReplies()
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

  const filteredReplies = replies.filter(reply => {
    const matchesSearch = reply.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reply.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reply.topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
          <h1 className="text-4xl font-bold mb-2">Yorum Yönetimi</h1>
          <p className="text-muted-foreground">
            Forum yorumlarını görüntüleyin ve yönetin
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/forum">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Forum Yönetimi
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Yorum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{replies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Görselli Yorumlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {replies.filter(r => r.image).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Linkli Yorumlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {replies.filter(r => r.link).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Yorum, kullanıcı veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Replies List */}
      <div className="space-y-4">
        {filteredReplies.map((reply) => (
          <Card key={reply.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{reply.user.name}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(reply.createdAt)}
                    </div>
                    <span>•</span>
                    <Link 
                      href={`/forum/${reply.topic.id}`}
                      className="flex items-center gap-1 hover:underline text-indigo-600 dark:text-indigo-400"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {reply.topic.title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Content */}
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>

                  {/* Image */}
                  {reply.image && (
                    <div className="rounded-lg overflow-hidden max-w-md border">
                      <img 
                        src={reply.image} 
                        alt="Reply" 
                        className="w-full max-h-48 object-contain"
                      />
                    </div>
                  )}

                  {/* Link */}
                  {reply.link && (
                    <a 
                      href={reply.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      🔗 {reply.link}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/forum/${reply.topic.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(reply.topic.id, reply.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReplies.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Yorum bulunamadı</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
