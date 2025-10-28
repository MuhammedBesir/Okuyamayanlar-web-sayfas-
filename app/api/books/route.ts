import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const search = searchParams.get("search") || ""
    const genre = searchParams.get("genre") || ""
    const isAdmin = session?.user?.role === "ADMIN"

    // Eğer ID varsa, tek kitap getir
    if (id) {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          _count: {
            select: { reviews: true, readingLists: true },
          },
          ...(isAdmin && {
            borrower: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }),
        },
      })
      return NextResponse.json({ books: book ? [book] : [] })
    }

    // Yoksa tüm kitapları filtrele ve getir
    const books = await prisma.book.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { author: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          genre ? { genre: { contains: genre, mode: "insensitive" } } : {},
        ],
      },
      include: {
        _count: {
          select: { reviews: true, readingLists: true },
        },
        reviews: {
          select: {
            rating: true
          }
        },
        ...(isAdmin && {
          borrower: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    // Calculate average rating for each book
    const booksWithRating = books.map(book => {
      const averageRating = book.reviews.length > 0
        ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
        : 0
      
      const { reviews, ...bookWithoutReviews } = book
      return {
        ...bookWithoutReviews,
        averageRating: averageRating > 0 ? Number(averageRating.toFixed(1)) : undefined
      }
    })

    return NextResponse.json({ books: booksWithRating })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, author, description, coverImage, isbn, publishedYear, genre, pageCount, available, featured } = body

    if (!title || !author) {
      return NextResponse.json({ error: "Title and author are required" }, { status: 400 })
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description: description || null,
        coverImage: coverImage || null,
        isbn: isbn || null,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        genre: genre || null,
        pageCount: pageCount ? parseInt(pageCount) : null,
        available: available !== undefined ? available : true,
        featured: featured !== undefined ? featured : false,
      },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create book"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, author, description, coverImage, isbn, publishedYear, genre, pageCount, available, borrowedBy, borrowedAt, dueDate, featured } = body

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    // Önce mevcut kitap durumunu al
    const currentBook = await prisma.book.findUnique({
      where: { id },
      select: { available: true, title: true, author: true, borrowedBy: true, borrowedAt: true, dueDate: true }
    })

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isbn !== undefined && { isbn }),
        ...(publishedYear !== undefined && { publishedYear: publishedYear ? parseInt(publishedYear) : null }),
        ...(genre !== undefined && { genre }),
        ...(pageCount !== undefined && { pageCount: pageCount ? parseInt(pageCount) : null }),
        ...(available !== undefined && { available }),
        ...(borrowedBy !== undefined && { borrowedBy }),
        ...(borrowedAt !== undefined && { borrowedAt: borrowedAt ? new Date(borrowedAt) : null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(featured !== undefined && { featured }),
      },
    })

    // Ödünç verme işlemi - yeni log oluştur
    if (borrowedBy && borrowedAt && dueDate && !currentBook?.borrowedBy) {
      const borrower = await prisma.user.findUnique({
        where: { id: borrowedBy },
        select: { name: true, email: true }
      })

      if (borrower) {
        await prisma.borrowLog.create({
          data: {
            bookId: id,
            bookTitle: currentBook?.title || title || book.title,
            bookAuthor: currentBook?.author || author || book.author,
            userId: borrowedBy,
            userName: borrower.name || "Bilinmiyor",
            userEmail: borrower.email,
            borrowedAt: new Date(borrowedAt),
            dueDate: new Date(dueDate),
            status: "BORROWED"
          }
        })
      }
    }

    // İade işlemi - mevcut log'u güncelle
    if (available === true && currentBook && !currentBook.available && currentBook.borrowedBy) {
      const activeLog = await prisma.borrowLog.findFirst({
        where: {
          bookId: id,
          userId: currentBook.borrowedBy,
          status: "BORROWED"
        },
        orderBy: { borrowedAt: 'desc' }
      })

      if (activeLog) {
        const now = new Date()
        const isOverdue = now > activeLog.dueDate

        await prisma.borrowLog.update({
          where: { id: activeLog.id },
          data: {
            returnedAt: now,
            status: isOverdue ? "OVERDUE" : "RETURNED"
          }
        })
      }
    }

    // Eğer kitap müsait hale geldiyse ve daha önce müsait değildiyse
    if (available === true && currentBook && !currentBook.available) {
      // Okuma listesinde bu kitabı bekleyen kullanıcıları bul
      const waitingUsers = await prisma.readingList.findMany({
        where: {
          bookId: id,
        },
        select: {
          userId: true,
        },
        distinct: ['userId']
      })

      // Her birine bildirim gönder
      if (waitingUsers.length > 0) {
        await prisma.notification.createMany({
          data: waitingUsers.map(user => ({
            userId: user.userId,
            title: "Kitap Müsait!",
            message: `"${currentBook.title}" kitabı artık ödünç alınabilir durumda.`,
            link: `/library?search=${encodeURIComponent(currentBook.title)}`
          }))
        })
      }
    }

    return NextResponse.json(book)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update book"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const body = await request.json()
    const id = searchParams.get("id") || body.id

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    await prisma.book.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}
