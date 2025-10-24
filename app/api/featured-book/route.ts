import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch the currently active featured book
export async function GET() {
  try {
    const now = new Date();

    // Find active featured book within date range
    const featuredBook = await prisma.featuredBook.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      },
      include: {
        book: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!featuredBook) {
      return NextResponse.json({ featuredBook: null }, { status: 200 });
    }

    return NextResponse.json({ featuredBook });
  } catch (error) {
    console.error('Error fetching featured book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured book' },
      { status: 500 }
    );
  }
}

// POST: Create a new featured book (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      bookId,
      title,
      author,
      coverImage,
      category,
      description,
      rating,
      reviewCount,
      readers,
      quote,
      pages,
      genre,
      badge,
      startDate,
      endDate,
      isActive
    } = body;

    // Validate required fields
    if (!bookId || !title || !author) {
      return NextResponse.json(
        { error: 'Book ID, title, and author are required' },
        { status: 400 }
      );
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if this book already has a featured book entry
    const existingFeatured = await prisma.featuredBook.findUnique({
      where: { bookId }
    });

    if (existingFeatured) {
      return NextResponse.json(
        { 
          error: 'Bu kitap zaten öne çıkarılmış. Lütfen önce mevcut kaydı düzenleyin veya silin.',
          existingId: existingFeatured.id 
        },
        { status: 400 }
      );
    }

    // If setting as active, deactivate all other featured books
    if (isActive) {
      await prisma.featuredBook.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    // Create featured book
    const featuredBook = await prisma.featuredBook.create({
      data: {
        bookId,
        title,
        author,
        coverImage: coverImage || book.coverImage || '/placeholder-book.jpg',
        category: category || book.genre || 'Genel',
        description: description || book.description || '',
        rating: rating || 0,
        reviewCount: reviewCount || 0,
        readers: readers || 0,
        quote: quote || null,
        pages: pages || book.pageCount || null,
        genre: genre || book.genre || 'Genel',
        badge: badge || null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        book: true
      }
    });

    return NextResponse.json({ featuredBook }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating featured book:', error);
    return NextResponse.json(
      { error: 'Failed to create featured book', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update featured book (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Featured book ID is required' },
        { status: 400 }
      );
    }

    // If setting as active, deactivate all other featured books
    if (updateData.isActive) {
      await prisma.featuredBook.updateMany({
        where: { 
          id: { not: id },
          isActive: true 
        },
        data: { isActive: false }
      });
    }

    // Convert date strings to Date objects
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const featuredBook = await prisma.featuredBook.update({
      where: { id },
      data: updateData,
      include: {
        book: true
      }
    });

    return NextResponse.json({ featuredBook });
  } catch (error: any) {
    console.error('Error updating featured book:', error);
    return NextResponse.json(
      { error: 'Failed to update featured book', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove featured book (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Featured book ID is required' },
        { status: 400 }
      );
    }

    await prisma.featuredBook.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Featured book deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting featured book:', error);
    return NextResponse.json(
      { error: 'Failed to delete featured book', details: error.message },
      { status: 500 }
    );
  }
}
