// Database Export Script - Local'den Vercel'e Veri Aktarımı
import pkg from '@prisma/client'
const { PrismaClient } = pkg
import fs from 'fs'

const prisma = new PrismaClient()

async function exportData() {
    console.log('📦 Database export başlıyor...\n')

    try {
        // Tüm verileri basit şekilde çek (ilişkiler olmadan)
        const users = await prisma.user.findMany()
        const accounts = await prisma.account.findMany()
        const sessions = await prisma.session.findMany()
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
            users: users.map(u => ({
                ...u,
                createdAt: u.createdAt.toISOString(),
                emailVerified: u.emailVerified?.toISOString() || null,
                bannedUntil: u.bannedUntil?.toISOString() || null
            })),
            accounts,
            sessions: sessions.map(s => ({
                ...s,
                expires: s.expires.toISOString()
            })),
            books: books.map(b => ({
                ...b,
                addedDate: b.addedDate.toISOString()
            })),
            events: events.map(e => ({
                ...e,
                date: e.date.toISOString(),
                createdAt: e.createdAt.toISOString()
            })),
            eventComments: eventComments.map(c => ({
                ...c,
                createdAt: c.createdAt.toISOString()
            })),
            forumPosts: forumPosts.map(p => ({
                ...p,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()
            })),
            forumReplies: forumReplies.map(r => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString()
            })),
            badges,
            userBadges: userBadges.map(ub => ({
                ...ub,
                awardedAt: ub.awardedAt.toISOString()
            })),
            featuredBook: featuredBook ? {
                ...featuredBook,
                startDate: featuredBook.startDate.toISOString(),
                endDate: featuredBook.endDate?.toISOString() || null
            } : null,
            readingLists
        }

        // JSON dosyasına yaz
        fs.writeFileSync('database_export.json', JSON.stringify(data, null, 2))

        console.log('✅ Export başarılı!')
        console.log('\n📊 Export Özeti:')
        console.log(`   👥 Kullanıcılar: ${users.length}`)
        console.log(`   📚 Kitaplar: ${books.length}`)
        console.log(`   🎉 Etkinlikler: ${events.length}`)
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
