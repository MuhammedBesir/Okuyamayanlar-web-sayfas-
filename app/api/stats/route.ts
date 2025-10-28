import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          books: 0,
          members: 0,
          events: 0,
          discussions: 0,
          error: 'Database not configured'
        },
        { status: 200 }
      );
    }

    // Test database connection first
    await prisma.$connect();

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
    // Return fallback data instead of error
    return NextResponse.json({
      books: 0,
      members: 0,
      events: 0,
      discussions: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics',
      timestamp: new Date().toISOString()
    }, { status: 200 }); // Return 200 instead of 500 to prevent console errors
  } finally {
    await prisma.$disconnect();
  }
}
