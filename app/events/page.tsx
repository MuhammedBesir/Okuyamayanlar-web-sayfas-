"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Clock, Tag, Video, X, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  locationLat: number | null
  locationLng: number | null
  isOnline: boolean
  startDate: string
  endDate: string | null
  time: string | null
  eventType: string | null
  image: string | null
  maxAttendees: number | null
  status: string
  _count: {
    rsvps: number
  }
  userRSVP?: {
    status: string
  } | null
  rsvps?: {
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }[]
}

const eventTypes = ["Tümü", "Söyleşi", "Kitap Ortağım", "Kafamda Deli Sorular", "Spontane", "Diğer"]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">("upcoming")
  const [selectedType, setSelectedType] = useState("Tümü")
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('Events API response:', data)
      
      // Veriyi düzgün şekilde kontrol et
      if (data && data.events && Array.isArray(data.events)) {
        setEvents(data.events)
      } else if (Array.isArray(data)) {
        setEvents(data)
      } else {
        console.warn('Unexpected events data format:', data)
        setEvents([]) // Fallback: boş array
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([]) // Hata durumunda boş array
    } finally {
      setLoading(false)
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const event = events.find(e => e.id === eventId)
      const isAlreadyJoined = event?.userRSVP?.status === 'going'

      if (isAlreadyJoined) {
        // Leave event
        const response = await fetch(`/api/events/rsvp?eventId=${eventId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchEvents()
        }
      } else {
        // Join event
        const response = await fetch('/api/events/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, status: 'going' })
        })

        if (response.ok) {
          fetchEvents()
        } else {
          const data = await response.json()
          alert(data.error || 'Etkinliğe katılırken bir hata oluştu')
        }
      }
    } catch (error) {
      console.error('Error with event RSVP:', error)
      alert('Bir hata oluştu')
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

  const upcomingEvents = events.filter(e => 
    (e.status === "UPCOMING" || e.status === "ONGOING") &&
    (selectedType === "Tümü" || e.eventType === selectedType)
  )

  const pastEvents = events.filter(e => 
    (e.status === "COMPLETED" || e.status === "CANCELLED") &&
    (selectedType === "Tümü" || e.eventType === selectedType)
  )

  const displayEvents = selectedTab === "upcoming" ? upcomingEvents : pastEvents

  return (
    <div className="container py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3 md:mb-4 px-4 md:px-5 py-2 md:py-2.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-full border border-amber-200/30 dark:border-amber-800/30">
          <Sparkles className="h-4 md:h-5 w-4 md:w-5 text-amber-600 dark:text-amber-500" />
          <span className="text-xs md:text-sm font-medium text-amber-700 dark:text-amber-400">
            Okuyamayanlar Etkinlikleri
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-gray-100">
          Etkinlikler
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
          Kitapseverlerle buluşun, yeni arkadaşlıklar kurun ve edebiyat dünyasında keyifli zamanlar geçirin
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 md:mb-8 px-2">
        <div className="inline-flex w-full md:w-auto bg-gray-100 dark:bg-gray-800 rounded-xl p-1 md:p-1.5 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={`flex-1 md:flex-none px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
              selectedTab === "upcoming"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span className="hidden sm:inline">Gelecek Etkinlikler</span>
            <span className="sm:hidden">Gelecek</span> ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setSelectedTab("past")}
            className={`flex-1 md:flex-none px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
              selectedTab === "past"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span className="hidden sm:inline">Geçmiş Etkinlikler</span>
            <span className="sm:hidden">Geçmiş</span> ({pastEvents.length})
          </button>
        </div>
      </div>

      {/* Event Type Filters */}
      <div className="mb-8 md:mb-10 flex flex-wrap justify-center gap-2 px-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
              selectedType === type
                ? "bg-amber-600 text-white shadow-md hover:shadow-lg hover:bg-amber-700"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-64 rounded-lg mb-4"></div>
              <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-muted h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 bg-white dark:bg-gray-900"
              >
                <div 
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="flex flex-col flex-1 cursor-pointer"
                >
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-50 dark:bg-gray-800">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {event.isOnline && (
                      <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                        <Video className="h-3.5 w-3.5" />
                        Online
                      </div>
                    )}
                    {event.eventType && (
                      <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                        <Tag className="h-3.5 w-3.5" />
                        {event.eventType}
                      </div>
                    )}
                  </div>
                  {selectedTab === "past" && (
                    <div className="absolute top-3 left-3">
                      {event.status === "CANCELLED" ? (
                        <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <X className="h-3.5 w-3.5" />
                          İptal Edildi
                        </div>
                      ) : (
                        <div className="bg-gray-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <Check className="h-3.5 w-3.5" />
                          Tamamlandı
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <CardHeader className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-2 mt-3">
                    <span className="flex items-center gap-2.5 text-sm">
                      <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{formatDate(event.startDate)}</span>
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-2.5 text-sm">
                        <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
                          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{event.time}</span>
                      </span>
                    )}
                    {event.locationLat && event.locationLng ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`https://www.google.com/maps/search/?api=1&query=${event.locationLat},${event.locationLng}`, '_blank', 'noopener,noreferrer')
                        }}
                        className="flex items-center gap-2.5 text-sm hover:text-amber-600 dark:hover:text-amber-500 transition-colors group/link text-left"
                      >
                        <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg group-hover/link:bg-amber-50 dark:group-hover/link:bg-amber-950/30">
                          <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </div>
                        <span className="line-clamp-1 group-hover/link:underline text-gray-700 dark:text-gray-300">{event.location}</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-2.5 text-sm">
                        <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
                          <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </div>
                        <span className="line-clamp-1 text-gray-700 dark:text-gray-300">{event.location}</span>
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {event.description}
                    </p>
                  )}
                  {event.maxAttendees && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{event._count.rsvps}</span> / {event.maxAttendees} kişi
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                          %{Math.round((event._count.rsvps / event.maxAttendees) * 100)} dolu
                        </div>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-amber-600 h-full transition-all duration-500"
                          style={{ width: `${(event._count.rsvps / event.maxAttendees) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                </div>
                {selectedTab === "upcoming" && (
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      Detaylar
                    </Button>
                    <Button 
                      className={`flex-1 transition-all ${
                        event.userRSVP?.status === 'going' 
                          ? "" 
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                      variant={event.userRSVP?.status === 'going' ? "outline" : "default"}
                      disabled={!event.userRSVP && event.maxAttendees ? event._count.rsvps >= event.maxAttendees : false}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleJoinEvent(event.id)
                      }}
                    >
                      {event.userRSVP?.status === 'going' ? (
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Katıldınız
                        </span>
                      ) : event.maxAttendees && event._count.rsvps >= event.maxAttendees ? (
                        "Dolu"
                      ) : (
                        "Katıl"
                      )}
                    </Button>
                  </CardFooter>
                )}
                {selectedTab === "past" && (
                  <CardFooter className="flex flex-col gap-2">
                    {event.status === "CANCELLED" && (
                      <div className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3 text-center">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          Bu etkinlik iptal edildi
                        </p>
                      </div>
                    )}
                    <Button 
                      variant="outline"
                      className="w-full hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      {event.status === "CANCELLED" ? "Detayları Gör" : "Detayları Gör & Yorum Yap"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="bg-gray-100 dark:bg-gray-800 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-700">
            <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Etkinlik bulunamadı</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedTab === "upcoming" 
              ? "Şu anda planlanmış etkinlik bulunmamaktadır" 
              : "Geçmiş etkinlik kaydı bulunmamaktadır"}
          </p>
        </motion.div>
      )}
    </div>
  )
}
