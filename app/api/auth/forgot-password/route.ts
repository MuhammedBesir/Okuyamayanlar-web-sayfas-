import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email gereklidir" },
        { status: 400 }
      )
    }

    // Kullanıcının var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, username: true },
    })

    // Güvenlik için, kullanıcı bulunamasa bile başarılı mesaj döndür
    // (Email enumeration saldırılarını önlemek için)
    if (!user) {
      return NextResponse.json({
        message: "Eğer bu email adresi kayıtlıysa, şifre sıfırlama linki gönderildi.",
      })
    }

    // Rastgele token oluştur
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // 1 saat geçerli

    // Eski tokenları sil
    await prisma.passwordReset.deleteMany({
      where: {
        email: email.toLowerCase(),
        used: false,
      },
    })

    // Yeni token'ı veritabanına kaydet
    await prisma.passwordReset.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires,
      },
    })

    // Şifre sıfırlama e-postası gönder
    try {
      await sendPasswordResetEmail(user.email, token, user.username)
      console.log('Şifre sıfırlama e-postası gönderildi:', user.email)
    } catch (emailError) {
      console.error('E-posta gönderme hatası:', emailError)
      // E-posta gönderilemese bile başarılı mesaj döndür (güvenlik için)
    }

    return NextResponse.json({
      message: "Eğer bu email adresi kayıtlıysa, şifre sıfırlama linki gönderildi.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
