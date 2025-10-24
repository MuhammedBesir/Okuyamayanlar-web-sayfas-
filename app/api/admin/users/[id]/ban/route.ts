import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin } from "@/lib/admin"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: userId } = await params
    const body = await request.json()
    const { banned, reason } = body

    // Admin kendini banlayamaz
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Kendinizi banlayamazsınız" }, { status: 400 })
    }

    // Hedef kullanıcıyı kontrol et
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    })

    // Süper admin banlanamazı
    if (targetUser && isSuperAdmin(targetUser.email)) {
      return NextResponse.json({ error: "Süper admin banlayamazsınız" }, { status: 403 })
    }

    // Diğer adminleri banlayamaz
    if (targetUser?.role === "ADMIN") {
      return NextResponse.json({ error: "Admin kullanıcılarını banlayamazsınız" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        banned: banned,
        bannedAt: banned ? new Date() : null,
        bannedReason: banned ? reason : null
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Error toggling ban:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
