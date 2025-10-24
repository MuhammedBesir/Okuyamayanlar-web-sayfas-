// Rozetleri veritabanına ekle
import { PrismaClient } from '@prisma/client'
import { BADGE_DEFINITIONS } from '../lib/badge-definitions'

const prisma = new PrismaClient()

async function seedBadges() {
  console.log('🎖️  Rozetler ekleniyor...')

  for (const badgeDef of BADGE_DEFINITIONS) {
    const badge = await prisma.badge.upsert({
      where: { name: badgeDef.name },
      update: {
        description: badgeDef.description,
        icon: badgeDef.icon,
        color: badgeDef.color,
        category: badgeDef.category,
        requirement: badgeDef.requirement,
        isActive: true,
        isSpecial: badgeDef.isSpecial || false,
        order: badgeDef.order,
      },
      create: {
        name: badgeDef.name,
        description: badgeDef.description,
        icon: badgeDef.icon,
        color: badgeDef.color,
        category: badgeDef.category,
        requirement: badgeDef.requirement,
        isActive: true,
        isSpecial: badgeDef.isSpecial || false,
        order: badgeDef.order,
      },
    })

    console.log(`✅ ${badge.icon} ${badge.name}`)
  }

  console.log(`\n🎉 Toplam ${BADGE_DEFINITIONS.length} rozet eklendi!`)
}

seedBadges()
  .catch((error) => {
    console.error('❌ Hata:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
