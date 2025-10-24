"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, ShieldCheck, Search, Loader2, AlertCircle, UserCog } from "lucide-react"

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: string
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Yetki kontrolü
  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    // Arama filtresi
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Kullanıcılar yüklenemedi")
      }

      const data = await response.json()
      setUsers(data.users)
      setFilteredUsers(data.users)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error("Kullanıcılar yüklenirken hata:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: "USER" | "ADMIN") => {
    // Kendi rolünü değiştirmeye çalışıyor mu?
    const currentUser = users.find((u) => u.email === session?.user?.email)
    if (currentUser?.id === userId) {
      setError("Kendi rolünüzü değiştiremezsiniz!")
      setTimeout(() => setError(null), 3000)
      return
    }

    // Onay diyalogu
    const targetUser = users.find((u) => u.id === userId)
    const confirmMessage = `${targetUser?.name || targetUser?.email} kullanıcısına ${
      newRole === "ADMIN" ? "admin yetkisi vermek" : "admin yetkisini kaldırmak"
    } istediğinizden emin misiniz?`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setUpdating(userId)
      setError(null)
      setSuccessMessage(null)

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Rol güncellenemedi")
      }

      setSuccessMessage(data.message)
      setTimeout(() => setSuccessMessage(null), 3000)
      
      // Listeyi yenile
      await fetchUsers()
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(null), 4000)
      console.error("Rol güncellenirken hata:", err)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <CardTitle>Admin Ayarları</CardTitle>
          </div>
          <CardDescription>
            Kullanıcıların yetkilerini yönetin. Admin yetkisi vererek veya kaldırarak
            kullanıcıların sisteme erişimini kontrol edebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bilgilendirme */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <p className="font-medium mb-1">Önemli Notlar:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kendi rolünüzü değiştiremezsiniz</li>
                  <li>Admin kullanıcılar tüm yönetim paneline erişebilir</li>
                  <li>Normal kullanıcılar sadece kendi profillerini yönetebilir</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mesajlar */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-900 dark:text-green-100">{successMessage}</p>
            </div>
          )}

          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Kullanıcı ara (isim veya e-posta)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Kullanıcı Listesi */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "Kullanıcı bulunamadı" : "Henüz kullanıcı yok"}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isCurrentUser = user.email === session?.user?.email
                const isAdmin = user.role === "ADMIN"

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {isAdmin ? (
                          <ShieldCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Shield className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user.name || "İsimsiz Kullanıcı"}
                          </p>
                          {isCurrentUser && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                              Siz
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Kayıt: {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            isAdmin
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {isAdmin ? "Admin" : "Kullanıcı"}
                        </span>
                      </div>

                      {!isCurrentUser && (
                        <Button
                          variant={isAdmin ? "outline" : "default"}
                          size="sm"
                          onClick={() => updateUserRole(user.id, isAdmin ? "USER" : "ADMIN")}
                          disabled={updating === user.id}
                          className={
                            isAdmin
                              ? "border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950/20"
                              : "bg-amber-600 hover:bg-amber-700 text-white"
                          }
                        >
                          {updating === user.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Güncelleniyor...
                            </>
                          ) : isAdmin ? (
                            "Yetkiyi Kaldır"
                          ) : (
                            "Admin Yap"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* İstatistikler */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {users.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Toplam Kullanıcı</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {users.filter((u) => u.role === "USER").length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Kullanıcı</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
