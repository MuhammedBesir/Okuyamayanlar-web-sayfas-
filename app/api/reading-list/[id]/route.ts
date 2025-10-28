import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const itemId = params.id
    const body = await request.json()
    const { status } = body

    // Check if item exists and belongs to user
    const item = await prisma.readingList.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update status
    const updatedItem = await prisma.readingList.update({
      where: { id: itemId },
      data: { status },
      include: {
        book: true
      }
    })

    // Profil sayfasını yeniden doğrula
    revalidatePath('/profile')
    revalidatePath('/reading-list')

    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const itemId = params.id

    // Check if item exists and belongs to user
    const item = await prisma.readingList.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete item
    await prisma.readingList.delete({
      where: { id: itemId }
    })

    // Profil sayfasını yeniden doğrula
    revalidatePath('/profile')
    revalidatePath('/reading-list')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
