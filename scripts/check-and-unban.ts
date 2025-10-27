import { prisma } from '../lib/prisma'

async function checkAndUnbanUser() {
  const targetEmail = 'besirmuhammet021@gmail.com'
  
  try {
    console.log(`\n🔍 Kullanıcı aranıyor: ${targetEmail}`)
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        bannedAt: true,
        bannedReason: true,
      }
    })

    if (!user) {
      console.log('❌ Kullanıcı bulunamadı!')
      console.log('\nBenzer kullanıcılar:')
      const similar = await prisma.user.findMany({
        where: {
          email: { contains: 'besir', mode: 'insensitive' }
        },
        select: { email: true, banned: true }
      })
      similar.forEach(u => console.log(`  ${u.banned ? '🔴' : '🟢'} ${u.email}`))
      return
    }

    console.log('\n📊 Kullanıcı Bulundu:')
    console.log('ID:', user.id)
    console.log('İsim:', user.name)
    console.log('Email:', user.email)
    console.log('Role:', user.role)
    console.log('Banned:', user.banned ? '🔴 EVET' : '🟢 HAYIR')
    
    if (user.banned) {
      console.log('Banned At:', user.bannedAt)
      console.log('Ban Nedeni:', user.bannedReason)
      
      console.log('\n🔄 Ban kaldırılıyor...')
      
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          banned: false,
          bannedAt: null,
          bannedReason: null,
        }
      })

      console.log('✅ Ban başarıyla kaldırıldı!')
      console.log('Email:', updated.email)
      console.log('Banned:', updated.banned)
    } else {
      console.log('\n✅ Kullanıcı zaten banlı değil')
    }
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndUnbanUser()
