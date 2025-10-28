import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin } from "@/lib/admin"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: userId } = await params

    // Admin kendini silemez
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Kendinizi silemezsiniz" }, { status: 400 })
    }

    // Hedef kullanıcıyı kontrol et
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true, name: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    // Süper admin silinemez
    if (isSuperAdmin(targetUser.email)) {
      return NextResponse.json({ error: "Süper admin silemezsiniz" }, { status: 403 })
    }

    // Diğer adminleri silemez
    if (targetUser.role === "ADMIN") {
      return NextResponse.json({ error: "Admin kullanıcılarını silemezsiniz" }, { status: 400 })
    }

    // Kullanıcıyı sil - Prisma cascade delete ile ilişkili verileri de siler
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ 
      success: true, 
      message: `${targetUser.name || targetUser.email} başarıyla silindi` 
    })
  } catch (error) {
    return NextResponse.json({ error: "Kullanıcı silinirken bir hata oluştu" }, { status: 500 })
  }
}
