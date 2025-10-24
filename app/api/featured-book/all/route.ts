import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET: List all featured books (Admin only)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const featuredBooks = await prisma.featuredBook.findMany({
      include: {
        book: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ featuredBooks });
  } catch (error) {
    console.error('Error fetching featured books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured books' },
      { status: 500 }
    );
  }
}
