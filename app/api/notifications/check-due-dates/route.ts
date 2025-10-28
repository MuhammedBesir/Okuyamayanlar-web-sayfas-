import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/notifications/check-due-dates - Son teslim tarihlerini kontrol et ve bildirim gönder
// Bu endpoint bir cron job veya otomatik görev tarafından çağrılabilir
export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const threeDaysLater = new Date()
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)

    // Ödünç alınmış ve son teslim tarihi 3 gün içinde olan kitapları bul
    const booksWithUpcomingDueDate = await prisma.book.findMany({
      where: {
        available: false,
        borrowedBy: { not: null },
        dueDate: {
          gte: now,
          lte: threeDaysLater,
        },
      },
    })

    // Bugün teslim edilmesi gereken kitapları bul
    const booksDueToday = await prisma.book.findMany({
      where: {
        available: false,
        borrowedBy: { not: null },
        dueDate: {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999)),
        },
      },
    })

    // Gecikmiş kitapları bul
    const overdueBooks = await prisma.book.findMany({
      where: {
        available: false,
        borrowedBy: { not: null },
        dueDate: {
          lt: new Date(),
        },
      },
    })

    // 3 gün içinde teslim edilecekler için bildirim
    for (const book of booksWithUpcomingDueDate) {
      if (book.borrowedBy && book.dueDate) {
        const daysLeft = Math.ceil((book.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        
        // Aynı bildirimin tekrar gönderilmemesi için son 24 saatte bu bildirim gönderildi mi kontrol et
        const recentNotification = await prisma.notification.findFirst({
          where: {
            userId: book.borrowedBy,
            message: { contains: book.title },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })

        if (!recentNotification) {
          await prisma.notification.create({
            data: {
              userId: book.borrowedBy,
              title: "Son Teslim Tarihi Yaklaşıyor",
              message: `"${book.title}" kitabını ${daysLeft} gün içinde teslim etmelisiniz.`,
              link: `/library?search=${encodeURIComponent(book.title)}`
            }
          })
        }
      }
    }

    // Bugün teslim edilecekler için bildirim
    for (const book of booksDueToday) {
      if (book.borrowedBy) {
        const recentNotification = await prisma.notification.findFirst({
          where: {
            userId: book.borrowedBy,
            message: { contains: book.title },
            title: "Son Teslim Tarihi Bugün!",
            createdAt: {
              gte: new Date(Date.now() - 12 * 60 * 60 * 1000)
            }
          }
        })

        if (!recentNotification) {
          await prisma.notification.create({
            data: {
              userId: book.borrowedBy,
              title: "Son Teslim Tarihi Bugün!",
              message: `"${book.title}" kitabını bugün teslim etmelisiniz.`,
              link: `/library?search=${encodeURIComponent(book.title)}`
            }
          })
        }
      }
    }

    // Gecikmiş kitaplar için bildirim
    for (const book of overdueBooks) {
      if (book.borrowedBy && book.dueDate) {
        const daysOverdue = Math.ceil((Date.now() - book.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        
        const recentNotification = await prisma.notification.findFirst({
          where: {
            userId: book.borrowedBy,
            message: { contains: book.title },
            title: "Kitap Teslim Tarihi Geçti!",
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })

        if (!recentNotification) {
          await prisma.notification.create({
            data: {
              userId: book.borrowedBy,
              title: "Kitap Teslim Tarihi Geçti!",
              message: `"${book.title}" kitabının teslim tarihi ${daysOverdue} gün önce geçti. Lütfen en kısa sürede teslim edin.`,
              link: `/library?search=${encodeURIComponent(book.title)}`
            }
          })
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      upcomingDueDates: booksWithUpcomingDueDate.length,
      dueToday: booksDueToday.length,
      overdue: overdueBooks.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check due dates" },
      { status: 500 }
    )
  }
}
