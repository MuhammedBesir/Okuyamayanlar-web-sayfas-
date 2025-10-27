import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    console.log('🔍 Email verification attempt:', { 
      token: token ? token.substring(0, 10) + '...' : 'none',
      fullUrl: request.url 
    })

    if (!token) {
      console.error('❌ No token provided')
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
        emailVerified: true,
      },
    })

    console.log('👤 User lookup result:', { 
      found: !!user, 
      email: user?.email,
      alreadyVerified: !!user?.emailVerified,
      tokenExpires: user?.verificationExpires
    })

    if (!user) {
      console.error('❌ No user found with this token')
      return NextResponse.redirect(new URL('/auth/signin?error=invalid_token', request.url))
    }

    // Eğer kullanıcı zaten onaylanmışsa
    if (user.emailVerified) {
      console.log('✅ User already verified, redirecting to signin')
      return NextResponse.redirect(new URL('/auth/signin?verified=true&already=true', request.url))
    }

    // Token'ın süresinin dolup dolmadığını kontrol et
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      console.error('❌ Token expired:', { 
        expires: user.verificationExpires, 
        now: new Date() 
      })
      return NextResponse.redirect(new URL('/auth/signin?error=token_expired', request.url))
    }

    console.log('✅ Verifying user email...')

    // Kullanıcıyı onayla
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    })

    console.log('✅ Email verified successfully for:', user.email)

    // Hoş geldiniz e-postası gönder
    if (user.email && user.username) {
      try {
        await sendWelcomeEmail(user.email, user.username)
        console.log('✅ Welcome email sent to:', user.email)
      } catch (emailError) {
        console.error('⚠️ Failed to send welcome email:', emailError)
        // Hoş geldiniz emaili gönderilemese de devam et
      }
    }

    console.log('🎉 Redirecting to signin with verified=true')
    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url))
  } catch (error) {
    console.error('❌ Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=verification_failed', request.url))
  }
}
