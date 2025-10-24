"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, Star, 
  MessageCircle, Camera, Trash2, Send, Map 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  description: string
  location: string
  locationLat: number | null
  locationLng: number | null
  isOnline: boolean
  startDate: string
  endDate: string | null
  time: string
  eventType: string
  image: string | null
  maxAttendees: number | null
  status: string
  comments: Comment[]
  photos: Photo[]
  _count: {
    rsvps: number
    comments: number
    photos: number
  }
  rsvps?: {
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }[]
}

interface Comment {
  id: string
  content: string
  rating: number | null
  createdAt: string
  user: {
    id: string
    name: string
    image: string | null
  }
}

interface Photo {
  id: string
  url: string
  caption: string | null
  createdAt: string
  user: {
    id: string
    name: string
    image: string | null
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [rating, setRating] = useState<number | null>(null)
  const [photoUrl, setPhotoUrl] = useState("")
  const [photoCaption, setPhotoCaption] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events?id=${params.id}`)
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/events/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          rating: rating,
        }),
      })

      if (response.ok) {
        setCommentText("")
        setRating(null)
        fetchEvent() // Refresh
      } else {
        const error = await response.json()
        alert(error.error || 'Yorum eklenemedi')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoUrl.trim() || !session) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/events/${params.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: photoUrl,
          caption: photoCaption,
        }),
      })

      if (response.ok) {
        setPhotoUrl("")
        setPhotoCaption("")
        fetchEvent() // Refresh
      } else {
        const error = await response.json()
        alert(error.error || 'Fotoğraf eklenemedi')
      }
    } catch (error) {
      console.error('Error submitting photo:', error)
      alert('Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Yorumu silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/events/${params.id}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEvent()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Fotoğrafı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/events/${params.id}/photos?photoId=${photoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEvent()
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  if (loading) {
    return (
      <div className="container py-20 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Etkinlik bulunamadı</h1>
        <Button asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Etkinliklere Dön
          </Link>
        </Button>
      </div>
    )
  }

  const eventDate = new Date(event.startDate)
  const formattedDate = eventDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const isCompleted = event.status === 'COMPLETED'
  const canAddContent = isCompleted && session

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DED0] dark:from-gray-900 dark:to-gray-800">
      <div className="container py-8 px-4 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Etkinliklere Dön
          </Link>
        </Button>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl mb-8"
        >
          <Image
            src={event.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200"}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  event.status === 'COMPLETED' 
                    ? 'bg-blue-500/90 text-white'
                    : event.status === 'ONGOING'
                    ? 'bg-orange-500/90 text-white'
                    : 'bg-green-500/90 text-white'
                }`}>
                  {event.status === 'COMPLETED' ? 'Tamamlandı' : event.status === 'ONGOING' ? 'Devam Ediyor' : 'Yaklaşan'}
                </span>
                {event.eventType && (
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm text-white">
                    {event.eventType}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                {event.title}
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Etkinlik Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">{formattedDate}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">{event.location}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {event._count.rsvps} / {event.maxAttendees} Katılımcı
                    </span>
                  </div>
                )}
                {event.description && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Google Maps */}
            {event.locationLat && event.locationLng && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Konum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${event.locationLat},${event.locationLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors cursor-pointer">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0, pointerEvents: 'none' }}
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${event.locationLat},${event.locationLng}&zoom=15`}
                        allowFullScreen
                      ></iframe>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-900 px-6 py-3 rounded-full shadow-lg">
                          <span className="flex items-center gap-2 font-semibold text-primary">
                            <MapPin className="h-5 w-5" />
                            Google Maps&apos;te Aç
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{event.location}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      💡 Haritaya tıklayarak Google Maps&apos;te detaylı konum bilgisi alabilirsiniz
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            {isCompleted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Yorumlar ({event._count.comments})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment Form */}
                  {canAddContent && (
                    <form onSubmit={handleCommentSubmit} className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label htmlFor="rating">Puanlama (Opsiyonel)</Label>
                        <div className="flex gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating && star <= rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          {rating && (
                            <button
                              type="button"
                              onClick={() => setRating(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                            >
                              Temizle
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comment">Yorumunuz</Label>
                        <textarea
                          id="comment"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Etkinlik hakkındaki düşüncelerinizi paylaşın..."
                          className="w-full min-h-[100px] px-3 py-2 mt-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={submitting}
                        />
                      </div>
                      <Button type="submit" disabled={submitting || !commentText.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                      </Button>
                    </form>
                  )}

                  {/* Comments List */}
                  <div className="space-y-4">
                    {event.comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                      </p>
                    ) : (
                      event.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                                {comment.user.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="font-semibold">{comment.user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                            </div>
                            {(session?.user?.id === comment.user.id || session?.user?.role === 'ADMIN') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {comment.rating && (
                            <div className="flex gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < comment.rating!
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photos Section */}
            {isCompleted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Fotoğraflar ({event._count.photos})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Photo Form */}
                  {canAddContent && (
                    <form onSubmit={handlePhotoSubmit} className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label htmlFor="photoUrl">Fotoğraf URL&apos;si</Label>
                        <Input
                          id="photoUrl"
                          type="url"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          disabled={submitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="caption">Açıklama (Opsiyonel)</Label>
                        <Input
                          id="caption"
                          value={photoCaption}
                          onChange={(e) => setPhotoCaption(e.target.value)}
                          placeholder="Fotoğraf açıklaması..."
                          disabled={submitting}
                          className="mt-2"
                        />
                      </div>
                      <Button type="submit" disabled={submitting || !photoUrl.trim()}>
                        <Camera className="h-4 w-4 mr-2" />
                        {submitting ? 'Ekleniyor...' : 'Fotoğraf Ekle'}
                      </Button>
                    </form>
                  )}

                  {/* Photos Grid */}
                  {event.photos.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Henüz fotoğraf eklenmemiş.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="group relative aspect-square rounded-lg overflow-hidden shadow-lg"
                        >
                          <Image
                            src={photo.url}
                            alt={photo.caption || 'Event photo'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                              <div className="flex justify-end">
                                {(session?.user?.id === photo.user.id || session?.user?.role === 'ADMIN') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    className="text-white hover:bg-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              {photo.caption && (
                                <p className="text-white text-sm font-medium">
                                  {photo.caption}
                                </p>
                              )}
                              <p className="text-white/80 text-xs">
                                {photo.user.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hızlı Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Durum</p>
                  <p className="font-semibold">
                    {event.status === 'COMPLETED' ? 'Tamamlandı' : event.status === 'ONGOING' ? 'Devam Ediyor' : 'Yaklaşan'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Katılımcılar</p>
                  <p className="font-semibold">{event._count.rsvps} kişi</p>
                </div>
                {isCompleted && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Yorumlar</p>
                      <p className="font-semibold">{event._count.comments} yorum</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Fotoğraflar</p>
                      <p className="font-semibold">{event._count.photos} fotoğraf</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Katılımcı Listesi */}
            {event.rsvps && event.rsvps.length > 0 && (
              <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    Katılımcılar ({event.rsvps.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {event.rsvps.map((rsvp) => (
                      <div 
                        key={rsvp.user.id} 
                        className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                      >
                        {rsvp.user.image ? (
                          <img 
                            src={rsvp.user.image} 
                            alt={rsvp.user.name || "User"} 
                            className="h-10 w-10 rounded-full object-cover border-2 border-amber-200 dark:border-amber-800 flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center border-2 border-amber-200 dark:border-amber-800 flex-shrink-0">
                            <span className="text-amber-700 dark:text-amber-300 font-semibold text-sm">
                              {rsvp.user.name?.[0]?.toUpperCase() || rsvp.user.email[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {rsvp.user.name || "İsimsiz Kullanıcı"}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                            ✓
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Henüz Katılımcı Yok */}
            {(!event.rsvps || event.rsvps.length === 0) && (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Katılımcılar
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Henüz katılımcı yok
                  </p>
                  {event.status !== 'COMPLETED' && event.status !== 'CANCELLED' && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      İlk katılan siz olun!
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
