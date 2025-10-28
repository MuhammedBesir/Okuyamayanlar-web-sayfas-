"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { ArrowLeft, Save } from "lucide-react"

// Google Drive linkini direkt görsel URL'ine çevir
const convertDriveLink = (url: string): string => {
  if (!url) return url
  
  // Eğer zaten dönüştürülmüşse, olduğu gibi döndür
  if (url.includes('drive.google.com/uc?') || url.includes('drive.google.com/thumbnail')) return url
  
  // Drive share linkini parse et: /file/d/FILE_ID/view formatı
  const fileIdMatch = url.match(/\/d\/([^\/\?]+)/)
  if (fileIdMatch && fileIdMatch[1]) {
    // Thumbnail formatı daha güvenilir
    return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`
  }
  
  // id=FILE_ID formatı
  const idMatch = url.match(/[?&]id=([^&]+)/)
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`
  }
  
  return url
}

export default function NewBookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "",
    isbn: "",
    publishedYear: "",
    genre: "",
    pageCount: "",
    available: true,
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Google Drive linkini dönüştür
      const processedData = {
        title: formData.title,
        author: formData.author,
        description: formData.description || null,
        coverImage: convertDriveLink(formData.coverImage) || null,
        isbn: formData.isbn || null,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
        genre: formData.genre || null,
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : null,
        available: formData.available,
        featured: formData.featured,
      }
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      })

      const data = await res.json()
      if (res.ok) {
        router.push("/admin/books")
        router.refresh()
      } else {
        console.log(`Kitap eklenirken bir hata oluştu: ${data.error || 'Bilinmeyen hata'}`)
      }
    } catch (error) {
      console.log(`Bir hata oluştu: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/books">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Yeni Kitap Ekle
            </h1>
            <p className="text-muted-foreground mt-1">
              Kütüphaneye yeni kitap ekleyin
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Kitap Bilgileri</CardTitle>
            <CardDescription>
              Tüm alanları eksiksiz doldurun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Kitap Adı *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Yazar *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Tür</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Örn: Roman, Şiir, Deneme"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Yayın Yılı</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                    placeholder="2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageCount">Sayfa Sayısı</Label>
                  <Input
                    id="pageCount"
                    type="number"
                    value={formData.pageCount}
                    onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                    placeholder="350"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Kitap hakkında kısa bir açıklama..."
                />
              </div>

              <ImageUpload
                label="Kapak Görseli"
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: convertDriveLink(url) })}
                id="coverImage"
                placeholder="URL girin veya bilgisayar/telefonunuzdan dosya yükleyin"
                helperText="📱 Telefondan veya bilgisayardan resim yükleyebilir, URL girebilir veya Google Drive linki ekleyebilirsiniz"
              />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Ödünç Alınabilir</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Öne Çıkan</span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/books">İptal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
