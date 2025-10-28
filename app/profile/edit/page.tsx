"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Lock, User as UserIcon, Save, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageUpload } from "@/components/image-upload"
import { generateCartoonAvatar } from "@/lib/avatars"

const AVATAR_STYLES = ['bottts', 'avataaars', 'big-smile', 'adventurer', 'fun-emoji'] as const
const AVATAR_SEEDS = ['Felix', 'Aneka', 'Trouble', 'Milo', 'Jasper', 'Lucky', 'Shadow', 'Buddy', 'Max', 'Bella', 'Charlie', 'Luna', 'Rocky', 'Coco', 'Toby', 'Daisy', 'Oliver', 'Ruby', 'Leo', 'Zoe']

// Çizgi film avatarları oluştur - Her stilden 4 avatar
const AVATAR_OPTIONS = AVATAR_STYLES.flatMap(style => 
  AVATAR_SEEDS.slice(0, 4).map(seed => 
    generateCartoonAvatar(seed, style)
  )
)

export default function EditProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [customAvatar, setCustomAvatar] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session) {
      setName(session.user?.name || "")
      setBio((session.user as any)?.bio || "")
      setSelectedAvatar(session.user?.image || "")
    }
  }, [session, status, router])

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      console.log("İsim alanı boş bırakılamaz")
      return
    }

    setLoading(true)
    try {
      const avatarToUse = customAvatar.trim() || selectedAvatar

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          image: avatarToUse
        })
      })

      if (res.ok) {
        // Session'ı güncelle
        await update({
          name: name.trim(),
          image: avatarToUse,
          bio: bio.trim(),
        })
        
        console.log("✓ Profil başarıyla güncellendi!")
        router.push("/profile")
        router.refresh()
      } else {
        const error = await res.json()
        console.log("✗ Hata: " + (error.error || "Profil güncellenemedi"))
      }
    } catch (error) {
      console.log("✗ Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }



  if (status === "loading") {
    return (
      <div className="container py-8 px-4 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="container py-6 md:py-8 px-4 max-w-4xl">
      <Button variant="ghost" className="mb-4 md:mb-6 text-sm md:text-base" asChild>
        <Link href="/profile">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Profile Dön</span>
          <span className="sm:hidden">Geri</span>
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 md:space-y-6"
      >
        <div>
          <h1 className="text-2xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Profili Düzenle
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">
            Profil bilgilerinizi ve ayarlarınızı güncelleyin
          </p>
        </div>

        {/* Profile Picture Selection */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Camera className="h-4 md:h-5 w-4 md:w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-sm md:text-base">Profil Fotoğrafı</CardTitle>
                <CardDescription className="text-xs md:text-sm">Hazır avatarlardan birini seçin veya URL girin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="flex justify-center">
              <Avatar className="h-24 md:h-32 w-24 md:w-32 border-4 border-amber-200 dark:border-amber-800">
                <AvatarImage 
                  src={customAvatar || selectedAvatar || generateCartoonAvatar(session?.user?.email || session?.user?.name || 'user', 'avataaars')} 
                  alt={name} 
                />
                <AvatarFallback className="text-2xl md:text-4xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  {name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <ImageUpload
                label="Özel Avatar Yükle"
                value={customAvatar}
                onChange={(url) => {
                  setCustomAvatar(url)
                  setSelectedAvatar("")
                }}
                id="customAvatar"
                placeholder="URL girin veya bilgisayar/telefonunuzdan dosya yükleyin"
                helperText="📱 Kendi fotoğrafınızı yükleyebilir, URL girebilir veya aşağıdaki hazır avatarlardan birini seçebilirsiniz"
              />
            </div>

            <div>
              <Label className="mb-2 md:mb-3 block text-xs md:text-sm">Veya Hazır Avatarlardan Seçin</Label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
                {AVATAR_OPTIONS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAvatar(avatar)
                      setCustomAvatar("")
                    }}
                    className={`relative aspect-square rounded-full overflow-hidden border-2 md:border-4 transition-all hover:scale-110 ${
                      selectedAvatar === avatar && !customAvatar
                        ? "border-amber-500 shadow-lg scale-110"
                        : "border-transparent hover:border-amber-300"
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserIcon className="h-4 md:h-5 w-4 md:w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-sm md:text-base">Profil Bilgileri</CardTitle>
                <CardDescription className="text-xs md:text-sm">İsim ve biyografi bilgilerinizi güncelleyin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div>
              <Label htmlFor="name" className="text-xs md:text-sm">İsim *</Label>
              <Input
                id="name"
                type="text"
                placeholder="İsminiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-9 md:h-10 text-sm md:text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-xs md:text-sm">Biyografi</Label>
              <textarea
                id="bio"
                placeholder="Kendiniz hakkında kısa bir yazı..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-xs md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {bio.length} / 500 karakter
              </p>
            </div>

            <Button 
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 h-9 md:h-10 text-sm md:text-base"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Kaydediliyor..." : "Profili Kaydet"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Link */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <KeyRound className="h-5 md:h-6 w-5 md:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-lg">Şifre Güvenliği</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Hesabınızı korumak için şifrenizi değiştirin</p>
                </div>
              </div>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-9 md:h-10 text-sm md:text-base w-full sm:w-auto">
                <Link href="/profile/change-password">
                  <Lock className="h-4 w-4 mr-2" />
                  Şifre Değiştir
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
