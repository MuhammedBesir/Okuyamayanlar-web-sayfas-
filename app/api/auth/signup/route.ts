import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

// Force Node.js runtime for bcryptjs and crypto compatibility
export const runtime = 'nodejs'

// Güvenilir email sağlayıcıları
const TRUSTED_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'windowslive.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.com.tr',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'tutanota.com', 'tutanota.de',
  'aol.com',
  'zoho.com',
  'mail.com',
  'gmx.com', 'gmx.de', 'gmx.net',
  'yandex.com', 'yandex.ru', 'yandex.com.tr',
  'hotmail.com.tr',
  'mynet.com',
]

// Geçici email servisleri (YASAKLI)
const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwaway.email', 'temp-mail.org',
  'fakemailgenerator.com', 'trashmail.com', 'getnada.com',
  'maildrop.cc', 'sharklasers.com', 'spam4.me',
  'yopmail.com', 'mailnesia.com', 'mintemail.com'
]

// Email validasyonu
function validateEmail(email: string): { valid: boolean; message?: string } {
  // Format kontrolü
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Geçerli bir e-posta adresi giriniz" }
  }

  const domain = email.toLowerCase().split('@')[1]

  // Geçici email kontrolü
  if (DISPOSABLE_DOMAINS.some(d => domain.includes(d))) {
    return { valid: false, message: "Geçici e-posta adresleri kabul edilmemektedir" }
  }

  // Eğitim kurumu email'i mi?
  const isEduEmail = domain.endsWith('.edu.tr') || 
                     domain.endsWith('.edu') ||
                     domain.includes('university') ||
                     domain.includes('universite')

  // Güvenilir domain kontrolü
  const isTrustedDomain = TRUSTED_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))

  if (!isTrustedDomain && !isEduEmail) {
    return {
      valid: false,
      message: "Bu e-posta sağlayıcısı kabul edilmemektedir. Lütfen Gmail, Outlook, Yahoo, iCloud veya üniversite e-postası kullanın."
    }
  }

  return { valid: true }
}

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

    // Email validasyonu (KATİ)
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.message },
        { status: 400 }
      )
    }

    // Şifre güvenlik kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      )
    }

    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    if (!hasNumber || !hasLetter) {
      return NextResponse.json(
        { error: "Şifre hem harf hem rakam içermelidir" },
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
