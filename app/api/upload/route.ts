import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Oturum açmış kullanıcılar yükleme yapabilir (sadece admin değil, tüm kullanıcılar)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Dosya türünü kontrol et
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WebP)" },
        { status: 400 }
      )
    }

    // Dosya boyutunu kontrol et (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan küçük olmalıdır" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-')
    const fileName = `${timestamp}-${originalName}`
    
    // Public/uploads klasörünü oluştur
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Dosyayı kaydet
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)
    
    // Public URL'ini döndür
    const publicUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
