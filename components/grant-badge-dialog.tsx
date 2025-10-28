'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, Gift } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'

interface BadgeItem {
  id: string
  name: string
  icon: string
  description: string
  category: string
  color: string
}

interface GrantBadgeDialogProps {
  userId: string
  userName: string
  onSuccess?: () => void
}

export default function GrantBadgeDialog({
  userId,
  userName,
  onSuccess,
}: GrantBadgeDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [badges, setBadges] = useState<BadgeItem[]>([])
  const [loadingBadges, setLoadingBadges] = useState(true)
  const { toast } = useToast()

  // Tüm rozetleri yükle
  useEffect(() => {
    if (open) {
      fetchBadges()
    }
  }, [open])

  const fetchBadges = async () => {
    try {
      const res = await fetch('/api/badges')
      if (res.ok) {
        const data = await res.json()
        setBadges(data)
      }
    } catch (error) {
      console.error('Rozet yükleme hatası:', error)
    } finally {
      setLoadingBadges(false)
    }
  }

  const handleGrantBadge = async () => {
    if (!selectedBadge) {
      toast({
        title: '⚠️ Rozet seçilmedi',
        description: 'Lütfen bir rozet seçin',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/badges/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId,
          badgeName: selectedBadge,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: '✅ Rozet verildi!',
          description: `${selectedBadge} rozeti başarıyla verildi!`,
        })
        setOpen(false)
        setSelectedBadge(null)
        onSuccess?.()
      } else {
        toast({
          title: '❌ Hata',
          description: data.error || 'Rozet verilemedi',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Rozet verme hatası:', error)
      toast({
        title: '❌ Hata',
        description: 'Rozet verilirken bir hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/20"
        >
          <Gift className="h-4 w-4" />
          Rozet Ver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Rozet Ver
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-purple-600">{userName}</span> kullanıcısına
            rozet ver
          </DialogDescription>
        </DialogHeader>

        {loadingBadges ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Rozetler yükleniyor...</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] py-4">
            <div className="space-y-6 px-1">
              {/* Rozetleri kategoriye göre grupla */}
              {['READING', 'FORUM', 'EVENT', 'PROFILE', 'ACHIEVEMENT', 'SPECIAL'].map((category) => {
                const categoryBadges = badges.filter((b) => b.category === category)
                if (categoryBadges.length === 0) return null

                const categoryNames: Record<string, string> = {
                  READING: '📚 Kitap Okuma',
                  FORUM: '💬 Forum',
                  EVENT: '🎉 Etkinlik',
                  PROFILE: '👤 Profil',
                  ACHIEVEMENT: '🏅 Başarılar',
                  SPECIAL: '🎁 Özel Rozetler',
                }

                return (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                      {categoryNames[category]}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryBadges.map((badge) => (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedBadge(badge.name)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            selectedBadge === badge.name
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          }`}
                          style={{
                            borderColor:
                              selectedBadge === badge.name ? badge.color : undefined,
                          }}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{badge.icon}</div>
                            <div className="text-xs font-bold mb-1 line-clamp-2">
                              {badge.name}
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2">
                              {badge.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}

        {selectedBadge && !loadingBadges && (
          <Badge className="w-full justify-center bg-purple-100 text-purple-700 dark:bg-purple-900/30 mt-2">
            Seçilen Rozet: {selectedBadge}
          </Badge>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
              setSelectedBadge(null)
            }}
            disabled={loading}
          >
            İptal
          </Button>
          <Button
            onClick={handleGrantBadge}
            disabled={!selectedBadge || loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? '⏳ Veriliyor...' : '🎁 Rozet Ver'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
