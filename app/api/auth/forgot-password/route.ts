import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

// Force Node.js runtime for crypto compatibility
export const runtime = 'nodejs'

// Güvenilir email sağlayıcıları (kayıt sayfasıyla aynı)
const TRUSTED_EMAIL_DOMAINS = [
  // Ana sağlayıcılar
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'ymail.com',
  'icloud.com', 'me.com', 'mac.com',
  
  // Güvenli alternatifler
  'protonmail.com', 'proton.me', 'pm.me',
  'tutanota.com', 'tuta.io',
  'zoho.com', 'zohomail.com',
  'fastmail.com',
  'aol.com',
  'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru',
  'mail.com',
]

// Engellenen geçici/sahte email servisleri
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'maildrop.cc', 'mailinator.com', 'trashmail.com',
  'fakeinbox.com', 'getnada.com', 'mohmal.com', 'sharklasers.com',
  'emailondeck.com', 'mintemail.com', 'mytemp.email',
]

function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Geçersiz email formatı" }
  }

  const domain = email.toLowerCase().split('@')[1]
  
  // Engellenen domainler
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: "Geçici email adresleri kabul edilmez" }
  }

  // Güvenilir domain veya eğitim emaili kontrolü
  const isTrustedDomain = TRUSTED_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))
  const isEduEmail = domain.endsWith('.edu.tr') || domain.endsWith('.edu')
  
  if (!isTrustedDomain && !isEduEmail) {
    return { 
      valid: false, 
      error: "Bu email sağlayıcısı kabul edilmiyor. Lütfen Gmail, Outlook, Yahoo gibi güvenilir bir sağlayıcı kullanın" 
    }
  }

  return { valid: true }
}

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

    // Email validasyonu
    const validation = validateEmail(email)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
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

    // Eski ve süresi dolmuş tokenları temizle
    await prisma.passwordReset.deleteMany({
      where: {
        OR: [
          { email: email.toLowerCase(), used: false },
          { expires: { lt: new Date() } }, // Süresi dolmuş tokenlar
        ],
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
