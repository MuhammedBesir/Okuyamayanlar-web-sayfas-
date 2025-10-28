import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, status } = body

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Check if event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { rsvps: true }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.maxAttendees && event._count.rsvps >= event.maxAttendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Create or update RSVP
    const rsvp = await prisma.eventRSVP.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId,
        },
      },
      update: {
        status: status || "going",
      },
      create: {
        userId: session.user.id,
        eventId: eventId,
        status: status || "going",
      },
    })

    return NextResponse.json(rsvp, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create RSVP" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await prisma.eventRSVP.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId,
        },
      },
    })

    return NextResponse.json({ message: "RSVP deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete RSVP" }, { status: 500 })
  }
}
