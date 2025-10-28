/**
 * One-time migration endpoint to make username optional
 * 
 * SECURITY: This endpoint should be deleted after running once!
 * 
 * Usage: POST to /api/migrations/make-username-optional
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Make username column nullable
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;
    `)

    console.log('✅ Successfully made username column optional!')

    // Verify the change
    const verification = await prisma.$queryRawUnsafe(`
      SELECT 
        column_name, 
        is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username';
    `) as any[]

    return NextResponse.json({
      success: true,
      message: 'Username column is now optional',
      verification
    })

  } catch (error: any) {
    console.error('Migration error:', error)

    // If already nullable, return success
    if (error.message?.includes('already allows null values') || error.code === '42804') {
      return NextResponse.json({
        success: true,
        message: 'Username column was already optional',
        alreadyMigrated: true
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'This might be expected if the migration was already run'
      },
      { status: 500 }
    )
  }
}

// Prevent caching
export const dynamic = 'force-dynamic'
