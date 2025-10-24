import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const badges = [
  {
    id: 'first-book',
    name: '📚 İlk Kitap',
    description: 'İlk kitabını okuyanlar için',
    icon: '📚',
    color: '#3b82f6'
  },
  {
    id: 'bookworm',
    name: '🐛 Kitap Kurdu',
    description: '10 kitap okuyanlar için',
    icon: '🐛',
    color: '#10b981'
  },
  {
    id: 'social-butterfly',
    name: '🦋 Sosyal Kelebek',
    description: 'İlk etkinliğe katılanlar için',
    icon: '🦋',
    color: '#f59e0b'
  },
  {
    id: 'forum-master',
    name: '💬 Forum Ustası',
    description: '50 forum mesajı atanlar için',
    icon: '💬',
    color: '#8b5cf6'
  },
  {
    id: 'early-bird',
    name: '🐦 Erken Kuş',
    description: 'İlk üyeler için',
    icon: '🐦',
    color: '#ec4899'
  },
  {
    id: 'speed-reader',
    name: '⚡ Hızlı Okuyucu',
    description: 'Bir ayda 5 kitap okuyanlar için',
    icon: '⚡',
    color: '#f97316'
  },
  {
    id: 'reviewer',
    name: '⭐ Eleştirmen',
    description: '10 kitap yorumu yazanlar için',
    icon: '⭐',
    color: '#14b8a6'
  },
  {
    id: 'helpful',
    name: '🤝 Yardımsever',
    description: 'Diğer üyelere kitap önerenlere',
    icon: '🤝',
    color: '#06b6d4'
  }
]

async function seedBadges() {
  console.log('🏆 Badge\'ler ekleniyor...\n')

  try {
    for (const badge of badges) {
      await prisma.badge.upsert({
        where: { id: badge.id },
        update: badge,
        create: badge
      })
      console.log(`✅ ${badge.name} eklendi`)
    }

    console.log(`\n🎉 Toplam ${badges.length} badge başarıyla eklendi!\n`)

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedBadges()
