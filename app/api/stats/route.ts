import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all counts in parallel
    const [booksCount, usersCount, eventsCount, forumTopicsCount] = await Promise.all([
      prisma.book.count(),
      prisma.user.count(),
      prisma.event.count(),
      prisma.forumTopic.count()
    ]);

    return NextResponse.json({
      books: booksCount,
      members: usersCount,
      events: eventsCount,
      discussions: forumTopicsCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
