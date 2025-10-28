"use client"

import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink } from "lucide-react"
import { loadGoogleMapsScript } from "@/lib/google-maps-loader"

interface MapLocationPickerProps {
  latitude: string
  longitude: string
  onLocationChange: (lat: string, lng: string) => void
}

export default function MapLocationPicker({ latitude, longitude, onLocationChange }: MapLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  // Default location: Eskişehir
  const defaultLat = 39.7767
  const defaultLng = 30.5206

  // Load Google Maps Script (only once globally)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      console.warn('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file')
      return
    }

    loadGoogleMapsScript(
      apiKey,
      () => setIsScriptLoaded(true),
      () => console.error('Failed to load Google Maps script. Please check your API key and internet connection.')
    )
  }, [])

  // Initialize Map
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || map) return
    if (typeof window === 'undefined' || !(window as any).google) return

    const google = (window as any).google
    const lat = parseFloat(latitude) || defaultLat
    const lng = parseFloat(longitude) || defaultLng

    const newMap = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    // Use legacy Marker (simpler and still supported)
    const newMarker = new google.maps.Marker({
      position: { lat, lng },
      map: newMap,
      draggable: true,
      animation: google.maps.Animation?.DROP,
    })

    // Map click event
    newMap.addListener('click', (e: any) => {
      if (e.latLng) {
        const newLat = e.latLng.lat()
        const newLng = e.latLng.lng()
        newMarker.setPosition(e.latLng)
        onLocationChange(newLat.toFixed(6), newLng.toFixed(6))
      }
    })

    // Marker drag event
    newMarker.addListener('dragend', (e: any) => {
      if (e.latLng) {
        const newLat = e.latLng.lat()
        const newLng = e.latLng.lng()
        onLocationChange(newLat.toFixed(6), newLng.toFixed(6))
      }
    })

    setMap(newMap)
    setMarker(newMarker)
  }, [isScriptLoaded, mapRef.current])

  // Update marker when coordinates change externally
  useEffect(() => {
    if (!map || !marker) return
    
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    
    if (!isNaN(lat) && !isNaN(lng)) {
      const newPos = { lat, lng }
      marker.setPosition(newPos)
      map.panTo(newPos)
    }
  }, [latitude, longitude, map, marker])

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6)
          const lng = position.coords.longitude.toFixed(6)
          onLocationChange(lat, lng)
        },
        (error) => {
          console.error('Konum bilgisi alınamadı:', error.message)
        }
      )
    } else {
      console.error('Tarayıcınız konum servislerini desteklemiyor')
    }
  }

  const hasLocation = latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          📍 Haritadan Konum Seç
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
          >
            Konumumu Kullan
          </Button>
          {hasLocation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onLocationChange("", "")}
            >
              Temizle
            </Button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg border-2 border-dashed border-primary/30 overflow-hidden bg-muted"
        style={{ minHeight: '400px' }}
      >
        {!isScriptLoaded && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Harita yükleniyor...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground flex items-start gap-2">
          <span className="text-primary font-bold">💡</span>
          <span>
            <strong>Haritaya tıklayın</strong> veya <strong>markeri sürükleyin</strong> konum seçmek için
          </span>
        </p>
        {hasLocation && (
          <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-400 font-medium mb-1">✅ Konum Seçildi</p>
            <p className="text-xs text-green-600 dark:text-green-500">
              <strong>Enlem:</strong> {latitude} | <strong>Boylam:</strong> {longitude}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
            >
              <ExternalLink className="h-3 w-3" />
              Google Maps&apos;te Kontrol Et
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
