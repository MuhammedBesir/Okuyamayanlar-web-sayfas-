import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanları doldurun" },
        { status: 400 }
      )
    }

    // Kullanıcı adı uzunluk kontrolü
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Kullanıcı adı 3-30 karakter arasında olmalıdır" },
        { status: 400 }
      )
    }

    // E-posta kontrolü
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      )
    }

    // Kullanıcı adı kontrolü
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten kullanılıyor" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Verification token oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat

    const user = await prisma.user.create({
      data: {
        name: username, // Kullanıcı adını name olarak da kaydet
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verificationExpires,
        emailVerified: null, // Henüz onaylanmadı
      },
    })

    // Onaylama e-postası gönder
    try {
      await sendVerificationEmail(user.email, verificationToken, user.username || 'Değerli Okuyucumuz')
    } catch (emailError) {
      console.error('E-posta gönderme hatası:', emailError)
      // E-posta gönderilemese de kayıt tamamlansın
    }

    return NextResponse.json(
      { 
        message: "Kayıt başarılı! E-posta adresinize gönderilen linke tıklayarak hesabınızı onaylayın.", 
        user: { id: user.id, email: user.email, username: user.username },
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
