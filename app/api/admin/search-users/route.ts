import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/admin'

// GET /api/admin/search-users?q=search_query
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Süper admin kontrolü
    if (!isSuperAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'En az 2 karakter girin' },
        { status: 400 }
      )
    }

    // Kullanıcıları ara (isim veya email ile)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            userBadges: true,
          },
        },
      },
      take: 10,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Kullanıcı arama hatası:', error)
    return NextResponse.json(
      { error: 'Kullanıcılar aranırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
