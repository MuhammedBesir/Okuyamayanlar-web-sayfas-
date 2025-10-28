import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: topicId } = await params
    const body = await request.json()
    const { featured } = body

    // Forum konusunu güncelle
    const updatedTopic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: { featured: featured }
    })

    return NextResponse.json({ 
      success: true, 
      topic: updatedTopic,
      message: featured 
        ? "Tartışma ana sayfaya eklendi" 
        : "Tartışma ana sayfadan kaldırıldı"
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "İşlem sırasında bir hata oluştu" 
    }, { status: 500 })
  }
}
