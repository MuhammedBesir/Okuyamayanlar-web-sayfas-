// Çizgi film karakteri avatarları
export const CARTOON_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Trouble&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Milo&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jasper&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Trouble&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Milo&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Jasper&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Trouble&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Trouble&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jasper&backgroundColor=ffdfbf",
]

// Kullanıcı adına veya email'e göre tutarlı avatar seç
export function getCartoonAvatar(identifier: string): string {
  if (!identifier) {
    return CARTOON_AVATARS[0]
  }
  
  // String'i sayıya çevir (basit hash fonksiyonu)
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Pozitif sayı yap ve avatar listesinden birini seç
  const index = Math.abs(hash) % CARTOON_AVATARS.length
  return CARTOON_AVATARS[index]
}

// DiceBear API ile dinamik avatar oluştur
export function generateCartoonAvatar(seed: string, style: 'bottts' | 'avataaars' | 'big-smile' | 'adventurer' | 'fun-emoji' = 'avataaars'): string {
  const colors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'a8e6cf', 'ffd3b6', 'ffaaa5', 'ff8b94']
  const colorIndex = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${colors[colorIndex]}`
}
