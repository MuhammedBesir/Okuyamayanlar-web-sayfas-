"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Yaygın e-posta sağlayıcıları (SADECE BUNLAR KABUL EDİLİR)
const TRUSTED_EMAIL_DOMAINS = [
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'windowslive.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.com.tr',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Güvenli mail servisleri
  'protonmail.com', 'proton.me',
  'tutanota.com', 'tutanota.de',
  // Diğer yaygın servisler
  'aol.com',
  'zoho.com',
  'mail.com',
  'gmx.com', 'gmx.de', 'gmx.net',
  // Yandex
  'yandex.com', 'yandex.ru', 'yandex.com.tr',
  // Türkiye yaygın servisler
  'hotmail.com.tr',
  'mynet.com',
  // Üniversite alan adları (tüm .edu.tr ve .edu uzantıları)
  // Not: Bu alan adları özel kontrol edilecek
]

// Üniversite ve eğitim kurumu email'lerini kontrol et
const isEducationalEmail = (domain: string): boolean => {
  return domain.endsWith('.edu.tr') || 
         domain.endsWith('.edu') || 
         domain.includes('university') ||
         domain.includes('universite')
}

const validateEmail = (email: string): { valid: boolean; message?: string } => {
  // Temel email formatı kontrolü
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Geçerli bir e-posta adresi giriniz" }
  }

  // Boşluk kontrolü
  if (email.includes(' ')) {
    return { valid: false, message: "E-posta adresi boşluk içeremez" }
  }

  // Domain çıkar
  const domain = email.toLowerCase().split('@')[1]
  
  // Geçici/tek kullanımlık e-posta servislerini engelle
  const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 
    'mailinator.com', 'throwaway.email', 'temp-mail.org',
    'fakemailgenerator.com', 'trashmail.com', 'getnada.com',
    'maildrop.cc', 'sharklasers.com', 'spam4.me',
    'yopmail.com', 'mailnesia.com', 'mintemail.com'
  ]
  
  if (disposableDomains.some(d => domain.includes(d))) {
    return { valid: false, message: "Geçici e-posta adresleri kabul edilmemektedir" }
  }

  // Güvenilir domain kontrolü (KATİ)
  const isTrustedDomain = TRUSTED_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))
  const isEduEmail = isEducationalEmail(domain)
  
  if (!isTrustedDomain && !isEduEmail) {
    return { 
      valid: false, 
      message: `Bu e-posta sağlayıcısı kabul edilmemektedir. Lütfen Gmail, Outlook, Yahoo, iCloud veya üniversite e-postası kullanın.`
    }
  }

  return { valid: true }
}

const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Şifre en az 6 karakter olmalıdır" }
  }
  
  // Daha güçlü şifre kontrolü (isteğe bağlı)
  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  
  if (!hasNumber || !hasLetter) {
    return { valid: false, message: "Şifre hem harf hem rakam içermelidir" }
  }

  return { valid: true }
}

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedCookies, setAcceptedCookies] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setFormData({ ...formData, email: newEmail })
    
    // Email değiştikçe hata mesajını temizle
    if (error && error.includes("e-posta")) {
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Politika onaylarını kontrol et
    if (!acceptedTerms) {
      setError("Kullanım Şartlarını kabul etmelisiniz")
      return
    }

    if (!acceptedPrivacy) {
      setError("Gizlilik Politikasını kabul etmelisiniz")
      return
    }

    if (!acceptedCookies) {
      setError("Çerez Politikasını kabul etmelisiniz")
      return
    }

    // E-posta validasyonu
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      setError(emailValidation.message || "Geçersiz e-posta adresi")
      return
    }

    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor")
      return
    }

    // Şifre güvenlik kontrolü
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || "Şifre gereksinimleri karşılanmıyor")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Kayıt sırasında bir hata oluştu")
        return
      }

      // Başarılı kayıt - email onayı mesajı göster
      if (data.requiresVerification) {
        setSuccess("Kayıt başarılı! E-posta adresinize gönderilen onay linkine tıklayarak hesabınızı aktif edin.")
        // 3 saniye sonra giriş sayfasına yönlendir
        setTimeout(() => {
          router.push("/auth/signin?registered=true")
        }, 3000)
      } else {
        router.push("/auth/signin?registered=true")
      }
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
          <CardDescription>
            Okuyamayanlar Kitap Kulübü&apos;ne katılın
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email Bilgilendirme */}
            <div className="p-3 text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                📧 Kabul edilen e-posta sağlayıcıları:
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Gmail, Outlook, Yahoo, iCloud, Proton Mail, Yandex veya üniversite e-postası (.edu.tr)
              </p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
                {success}
              </div>
            )}
            
            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { 
                callbackUrl: "/",
                redirect: true,
              })}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google ile Kayıt Ol
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  veya
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Kullanıcı Adı
              </label>
              <Input
                id="username"
                placeholder="Ahmet_Yilmaz"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                🔑 Bu kullanıcı adı ile giriş yapacaksınız
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleEmailChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Gmail, Outlook, Yahoo gibi yaygın e-posta servislerini kullanmanızı öneririz
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Şifre
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                En az 6 karakter, hem harf hem rakam içermelidir
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Şifre Tekrar
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* Politika Onayları */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <Link href="/terms-of-service" target="_blank" className="text-primary hover:underline font-medium">
                    Kullanım Şartlarını
                  </Link>
                  {" "}okudum ve kabul ediyorum
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                />
                <Label 
                  htmlFor="privacy" 
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline font-medium">
                    Gizlilik Politikasını
                  </Link>
                  {" "}okudum ve kabul ediyorum
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="cookies" 
                  checked={acceptedCookies}
                  onCheckedChange={(checked) => setAcceptedCookies(checked === true)}
                />
                <Label 
                  htmlFor="cookies" 
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <Link href="/cookie-policy" target="_blank" className="text-primary hover:underline font-medium">
                    Çerez Politikasını
                  </Link>
                  {" "}okudum ve kabul ediyorum
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Giriş Yapın
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
