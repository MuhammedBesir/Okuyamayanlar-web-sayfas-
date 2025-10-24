import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve yeni şifre gereklidir" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      )
    }

    // Token'ı bul ve doğrula
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş token" },
        { status: 400 }
      )
    }

    // Token'ın kullanılıp kullanılmadığını kontrol et
    if (resetToken.used) {
      return NextResponse.json(
        { error: "Bu token zaten kullanılmış" },
        { status: 400 }
      )
    }

    // Token'ın süresinin dolup dolmadığını kontrol et
    if (new Date() > resetToken.expires) {
      return NextResponse.json(
        { error: "Token süresi dolmuş" },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10)

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Token'ı kullanılmış olarak işaretle
    await prisma.passwordReset.update({
      where: { id: resetToken.id },
      data: { used: true },
    })

    return NextResponse.json({
      message: "Şifreniz başarıyla güncellendi",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
