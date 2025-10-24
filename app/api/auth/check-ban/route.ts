import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ banned: false })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { banned: true, bannedReason: true }
  })

  if (user?.banned) {
    return NextResponse.json({ 
      banned: true, 
      reason: user.bannedReason || "Belirtilmemiş" 
    })
  }

  return NextResponse.json({ banned: false })
}
