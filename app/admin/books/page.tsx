"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus, Search, Edit, Trash2, Check, X, BookOpen } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  genre: string | null
  available: boolean
  borrowedBy: string | null
  borrowedAt: string | null
  dueDate: string | null
  featured: boolean
}

interface User {
  id: string
  name: string | null
  email: string
}

export default function AdminBooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [borrowingBook, setBorrowingBook] = useState<Book | null>(null)
  const [selectedUser, setSelectedUser] = useState("")
  const [daysToReturn, setDaysToReturn] = useState("14")

  useEffect(() => {
    fetchBooks()
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books")
      if (res.ok) {
        const data = await res.json()
        setBooks(data.books || [])
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kitabı silmek istediğinizden emin misiniz?")) return

    try {
      const res = await fetch("/api/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchBooks()
      }
    } catch (error) {
      console.error("Error deleting book:", error)
    }
  }

  const openBorrowDialog = (book: Book) => {
    setBorrowingBook(book)
    setSelectedUser("")
    setDaysToReturn("14")
  }

  const closeBorrowDialog = () => {
    setBorrowingBook(null)
    setSelectedUser("")
  }

  const handleBorrow = async () => {
    if (!borrowingBook || !selectedUser) return

    const borrowedAt = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + parseInt(daysToReturn))

    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: borrowingBook.id,
          available: false,
          borrowedBy: selectedUser,
          borrowedAt: borrowedAt.toISOString(),
          dueDate: dueDate.toISOString(),
        }),
      })

      if (res.ok) {
        fetchBooks()
        closeBorrowDialog()
      } else {
        alert("Kitap ödünç verilemedi")
      }
    } catch (error) {
      console.error("Error borrowing book:", error)
      alert("Bir hata oluştu")
    }
  }

  const handleReturn = async (book: Book) => {
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: book.id,
          available: true,
          borrowedBy: null,
          borrowedAt: null,
          dueDate: null,
        }),
      })

      if (res.ok) {
        fetchBooks()
      }
    } catch (error) {
      console.error("Error returning book:", error)
    }
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableBooks = filteredBooks.filter((b) => b.available)
  const borrowedBooks = filteredBooks.filter((b) => !b.available)

  if (loading) {
    return (
      <div className="container py-8 px-4 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Kitap Yönetimi
            </h1>
            <p className="text-muted-foreground mt-1">
              Toplam {books.length} kitap • {availableBooks.length} müsait • {borrowedBooks.length} ödünç alınmış
            </p>
          </div>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" asChild>
          <Link href="/admin/books/new">
            <Plus className="h-4 w-4" />
            Yeni Kitap
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Kitap veya yazar ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Available Books */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Check className="h-6 w-6 text-emerald-600" />
          Müsait Kitaplar ({availableBooks.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {availableBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        {book.genre && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                            {book.genre}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openBorrowDialog(book)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Ödünç Ver
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/books/edit/${book.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {availableBooks.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center text-muted-foreground">
                Müsait kitap bulunamadı
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Borrowed Books */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <X className="h-6 w-6 text-red-600" />
          Ödünç Alınmış Kitaplar ({borrowedBooks.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {borrowedBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        {book.borrowedAt && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Ödünç alındı: {new Date(book.borrowedAt).toLocaleDateString("tr-TR")}
                            {book.dueDate && ` • İade: ${new Date(book.dueDate).toLocaleDateString("tr-TR")}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturn(book)}
                        className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                      >
                        <Check className="h-4 w-4" />
                        İade Alındı
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/books/edit/${book.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {borrowedBooks.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center text-muted-foreground">
                Ödünç alınmış kitap yok
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Borrow Dialog */}
      {borrowingBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Kitap Ödünç Ver</h2>
            <p className="text-sm text-muted-foreground mb-6">
              <strong>{borrowingBook.title}</strong> kitabını ödünç vermek için kullanıcı seçin
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kullanıcı Seç *</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bir kullanıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>İade Süresi (Gün)</Label>
                <Input
                  type="number"
                  value={daysToReturn}
                  onChange={(e) => setDaysToReturn(e.target.value)}
                  min="1"
                  max="90"
                />
                <p className="text-xs text-muted-foreground">
                  İade tarihi: {new Date(Date.now() + parseInt(daysToReturn || "14") * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleBorrow}
                disabled={!selectedUser}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                Ödünç Ver
              </Button>
              <Button
                onClick={closeBorrowDialog}
                variant="outline"
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
