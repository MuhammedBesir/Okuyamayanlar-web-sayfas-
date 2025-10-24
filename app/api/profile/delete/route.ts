import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 })
    }

    const userId = session.user.id

    // Kullanıcıyı ve ilişkili tüm verileri sil
    // Prisma cascade delete ile ilişkili veriler otomatik silinecek
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: "Hesabınız başarıyla silindi" 
    })
  } catch (error) {
    console.error("Hesap silme hatası:", error)
    return NextResponse.json(
      { error: "Hesap silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
