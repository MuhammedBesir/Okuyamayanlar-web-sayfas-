"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
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

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    attendeeCount: "",
    status: "UPCOMING"
  })

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events?id=${params.id}`)
      const data = await response.json()
      
      // Convert date to datetime-local format
      const date = new Date(data.startDate)
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)

      setFormData({
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        locationLat: data.locationLat?.toString() || "",
        locationLng: data.locationLng?.toString() || "",
        isOnline: data.isOnline || false,
        startDate: localDate,
        time: data.time || "",
        eventType: data.eventType || "",
        image: data.image || "",
        maxAttendees: data.maxAttendees?.toString() || "",
        attendeeCount: data.attendeeCount?.toString() || "",
        status: data.status || "UPCOMING"
      })
    } catch (error) {
      alert('Etkinlik yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          ...formData
        })
      })

      if (response.ok) {
        router.push('/admin/events')
        router.refresh()
      } else {
        alert('Etkinlik güncellenirken bir hata oluştu')
      }
    } catch (error) {
      alert('Etkinlik güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold mb-2">Etkinliği Düzenle</h1>
          <p className="text-muted-foreground">
            Etkinlik bilgilerini güncelleyin
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Etkinlik Bilgileri</CardTitle>
            <CardDescription>
              Etkinlik detaylarını düzenleyin
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
                    setFormData(prev => ({ ...prev, locationLat: lat, locationLng: lng }))
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Attendee Count (Manual) */}
                <div className="space-y-2">
                  <Label htmlFor="attendeeCount">Gerçekleşen Katılımcı Sayısı</Label>
                  <Input
                    id="attendeeCount"
                    type="number"
                    placeholder="Örn: 45"
                    value={formData.attendeeCount}
                    onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Geçmiş etkinlikler için manuel girilebilir
                  </p>
                </div>
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
                <Button type="submit" className="flex-1" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/events')}
                  disabled={saving}
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
