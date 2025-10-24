import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Kullanıcıları ve account bağlantılarını kontrol ediyoruz...\n')
  
  // Tüm kullanıcıları al
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
    },
  })
  
  console.log(`📊 Toplam ${users.length} kullanıcı bulundu\n`)
  
  for (const user of users) {
    console.log(`👤 ${user.name} (${user.email})`)
    console.log(`   - ID: ${user.id}`)
    console.log(`   - Password: ${user.password ? '✅ Var' : '❌ Yok (OAuth only)'}`)
    console.log(`   - Accounts: ${user.accounts.length}`)
    
    if (user.accounts.length > 0) {
      user.accounts.forEach((account) => {
        console.log(`     → ${account.provider} (${account.providerAccountId})`)
      })
    }
    console.log('')
  }
  
  // Orphan users (account'u olmayan ve password'u olmayan)
  const orphanUsers = users.filter(u => u.accounts.length === 0 && !u.password)
  
  if (orphanUsers.length > 0) {
    console.log(`⚠️  ${orphanUsers.length} orphan kullanıcı bulundu (account yok, password yok):`)
    orphanUsers.forEach(u => {
      console.log(`   - ${u.email}`)
    })
  }
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
