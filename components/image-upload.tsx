"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  id?: string
  placeholder?: string
  helperText?: string
}

export function ImageUpload({ 
  label, 
  value, 
  onChange, 
  id = "image",
  placeholder = "Görsel URL'si girin veya dosya yükleyin",
  helperText
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Google Drive linkini dönüştür
  const convertGoogleDriveLink = (url: string): string => {
    if (!url) return url
    
    // Eğer zaten dönüştürülmüşse, olduğu gibi döndür
    if (url.includes('drive.google.com/uc?export=view')) {
      return url
    }
    
    // Google Drive link formatları:
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const fileId = match[1]
        // uc?export=view formatı en güvenilir
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    
    return url
  }

  // URL değiştiğinde otomatik dönüştür ve Cloudinary'ye yükle
  const handleUrlChange = async (url: string) => {
    if (!url.trim()) {
      onChange('')
      setError(null)
      return
    }

    // Eğer zaten Cloudinary URL'i ise direkt kullan
    if (url.includes('cloudinary.com')) {
      onChange(url)
      setError(null)
      return
    }

    // Google Drive linkini dönüştür
    const convertedUrl = convertGoogleDriveLink(url)
    
    // Google Drive linkleri direkt kullan (Cloudinary'ye yükleme, CORS sorunları var)
    if (convertedUrl.includes('drive.google.com')) {
      onChange(convertedUrl)
      setError("ℹ️ Google Drive linki direkt kullanılıyor")
      setTimeout(() => setError(null), 3000)
      return
    }

    // Diğer URL'ler için Cloudinary'ye yükle
    setError("📤 Görsel Cloudinary'ye yükleniyor...")
    setUploading(true)

    try {
      // URL'yi Cloudinary'ye upload et
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: convertedUrl 
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        onChange(data.url)
        setError("✅ Görsel başarıyla yüklendi!")
        setTimeout(() => setError(null), 3000)
      } else {
        // Eğer upload başarısız olursa, orijinal URL'i kullan
        onChange(convertedUrl)
        setError("⚠️ Cloudinary'ye yüklenemedi, orijinal URL kullanılıyor")
        setTimeout(() => setError(null), 5000)
      }
    } catch (err) {
      // Hata durumunda orijinal URL'i kullan
      onChange(convertedUrl)
      setError("⚠️ Yükleme hatası, orijinal URL kullanılıyor")
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya türü kontrolü - daha esnek
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
    const isImage = file.type.startsWith('image/') || validImageTypes.some(type => file.name.toLowerCase().endsWith(type.split('/')[1]))
    
    if (!isImage) {
      setError("Lütfen bir resim dosyası seçin (JPG, PNG, GIF, WebP, HEIC)")
      return
    }

    // Dosya boyutu kontrolü (10MB - mobil için artırıldı)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError(`Dosya boyutu ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maksimum 10MB yüklenebilir.`)
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onChange(data.url)
        setError(null)
      } else {
        const errorMessage = data.error || 'Yükleme başarısız'
        const details = data.details ? ` (${data.details})` : ''
        setError(errorMessage + details)
        console.error('Upload failed:', data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(`Yükleme sırasında bir hata oluştu: ${errorMessage}`)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleClearImage = () => {
    onChange('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            const url = e.target.value.trim()
            if (url && !url.includes('cloudinary.com')) {
              handleUrlChange(url)
            }
          }}
          className="flex-1"
          disabled={uploading}
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClearImage}
            title="Görseli temizle"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File Upload Button */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,image/heic,image/heif"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
          id={`${id}-file`}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Fotoğraf Yükle
            </>
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          Kameradan veya galeriden
        </span>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      
      {!helperText && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Maksimum 10MB (JPG, PNG, GIF, WebP, HEIC)
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
            ⚠️ Google Drive linkleri görüntüleme sorunu yaşayabilir. En iyi performans için dosya yükleyin.
          </p>
        </div>
      )}

      {/* Error/Success Message */}
      {error && (
        <p className={`text-xs font-medium ${
          error.startsWith('✅') 
            ? 'text-green-600 dark:text-green-400'
            : error.startsWith('ℹ️')
            ? 'text-blue-600 dark:text-blue-400'
            : error.startsWith('⚠️')
            ? 'text-yellow-600 dark:text-yellow-500'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {error}
        </p>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative mt-3 inline-block">
          <div className="relative rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={value}
              alt="Preview"
              className="max-h-48 max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                // Google Drive linkleri için alternatif gösterme
                if (value.includes('drive.google.com')) {
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EGoogle Drive%3C/text%3E%3C/svg%3E"
                  setError("ℹ️ Google Drive görseli önizlenemiyor, ancak kaydedilecek")
                } else {
                  target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
                  setError("⚠️ Görsel yüklenemedi, varsayılan görsel gösteriliyor")
                }
              }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
            <ImageIcon className="h-3 w-3" />
            <span>
              {value.includes('drive.google.com') 
                ? 'Google Drive linki (önizleme olmayabilir)' 
                : 'Görsel önizleme'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
