"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Calendar, Users, Quote, Star, Award, TrendingUp, MessageCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

const featuredBooks = [
  {
    id: "1",
    title: "Kürk Mantolu Madonna",
    author: "Sabahattin Ali",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description: "Türk edebiyatının걸작lerinden. Raif Efendi'nin Maria Puder'e olan aşkı ve trajik sonu.",
    genre: "Roman",
    pages: 176,
  },
  {
    id: "2",
    title: "İnce Memed",
    author: "Yaşar Kemal",
    coverImage: "https://images.unsplash.com/photo-1495640452828-3df6795cf331?w=400",
    description: "Çukurova'nın acı gerçeklerini anlatan destansı bir roman. Memed'in özgürlük mücadelesi.",
    genre: "Epik Roman",
    pages: 432,
  },
  {
    id: "3",
    title: "Tutunamayanlar",
    author: "Oğuz Atay",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    description: "Modern Türk edebiyatının başyapıtı. Selim'in iç dünyasına yolculuk.",
    genre: "Felsefi Roman",
    pages: 724,
  },
  {
    id: "4",
    title: "Saatleri Ayarlama Enstitüsü",
    author: "Ahmet Hamdi Tanpınar",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    description: "Doğu-Batı çatışmasını mizahi bir dille işleyen걸작 eser.",
    genre: "Mizahi Roman",
    pages: 408,
  },
  {
    id: "5",
    title: "Beyaz Kale",
    author: "Orhan Pamuk",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    description: "Kimlik, ikiz benlik ve Doğu-Batı ilişkilerini sorgulayan tarihsel roman.",
    genre: "Tarihsel Roman",
    pages: 176,
  },
  {
    id: "6",
    title: "Şu Çılgın Türkler",
    author: "Turgut Özakman",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
    description: "Çanakkale Savaşı'nın destansı hikayesi. Vatan sevgisi ve kahramanlık.",
    genre: "Tarihsel Roman",
    pages: 584,
  },
]

const upcomingEvents = [
  {
    id: "1",
    title: "Yaşar Kemal Kitap Kulübü",
    date: "25 Ekim 2025",
    location: "Online - Zoom",
    attendees: 18,
    maxAttendees: 30,
    description: "Bu ay İnce Memed'i tartışıyoruz. Çukurova'nın destanını birlikte okuyalım.",
  },
  {
    id: "2",
    title: "Orhan Pamuk Söyleşisi",
    date: "1 Kasım 2025",
    location: "Merkez Kütüphane - Konferans Salonu",
    attendees: 42,
    maxAttendees: 50,
    description: "Nobel ödüllü yazarımız eserlerini ve yazma sürecini anlatacak.",
  },
  {
    id: "3",
    title: "Türk Şiiri Gecesi",
    date: "5 Kasım 2025",
    location: "Kitap Kafe - Bahçe",
    attendees: 15,
    maxAttendees: 25,
    description: "Nazım Hikmet, Orhan Veli, Cahit Sıtkı şiirleri ile dolu bir akşam.",
  },
]

const bookQuotes = [
  {
    text: "İnsan sevdiğini koruyabildiği müddetçe mutludur.",
    author: "Sabahattin Ali",
    book: "Kürk Mantolu Madonna",
  },
  {
    text: "Çocuklar acıkmıştı. Analar ağlıyordu. Babalar sustular.",
    author: "Yaşar Kemal",
    book: "İnce Memed",
  },
]

