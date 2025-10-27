'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Lock, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BadgeItem {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  locked?: boolean
  earnedAt?: Date
}

interface BadgesData {
  earnedBadges: BadgeItem[]
  lockedBadges: BadgeItem[]
  totalEarned: number
  totalAvailable: number
}

export default function UserBadges() {
  const [badges, setBadges] = useState<BadgesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  // Rozetleri yükle
  useEffect(() => {
    fetchBadges()
  }, [])

  async function fetchBadges() {
    try {
      const res = await fetch('/api/badges/user')
      if (res.ok) {
        const data = await res.json()
        setBadges(data)
      }
    } catch (error) {
      console.error('Rozet yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  // Rozet kontrolü yap
  async function checkBadges() {
    setChecking(true)
    try {
      const res = await fetch('/api/badges/user?action=check')
      if (res.ok) {
        const result = await res.json()
        if (result.newBadges && result.newBadges.length > 0) {
          alert(`🎉 Tebrikler! ${result.newBadges.length} yeni rozet kazandınız:\n\n${result.newBadges.join('\n')}`)
        } else {
          alert('Şu anda yeni rozet yok. Aktivitelerinize devam edin! 💪')
        }
        // Rozetleri yeniden yükle
        await fetchBadges()
      }
    } catch (error) {
      console.error('Rozet kontrol hatası:', error)
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Rozetlerim
          </CardTitle>
          <CardDescription>Yükleniyor...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!badges) {
    return null
  }

  return (
    <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg">Rozetlerim</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {badges.totalEarned} / {badges.totalAvailable} rozet kazandın
              </CardDescription>
            </div>
          </div>
          <button
            onClick={checkBadges}
            disabled={checking}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 w-full sm:w-auto whitespace-nowrap"
          >
            {checking ? '⏳ Kontrol ediliyor...' : '🔍 Yeni Rozet Kontrol Et'}
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Kazanılan Rozetler */}
        {badges.earnedBadges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-purple-700 dark:text-purple-400 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Kazanılan Rozetler ({badges.earnedBadges.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="group relative p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ borderColor: badge.color + '40' }}
                  title={badge.description}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-bounce">{badge.icon}</div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                      {badge.name}
                    </div>
                    <Badge
                      className="text-[10px] px-1.5 py-0.5"
                      style={{
                        backgroundColor: badge.color + '20',
                        color: badge.color,
                        borderColor: badge.color,
                      }}
                    >
                      {badge.category === 'READING'
                        ? '📚 Okuma'
                        : badge.category === 'FORUM'
                        ? '💬 Forum'
                        : badge.category === 'EVENT'
                        ? '🎉 Etkinlik'
                        : badge.category === 'PROFILE'
                        ? '👤 Profil'
                        : badge.category === 'ACHIEVEMENT'
                        ? '🏆 Başarı'
                        : '🎁 Özel'}
                    </Badge>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-center z-10">
                    {badge.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kilitli Rozetler */}
        {badges.lockedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Henüz Kazanılmayan Rozetler ({badges.lockedBadges.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.lockedBadges.slice(0, 8).map((badge) => (
                <div
                  key={badge.id}
                  className="group relative p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 opacity-60 hover:opacity-80 transition-all duration-300 cursor-pointer"
                  title={badge.description}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 grayscale">
                      {badge.icon}
                      <Lock className="h-3 w-3 inline-block ml-1 text-gray-500" />
                    </div>
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                      {badge.name}
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                      🔒 Kilitli
                    </Badge>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-center z-10">
                    {badge.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              ))}
              {badges.lockedBadges.length > 8 && (
                <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-xs text-gray-500">
                    +{badges.lockedBadges.length - 8} daha
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {badges.earnedBadges.length === 0 && badges.lockedBadges.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">Henüz rozet yok</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
