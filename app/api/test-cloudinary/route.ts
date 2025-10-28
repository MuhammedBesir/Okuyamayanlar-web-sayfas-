import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function GET() {
  try {
    // Environment variables kontrolü
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined, // Güvenlik için gizle
    }
    
    // Cloudinary config kontrolü
    const cloudinaryConfig = cloudinary.config()
    
    return NextResponse.json({
      message: "Cloudinary configuration test",
      env_vars: config,
      cloudinary_config: {
        cloud_name: cloudinaryConfig.cloud_name,
        api_key: cloudinaryConfig.api_key,
        api_secret: cloudinaryConfig.api_secret ? '***' : undefined,
      },
      status: "OK"
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
