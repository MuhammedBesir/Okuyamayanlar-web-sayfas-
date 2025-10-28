import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveDatabaseUrl(): string | undefined {
  const isValid = (v?: string) => !!v && /^postgres(ql)?:\/\//i.test(v)

  // Prefer DATABASE_URL if valid
  if (isValid(process.env.DATABASE_URL)) return process.env.DATABASE_URL

  // Fall back to common Vercel Postgres variables
  if (isValid(process.env.POSTGRES_PRISMA_URL)) return process.env.POSTGRES_PRISMA_URL
  if (isValid(process.env.POSTGRES_URL)) return process.env.POSTGRES_URL
  if (isValid(process.env.POSTGRES_URL_NON_POOLING)) return process.env.POSTGRES_URL_NON_POOLING

  return undefined
}

const dbUrl = resolveDatabaseUrl()

if (!dbUrl && process.env.NODE_ENV === 'production') {
  console.error('[Prisma] No valid Postgres connection string found. Set DATABASE_URL to a url starting with postgres:// or postgresql://, or ensure POSTGRES_PRISMA_URL exists in the environment.')
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
