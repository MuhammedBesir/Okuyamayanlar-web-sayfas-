"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, User, Clock, Pin, Lock, Eye, Plus, 
  Search, TrendingUp, MessageCircle, X, Image as ImageIcon,
  Send, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  _count: {
    replies: number
    likes: number
  }
}

const categories = ["Tümü", "Tartışma", "Kitap Önerisi", "Soru", "Duyuru", "İnceleme"]

const convertDriveLink = (url: string): string => {
  if (!url) return url
  if (url.includes('drive.google.com/uc?') || url.includes('drive.google.com/thumbnail')) return url
  const fileIdMatch = url.match(/\/d\/([^\/\?]+)/)
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`
  }
  return url
}

export default function ForumPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [showNewTopicModal, setShowNewTopicModal] = useState(false)
  const [likedTopics, setLikedTopics] = useState<Set<string>>(new Set())
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    category: "Tartışma",
    image: ""
  })

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/forum')
      if (res.ok) {
        const data = await res.json()
        setTopics(data.topics || data) // Yeni format ile uyumlu
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTopic,
          image: convertDriveLink(newTopic.image)
        })
      })

      if (res.ok) {
        setShowNewTopicModal(false)
        setNewTopic({ title: "", content: "", category: "Tartışma", image: "" })
        fetchTopics()
      }
    } catch (error) {
      console.error('Error creating topic:', error)
    }
  }

  const handleLikeTopic = async (topicId: string) => {
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
      
      // Refresh topics to get updated counts
      fetchTopics()
    } catch (error) {
      console.error('Error liking topic:', error)
    }
  }

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Tümü" || topic.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  return (
    <div className="container py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3 md:mb-4 px-4 md:px-5 py-2 md:py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
          <MessageCircle className="h-4 md:h-5 w-4 md:w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Okuyamayanlar Forum</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-gray-100">Forum</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
          Kitaplar hakkında sohbet edin, sorular sorun ve toplulukla etkileşime geçin
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <MessageSquare className="h-4 md:h-5 w-4 md:w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{topics.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Konu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <MessageCircle className="h-4 md:h-5 w-4 md:w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{topics.reduce((acc, t) => acc + t._count.replies, 0)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Yorum</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Eye className="h-4 md:h-5 w-4 md:w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{topics.reduce((acc, t) => acc + t.views, 0)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Görüntüleme</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TrendingUp className="h-4 md:h-5 w-4 md:w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{topics.filter(t => t.pinned).length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sabitlenmiş</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 md:top-3 h-4 md:h-5 w-4 md:w-5 text-gray-400" />
          <Input
            placeholder="Konu veya içerik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 md:pl-10 h-10 md:h-11 border-gray-200 dark:border-gray-700 text-sm md:text-base"
          />
        </div>
        <Button 
          size="lg"
          onClick={() => {
            if (!session) {
              router.push('/auth/signin')
            } else {
              setShowNewTopicModal(true)
            }
          }}
          className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 h-10 md:h-11 text-sm md:text-base"
        >
          <Plus className="h-4 md:h-5 w-4 md:w-5 mr-2" />
          <span className="hidden sm:inline">Yeni Konu Aç</span>
          <span className="sm:hidden">Yeni Konu</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {category} {category !== "Tümü" && `(${topics.filter(t => t.category === category).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="bg-gray-100 dark:bg-gray-800 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-700">
            <MessageSquare className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Konu bulunamadı</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || selectedCategory !== "Tümü" 
              ? "Farklı bir arama veya kategori deneyin" 
              : "İlk konuyu siz açın!"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                <Link href={`/forum/${topic.id}`}>
                  <CardHeader className="p-3 md:p-6">
                    <div className="flex items-start gap-2 md:gap-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-sm md:text-lg flex-shrink-0">
                        {topic.user.image ? (
                          <img src={topic.user.image} alt={topic.user.name || "User"} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          topic.user.name?.charAt(0) || "?"
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-1 md:gap-2 mb-2 flex-wrap">
                          {topic.pinned && (
                            <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Pin className="h-2 md:h-3 w-2 md:w-3" />
                              <span className="hidden sm:inline">Sabitlendi</span>
                            </span>
                          )}
                          {topic.locked && (
                            <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              <Lock className="h-2 md:h-3 w-2 md:w-3" />
                              <span className="hidden sm:inline">Kilitli</span>
                            </span>
                          )}
                          {topic.category && (
                            <span className={`px-1.5 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full ${getCategoryColor(topic.category)}`}>
                              {topic.category}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <CardTitle className="text-sm md:text-xl line-clamp-2 mb-1 md:mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors break-words leading-tight">
                          {topic.title}
                        </CardTitle>

                        {/* Description */}
                        <CardDescription className="line-clamp-2 text-[11px] md:text-sm text-gray-600 dark:text-gray-400 break-words leading-snug mb-2">
                          {topic.content}
                        </CardDescription>

                        {/* Image */}
                        {topic.image && (
                          <div className="mt-2 md:mt-3 rounded-lg overflow-hidden max-w-[150px] md:max-w-xs">
                            <img 
                              src={topic.image} 
                              alt="Topic" 
                              className="w-full h-20 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 md:mt-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center flex-wrap gap-2 md:gap-3 text-[10px] md:text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-0.5 md:gap-1">
                              <User className="h-2.5 md:h-4 w-2.5 md:w-4 flex-shrink-0" />
                              <span className="truncate max-w-[80px] md:max-w-none">{topic.user.name}</span>
                              {topic.user.userBadges?.[0]?.badge && (
                                <span 
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ml-1"
                                  style={{ 
                                    backgroundColor: `${topic.user.userBadges[0].badge.color}15`,
                                    color: topic.user.userBadges[0].badge.color,
                                    border: `1px solid ${topic.user.userBadges[0].badge.color}30`
                                  }}
                                  title={topic.user.userBadges[0].badge.name}
                                >
                                  <span className="text-[10px]">{topic.user.userBadges[0].badge.icon}</span>
                                </span>
                              )}
                            </span>
                            <span className="hidden sm:flex items-center gap-0.5 md:gap-1">
                              <Clock className="h-2.5 md:h-4 w-2.5 md:w-4" />
                              <span className="whitespace-nowrap">{formatDate(topic.createdAt)}</span>
                            </span>
                            <span className="flex items-center gap-0.5 md:gap-1">
                              <MessageSquare className="h-2.5 md:h-4 w-2.5 md:w-4" />
                              {topic._count.replies}
                            </span>
                            <span className="flex items-center gap-0.5 md:gap-1">
                              <Eye className="h-2.5 md:h-4 w-2.5 md:w-4" />
                              {topic.views}
                            </span>
                            {topic.edited && (
                              <span className="hidden md:inline text-[10px] italic text-gray-400 dark:text-gray-500">
                                (düzenlendi)
                              </span>
                            )}
                          </div>

                          {/* Like Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleLikeTopic(topic.id)
                            }}
                            className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Heart 
                              className={`h-3 md:h-4 w-3 md:w-4 ${
                                likedTopics.has(topic.id) 
                                  ? "fill-red-500 text-red-500" 
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                            <span className={`text-xs md:text-sm font-medium ${
                              likedTopics.has(topic.id)
                                ? "text-red-500"
                                : "text-gray-600 dark:text-gray-400"
                            }`}>
                              {topic._count.likes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showNewTopicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewTopicModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Yeni Konu Aç</h2>
                  <button
                    onClick={() => setShowNewTopicModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <form onSubmit={handleCreateTopic} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Kategori</label>
                    <select
                      value={newTopic.category}
                      onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                      className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {categories.filter(c => c !== "Tümü").map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Başlık</label>
                    <Input
                      placeholder="Konunuza bir başlık verin..."
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">İçerik</label>
                    <textarea
                      placeholder="Konunuzu detaylı bir şekilde anlatın..."
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                      required
                      className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    />
                  </div>

                  <ImageUpload
                    label="Görsel (Opsiyonel)"
                    value={newTopic.image}
                    onChange={(url) => setNewTopic({ ...newTopic, image: convertDriveLink(url) })}
                    id="topicImage"
                    placeholder="URL girin veya bilgisayar/telefonunuzdan dosya yükleyin"
                    helperText="📱 Telefondan veya bilgisayardan resim yükleyebilir, URL girebilir veya Google Drive linki ekleyebilirsiniz"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900">
                      <Send className="h-4 w-4 mr-2" />
                      Konuyu Yayınla
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewTopicModal(false)}
                      className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
