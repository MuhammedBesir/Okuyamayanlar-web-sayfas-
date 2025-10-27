import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin, deleteUserContent } from "@/lib/admin"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Süper admin kontrolü
  if (!isSuperAdmin(session.user.email)) {
    return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 })
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

    if (!targetUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    // Süper admin banlanamaz
    if (isSuperAdmin(targetUser.email)) {
      return NextResponse.json({ error: "Süper admin banlayamazsınız" }, { status: 403 })
    }

    // İçerik silme sonucu için değişken
    let deletedCounts = {}

    // Kullanıcı banlanıyorsa, önce tüm içeriklerini sil
    if (banned) {
      console.log('🗑️ Kullanıcı banlanıyor, içerikler siliniyor:', userId)
      const deleteResult = await deleteUserContent(userId, prisma)
      
      if (!deleteResult.success) {
        console.error('❌ İçerik silme hatası:', deleteResult.error)
        return NextResponse.json({ 
          error: "Kullanıcı içerikleri silinirken hata oluştu: " + deleteResult.error 
        }, { status: 500 })
      }

      deletedCounts = deleteResult.deletedCounts
      console.log('✅ Kullanıcı içerikleri silindi:', deletedCounts)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        banned: banned,
        bannedAt: banned ? new Date() : null,
        bannedReason: banned ? reason : null
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      deletedContent: banned ? deletedCounts : undefined
    })
  } catch (error) {
    console.error("Error toggling ban:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
