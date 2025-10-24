"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Book, User, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BorrowLog {
  id: string
  bookTitle: string
  bookAuthor: string
  userName: string
  userEmail: string
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  status: string
  notes: string | null
}

export default function AdminBorrowLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<BorrowLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/")
    } else {
      fetchLogs()
    }
  }, [session, status, router])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/borrow-logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error("Error fetching borrow logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysRemaining = (dueDate: string, returnedAt: string | null) => {
    const due = new Date(dueDate)
    const compareDate = returnedAt ? new Date(returnedAt) : new Date()
    const diffTime = due.getTime() - compareDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BORROWED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            <Book className="h-3 w-3" />
            Ödünçte
          </span>
        )
      case "RETURNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
            <CheckCircle className="h-3 w-3" />
            İade Edildi
          </span>
        )
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-3 w-3" />
            Gecikmeli İade
          </span>
        )
      default:
        return null
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.bookTitle.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
      log.bookAuthor.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
      log.userName.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
      log.userEmail.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'))
    
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: logs.length,
    borrowed: logs.filter(l => l.status === "BORROWED").length,
    returned: logs.filter(l => l.status === "RETURNED").length,
    overdue: logs.filter(l => l.status === "OVERDUE").length,
  }

  if (loading || status === "loading") {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ödünç Kitap Kayıtları</h1>
        <p className="text-muted-foreground">
          Tüm ödünç verme ve iade işlemlerinin geçmişi
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam İşlem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Ödünçte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.borrowed}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
              İade Edildi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.returned}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
              Gecikmiş
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Kitap, yazar, kullanıcı veya email ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Durum Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tümü</SelectItem>
            <SelectItem value="BORROWED">Ödünçte</SelectItem>
            <SelectItem value="RETURNED">İade Edildi</SelectItem>
            <SelectItem value="OVERDUE">Gecikmiş</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Kitap
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Kullanıcı
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Ödünç Tarihi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Teslim Tarihi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    İade Tarihi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Kalan/Geçen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const daysRemaining = getDaysRemaining(log.dueDate, log.returnedAt)
                    return (
                      <tr key={log.id} className="hover:bg-muted/50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium">{log.bookTitle}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.bookAuthor}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(log.borrowedAt)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDate(log.dueDate)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {log.returnedAt ? (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {formatDate(log.returnedAt)}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="px-4 py-4">
                          {log.status === "BORROWED" ? (
                            <span className={`text-sm font-medium ${
                              daysRemaining < 0 
                                ? "text-red-600 dark:text-red-400"
                                : daysRemaining <= 3
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-green-600 dark:text-green-400"
                            }`}>
                              {daysRemaining < 0 
                                ? `${Math.abs(daysRemaining)} gün gecikti`
                                : `${daysRemaining} gün kaldı`
                              }
                            </span>
                          ) : (
                            <span className={`text-sm font-medium ${
                              daysRemaining < 0 
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}>
                              {daysRemaining < 0 
                                ? `${Math.abs(daysRemaining)} gün geç`
                                : "Zamanında"
                              }
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Toplam {filteredLogs.length} kayıt gösteriliyor
      </div>
    </div>
  )
}
