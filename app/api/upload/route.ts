import { NextResponse } from "next/server"
import { auth } from "@/auth"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Oturum açmış kullanıcılar yükleme yapabilir
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Dosya türünü kontrol et
    const allowedTypes = [
      "image/jpeg", 
      "image/jpg", 
      "image/png", 
      "image/gif", 
      "image/webp",
      "image/heic",
      "image/heif",
      "application/octet-stream"
    ]
    
    const originalFileName = file.name.toLowerCase()
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif']
    const hasValidExtension = validExtensions.some(ext => originalFileName.endsWith(ext))
    
    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return NextResponse.json(
        { error: "Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WebP, HEIC)" },
        { status: 400 }
      )
    }

    // Dosya boyutunu kontrol et (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'dan küçük olmalıdır" },
        { status: 400 }
      )
    }

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Cloudinary'ye yükle
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'okuyamayanlar',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })
    
    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      fileName: result.public_id
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { 
        error: "Dosya yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
