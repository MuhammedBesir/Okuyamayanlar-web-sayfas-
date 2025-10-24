// Type definitions for Google Maps JavaScript API
// This is a simplified version to avoid conflicts with @types/google.maps

declare global {
  interface Window {
    google?: {
      maps?: {
        Map: any
        Marker: any
        LatLng: any
        Animation?: {
          BOUNCE: number
          DROP: number
        }
      }
    }
  }
}

export {}
