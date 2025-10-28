/**
 * Make username column optional in production database
 * 
 * This script updates the database schema to make the username field optional,
 * allowing Google OAuth users to sign in without requiring a username upfront.
 * 
 * Usage: 
 * - Local: npx tsx scripts/make-username-optional.ts
 * - Vercel: Will run automatically via postinstall hook
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Making username column optional...\n')

  try {
    // Execute raw SQL to make username nullable
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;
    `)

    console.log('✅ Successfully made username column optional!')

    // Verify the change
    const result = await prisma.$queryRawUnsafe(`
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username';
    `)

    console.log('\n📊 Verification:')
    console.log(result)

  } catch (error: any) {
    if (error.message.includes('column "username" of relation "users" does not exist')) {
      console.log('⚠️  Username column does not exist yet. This is expected if migrations haven\'t run.')
    } else if (error.message.includes('already allows null values') || error.code === '42804') {
      console.log('✅ Username column is already nullable. No changes needed.')
    } else {
      console.error('❌ Error:', error.message)
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
