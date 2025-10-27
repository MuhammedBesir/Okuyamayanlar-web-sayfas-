import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const id = searchParams.get('id')
    const past = searchParams.get('past') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Eğer ID verilmişse tek etkinlik getir
    if (id) {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          rsvps: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                }
              }
            }
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' },
          },
          photos: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { 
              rsvps: true,
              comments: true,
              photos: true,
            },
          },
        },
      })
      
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      // Ortalama rating hesapla
      const ratingsWithValue = event.comments.filter(c => c.rating !== null)
      const averageRating = ratingsWithValue.length > 0
        ? ratingsWithValue.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingsWithValue.length
        : null

      return NextResponse.json({
        ...event,
        averageRating,
        totalRatings: ratingsWithValue.length,
      })
    }

    // Geçmiş etkinlikler için filtre
    const whereClause: any = {}
    
    if (status) {
      whereClause.status = status as any
    }

    if (past) {
      // Geçmiş etkinlikler: bugünden önceki veya COMPLETED statüsündeki
      whereClause.OR = [
        { status: 'COMPLETED' },
        { 
          startDate: {
            lt: new Date()
          }
        }
      ]
    }

    if (featured) {
      // Sadece öne çıkarılmış etkinlikler
      whereClause.featured = true
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { 
            rsvps: true,
            comments: true,
          },
        },
        comments: {
          select: {
            rating: true,
          },
        },
        // Kullanıcı giriş yaptıysa RSVP durumunu da ekle
        ...(session?.user?.id && {
          rsvps: {
            where: {
              userId: session.user.id
            },
            select: {
              status: true
            }
          }
        })
      },
      orderBy: { startDate: "desc" },
      take: limit,
    })

    // RSVP verisini daha kullanışlı hale getir ve rating hesapla
    const eventsWithUserRSVP = events.map((event: any) => {
      // Ortalama rating hesapla
      const ratingsWithValue = event.comments.filter((c: any) => c.rating !== null)
      const averageRating = ratingsWithValue.length > 0
        ? ratingsWithValue.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / ratingsWithValue.length
        : null

      return {
        ...event,
        attendees: event._count?.rsvps || 0, // Katılımcı sayısı
        userRSVP: session?.user?.id && 'rsvps' in event && event.rsvps.length > 0 
          ? event.rsvps[0] 
          : null,
        averageRating,
        totalRatings: ratingsWithValue.length,
        rsvps: undefined, // Frontend'de rsvps array'ine ihtiyacımız yok
        comments: undefined, // Frontend'de comments array'ine ihtiyacımız yok
      }
    })

    return NextResponse.json({ events: eventsWithUserRSVP })
  } catch (error) {
    console.error("Event fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      location,
      locationLat,
      locationLng,
      isOnline, 
      startDate, 
      endDate, 
      time,
      eventType,
      image, 
      maxAttendees,
      status 
    } = body

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        isOnline: isOnline || false,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        time,
        eventType,
        image,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        status: status || "UPCOMING",
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("PUT /api/events - Received body:", body)
    
    const { 
      id,
      title, 
      description, 
      location,
      locationLat,
      locationLng,
      isOnline, 
      startDate, 
      endDate, 
      time,
      eventType,
      image, 
      maxAttendees,
      status,
      featured 
    } = body

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Sadece gönderilen alanları güncelle
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (location !== undefined) updateData.location = location
    if (locationLat !== undefined) updateData.locationLat = locationLat ? parseFloat(locationLat) : null
    if (locationLng !== undefined) updateData.locationLng = locationLng ? parseFloat(locationLng) : null
    if (isOnline !== undefined) updateData.isOnline = isOnline
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (time !== undefined) updateData.time = time
    if (eventType !== undefined) updateData.eventType = eventType
    if (image !== undefined) updateData.image = image
    if (maxAttendees !== undefined) updateData.maxAttendees = maxAttendees ? parseInt(maxAttendees) : null
    if (status !== undefined) updateData.status = status
    if (featured !== undefined) updateData.featured = featured

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    console.log("Event updated successfully:", event.id)
    return NextResponse.json(event)
  } catch (error) {
    console.error("Event update error:", error)
    return NextResponse.json({ 
      error: "Failed to update event", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Event deletion error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
