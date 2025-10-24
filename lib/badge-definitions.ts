// Rozet tanımları ve yardımcı fonksiyonlar
import { BadgeCategory } from '@prisma/client'

export interface BadgeDefinition {
  name: string
  description: string
  icon: string
  color: string
  category: BadgeCategory
  requirement?: number
  isSpecial?: boolean
  order: number
}

// Tüm rozetlerin tanımları
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // 📚 READING - Kitap Okuma Rozetleri
  {
    name: 'İlk Adım',
    description: 'İlk kitabını okuduğun için tebrikler!',
    icon: '📖',
    color: '#10B981',
    category: 'READING',
    requirement: 1,
    order: 1,
  },
  {
    name: 'Kitap Kurdu',
    description: '5 kitap okudun!',
    icon: '🐛',
    color: '#059669',
    category: 'READING',
    requirement: 5,
    order: 2,
  },
  {
    name: 'Kütüphane Ustası',
    description: '10 kitap okudun!',
    icon: '📚',
    color: '#047857',
    category: 'READING',
    requirement: 10,
    order: 3,
  },
  {
    name: 'Bilge Okuyucu',
    description: '25 kitap okudun!',
    icon: '🦉',
    color: '#065F46',
    category: 'READING',
    requirement: 25,
    order: 4,
  },
  {
    name: 'Kitap Koleksiyoncusu',
    description: '50 kitap okudun!',
    icon: '🏆',
    color: '#064E3B',
    category: 'READING',
    requirement: 50,
    order: 5,
  },

  // 💬 FORUM - Forum Aktivite Rozetleri
  {
    name: 'İlk Söz',
    description: 'İlk forum konunu oluşturdun!',
    icon: '💬',
    color: '#3B82F6',
    category: 'FORUM',
    requirement: 1,
    order: 6,
  },
  {
    name: 'Tartışmacı',
    description: '10 forum konusu oluşturdun!',
    icon: '💭',
    color: '#2563EB',
    category: 'FORUM',
    requirement: 10,
    order: 7,
  },
  {
    name: 'Yorum Uzmanı',
    description: '50 forum yanıtı yaptın!',
    icon: '✍️',
    color: '#1D4ED8',
    category: 'FORUM',
    requirement: 50,
    order: 8,
  },
  {
    name: 'Forum Yıldızı',
    description: '100 forum yanıtı yaptın!',
    icon: '⭐',
    color: '#1E40AF',
    category: 'FORUM',
    requirement: 100,
    order: 9,
  },
  {
    name: 'Popüler Yazar',
    description: 'Konularında toplamda 100+ beğeni aldın!',
    icon: '❤️',
    color: '#EF4444',
    category: 'FORUM',
    requirement: 100,
    order: 10,
  },

  // 🎉 EVENT - Etkinlik Katılım Rozetleri
  {
    name: 'Etkinlik Meraklısı',
    description: 'İlk etkinliğe katıldın!',
    icon: '🎉',
    color: '#F59E0B',
    category: 'EVENT',
    requirement: 1,
    order: 11,
  },
  {
    name: 'Sosyal Kelebek',
    description: '5 etkinliğe katıldın!',
    icon: '🦋',
    color: '#D97706',
    category: 'EVENT',
    requirement: 5,
    order: 12,
  },
  {
    name: 'Etkinlik Aşığı',
    description: '10 etkinliğe katıldın!',
    icon: '🎊',
    color: '#B45309',
    category: 'EVENT',
    requirement: 10,
    order: 13,
  },
  {
    name: 'Topluluk Lideri',
    description: '25 etkinliğe katıldın!',
    icon: '👑',
    color: '#92400E',
    category: 'EVENT',
    requirement: 25,
    order: 14,
  },

  // 👤 PROFILE - Profil Tamamlama Rozetleri
  {
    name: 'Hoş Geldin!',
    description: 'Hesabını oluşturduğun için teşekkürler!',
    icon: '👋',
    color: '#8B5CF6',
    category: 'PROFILE',
    requirement: 1,
    order: 15,
  },
  {
    name: 'Profil Tamamlandı',
    description: 'Profilini tamamladın (bio, resim)!',
    icon: '✅',
    color: '#7C3AED',
    category: 'PROFILE',
    order: 16,
  },
  {
    name: 'Sadık Üye',
    description: '30 gün üyeliğin var!',
    icon: '🌟',
    color: '#6D28D9',
    category: 'PROFILE',
    requirement: 30,
    order: 17,
  },
  {
    name: 'Veterán',
    description: '1 yıl üyeliğin var!',
    icon: '🎖️',
    color: '#5B21B6',
    category: 'PROFILE',
    requirement: 365,
    order: 18,
  },

  // 🏅 ACHIEVEMENT - Başarı Rozetleri
  {
    name: 'Hızlı Okuyucu',
    description: 'Bir ayda 5+ kitap okudun!',
    icon: '⚡',
    color: '#EC4899',
    category: 'ACHIEVEMENT',
    requirement: 5,
    order: 19,
  },
  {
    name: 'Gece Kuşu',
    description: 'Gece 00:00 - 06:00 arası 10+ aktivite yaptın!',
    icon: '🌙',
    color: '#DB2777',
    category: 'ACHIEVEMENT',
    requirement: 10,
    order: 20,
  },
  {
    name: 'Sabah Kuşu',
    description: 'Sabah 05:00 - 09:00 arası 10+ aktivite yaptın!',
    icon: '🌅',
    color: '#BE185D',
    category: 'ACHIEVEMENT',
    requirement: 10,
    order: 21,
  },
  {
    name: 'Çeşitlilik Ustası',
    description: '5 farklı kategoriden kitap okudun!',
    icon: '🎨',
    color: '#9D174D',
    category: 'ACHIEVEMENT',
    requirement: 5,
    order: 22,
  },

  // 🎁 SPECIAL - Özel Rozetler (Sadece admin verebilir)
  {
    name: 'Kurucu Üye',
    description: 'Topluluğun kurucu üyelerinden birisin!',
    icon: '💎',
    color: '#6366F1',
    category: 'SPECIAL',
    isSpecial: true,
    order: 23,
  },
  {
    name: 'Moderatör',
    description: 'Topluluğu yönetme yetkisine sahipsin!',
    icon: '🛡️',
    color: '#4F46E5',
    category: 'SPECIAL',
    isSpecial: true,
    order: 24,
  },
  {
    name: 'VIP Üye',
    description: 'Özel bir üyesin!',
    icon: '👑',
    color: '#4338CA',
    category: 'SPECIAL',
    isSpecial: true,
    order: 25,
  },
  {
    name: 'Aylık Şampiyon',
    description: 'Ayın en aktif kullanıcısısın!',
    icon: '🏆',
    color: '#3730A3',
    category: 'SPECIAL',
    isSpecial: true,
    order: 26,
  },
]

// Kategori renklerini döndür
export function getCategoryColor(category: BadgeCategory): string {
  const colors: Record<BadgeCategory, string> = {
    READING: '#10B981',
    FORUM: '#3B82F6',
    EVENT: '#F59E0B',
    PROFILE: '#8B5CF6',
    SPECIAL: '#6366F1',
    ACHIEVEMENT: '#EC4899',
  }
  return colors[category]
}

// Kategori isimlerini döndür
export function getCategoryName(category: BadgeCategory): string {
  const names: Record<BadgeCategory, string> = {
    READING: 'Kitap Okuma',
    FORUM: 'Forum Aktivitesi',
    EVENT: 'Etkinlik Katılımı',
    PROFILE: 'Profil',
    SPECIAL: 'Özel Rozetler',
    ACHIEVEMENT: 'Başarılar',
  }
  return names[category]
}
