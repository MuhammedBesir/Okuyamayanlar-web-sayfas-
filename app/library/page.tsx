﻿"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Search, Star, BookOpen, TrendingUp, Calendar, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Book {
  id: string
  title: string
  author: string
  description: string | null
  coverImage: string | null
  genre: string | null
  publishedYear: number | null
  pageCount: number | null
  available: boolean
  featured: boolean
  borrower?: {
    id: string
    name: string | null
    email: string
  } | null
  _count?: {
    reviews: number
    readingLists: number
  }
  averageRating?: number
}

function LibraryContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all") // "all", "available", "borrowed"
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const isAdmin = session?.user?.role === "ADMIN"

  useEffect(() => {
    fetchBooks()
    // URL'deki search parametresini al
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books")
      if (res.ok) {
        const data = await res.json()
        console.log('API Response:', data)
        console.log('Is Array?', Array.isArray(data))
        console.log('Has books property?', data.books)
        // API returns { books: [...] } format
        const booksArray = Array.isArray(data) ? data : data.books || []
        console.log('Books to set:', booksArray)
        setBooks(booksArray)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setBooks([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const genres = Array.isArray(books) && books.length > 0 
    ? ["all", ...Array.from(new Set(books.filter(b => b.genre).map(b => b.genre!)))]
    : ["all"]

  const filteredBooks = Array.isArray(books) ? books.filter((book: Book) => {
    const searchLower = searchQuery.toLocaleLowerCase('tr-TR')
    const matchesSearch = book.title.toLocaleLowerCase('tr-TR').includes(searchLower) ||
                         book.author.toLocaleLowerCase('tr-TR').includes(searchLower)
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre
    const matchesAvailability = availabilityFilter === "all" || 
                                (availabilityFilter === "available" && book.available) ||
                                (availabilityFilter === "borrowed" && !book.available)
    return matchesSearch && matchesGenre && matchesAvailability
  }) : []

  if (loading) {
    return (
      <div className="container py-4 sm:py-8 px-3 sm:px-4 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 sm:h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 sm:py-8 px-3 sm:px-4 max-w-7xl">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Kütüphane
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg">
          Kitap koleksiyonumuzu keşfedin
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-2.5 sm:p-3 md:p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              <div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-amber-700 dark:text-amber-400">{books.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Toplam</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-2.5 sm:p-3 md:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-400">{books.filter(b => b.featured).length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Öne Çıkan</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-2.5 sm:p-3 md:p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-700 dark:text-green-400">{books.filter(b => b.available).length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Müsait</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-2.5 sm:p-3 md:p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-400">{Math.max(0, genres.length - 1)}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Kategori</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 md:top-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Kitap veya yazar ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 sm:pl-9 md:pl-10 h-9 sm:h-10 md:h-11 text-sm md:text-base"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground pt-1 sm:pt-0 flex-shrink-0">Kategori:</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className="text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-2.5 md:px-3"
                >
                  {genre === "all" ? "Tümü" : genre}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-start sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground pt-1 sm:pt-0 flex-shrink-0">Durum:</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button
                variant={availabilityFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter("all")}
                className="text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-2.5 md:px-3"
              >
                Tümü
              </Button>
              <Button
                variant={availabilityFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter("available")}
                className={`text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-2.5 md:px-3 ${
                  availabilityFilter === "available" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950/20"
                }`}
              >
                Ödünç Alınabilir
              </Button>
              <Button
                variant={availabilityFilter === "borrowed" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter("borrowed")}
                className={`text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-2.5 md:px-3 ${
                  availabilityFilter === "borrowed" 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950/20"
                }`}
              >
                Ödünçte
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {filteredBooks.map((book: Book) => (
          <Link key={book.id} href={`/library/${book.id}`} className="block">
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <CardHeader className="p-2 sm:p-3 md:p-4 pb-1.5 sm:pb-2 md:pb-3 flex-shrink-0">
                <CardTitle className="line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg break-words group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{book.title}</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs md:text-sm truncate">{book.author}</CardDescription>
              </CardHeader>
            
            <CardContent className="p-2 sm:p-3 md:p-4 pb-2 sm:pb-3 md:pb-4 space-y-1 sm:space-y-1.5 md:space-y-2">
              {book.genre && (
                <span className="text-[10px] sm:text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full inline-block">
                  {book.genre}
                </span>
              )}
              {book.featured && (
                <div className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 inline-flex items-center gap-0.5 sm:gap-1">
                  <Star className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-current" />
                  <span className="hidden sm:inline">Öne Çıkan</span>
                </div>
              )}
              
              {/* Rating Display */}
              {book._count?.reviews && book._count.reviews > 0 && book.averageRating && book.averageRating > 0 && (
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 sm:h-3 md:h-3.5 w-2.5 sm:w-3 md:w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {book.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{book._count.reviews} değerlendirme</span>
                </div>
              )}
              
              <div className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 md:gap-2 ${
                book.available ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'
              }`}>
                <div className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full ${book.available ? 'bg-green-500' : 'bg-red-500'}`} />
                {book.available ? 'Müsait' : 'Ödünçte'}
              </div>
              
              {!book.available && isAdmin && book.borrower && (
                <div className="text-[10px] sm:text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <User className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                    <span className="font-semibold">Ödünç Alan:</span>
                  </div>
                  <div className="pl-3 sm:pl-3.5 md:pl-4">
                    <div className="font-medium truncate">{book.borrower.name || "İsimsiz"}</div>
                    <div className="text-[9px] sm:text-[10px] opacity-75 truncate">{book.borrower.email}</div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-2 sm:p-3 md:p-4 mt-auto">
              <Button className="w-full h-7 sm:h-8 md:h-9 text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" size="sm">
                Detayları Gör
              </Button>
            </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Sonuç bulunamadı</h3>
          <p className="text-muted-foreground text-sm sm:text-base">Farklı bir arama terimi deneyin.</p>
        </div>
      )}
    </div>
  )
}

export default function LibraryPage() {
  return (
    <Suspense fallback={
      <div className="container py-4 sm:py-8 px-3 sm:px-4 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 sm:h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <LibraryContent />
    </Suspense>
  )
}
