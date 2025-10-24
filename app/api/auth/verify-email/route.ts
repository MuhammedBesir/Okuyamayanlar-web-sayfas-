import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid_token', request.url))
    }

    // Token'ı kontrol et - findFirst kullanarak
    const user = await prisma.user.findFirst({
      where: { 
        verificationToken: token 
      },
      select: {
        id: true,
        email: true,
        username: true,
        verificationExpires: true,
      },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid_token', request.url))
    }

    // Token'ın süresinin dolup dolmadığını kontrol et
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.redirect(new URL('/auth/signin?error=token_expired', request.url))
    }

    // Kullanıcıyı onayla
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    })

    // Hoş geldiniz e-postası gönder
    if (user.email && user.username) {
      await sendWelcomeEmail(user.email, user.username)
    }

    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=verification_failed', request.url))
  }
}
