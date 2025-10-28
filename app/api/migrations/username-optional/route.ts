/**
 * One-time migration endpoint to make username optional
 * ⚠️ DELETE THIS FILE AFTER RUNNING ONCE!
 * 
 * Usage: POST to /api/migrations/username-optional
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting username migration...')

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
      verification,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Migration error:', error)

    // If already nullable, return success
    if (error.message?.includes('already allows null values') || 
        error.code === '42804' ||
        error.message?.includes('is already nullable')) {
      return NextResponse.json({
        success: true,
        message: 'Username column was already optional - no changes needed',
        alreadyMigrated: true,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        hint: 'Check Vercel function logs for details',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET method to check status
export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT 
        column_name, 
        is_nullable,
        data_type
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username';
    `) as any[]

    return NextResponse.json({
      message: 'Username column status',
      column: result[0],
      isOptional: result[0]?.is_nullable === 'YES',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Prevent caching
export const dynamic = 'force-dynamic'
