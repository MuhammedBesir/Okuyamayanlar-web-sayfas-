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

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid_token', request.url))
    }

    if (user.emailVerified) {
      return NextResponse.redirect(new URL('/auth/signin?verified=true&already=true', request.url))
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.redirect(new URL('/auth/signin?error=token_expired', request.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    })

    if (user.email && user.username) {
      try {
        await sendWelcomeEmail(user.email, user.username)
      } catch (emailError) {
        // Email gönderilemese de devam et
      }
    }

    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url))
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/signin?error=verification_failed', request.url))
  }
}

