"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import Link from "next/link"
import MapLocationPicker from "@/components/map-location-picker"

const eventTypes = [
  "Söyleşi",
  "Kitap Ortağım",
  "Kafamda Deli Sorular",
  "Kitap Kahve",
  "Kitap Değişim",
  "Yazar Buluşması",
  "Diğer"
]

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

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    locationLat: "",
    locationLng: "",
    isOnline: false,
    startDate: "",
    time: "",
    eventType: "",
    image: "",
    maxAttendees: "",
    status: "UPCOMING"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Google Drive linkini dönüştür
      const processedData = {
        ...formData,
        image: convertDriveLink(formData.image)
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      })

      if (response.ok) {
        router.push('/admin/events')
        router.refresh()
      } else {
        alert('Etkinlik eklenirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Etkinlik eklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2">Yeni Etkinlik Ekle</h1>
          <p className="text-muted-foreground">
            Topluluk için yeni bir etkinlik oluşturun
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Etkinlik Bilgileri</CardTitle>
            <CardDescription>
              Etkinlik detaylarını doldurun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Etkinlik Başlığı *</Label>
                <Input
                  id="title"
                  placeholder="Örn: Söyleşi: Edebiyatta Kadın Kahramanlar"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama *</Label>
                <textarea
                  id="description"
                  placeholder="Etkinlik hakkında detaylı bilgi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
                  required
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType">Etkinlik Türü *</Label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Seçiniz...</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tarih *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Saat Aralığı</Label>
                  <Input
                    id="time"
                    placeholder="Örn: 14:00 - 16:00"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Mekan *</Label>
                <Input
                  id="location"
                  placeholder="Örn: Merkez Kütüphane veya Online (Zoom)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* Location Coordinates (Optional) */}
              {!formData.isOnline && (
                <MapLocationPicker
                  latitude={formData.locationLat}
                  longitude={formData.locationLng}
                  onLocationChange={(lat, lng) => 
                    setFormData({ ...formData, locationLat: lat, locationLng: lng })
                  }
                />
              )}

              {/* Is Online */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="isOnline" className="cursor-pointer">
                  Bu etkinlik online olarak gerçekleşecek
                </Label>
              </div>

              {/* Max Attendees */}
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maksimum Katılımcı</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  placeholder="Örn: 50"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Boş bırakılırsa sınırsız katılımcı kabul edilir
                </p>
              </div>

              {/* Event Image */}
              <ImageUpload
                label="Etkinlik Görseli"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                id="image"
                placeholder="URL girin veya bilgisayar/telefonunuzdan dosya yükleyin"
                helperText="📱 Telefondan veya bilgisayardan resim yükleyebilir, URL girebilir veya Google Drive linki ekleyebilirsiniz"
              />

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="UPCOMING">Yaklaşan</option>
                  <option value="ONGOING">Devam Ediyor</option>
                  <option value="COMPLETED">Tamamlandı</option>
                  <option value="CANCELLED">İptal Edildi</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Kaydediliyor..." : "Etkinliği Kaydet"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/events')}
                  disabled={loading}
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
