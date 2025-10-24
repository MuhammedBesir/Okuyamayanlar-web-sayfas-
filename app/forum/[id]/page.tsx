"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, User, Clock, Eye, MessageSquare, Send, 
  Pin, Lock, Image as ImageIcon, Edit, Trash2, Save, X, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/image-upload"

interface Badge {
  id: string
  name: string
  icon: string
  color: string
  isSpecial: boolean
}

interface ForumTopic {
  id: string
  title: string
  content: string
  category: string | null
  image: string | null
  views: number
  pinned: boolean
  locked: boolean
  edited: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
    userBadges: Array<{
      badge: Badge
    }>
  }
  replies: ForumReply[]
  _count: {
    likes: number
  }
}

interface ForumReply {
  id: string
  content: string
  image: string | null
  link: string | null
  edited: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
    userBadges: Array<{
      badge: Badge
    }>
  }
  parentReply?: {
    id: string
    content: string
    user: {
      id: string
      name: string | null
    }
  } | null
  _count: {
    likes: number
  }
}

const convertDriveLink = (url: string): string => {
  if (!url) return url
  if (url.includes('drive.google.com/uc?') || url.includes('drive.google.com/thumbnail')) return url
  const fileIdMatch = url.match(/\/d\/([^\/\?]+)/)
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`
  }
  return url
}

export default function ForumTopicPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const topicId = params?.id as string

  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [replyImage, setReplyImage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editImage, setEditImage] = useState("")
  const [likedTopics, setLikedTopics] = useState<Set<string>>(new Set())
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set())
  const [editingTopic, setEditingTopic] = useState(false)
  const [editTopicTitle, setEditTopicTitle] = useState("")
  const [editTopicContent, setEditTopicContent] = useState("")
  const [editTopicCategory, setEditTopicCategory] = useState("")
  const [editTopicImage, setEditTopicImage] = useState("")
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyingToUser, setReplyingToUser] = useState<string | null>(null)

  useEffect(() => {
    if (topicId) {
      fetchTopic()
    }
  }, [topicId])

  const fetchTopic = async () => {
    try {
      const res = await fetch(`/api/forum/${topicId}`)
      if (res.ok) {
        const data = await res.json()
        setTopic(data)
      } else {
        router.push('/forum')
      }
    } catch (error) {
      console.error('Error fetching topic:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (topic?.locked) {
      alert('Bu konu kilitli, yeni yorum eklenemez')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/forum/${topicId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          image: convertDriveLink(replyImage) || null,
          parentReplyId: replyingToId
        })
      })

      if (res.ok) {
        setReplyContent("")
        setReplyImage("")
        setReplyingToId(null)
        setReplyingToUser(null)
        fetchTopic()
      }
    } catch (error) {
      console.error('Error posting reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditReply = (reply: ForumReply) => {
    setEditingReplyId(reply.id)
    setEditContent(reply.content)
    setEditImage(reply.image || "")
  }

  const handleSaveEdit = async (replyId: string) => {
    try {
      const res = await fetch(`/api/forum/reply/${replyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent,
          image: convertDriveLink(editImage) || null
        })
      })

      if (res.ok) {
        setEditingReplyId(null)
        setEditContent("")
        setEditImage("")
        fetchTopic()
      }
    } catch (error) {
      console.error('Error updating reply:', error)
    }
  }

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const res = await fetch(`/api/forum/reply/${replyId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchTopic()
      }
    } catch (error) {
      console.error('Error deleting reply:', error)
    }
  }

  const handleLikeTopic = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const res = await fetch(`/api/forum/topic/${topicId}/like`, {
        method: 'POST'
      })
      const data = await res.json()
      
      if (data.liked) {
        setLikedTopics(prev => new Set(prev).add(topicId))
      } else {
        setLikedTopics(prev => {
          const newSet = new Set(prev)
          newSet.delete(topicId)
          return newSet
        })
      }
      
      fetchTopic()
    } catch (error) {
      console.error('Error liking topic:', error)
    }
  }

  const handleLikeReply = async (replyId: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const res = await fetch(`/api/forum/reply/${replyId}/like`, {
        method: 'POST'
      })
      const data = await res.json()
      
      if (data.liked) {
        setLikedReplies(prev => new Set(prev).add(replyId))
      } else {
        setLikedReplies(prev => {
          const newSet = new Set(prev)
          newSet.delete(replyId)
          return newSet
        })
      }
      
      fetchTopic()
    } catch (error) {
      console.error('Error liking reply:', error)
    }
  }

  const handleEditTopic = () => {
    if (!topic) return
    setEditingTopic(true)
    setEditTopicTitle(topic.title)
    setEditTopicContent(topic.content)
    setEditTopicCategory(topic.category || "Tartışma")
    setEditTopicImage(topic.image || "")
  }

  const handleSaveTopicEdit = async () => {
    try {
      const res = await fetch(`/api/forum/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTopicTitle,
          content: editTopicContent,
          category: editTopicCategory,
          image: convertDriveLink(editTopicImage) || null
        })
      })

      if (res.ok) {
        setEditingTopic(false)
        fetchTopic()
      }
    } catch (error) {
      console.error('Error updating topic:', error)
    }
  }

  const handleDeleteTopic = async () => {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz? Tüm yanıtlar da silinecektir.')) {
      return
    }

    try {
      const res = await fetch(`/api/forum/${topicId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        router.push('/forum')
      }
    } catch (error) {
      console.error('Error deleting topic:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} dakika önce`
    if (hours < 24) return `${hours} saat önce`
    if (days < 7) return `${days} gün önce`
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(date)
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

  if (loading) {
    return (
      <div className="container py-8 px-4 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="container py-8 px-4 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Konu bulunamadı</h1>
        <Button asChild>
          <Link href="/forum">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Foruma Dön
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/forum">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Foruma Dön
        </Link>
      </Button>

      {/* Topic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="mb-6">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {topic.pinned && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Pin className="h-3 w-3" />
                  Sabitlenmiş
                </span>
              )}
              {topic.locked && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <Lock className="h-3 w-3" />
                  Kilitli
                </span>
              )}
              {topic.category && (
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getCategoryColor(topic.category)}`}>
                  {topic.category}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold">{topic.title}</h1>
              {session?.user?.id && (session.user.id === topic.user.id || session.user.email === "admin@okuyamayanlar.com") && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEditTopic}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDeleteTopic}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Sil
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {topic.user.image ? (
                      <img src={topic.user.image} alt={topic.user.name || "User"} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      topic.user.name?.charAt(0) || "?"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{topic.user.name}</span>
                    {topic.user.userBadges?.[0]?.badge && (
                      <span 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${topic.user.userBadges[0].badge.color}15`,
                          color: topic.user.userBadges[0].badge.color,
                          border: `1px solid ${topic.user.userBadges[0].badge.color}30`
                        }}
                        title={topic.user.userBadges[0].badge.name}
                      >
                        <span>{topic.user.userBadges[0].badge.icon}</span>
                        <span className="hidden sm:inline">{topic.user.userBadges[0].badge.name}</span>
                      </span>
                    )}
                  </div>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(topic.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {topic.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {topic.replies.length}
                </span>
                {topic.edited && (
                  <span className="text-xs italic text-gray-400 dark:text-gray-500">
                    (düzenlendi)
                  </span>
                )}
              </div>
              <button
                onClick={handleLikeTopic}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    likedTopics.has(topicId) 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span className={`text-sm font-medium ${
                  likedTopics.has(topicId)
                    ? "text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {topic._count.likes}
                </span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{topic.content}</p>
            
            {topic.image && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={topic.image} 
                  alt="Topic" 
                  className="w-full max-h-96 object-contain"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold">
            Yanıtlar ({topic.replies.length})
          </h2>

          {topic.replies.map((reply) => {
            const isOwner = session?.user?.id === reply.user.id
            const isAdmin = session?.user?.email === "admin@okuyamayanlar.com"
            const canModify = isOwner || isAdmin
            const isEditing = editingReplyId === reply.id

            return (
              <Card key={reply.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {reply.user.image ? (
                        <img src={reply.user.image} alt={reply.user.name || "User"} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        reply.user.name?.charAt(0) || "?"
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{reply.user.name}</span>
                          {reply.user.userBadges?.[0]?.badge && (
                            <span 
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${reply.user.userBadges[0].badge.color}15`,
                                color: reply.user.userBadges[0].badge.color,
                                border: `1px solid ${reply.user.userBadges[0].badge.color}30`
                              }}
                              title={reply.user.userBadges[0].badge.name}
                            >
                              <span className="text-xs">{reply.user.userBadges[0].badge.icon}</span>
                              <span className="hidden sm:inline text-[10px]">{reply.user.userBadges[0].badge.name}</span>
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(reply.createdAt)}
                          </span>
                          {reply.edited && (
                            <span className="text-xs italic text-gray-400 dark:text-gray-500">
                              (düzenlendi)
                            </span>
                          )}
                        </div>
                        {canModify && !isEditing && (
                          <div className="flex gap-1">
                            {isOwner && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditReply(reply)}
                                className="h-8 px-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteReply(reply.id)}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                          />
                          <div>
                            <label className="text-xs font-medium mb-1 block">Görsel (Opsiyonel)</label>
                            <Input
                              value={editImage}
                              onChange={(e) => setEditImage(e.target.value)}
                              placeholder="Google Drive link veya URL..."
                              className="h-9"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(reply.id)}
                              className="bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Kaydet
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingReplyId(null)
                                setEditContent("")
                                setEditImage("")
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              İptal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {reply.parentReply && (
                            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-indigo-500">
                              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                                @{reply.parentReply.user.name} kullanıcısına yanıt
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {reply.parentReply.content}
                              </div>
                            </div>
                          )}

                          <p className="whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                          
                          {reply.image && (
                            <div className="mt-3 rounded-lg overflow-hidden max-w-md">
                              <img 
                                src={reply.image} 
                                alt="Reply" 
                                className="w-full max-h-48 object-contain"
                              />
                            </div>
                          )}

                          {reply.link && (
                            <a 
                              href={reply.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                            >
                              🔗 {reply.link}
                            </a>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => handleLikeReply(reply.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  likedReplies.has(reply.id) 
                                    ? "fill-red-500 text-red-500" 
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              />
                              <span className={`text-sm font-medium ${
                                likedReplies.has(reply.id)
                                  ? "text-red-500"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}>
                                {reply._count.likes}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setReplyingToId(reply.id)
                                setReplyingToUser(reply.user.name || "Kullanıcı")
                                // Scroll to reply form
                                document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' })
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm font-medium">Yanıtla</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {topic.replies.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Henüz yanıt yok. İlk yanıtı siz verin!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reply Form */}
        {!topic.locked && (
          <Card id="reply-form">
            <CardHeader>
              <h3 className="text-xl font-bold">Yanıt Yaz</h3>
            </CardHeader>
            <CardContent>
              {session ? (
                <form onSubmit={handleReply} className="space-y-4">
                  {replyingToId && replyingToUser && (
                    <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          @{replyingToUser} kullanıcısına yanıt veriyorsunuz
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingToId(null)
                          setReplyingToUser(null)
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div>
                    <textarea
                      placeholder="Yanıtınızı yazın..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    />
                  </div>

                  <ImageUpload
                    label="Görsel (Opsiyonel)"
                    value={replyImage}
                    onChange={(url) => setReplyImage(convertDriveLink(url))}
                    id="replyImage"
                    placeholder="URL girin veya bilgisayar/telefonunuzdan dosya yükleyin"
                    helperText="📱 Telefondan veya bilgisayardan resim yükleyebilir, URL girebilir veya Google Drive linki ekleyebilirsiniz"
                  />

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? "Gönderiliyor..." : "Yanıtı Gönder"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Yanıt yazmak için giriş yapmalısınız</p>
                  <Button asChild>
                    <Link href="/auth/signin">Giriş Yap</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Topic Modal */}
        {editingTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setEditingTopic(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Konuyu Düzenle</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingTopic(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Başlık</label>
                  <Input
                    value={editTopicTitle}
                    onChange={(e) => setEditTopicTitle(e.target.value)}
                    placeholder="Konu başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={editTopicCategory}
                    onChange={(e) => setEditTopicCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Tartışma">Tartışma</option>
                    <option value="Kitap Önerisi">Kitap Önerisi</option>
                    <option value="Soru">Soru</option>
                    <option value="İnceleme">İnceleme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">İçerik</label>
                  <textarea
                    value={editTopicContent}
                    onChange={(e) => setEditTopicContent(e.target.value)}
                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    placeholder="Konu içeriği"
                  />
                </div>

                <ImageUpload
                  label="Görsel (Opsiyonel)"
                  value={editTopicImage}
                  onChange={(url) => setEditTopicImage(url)}
                  id="editTopicImage"
                  placeholder="Görsel URL'si"
                  helperText="Görsel eklemek için URL girin"
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTopic(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={handleSaveTopicEdit}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
