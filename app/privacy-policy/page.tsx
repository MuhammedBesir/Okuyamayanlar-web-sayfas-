"use client"


import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, UserCheck, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function PrivacyPolicyPage() {
  const { data: session } = useSession()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const el = contentRef.current
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      const progress = (scrollTop / scrollHeight) * 100
      setScrollProgress(progress)
      setHasScrolledToBottom(progress > 90)
    }
    const el = contentRef.current
    if (el) {
      el.addEventListener("scroll", handleScroll)
      return () => el.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleAccept = () => {
    window.postMessage({ type: "PRIVACY_ACCEPTED" }, "*")
    window.location.href = "/auth/signup?privacy=accepted"
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      {!session && (
        <div className="fixed top-0 left-0 w-full h-2 bg-muted z-50">
          <div className="h-2 bg-primary transition-all" style={{ width: `${scrollProgress}%` }} />
        </div>
      )}
      <div className="mb-8 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Gizlilik Politikası</h1>
        <p className="text-muted-foreground">
          Son güncelleme: 24 Ekim 2025
        </p>
      </div>

  <div ref={contentRef} className="space-y-6 overflow-y-auto max-h-[70vh]">
        {/* Giriş */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              1. Giriş
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Okuyamayanlar Kitap Kulübü olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. 
              Bu gizlilik politikası, platformumuzu kullanırken toplanan kişisel bilgilerinizin nasıl 
              işlendiğini, saklandığını ve korunduğunu açıklamaktadır.
            </p>
            <p>
              Platformumuzu kullanarak, bu gizlilik politikasında belirtilen şartları kabul etmiş olursunuz.
            </p>
          </CardContent>
        </Card>

        {/* Toplanan Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              2. Toplanan Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.1. Kişisel Bilgiler</h3>
              <p>Kayıt sırasında şu bilgileri toplarız:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Ad ve soyad</li>
                <li>E-posta adresi</li>
                <li>Şifre (şifrelenmiş olarak saklanır)</li>
                <li>Profil fotoğrafı (isteğe bağlı)</li>
                <li>Biyografi ve sosyal medya hesapları (isteğe bağlı)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.2. Kullanım Bilgileri</h3>
              <p>Platformu kullanırken otomatik olarak şu bilgiler toplanır:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>IP adresi</li>
                <li>Tarayıcı türü ve sürümü</li>
                <li>Ziyaret edilen sayfalar</li>
                <li>Tıklama ve gezinme aktiviteleri</li>
                <li>Oturum açma zamanları</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.3. İçerik Bilgileri</h3>
              <p>Platformda oluşturduğunuz içerikler:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Kitap yorumları ve puanları</li>
                <li>Forum gönderileri ve yorumlar</li>
                <li>Etkinlik yorumları ve fotoğrafları</li>
                <li>Okuma listeleri</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Bilgilerin Kullanımı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              3. Bilgilerin Kullanımı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Toplanan bilgiler şu amaçlarla kullanılır:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hesap oluşturma ve yönetimi</li>
              <li>Platform hizmetlerinin sunulması</li>
              <li>Kullanıcı deneyiminin iyileştirilmesi</li>
              <li>Önerilen içeriklerin kişiselleştirilmesi</li>
              <li>Güvenlik ve dolandırıcılığın önlenmesi</li>
              <li>İstatistik ve analiz çalışmaları</li>
              <li>Etkinlik ve duyuru bildirimleri</li>
              <li>Kullanıcı desteği sağlanması</li>
            </ul>
          </CardContent>
        </Card>

        {/* Bilgi Paylaşımı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              4. Bilgi Paylaşımı ve Güvenlik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">4.1. Üçüncü Taraflarla Paylaşım</h3>
              <p>Kişisel bilgileriniz şu durumlar dışında üçüncü taraflarla paylaşılmaz:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Yasal zorunluluklar ve mahkeme kararları</li>
                <li>Platformun güvenliğini sağlamak için gerekli durumlar</li>
                <li>Açık rızanızın bulunduğu durumlar</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">4.2. Güvenlik Önlemleri</h3>
              <p>Verilerinizi korumak için aldığımız önlemler:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Şifrelerin hash&apos;lenerek saklanması</li>
                <li>SSL/TLS şifreleme ile veri transferi</li>
                <li>Düzenli güvenlik denetimleri</li>
                <li>Yetkisiz erişimlere karşı koruma</li>
                <li>Güvenli veritabanı yapılandırması</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Çerezler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              5. Çerezler (Cookies)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. 
              Çerezler hakkında detaylı bilgi için{" "}
              <a href="/cookie-policy" className="text-primary hover:underline font-semibold">
                Çerez Politikası
              </a>
              &apos;nı inceleyebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Kullanıcı Hakları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              6. Kullanıcı Hakları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verileriniz hakkında bilgi talep etme</li>
              <li>Verilerin işlenme amacını ve kullanımını öğrenme</li>
              <li>Yanlış veya eksik verilerin düzeltilmesini isteme</li>
              <li>Belirli şartlar çerçevesinde verilerin silinmesini isteme</li>
              <li>Hesabınızı ve tüm verilerinizi kalıcı olarak silme</li>
              <li>Yapılan işlemlere itiraz etme</li>
            </ul>
            <p className="mt-4">
              Bu haklarınızı kullanmak için{" "}
              <a href="mailto:okuyamayanlar2022@gmail.com" className="text-primary hover:underline font-semibold">
                okuyamayanlar2022@gmail.com
              </a>
              {" "}adresinden bizimle iletişime geçebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Veri Saklama */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              7. Veri Saklama Süresi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Kişisel verileriniz, işleme amaçları için gerekli olan süre boyunca saklanır. 
              Hesabınızı sildiğinizde, yasal zorunluluklar hariç tüm verileriniz sistemden kalıcı olarak silinir.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Aktif hesap verileri: Hesap silinene kadar</li>
              <li>Silinen hesap verileri: 30 gün içinde kalıcı olarak silinir</li>
              <li>Log kayıtları: 1 yıl süreyle saklanır</li>
            </ul>
          </CardContent>
        </Card>

        {/* Değişiklikler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              8. Politika Değişiklikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Bu gizlilik politikası gerektiğinde güncellenebilir. Önemli değişiklikler olduğunda, 
              kayıtlı e-posta adresinize bildirim gönderilecektir. Politikayı düzenli olarak gözden 
              geçirmenizi öneririz.
            </p>
          </CardContent>
        </Card>

        {/* İletişim */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              9. İletişim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Gizlilik politikamız hakkında sorularınız veya talepleriniz için:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="font-semibold text-foreground mb-2">Okuyamayanlar Kitap Kulübü</p>
              <p>Eskişehir Teknik Üniversitesi</p>
              <p>Telefon: 0553 189 83 95</p>
              <p>E-posta: okuyamayanlar2022@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Accept Button - Scroll ile onaylama - Sadece giriş yapmamış kullanıcılar için */}
      {!session && (
        <div className="sticky bottom-4 z-40 flex justify-center">
          <Card className="border-2 border-primary shadow-lg w-full max-w-lg mx-auto">
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                {hasScrolledToBottom ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Shield className="h-6 w-6 text-primary" />
                )}
                <div>
                  <p className="font-semibold">
                    {hasScrolledToBottom ? "Gizlilik Politikasını Okudum" : "Lütfen Aşağı Kaydırın"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hasScrolledToBottom ? "Onaylayıp kayıt sayfasına dönebilirsiniz" : `İlerleme: ${Math.round(scrollProgress)}%`}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAccept}
                disabled={!hasScrolledToBottom}
                size="lg"
                className="w-full"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Onaylıyorum
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
