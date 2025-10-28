"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, Trash2, ArrowLeft, Check, Clock, BookMarked, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ReadingListItem {
  id: string
  status: string
  addedAt: Date
  book: {
    id: string
    title: string
    author: string
    coverImage: string | null
    genre: string | null
    publishedYear: number | null
  }
}

export default function ReadingListPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<ReadingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchReadingList()
    }
  }, [status, router])

  const fetchReadingList = async () => {
    try {
      const res = await fetch("/api/reading-list")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId: string) => {
    if (!confirm("Bu kitabı okuma listenizden kaldırmak istediğinizden emin misiniz?")) return

    try {
      const res = await fetch(`/api/reading-list/${itemId}`, { method: "DELETE" })
      if (res.ok) {
        await fetchReadingList()
        router.refresh()
      }
    } catch (error) {
    }
  }

  const handleUpdateStatus = async (itemId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reading-list/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        // Listeyi yenile
        await fetchReadingList()
        // Profil sayfasını da yenile (cache invalidation)
        router.refresh()
      }
    } catch (error) {
    }
  }

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "all" || item.status === filter
    const matchesSearch = item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.book.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="container py-8 px-4 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-muted rounded"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4" asChild><Link href="/profile"><ArrowLeft className="h-4 w-4 mr-2" />Profile Dön</Link></Button>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Okuma Listem</h1>
          <p className="text-muted-foreground text-lg mb-6">Okumak istediğiniz ve okuduğunuz kitapları takip edin</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><BookOpen className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-muted-foreground">Toplam</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><BookMarked className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{items.filter(i => i.status === "to-read").length}</p><p className="text-xs text-muted-foreground">Okunacak</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg"><Clock className="h-5 w-5 text-amber-600" /></div><div><p className="text-2xl font-bold">{items.filter(i => i.status === "reading").length}</p><p className="text-xs text-muted-foreground">Okuyorum</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Check className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold">{items.filter(i => i.status === "completed").length}</p><p className="text-xs text-muted-foreground">Tamamlandı</p></div></div></CardContent></Card>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Kitap veya yazar ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Tümü ({items.length})</Button>
            <Button variant={filter === "to-read" ? "default" : "outline"} onClick={() => setFilter("to-read")}><BookMarked className="h-4 w-4 mr-2" />Okunacak ({items.filter(i => i.status === "to-read").length})</Button>
            <Button variant={filter === "reading" ? "default" : "outline"} onClick={() => setFilter("reading")}><Clock className="h-4 w-4 mr-2" />Okuyorum ({items.filter(i => i.status === "reading").length})</Button>
            <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}><Check className="h-4 w-4 mr-2" />Tamamlandı ({items.filter(i => i.status === "completed").length})</Button>
          </div>
        </motion.div>
      </div>
      {filteredItems.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="bg-gray-100 dark:bg-gray-800 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-700">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {searchQuery ? "Kitap bulunamadı" : "Henüz kitap eklenmemiş"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery 
              ? "Farklı bir arama deneyin" 
              : "Kütüphaneden kitap ekleyerek okuma listenizi oluşturun"}
          </p>
          {!searchQuery && (
            <Button asChild><Link href="/library"><BookOpen className="h-4 w-4 mr-2" />Kütüphaneye Git</Link></Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image src={item.book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"} alt={item.book.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="pb-3"><CardTitle className="line-clamp-2 text-lg">{item.book.title}</CardTitle><p className="text-sm text-muted-foreground">{item.book.author}</p></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    {item.book.genre && <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full">{item.book.genre}</span>}
                    {item.book.publishedYear && <span className="text-xs bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{item.book.publishedYear}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select value={item.status} onChange={(e) => handleUpdateStatus(item.id, e.target.value)} className="flex-1 text-xs rounded-md border border-input bg-background px-2 py-1">
                      <option value="to-read">Okunacak</option>
                      <option value="reading">Okuyorum</option>
                      <option value="completed">Tamamlandı</option>
                    </select>
                    <Button size="sm" variant="ghost" onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Button className="w-full" size="sm" variant="outline" asChild><Link href={`/library/${item.book.id}`}>Detaylar</Link></Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
