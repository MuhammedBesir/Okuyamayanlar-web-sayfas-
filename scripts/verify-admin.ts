import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "wastedtr34@gmail.com"
  console.log(`Verifying admin email for: ${email}`)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error("User not found")
    process.exit(1)
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date(), verificationToken: null, verificationExpires: null },
  })

  console.log("Admin verified successfully.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
