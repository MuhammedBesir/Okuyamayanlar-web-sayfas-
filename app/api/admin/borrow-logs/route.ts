import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const logs = await prisma.borrowLog.findMany({
      orderBy: { borrowedAt: "desc" },
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching borrow logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch borrow logs" },
      { status: 500 }
    )
  }
}
