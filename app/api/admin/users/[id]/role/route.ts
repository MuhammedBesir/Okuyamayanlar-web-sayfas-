import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isSuperAdmin } from "@/lib/admin"

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      )
    }

    // Kullanıcının admin olup olmadığını kontrol et
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    })

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için admin yetkisi gerekiyor" },
        { status: 403 }
      )
    }

    // Kendi rolünü değiştirmeye çalışıyor mu?
    if (currentUser.id === params.id) {
      return NextResponse.json(
        { error: "Kendi rolünüzü değiştiremezsiniz" },
        { status: 400 }
      )
    }

    const { role } = await req.json()

    // Geçerli rol kontrolü
    if (!role || (role !== "USER" && role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Geçersiz rol. USER veya ADMIN olmalıdır." },
        { status: 400 }
      )
    }

    // Sadece süper admin başkasına admin yetkisi verebilir
    if (role === "ADMIN" && !isSuperAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "Sadece süper admin (wastedtr34@gmail.com) başka kullanıcılara admin yetkisi verebilir" },
        { status: 403 }
      )
    }

    // Hedef kullanıcının varlığını kontrol et
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Süper admin'in rolü değiştirilemez
    if (isSuperAdmin(targetUser.email)) {
      return NextResponse.json(
        { error: "Süper admin'in (wastedtr34@gmail.com) rolü değiştirilemez" },
        { status: 403 }
      )
    }

    // Rolü güncelle
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json({
      message: `${updatedUser.name} kullanıcısının rolü ${role} olarak güncellendi`,
      user: updatedUser
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Rol güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
