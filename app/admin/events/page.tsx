"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Edit, Trash2, Plus, Users, MapPin, Clock, Tag, Video, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  isOnline: boolean
  startDate: string
  endDate: string | null
  time: string | null
  eventType: string | null
  image: string | null
  maxAttendees: number | null
  status: string
  featured: boolean
  _count: {
    rsvps: number
  }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data.events || data) // Yeni API formatı ile uyumlu
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEvents()
      }
    } catch (error) {
    }
  }

  const handleToggleFeatured = async (eventId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: eventId,
          featured: !currentFeatured,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        console.log('Hata: ' + (error.error || 'Bilinmeyen hata'))
        return
      }

      const updatedEvent = await response.json()
      // Yalnızca ilgili etkinliği güncelle
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId
            ? { ...event, featured: !currentFeatured }
            : event
        )
      )
    } catch (error) {
      console.log('Bağlantı hatası: ' + error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date)
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventType?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const upcomingEvents = filteredEvents.filter(e => e.status === "UPCOMING" || e.status === "ONGOING")
  const pastEvents = filteredEvents.filter(e => e.status === "COMPLETED")

  return (
    <div className="container py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Etkinlik Yönetimi</h1>
          <p className="text-muted-foreground">
            Topluluk etkinliklerini düzenleyin ve yönetin
          </p>
        </div>
        <Button className="gap-2" size="lg" asChild>
          <Link href="/admin/events/new">
            <Plus className="h-5 w-5" />
            Yeni Etkinlik Ekle
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Etkinlik ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam Etkinlik</CardDescription>
            <CardTitle className="text-3xl">{events.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gelecek Etkinlikler</CardDescription>
            <CardTitle className="text-3xl text-green-600">{upcomingEvents.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Geçmiş Etkinlikler</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{pastEvents.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-green-600" />
          Gelecek Etkinlikler
        </h2>
        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Gelecek etkinlik bulunmuyor</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10 flex-shrink-0">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {event.isOnline && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                                  <Video className="h-3 w-3" />
                                  Online
                                </span>
                              )}
                              {event.eventType && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                  <Tag className="h-3 w-3" />
                                  {event.eventType}
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs ${
                                event.status === "UPCOMING" 
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                              }`}>
                                {event.status === "UPCOMING" ? "Yaklaşan" : "Devam Ediyor"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/events/edit/${event.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {formatDate(event.startDate)}
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {event.time}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          {event.maxAttendees && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              {event._count.rsvps} / {event.maxAttendees} kişi
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Geçmiş Etkinlikler
        </h2>
        {pastEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Geçmiş etkinlik bulunmuyor</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all opacity-75">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover opacity-60"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold line-clamp-1">{event.title}</h3>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeatured(event.id, event.featured)}
                              className={event.featured ? "text-yellow-500 hover:text-yellow-600" : ""}
                              title={event.featured ? "Ana sayfadan kaldır" : "Ana sayfaya ekle"}
                            >
                              <Star className={`h-3 w-3 ${event.featured ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/events/edit/${event.id}`)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(event.startDate)}
                          </div>
                          {event.maxAttendees && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event._count.rsvps} kişi katıldı
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
