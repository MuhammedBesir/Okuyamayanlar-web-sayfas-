// Database Import Script - Vercel Postgres'e Veri Aktarımı
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function importData() {
    console.log('📥 Database import başlıyor...\n')

    try {
        // JSON dosyasını oku
        const data = JSON.parse(fs.readFileSync('database_export.json', 'utf8'))

        // Önce rozetleri ekle (foreign key constraint için)
        console.log('🏆 Rozetler ekleniyor...')
        for (const badge of data.badges) {
            await prisma.badge.upsert({
                where: { id: badge.id },
                update: badge,
                create: badge
            })
        }
        console.log(`✅ ${data.badges.length} rozet eklendi\n`)

        // Kullanıcıları ekle (şifreleri koru)
        console.log('👥 Kullanıcılar ekleniyor...')
        for (const user of data.users) {
            const { accounts, sessions, badges: userBadges, borrowLogs, ...userData } = user

            await prisma.user.upsert({
                where: { email: userData.email },
                update: {
                    ...userData,
                    createdAt: new Date(userData.createdAt),
                    emailVerified: userData.emailVerified ? new Date(userData.emailVerified) : null,
                    bannedUntil: userData.bannedUntil ? new Date(userData.bannedUntil) : null
                },
                create: {
                    ...userData,
                    createdAt: new Date(userData.createdAt),
                    emailVerified: userData.emailVerified ? new Date(userData.emailVerified) : null,
                    bannedUntil: userData.bannedUntil ? new Date(userData.bannedUntil) : null
                }
            })

            // Accounts ekle (Google OAuth için)
            for (const account of accounts) {
                await prisma.account.upsert({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId
                        }
                    },
                    update: account,
                    create: account
                })
            }

            // User badges ekle
            for (const ub of userBadges) {
                await prisma.userBadge.upsert({
                    where: {
                        userId_badgeId: {
                            userId: ub.userId,
                            badgeId: ub.badgeId
                        }
                    },
                    update: {
                        awardedAt: new Date(ub.awardedAt)
                    },
                    create: {
                        userId: ub.userId,
                        badgeId: ub.badgeId,
                        awardedAt: new Date(ub.awardedAt)
                    }
                })
            }
        }
        console.log(`✅ ${data.users.length} kullanıcı eklendi\n`)

        // Kitapları ekle
        console.log('📚 Kitaplar ekleniyor...')
        for (const book of data.books) {
            const { borrowLogs, ...bookData } = book
            await prisma.book.upsert({
                where: { id: bookData.id },
                update: {
                    ...bookData,
                    addedDate: new Date(bookData.addedDate)
                },
                create: {
                    ...bookData,
                    addedDate: new Date(bookData.addedDate)
                }
            })
        }
        console.log(`✅ ${data.books.length} kitap eklendi\n`)

        // Etkinlikleri ekle
        console.log('🎉 Etkinlikler ekleniyor...')
        for (const event of data.events) {
            const { comments, ...eventData } = event
            await prisma.event.upsert({
                where: { id: eventData.id },
                update: {
                    ...eventData,
                    date: new Date(eventData.date),
                    createdAt: new Date(eventData.createdAt)
                },
                create: {
                    ...eventData,
                    date: new Date(eventData.date),
                    createdAt: new Date(eventData.createdAt)
                }
            })

            // Etkinlik yorumlarını ekle
            for (const comment of comments) {
                await prisma.eventComment.upsert({
                    where: { id: comment.id },
                    update: {
                        ...comment,
                        createdAt: new Date(comment.createdAt)
                    },
                    create: {
                        ...comment,
                        createdAt: new Date(comment.createdAt)
                    }
                })
            }
        }
        console.log(`✅ ${data.events.length} etkinlik eklendi\n`)

        // Forum gönderilerini ekle
        console.log('💬 Forum gönderileri ekleniyor...')
        for (const post of data.forumPosts) {
            const { author, replies, ...postData } = post
            await prisma.forumPost.upsert({
                where: { id: postData.id },
                update: {
                    ...postData,
                    createdAt: new Date(postData.createdAt),
                    updatedAt: new Date(postData.updatedAt)
                },
                create: {
                    ...postData,
                    createdAt: new Date(postData.createdAt),
                    updatedAt: new Date(postData.updatedAt)
                }
            })

            // Yanıtları ekle
            for (const reply of replies) {
                await prisma.forumReply.upsert({
                    where: { id: reply.id },
                    update: {
                        ...reply,
                        createdAt: new Date(reply.createdAt),
                        updatedAt: new Date(reply.updatedAt)
                    },
                    create: {
                        ...reply,
                        createdAt: new Date(reply.createdAt),
                        updatedAt: new Date(reply.updatedAt)
                    }
                })
            }
        }
        console.log(`✅ ${data.forumPosts.length} forum gönderisi eklendi\n`)

        // Öne çıkan kitabı ekle
        if (data.featuredBook) {
            console.log('⭐ Öne çıkan kitap ekleniyor...')
            await prisma.featuredBook.upsert({
                where: { id: data.featuredBook.id },
                update: {
                    ...data.featuredBook,
                    startDate: new Date(data.featuredBook.startDate),
                    endDate: data.featuredBook.endDate ? new Date(data.featuredBook.endDate) : null
                },
                create: {
                    ...data.featuredBook,
                    startDate: new Date(data.featuredBook.startDate),
                    endDate: data.featuredBook.endDate ? new Date(data.featuredBook.endDate) : null
                }
            })
            console.log('✅ Öne çıkan kitap eklendi\n')
        }

        // Okuma listelerini ekle
        console.log('📖 Okuma listeleri ekleniyor...')
        for (const readingList of data.readingLists) {
            await prisma.readingList.upsert({
                where: {
                    userId_bookId: {
                        userId: readingList.userId,
                        bookId: readingList.bookId
                    }
                },
                update: readingList,
                create: readingList
            })
        }
        console.log(`✅ ${data.readingLists.length} okuma listesi eklendi\n`)

        console.log('🎉 Import tamamlandı!\n')

    } catch (error) {
        console.error('❌ Import hatası:', error)
    } finally {
        await prisma.$disconnect()
    }
}

importData()
