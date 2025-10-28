/**
 * Delete user and allow re-registration with OAuth
 * 
 * Usage: POST /api/admin/delete-user-for-oauth
 * Body: { "email": "user@example.com" }
 * 
 * ⚠️ This is for testing only! Delete after use.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    // Only allow admin or in development
    if (process.env.NODE_ENV === 'production' && session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete related records first
    await prisma.session.deleteMany({
      where: { userId: user.id }
    })

    await prisma.account.deleteMany({
      where: { userId: user.id }
    })

    // Delete user badges, notifications, etc.
    await prisma.userBadge.deleteMany({
      where: { userId: user.id }
    })

    await prisma.notification.deleteMany({
      where: { userId: user.id }
    })

    await prisma.readingList.deleteMany({
      where: { userId: user.id }
    })

    await prisma.forumTopicLike.deleteMany({
      where: { userId: user.id }
    })

    await prisma.forumReplyLike.deleteMany({
      where: { userId: user.id }
    })

    await prisma.forumTopic.deleteMany({
      where: { userId: user.id }
    })

    await prisma.forumReply.deleteMany({
      where: { userId: user.id }
    })

    await prisma.review.deleteMany({
      where: { userId: user.id }
    })

    await prisma.eventRSVP.deleteMany({
      where: { userId: user.id }
    })

    await prisma.eventComment.deleteMany({
      where: { userId: user.id }
    })

    await prisma.eventPhoto.deleteMany({
      where: { userId: user.id }
    })

    // Finally delete user
    await prisma.user.delete({
      where: { email }
    })

    return NextResponse.json({
      success: true,
      message: `User ${email} deleted successfully`,
      deletedUser: {
        email: user.email,
        name: user.name,
        hadAccounts: user.accounts.length,
        hadSessions: user.sessions.length
      }
    })

  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
