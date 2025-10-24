import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const prisma = new PrismaClient()

async function exportData() {
    console.log('📦 Database export başlıyor...\n')

    try {
        const users = await prisma.user.findMany()
        const accounts = await prisma.account.findMany()
        const books = await prisma.book.findMany()
        const events = await prisma.event.findMany()
        const eventComments = await prisma.eventComment.findMany()
        const forumPosts = await prisma.forumPost.findMany()
        const forumReplies = await prisma.forumReply.findMany()
        const badges = await prisma.badge.findMany()
        const userBadges = await prisma.userBadge.findMany()
        const featuredBook = await prisma.featuredBook.findFirst()
        const readingLists = await prisma.readingList.findMany()

        const data = {
            users: JSON.parse(JSON.stringify(users)),
            accounts: JSON.parse(JSON.stringify(accounts)),
            books: JSON.parse(JSON.stringify(books)),
            events: JSON.parse(JSON.stringify(events)),
            eventComments: JSON.parse(JSON.stringify(eventComments)),
            forumPosts: JSON.parse(JSON.stringify(forumPosts)),
            forumReplies: JSON.parse(JSON.stringify(forumReplies)),
            badges: JSON.parse(JSON.stringify(badges)),
            userBadges: JSON.parse(JSON.stringify(userBadges)),
            featuredBook: JSON.parse(JSON.stringify(featuredBook)),
            readingLists: JSON.parse(JSON.stringify(readingLists))
        }

        writeFileSync('database_export.json', JSON.stringify(data, null, 2))

        console.log('✅ Export başarılı!')
        console.log('\n📊 Export Özeti:')
        console.log(`   👥 Kullanıcılar: ${users.length}`)
        console.log(`   🔑 Accounts: ${accounts.length}`)
        console.log(`   📚 Kitaplar: ${books.length}`)
        console.log(`   🎉 Etkinlikler: ${events.length}`)
        console.log(`   💬 Etkinlik Yorumları: ${eventComments.length}`)
        console.log(`   💬 Forum Gönderileri: ${forumPosts.length}`)
        console.log(`   💬 Forum Yanıtları: ${forumReplies.length}`)
        console.log(`   🏆 Rozetler: ${badges.length}`)
        console.log(`   🏆 Kullanıcı Rozetleri: ${userBadges.length}`)
        console.log(`   ⭐ Öne Çıkan Kitap: ${featuredBook ? 'Var' : 'Yok'}`)
        console.log(`   📖 Okuma Listeleri: ${readingLists.length}`)
        console.log('\n📁 Dosya: database_export.json\n')

    } catch (error) {
        console.error('❌ Export hatası:', error)
    } finally {
        await prisma.$disconnect()
    }
}

exportData()
