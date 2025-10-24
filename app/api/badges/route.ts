import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAllBadges } from '@/lib/badges'

// GET /api/badges - Tüm rozetleri listele
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const badges = await getAllBadges()

    return NextResponse.json(badges)
  } catch (error) {
    console.error('Rozet listesi hatası:', error)
    return NextResponse.json(
      { error: 'Rozetler getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
