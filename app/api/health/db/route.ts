import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Database check failed'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
