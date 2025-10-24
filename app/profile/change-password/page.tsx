"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ChangePasswordPage() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Tüm alanları doldurun")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Yeni şifreler eşleşmiyor")
      return
    }

    if (newPassword.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalıdır")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      })

      if (res.ok) {
        setSuccess(true)
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } else {
        const error = await res.json()
        alert(error.error || "Şifre değiştirilemedi")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-6 md:py-8 px-4 max-w-2xl">
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
        <div className="text-center">
          <div className="inline-flex p-3 md:p-4 bg-muted rounded-full mb-3 md:mb-4">
            <Shield className="h-8 md:h-12 w-8 md:w-12 text-foreground" />
          </div>
          <h1 className="text-2xl md:text-5xl font-bold mb-2">
            Şifre Değiştir
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">
            Hesap güvenliğiniz için güçlü bir şifre kullanın
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="border-2">
              <CardContent className="pt-4 md:pt-6 text-center p-4 md:p-6">
                <div className="inline-flex p-3 md:p-4 bg-muted rounded-full mb-3 md:mb-4">
                  <CheckCircle className="h-8 md:h-12 w-8 md:w-12 text-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Şifreniz Değiştirildi!
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Profile sayfasına yönlendiriliyorsunuz...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="border-2">
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 md:p-2 bg-muted rounded-lg">
                  <Lock className="h-4 md:h-5 w-4 md:w-5 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm md:text-base">Yeni Şifre Belirle</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Mevcut şifrenizi doğrulayın ve yeni şifrenizi girin</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Current Password */}
                <div>
                  <Label htmlFor="oldPassword" className="text-sm md:text-base font-semibold">
                    Mevcut Şifre *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Mevcut şifrenizi girin"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pr-10 h-10 md:h-12 text-sm md:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="h-4 md:h-5 w-4 md:w-5" /> : <Eye className="h-4 md:h-5 w-4 md:w-5" />}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4 md:pt-6">
                  <h3 className="text-xs md:text-sm font-semibold mb-3 md:mb-4 text-muted-foreground">YENİ ŞİFRE BİLGİLERİ</h3>
                  
                  {/* New Password */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword" className="text-sm md:text-base font-semibold">
                        Yeni Şifre *
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="En az 6 karakter"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10 h-10 md:h-12 text-sm md:text-base"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="h-4 md:h-5 w-4 md:w-5" /> : <Eye className="h-4 md:h-5 w-4 md:w-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 6 karakter kullanın
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm md:text-base font-semibold">
                        Yeni Şifre Tekrar *
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Yeni şifrenizi tekrar girin"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pr-10 h-10 md:h-12 text-sm md:text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 md:h-5 w-4 md:w-5" /> : <Eye className="h-4 md:h-5 w-4 md:w-5" />}
                        </button>
                      </div>
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">
                          Şifreler eşleşmiyor
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="flex-1 h-10 md:h-12 text-sm md:text-base font-semibold"
                  >
                    <Lock className="h-4 md:h-5 w-4 md:w-5 mr-2" />
                    {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    disabled={loading}
                    className="h-10 md:h-12 text-sm md:text-base"
                  >
                    İptal
                  </Button>
                </div>

                <div className="bg-muted/50 border rounded-lg p-3 md:p-4">
                  <div className="flex gap-2 md:gap-3">
                    <Shield className="h-4 md:h-5 w-4 md:w-5 text-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold mb-1">
                        Güvenlik İpuçları
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Büyük ve küçük harf, rakam ve özel karakter kullanın</li>
                        <li>• Kolay tahmin edilebilecek şifreler kullanmayın</li>
                        <li>• Şifrenizi düzenli olarak değiştirin</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