export default function HomePage() {
  const [activeDiscussions, setActiveDiscussions] = useState<any[]>([])
  const [loadingDiscussions, setLoadingDiscussions] = useState(true)
  const [pastEvents, setPastEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [bookOfTheMonth, setBookOfTheMonth] = useState<any>(null)
  const [loadingFeaturedBook, setLoadingFeaturedBook] = useState(true)

  // Öne çıkan kitabı çek
  useEffect(() => {
    const fetchFeaturedBook = async () => {
      try {
        const response = await fetch('/api/featured-book')
        const data = await response.json()
        
        console.log('Featured book data:', data)
        
        if (data.featuredBook) {
          setBookOfTheMonth(data.featuredBook)
          console.log('Book of the month set:', data.featuredBook)
        }
      } catch (error) {
        console.error('Öne çıkan kitap yüklenirken hata:', error)
      } finally {
        setLoadingFeaturedBook(false)
      }
    }

    fetchFeaturedBook()
  }, [])

  // Forum verilerini çek
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch('/api/forum?featured=true&limit=6')
        const data = await response.json()
        
        if (data.topics) {
          setActiveDiscussions(data.topics)
        }
      } catch (error) {
        console.error('Tartışmalar yüklenirken hata:', error)
      } finally {
        setLoadingDiscussions(false)
      }
    }

    fetchDiscussions()
  }, [])

  // Geçmiş etkinlikleri çek
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const response = await fetch('/api/events?past=true&featured=true&limit=3')
        const data = await response.json()
        
        if (data.events || Array.isArray(data)) {
          setPastEvents(data.events || data)
        }
      } catch (error) {
        console.error('Etkinlikler yüklenirken hata:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchPastEvents()
  }, [])
  // Paylaşım fonksiyonu
  const handleShare = async () => {
    if (!bookOfTheMonth) return;
    
    const shareData = {
      title: `${bookOfTheMonth.title} - ${bookOfTheMonth.author}`,
      text: `Bu ayın seçimi: ${bookOfTheMonth.title} - ${bookOfTheMonth.quote || ''}`,
      url: window.location.origin + `/library/${bookOfTheMonth.bookId || bookOfTheMonth.id}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: URL'yi kopyala
        await navigator.clipboard.writeText(shareData.url)
        alert('Kitap linki kopyalandı! 📋')
      }
    } catch (err) {
      console.log('Paylaşım hatası:', err)
    }
  }

  // Okuma listesine ekleme fonksiyonu
  const handleAddToReadingList = () => {
    if (!bookOfTheMonth) return;
    
    // LocalStorage'a ekle (geçici çözüm, sonra API'ye bağlanacak)
    const readingList = JSON.parse(localStorage.getItem('readingList') || '[]')
    const bookId = bookOfTheMonth.bookId || bookOfTheMonth.id
    const bookExists = readingList.some((book: any) => book.id === bookId)
    
    if (!bookExists) {
      readingList.push({
        id: bookId,
        title: bookOfTheMonth.title,
        author: bookOfTheMonth.author,
        coverImage: bookOfTheMonth.coverImage,
        addedAt: new Date().toISOString()
      })
      localStorage.setItem('readingList', JSON.stringify(readingList))
      alert(`"${bookOfTheMonth.title}" okuma listenize eklendi! 📚`)
    } else {
      alert('Bu kitap zaten okuma listenizde! ✅')
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section - Görseldeki gibi */}
      <section className="relative py-32 md:py-48 bg-gradient-to-br from-[#F5F0E8] to-[#E8DED0] dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-5xl text-center"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight text-gray-900 dark:text-gray-100">
              Kitaplarla Birlikte{" "}
              <span className="text-[#E67350] dark:text-[#FF8A65]">Büyüyen</span>{" "}
              Bir Topluluk
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Her ay yeni kitaplar, keyifli sohbetler ve sınırsız eğlence. Katılmak için tek bir tıklama yeterli!
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-[#6B5544] hover:bg-[#5a4638] dark:bg-[#FF8A65] dark:hover:bg-[#FF7043] text-white text-lg h-14 px-10 rounded-xl shadow-xl font-bold transition-all" 
                asChild
              >
                <Link href="/events">
                  <Calendar className="mr-2 h-5 w-5" />
                  Hemen Keşfet
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bu Ayın Seçimi - Görseldeki gibi */}
      {!loadingFeaturedBook && bookOfTheMonth && (
      <section className="py-20 bg-gradient-to-br from-[#FFFAF7] to-[#FFF3ED] dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow">
                {bookOfTheMonth.badge || '⭐ Bu Ayın Seçimi'}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Sol: Kitap Görseli */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                    src={bookOfTheMonth.coverImage}
                    alt={bookOfTheMonth.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Rating ve Okuyucu overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold">{bookOfTheMonth.rating || 0}</span>
                        </div>
                        <div className="text-xs opacity-90">Rating</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-5 w-5" />
                          <span className="text-2xl font-bold">{bookOfTheMonth.readers}</span>
                        </div>
                        <div className="text-xs opacity-90">Okuyucu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sağ: Kitap Bilgileri */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Kategori */}
                <div className="inline-block">
                  <span className="text-[#E67350] dark:text-[#FF8A65] font-bold text-sm bg-[#E67350]/10 dark:bg-[#FF8A65]/20 px-4 py-2 rounded-full">
                    {bookOfTheMonth.genre || bookOfTheMonth.category || 'Genel'}
                  </span>
                </div>

                {/* Başlık */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-3">
                    {bookOfTheMonth.title}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
                    {bookOfTheMonth.author}
                  </p>
                </div>

                {/* Yıldızlar ve Değerlendirme */}
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${
                        i < Math.floor(bookOfTheMonth.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    ({bookOfTheMonth.reviewCount || 0} değerlendirme)
                  </span>
                </div>

                {/* Alıntı Kutusu */}
                {bookOfTheMonth.quote && (
                <div className="bg-muted p-6 rounded-xl border-l-4 border-primary">
                  <Quote className="h-8 w-8 text-primary mb-3" />
                  <p className="text-muted-foreground italic leading-relaxed">
                    &quot;{bookOfTheMonth.quote}&quot;
                  </p>
                </div>
                )}

                {/* Açıklama */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {bookOfTheMonth.description}
                </p>

                {/* Butonlar */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-[#6B5544] hover:bg-[#5a4638] dark:bg-[#8D6E63] dark:hover:bg-[#A1887F] text-white font-bold rounded-xl shadow-lg transition-all" 
                    onClick={handleAddToReadingList}
                  >
              📕 Okuma Listeme Ekle
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-[#E67350] text-[#E67350] hover:bg-[#E67350]/10 dark:border-[#FF8A65] dark:text-[#FF8A65] dark:hover:bg-[#FF8A65]/10 font-bold rounded-xl transition-all" 
                    onClick={handleShare}
                  >
                  🔗Paylaş
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* Active Discussions Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFFAF7] via-[#FFF7F2] to-[#FFF3ED] dark:from-gray-900 dark:via-gray-925 dark:to-gray-950">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-[#E67350] dark:text-[#FF8A65]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
              🔥 Aktif Tartışmalar
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Topluluğumuzun en çok konuştuğu konular ve kitaplar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {loadingDiscussions ? (
              // Loading skeleton
              [...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-20"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))
            ) : activeDiscussions.length > 0 ? (
              activeDiscussions.map((discussion, index) => {
                const replyCount = discussion._count?.replies || 0
                const createdDate = new Date(discussion.createdAt)
                const now = new Date()
                const diffTime = Math.abs(now.getTime() - createdDate.getTime())
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
                
                let timeAgo = ""
                if (diffDays > 0) {
                  timeAgo = `${diffDays} gün önce`
                } else if (diffHours > 0) {
                  timeAgo = `${diffHours} saat önce`
                } else {
                  timeAgo = "Az önce"
                }

                return (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-[#FF9B7A] dark:hover:border-[#E67350] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-[#E67350] dark:bg-[#D96544] text-white">
                            {discussion.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MessageCircle className="h-3 w-3" />
                            <span className="font-semibold">{replyCount}</span>
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2 text-lg leading-tight text-gray-900 dark:text-gray-100 group-hover:text-[#E67350] dark:group-hover:text-[#FF8A65] transition-colors" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
                          {discussion.title}
                        </CardTitle>
                        {discussion.pinned && (
                          <div className="flex items-center gap-1 text-xs text-[#E67350] dark:text-[#FF9B7A] mt-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span>Sabitlenmiş</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pb-3 flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                          {discussion.content}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E67350] to-[#D96544] flex items-center justify-center text-white text-xs font-bold">
                              {discussion.user?.name?.charAt(0) || "?"}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {discussion.user?.name || "Anonim"}
                            </span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">{timeAgo}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full h-9 text-sm bg-gradient-to-r from-[#E67350] to-[#D96544] hover:from-[#D96544] hover:to-[#CC5638] dark:from-[#FF8A65] dark:to-[#FF7043] dark:hover:from-[#FF7043] dark:hover:to-[#FF5722] font-bold text-white" 
                          asChild
                        >
                          <Link href={`/forum/${discussion.id}`}>
                            💬 Tartışmaya Katıl
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Henüz tartışma bulunmuyor</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-2 border-[#E67350] text-[#E67350] hover:bg-orange-50 dark:hover:bg-orange-950/30 font-bold" asChild>
              <Link href="/forum">
                Tüm Tartışmaları Gör
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFFAF7] to-[#FFF3ED] dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-[#6B5544] dark:text-[#A1887F]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
              📅 Geçmiş Etkinliklerimiz
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Gerçekleştirdiğimiz başarılı etkinlikler ve unutulmaz anlar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {loadingEvents ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))
            ) : pastEvents.length > 0 ? (
              pastEvents.map((event, index) => {
                const eventDate = new Date(event.startDate || event.date)
                const formattedDate = eventDate.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })

                const defaultImage = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop"

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      const modal = document.getElementById(`event-modal-${event.id}`)
                      if (modal) modal.classList.remove('hidden')
                    }}
                  >
                    {/* Event Image */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-xl">
                      <Image
                        src={event.image || defaultImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-2 text-white">
                            <Eye className="h-5 w-5" />
                            <span className="text-sm font-semibold">Detayları Gör</span>
                          </div>
                        </div>
                      </div>
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                        <div className="text-2xl font-black text-[#6B5544] dark:text-[#A1887F]">
                          {eventDate.getDate()}
                        </div>
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                          {eventDate.toLocaleDateString('tr-TR', { month: 'short' })}
                        </div>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="px-2">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-[#6B5544] dark:group-hover:text-[#A1887F] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-semibold">{event.attendees || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      {/* Detay Göster Butonu */}
                      <Button
                        className="w-full bg-[#6B5544] hover:bg-[#5a4638] dark:bg-[#8D6E63] dark:hover:bg-[#6D4C41] text-white font-semibold"
                        size="sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/events/${event.id}`}>
                          📖 Detay Göster
                        </Link>
                      </Button>
                    </div>

                    {/* Modal */}
                    <div
                      id={`event-modal-${event.id}`}
                      className="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          e.currentTarget.classList.add('hidden')
                        }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Modal Image */}
                        <div className="relative aspect-[21/9] w-full">
                          <Image
                            src={event.image || defaultImage}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const modal = document.getElementById(`event-modal-${event.id}`)
                              if (modal) modal.classList.add('hidden')
                            }}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                          >
                            <ArrowRight className="h-6 w-6 rotate-45 text-gray-900" />
                          </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#6B5544]/10 p-3 rounded-xl">
                              <Calendar className="h-6 w-6 text-[#6B5544]" />
                            </div>
                            <div>
                              <div className="text-2xl font-black text-[#6B5544]">{formattedDate}</div>
                              <div className="text-sm text-muted-foreground">{event.time || 'Tamamlandı'}</div>
                            </div>
                          </div>

                          <h2 className="text-3xl font-black mb-4 text-gray-900 dark:text-white">
                            {event.title}
                          </h2>

                          <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
                              <Users className="h-5 w-5 text-emerald-600" />
                              <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                                {event.attendees || 0} Katılımcı
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-blue-900 dark:text-blue-100">
                                {event.location}
                              </span>
                            </div>
                            {event.eventType && (
                              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                                <span className="font-semibold text-purple-900 dark:text-purple-100">
                                  {event.eventType}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {event.description}
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button 
                              className="w-full bg-[#6B5544] hover:bg-[#5a4638] dark:bg-[#8D6E63] dark:hover:bg-[#A1887F] text-white font-bold h-12 transition-all"
                              asChild
                            >
                              <Link href={`/events/${event.id}`}>
                                📖 Detay Göster
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Henüz tamamlanmış etkinlik bulunmuyor</p>
              </div>
            )}
          </div>

          {pastEvents.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="border-2 border-[#6B5544] text-[#6B5544] hover:bg-[#6B5544]/10 dark:border-[#A1887F] dark:text-[#A1887F] dark:hover:bg-[#A1887F]/10 font-bold transition-all" asChild>
                <Link href="/events">
                  Tüm Etkinlikler Sayfasına Git
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}