import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const { name, bio, image } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: "İsim alanı zorunludur" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
        image: image?.trim() || null,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        bio: updatedUser.bio,
        image: updatedUser.image,
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Profil güncellenirken bir hata oluştu" }, { status: 500 })
  }
}
