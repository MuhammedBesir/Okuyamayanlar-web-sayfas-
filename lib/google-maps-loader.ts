// Global state for Google Maps script loading
let isGoogleMapsLoading = false
let isGoogleMapsLoaded = false

export function useGoogleMapsScript() {
  if (typeof window === 'undefined') {
    return { isLoaded: false, isLoading: false }
  }

  // Check if already loaded
  if ((window as any).google?.maps) {
    isGoogleMapsLoaded = true
    return { isLoaded: true, isLoading: false }
  }

  return {
    isLoaded: isGoogleMapsLoaded,
    isLoading: isGoogleMapsLoading
  }
}

export function loadGoogleMapsScript(apiKey: string, onLoad?: () => void, onError?: () => void) {
  // Already loaded
  if ((window as any).google?.maps) {
    isGoogleMapsLoaded = true
    onLoad?.()
    return
  }

  // Already loading
  if (isGoogleMapsLoading) {
    // Wait for existing script to load
    const checkInterval = setInterval(() => {
      if ((window as any).google?.maps) {
        clearInterval(checkInterval)
        onLoad?.()
      }
    }, 100)
    
    setTimeout(() => clearInterval(checkInterval), 10000)
    return
  }

  // Check if script tag already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
  if (existingScript) {
    isGoogleMapsLoading = true
    const checkInterval = setInterval(() => {
      if ((window as any).google?.maps) {
        isGoogleMapsLoaded = true
        isGoogleMapsLoading = false
        clearInterval(checkInterval)
        onLoad?.()
      }
    }, 100)
    
    setTimeout(() => {
      clearInterval(checkInterval)
      isGoogleMapsLoading = false
    }, 10000)
    return
  }

  // Load new script
  isGoogleMapsLoading = true
  
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
  script.async = true
  script.defer = true
  script.id = 'google-maps-script'
  
  script.onload = () => {
    isGoogleMapsLoaded = true
    isGoogleMapsLoading = false
    onLoad?.()
  }
  
  script.onerror = () => {
    isGoogleMapsLoading = false
    console.error('Failed to load Google Maps script')
    onError?.()
  }
  
  document.head.appendChild(script)
}
