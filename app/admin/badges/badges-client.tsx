"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Award, Users, Search, X, Plus, Trash2, History, TrendingUp, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  isSpecial: boolean
  requirement?: number
  _count: {
    userBadges: number
  }
}

interface UserData {
  id: string
  name: string
  email: string
  image?: string
  createdAt: string
  _count: {
    userBadges: number
  }
}

interface BadgeHistoryItem {
  id: string
  earnedAt: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
  badge: {
    id: string
    name: string
    icon: string
    color: string
    category: string
    isSpecial: boolean
  }
}

export default function AdminBadgesClientPage({ initialBadges }: { initialBadges: BadgeData[] }) {
  const [badges, setBadges] = useState<BadgeData[]>(initialBadges)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserData[]>([])
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<string>("")
  const [isGranting, setIsGranting] = useState(false)
  const [badgeHistory, setBadgeHistory] = useState<BadgeHistoryItem[]>([])
  const [historyStats, setHistoryStats] = useState<any>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [activeTab, setActiveTab] = useState<"badges" | "grant" | "history">("badges")

  // Toast alternatifi - basit alert
  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    const emoji = variant === "destructive" ? "❌" : "✅"
    console.log(`${emoji} ${title}\n\n${description}`)
  }

  // Kategori bazında grupla
  const badgesByCategory = badges.reduce((acc: any, badge: BadgeData) => {
    if (!acc[badge.category]) {
      acc[badge.category] = []
    }
    acc[badge.category].push(badge)
    return acc
  }, {})

  const categoryNames: Record<string, string> = {
    READING: "📚 Kitap Okuma",
    FORUM: "💬 Forum Aktivitesi",
    EVENT: "🎉 Etkinlik Katılımı",
    PROFILE: "👤 Profil",
    ACHIEVEMENT: "🏆 Başarılar",
    SPECIAL: "🎁 Özel Rozetler",
  }

  // Kullanıcı ara
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const res = await fetch(`/api/admin/search-users?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const users = await res.json()
        setSearchResults(users)
      }
    } catch (error) {
    }
  }

  // Rozet ver
  const grantBadge = async () => {
    if (!selectedUser || !selectedBadge) {
      showToast("Hata", "Lütfen kullanıcı ve rozet seçin", "destructive")
      return
    }

    setIsGranting(true)
    try {
      const badge = badges.find(b => b.id === selectedBadge)
      const res = await fetch("/api/badges/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          badgeName: badge?.name,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        showToast("Başarılı! 🎉", `${selectedUser.name} kullanıcısına "${badge?.name}" rozeti verildi!`)
        setSelectedUser(null)
        setSelectedBadge("")
        setSearchQuery("")
        setSearchResults([])
        // Rozet sayısını güncelle
        setBadges(badges.map(b => 
          b.id === selectedBadge 
            ? { ...b, _count: { userBadges: b._count.userBadges + 1 } }
            : b
        ))
      } else {
        showToast("Hata", data.error || "Rozet verilirken bir hata oluştu", "destructive")
      }
    } catch (error) {
      showToast("Hata", "Rozet verilirken bir hata oluştu", "destructive")
    } finally {
      setIsGranting(false)
    }
  }

  // Rozet geri al
  const revokeBadge = async (userId: string, badgeId: string, badgeName: string, userName: string) => {
    if (!confirm(`${userName} kullanıcısından "${badgeName}" rozetini geri almak istediğinize emin misiniz?`)) {
      return
    }

    try {
      const res = await fetch("/api/badges/revoke", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, badgeId }),
      })

      const data = await res.json()

      if (res.ok) {
        showToast("Rozet geri alındı", `${userName} kullanıcısından "${badgeName}" rozeti geri alındı`)
        // Geçmişi yenile
        loadBadgeHistory()
      } else {
        showToast("Hata", data.error || "Rozet geri alınırken bir hata oluştu", "destructive")
      }
    } catch (error) {
      showToast("Hata", "Rozet geri alınırken bir hata oluştu", "destructive")
    }
  }

  // Rozet geçmişini yükle
  const loadBadgeHistory = async () => {
    try {
      const res = await fetch("/api/badges/history?limit=50")
      if (res.ok) {
        const data = await res.json()
        setBadgeHistory(data.history)
        setHistoryStats(data.stats)
      }
    } catch (error) {
    }
  }

  // Geçmiş sekmesine geçildiğinde yükle
  useEffect(() => {
    if (activeTab === "history") {
      loadBadgeHistory()
    }
  }, [activeTab])

  // Arama sorgusu değiştiğinde ara
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="container py-8 px-4 max-w-7xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rozet Yönetimi</h1>
          <p className="text-muted-foreground">
            Rozetleri görüntüle, kullanıcılara rozet ver veya geri al
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Panele Dön</Link>
          </Button>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "badges" ? "default" : "ghost"}
          onClick={() => setActiveTab("badges")}
          className="rounded-b-none"
        >
          <Award className="h-4 w-4 mr-2" />
          Tüm Rozetler
        </Button>
        <Button
          variant={activeTab === "grant" ? "default" : "ghost"}
          onClick={() => setActiveTab("grant")}
          className="rounded-b-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          Rozet Ver
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
          className="rounded-b-none"
        >
          <History className="h-4 w-4 mr-2" />
          Geçmiş
        </Button>
      </div>

      {/* Tüm Rozetler Sekmesi */}
      {activeTab === "badges" && (
        <>
          {/* İstatistikler */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Rozet</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{badges.length}</div>
                <p className="text-xs text-muted-foreground">Tüm kategorilerde</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Özel Rozetler</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {badges.filter((b) => b.isSpecial).length}
                </div>
                <p className="text-xs text-muted-foreground">Sadece admin verebilir</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Dağıtım</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {badges.reduce((sum, b) => sum + b._count.userBadges, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Kazanılan rozet sayısı</p>
              </CardContent>
            </Card>
          </div>

          {/* Rozetler Kategori Bazında */}
          <div className="space-y-6">
            {Object.entries(badgesByCategory).map(([category, categoryBadges]: [string, any]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {categoryNames[category] || category}
                  </CardTitle>
                  <CardDescription>
                    {(categoryBadges as any[]).length} rozet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(categoryBadges as any[]).map((badge: BadgeData) => (
                      <div
                        key={badge.id}
                        className="group relative p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                        style={{
                          borderColor: badge.color + "40",
                          backgroundColor: badge.color + "05",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                            {badge.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {badge.description}
                          </div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {badge._count.userBadges} kullanıcı
                            </Badge>
                            {badge.isSpecial && (
                              <Badge className="text-[10px] bg-purple-100 text-purple-700">
                                🎁 Özel
                              </Badge>
                            )}
                          </div>
                          {badge.requirement && (
                            <div className="text-[10px] text-gray-500">
                              Gereksinim: {badge.requirement}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Rozet Ver Sekmesi */}
      {activeTab === "grant" && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Kullanıcıya Rozet Ver
              </CardTitle>
              <CardDescription>
                Kullanıcı ara ve istediğin rozeti ver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Kullanıcı Arama */}
              <div className="space-y-2">
                <label className="text-sm font-medium">1. Kullanıcı Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="İsim veya email ile ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Arama Sonuçları */}
                {searchResults.length > 0 && !selectedUser && (
                  <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setSelectedUser(user)
                          setSearchResults([])
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{user._count.userBadges} rozet</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Seçili Kullanıcı */}
                {selectedUser && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedUser.image} />
                          <AvatarFallback>
                            {selectedUser.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedUser.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                          <Badge variant="secondary" className="mt-1">
                            {selectedUser._count.userBadges} rozet
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Rozet Seçimi */}
              {selectedUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">2. Rozet Seç</label>
                  <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rozet seç..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(badgesByCategory).map(([category, categoryBadges]: [string, any]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {categoryNames[category]}
                          </div>
                          {(categoryBadges as BadgeData[]).map((badge) => (
                            <SelectItem key={badge.id} value={badge.id}>
                              <div className="flex items-center gap-2">
                                <span>{badge.icon}</span>
                                <span>{badge.name}</span>
                                {badge.isSpecial && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    Özel
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Seçili Rozet Önizleme */}
                  {selectedBadge && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      {(() => {
                        const badge = badges.find(b => b.id === selectedBadge)
                        return badge ? (
                          <div className="flex items-center gap-4">
                            <div 
                              className="text-5xl p-3 rounded-lg"
                              style={{ backgroundColor: badge.color + "15" }}
                            >
                              {badge.icon}
                            </div>
                            <div>
                              <div className="font-bold">{badge.name}</div>
                              <div className="text-sm text-muted-foreground">{badge.description}</div>
                              <div className="flex gap-2 mt-2">
                                <Badge>{categoryNames[badge.category]}</Badge>
                                {badge.isSpecial && (
                                  <Badge variant="secondary">🎁 Özel Rozet</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Rozet Ver Butonu */}
              <Button
                onClick={grantBadge}
                disabled={!selectedUser || !selectedBadge || isGranting}
                className="w-full"
                size="lg"
              >
                {isGranting ? "Veriliyor..." : "Rozeti Ver 🎁"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Geçmiş Sekmesi */}
      {activeTab === "history" && (
        <>
          {/* İstatistikler */}
          {historyStats && (
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{historyStats.total}</div>
                  <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bugün</CardTitle>
                  <Clock className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{historyStats.today}</div>
                  <p className="text-xs text-muted-foreground">Son 24 saat</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{historyStats.thisWeek}</div>
                  <p className="text-xs text-muted-foreground">Son 7 gün</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{historyStats.thisMonth}</div>
                  <p className="text-xs text-muted-foreground">Bu ay</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Geçmiş Listesi */}
          <Card>
            <CardHeader>
              <CardTitle>Son Verilen Rozetler</CardTitle>
              <CardDescription>Son 50 rozet verilme kaydı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {badgeHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="text-3xl p-2 rounded-lg"
                        style={{ backgroundColor: item.badge.color + "15" }}
                      >
                        {item.badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.badge.name}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={item.user.image} />
                            <AvatarFallback>
                              {item.user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.user.name}</span>
                          <span>•</span>
                          <span>{new Date(item.earnedAt).toLocaleDateString("tr-TR")}</span>
                          <span>{new Date(item.earnedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{categoryNames[item.badge.category]}</Badge>
                        {item.badge.isSpecial && (
                          <Badge variant="secondary">Özel</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeBadge(item.user.id, item.badge.id, item.badge.name, item.user.name)}
                      className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {badgeHistory.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    Henüz rozet verilmemiş
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
