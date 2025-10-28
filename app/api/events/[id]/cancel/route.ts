import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEventCancellationEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const params = await context.params

    // Kullanıcının admin olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, username: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { cancellationReason } = await request.json()

    // Etkinliği bul
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        rsvps: {
          where: {
            status: 'going', // Sadece katılacak olan kullanıcılara bildirim gönder
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Etkinlik bulunamadı' },
        { status: 404 }
      )
    }

    // Etkinliği iptal et
    await prisma.event.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
      },
    })

    // Katılımcılara bildirim oluştur ve email gönder
    const notificationPromises = []
    const emailPromises = []

    for (const rsvp of event.rsvps) {
      // Bildirim oluştur
      notificationPromises.push(
        prisma.notification.create({
          data: {
            userId: rsvp.user.id,
            title: 'Etkinlik İptal Edildi',
            message: `"${event.title}" etkinliği iptal edildi.${cancellationReason ? ` Neden: ${cancellationReason}` : ''}`,
            link: `/events/${event.id}`,
          },
        })
      )

      // Email gönder
      if (rsvp.user.email) {
        const eventDate = new Date(event.startDate).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })

        emailPromises.push(
          sendEventCancellationEmail(
            rsvp.user.email,
            rsvp.user.username || rsvp.user.name || 'Değerli Katılımcı',
            event.title,
            eventDate,
            cancellationReason
          ).catch((error) => {
            console.error(`Email gönderme hatası (${rsvp.user.email}):`, error)
            // Email hatası olsa bile devam et
            return { success: false, error }
          })
        )
      }
    }

    // Tüm bildirimleri ve emailleri gönder
    await Promise.all([...notificationPromises, ...emailPromises])
    return NextResponse.json({
      message: 'Etkinlik iptal edildi ve katılımcılara bildirim gönderildi',
      participantsNotified: event.rsvps.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Etkinlik iptal edilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
