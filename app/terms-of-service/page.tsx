"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, Users, CheckCircle2, Shield } from "lucide-react"

export default function TermsOfServicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSignup = searchParams.get('from') === 'signup'
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      const totalScroll = documentHeight - windowHeight
      const currentProgress = (scrollTop / totalScroll) * 100
      
      setScrollProgress(currentProgress)
      
      // Kullanıcı %90'a ulaştıysa kabul edilmiş sayılsın
      if (currentProgress >= 90) {
        setHasScrolledToBottom(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAccept = () => {
    if (fromSignup) {
      // Opener window'a mesaj gönder
      if (window.opener) {
        window.opener.postMessage({ type: 'TERMS_ACCEPTED' }, window.location.origin)
        window.close()
      } else {
        // Eğer yeni sekmede açılmışsa kayıt sayfasına yönlendir
        router.push('/auth/signup?terms=accepted')
      }
    } else {
      router.back()
    }
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      {fromSignup && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <div className="container max-w-4xl py-8 md:py-12">
        <div className="mb-8 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kullanım Şartları</h1>
          <p className="text-muted-foreground">
            Son güncelleme: 24 Ekim 2025
          </p>
        </div>

        <div className="space-y-6">
        {/* Giriş */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              1. Genel Hükümler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Bu kullanım şartları, Okuyamayanlar Kitap Kulübü platformunu kullanan tüm 
              kullanıcılar için geçerlidir. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.
            </p>
            <p>
              Platformumuz, Eskişehir Teknik Üniversitesi&apos;nde faaliyet gösteren Okuyamayanlar 
              Kitap Kulübü tarafından işletilmektedir.
            </p>
          </CardContent>
        </Card>

        {/* Üyelik */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              2. Üyelik ve Hesap Güvenliği
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.1. Hesap Oluşturma</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Platformu kullanmak için hesap oluşturmanız gerekmektedir</li>
                <li>Kayıt sırasında doğru ve güncel bilgiler vermeniz zorunludur</li>
                <li>18 yaşından küçükler ebeveyn izni ile üye olabilir</li>
                <li>Bir kişi yalnızca bir hesap oluşturabilir</li>
                <li>Sahte hesap oluşturmak yasaktır</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.2. Hesap Güvenliği</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Şifrenizi gizli tutmaktan siz sorumlusunuz</li>
                <li>Hesabınızda gerçekleşen tüm faaliyetlerden sorumlusunuz</li>
                <li>Şüpheli bir durum fark ederseniz derhal bizimle iletişime geçin</li>
                <li>Hesabınızı başkalarıyla paylaşmayın</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* İzin Verilen Kullanım */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              3. İzin Verilen Kullanım
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Platformu şu amaçlarla kullanabilirsiniz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kitapları keşfetmek ve kitap hakkında bilgi edinmek</li>
              <li>Kitap yorumları ve puanları paylaşmak</li>
              <li>Forum tartışmalarına katılmak</li>
              <li>Etkinlikleri takip etmek ve katılmak</li>
              <li>Okuma listesi oluşturmak</li>
              <li>Diğer kitapseverlerle iletişim kurmak</li>
              <li>Rozet ve başarılar kazanmak</li>
            </ul>
          </CardContent>
        </Card>

        {/* Yasaklanan Davranışlar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              4. Yasaklanan Davranışlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Spam içerik paylaşmak</li>
              <li>Hakaret, küfür ve aşağılayıcı ifadeler kullanmak</li>
              <li>Pornografik veya uygunsuz içerik paylaşmak</li>
              <li>Telif hakkı ihlali yapan içerikler paylaşmak</li>
              <li>Başkalarının kişisel bilgilerini paylaşmak</li>
              <li>Dolandırıcılık veya yanıltıcı faaliyetler</li>
              <li>Platformun güvenliğini tehdit etmek</li>
              <li>Bot veya otomatik araçlar kullanmak</li>
              <li>Sahte hesap oluşturmak veya kimliğe bürünmek</li>
              <li>Ticari amaçlı reklam yapmak (izin alınmadan)</li>
              <li>Nefret söylemi veya ayrımcılık yapmak</li>
              <li>Sistemi manipüle etmeye çalışmak</li>
            </ul>
          </CardContent>
        </Card>

        {/* İçerik Politikası */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              5. İçerik Politikası
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">5.1. Kullanıcı İçeriği</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Paylaştığınız içeriklerden siz sorumlusunuz</li>
                <li>İçerikleriniz kamu tarafından görülebilir</li>
                <li>Platformda yayınladığınız içeriklerin kullanım hakkını bize vermiş olursunuz</li>
                <li>Uygunsuz içerikler moderasyon ekibi tarafından kaldırılabilir</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">5.2. Telif Hakları</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Yalnızca size ait veya kullanma hakkınız olan içerikleri paylaşın</li>
                <li>Başkalarının telif haklarına saygı gösterin</li>
                <li>Kitap özetleri kısa ve bilgilendirici olmalıdır</li>
                <li>Telif hakkı ihlali bildirimleri ciddiyetle değerlendirilir</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Moderasyon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              6. Moderasyon ve Yaptırımlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">6.1. Moderasyon</h3>
              <p>
                Platformumuz, kullanıcı deneyimini korumak için moderasyon yapma hakkını saklı tutar:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>İçerikleri inceleme ve kaldırma</li>
                <li>Kullanıcıları uyarma</li>
                <li>Hesapları geçici veya kalıcı olarak askıya alma</li>
                <li>Kullanıcıları platformdan yasaklama</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">6.2. İhlal Bildirimi</h3>
              <p>
                Kullanım şartlarını ihlal eden içerik veya kullanıcıları bildirebilirsiniz. 
                Tüm bildirimler incelenir ve gerekli işlemler yapılır.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kitap Ödünç Alma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              7. Kitap Ödünç Alma Sistemi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kulübümüzden fiziksel kitap ödünç alabilirsiniz</li>
              <li>Ödünç alma süresi maksimum 30 gündür</li>
              <li>Kitapları zamanında iade etmekten sorumlusunuz</li>
              <li>Kayıp veya hasarlı kitaplar için tazminat ödenmelidir</li>
              <li>Sürekli geç iade eden kullanıcıların ödünç alma hakkı kısıtlanabilir</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sorumluluk Reddi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              8. Sorumluluk Reddi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Platform &quot;olduğu gibi&quot; sunulmaktadır</li>
              <li>Kesintisiz ve hatasız çalışma garanti edilmez</li>
              <li>Kullanıcı içeriklerinin doğruluğundan sorumlu değiliz</li>
              <li>Üçüncü taraf bağlantılardan sorumlu değiliz</li>
              <li>Veri kaybı durumunda sorumluluk kabul etmeyiz</li>
              <li>Kullanıcılar arası anlaşmazlıklardan sorumlu değiliz</li>
            </ul>
          </CardContent>
        </Card>

        {/* Değişiklikler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              9. Şartlarda Değişiklik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Bu kullanım şartları gerektiğinde güncellenebilir. Önemli değişiklikler 
              platformda duyurulacak ve e-posta ile bildirilecektir. Değişikliklerden 
              sonra platformu kullanmaya devam ederseniz, yeni şartları kabul etmiş sayılırsınız.
            </p>
          </CardContent>
        </Card>

        {/* Hesap İptali */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              10. Hesap İptali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">10.1. Kullanıcı Tarafından</h3>
              <p>
                Hesabınızı istediğiniz zaman profil ayarlarından silebilirsiniz. 
                Hesap silme işlemi geri alınamaz.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">10.2. Platform Tarafından</h3>
              <p>
                Kullanım şartlarını ihlal eden hesaplar uyarı almaksızın kapatılabilir. 
                Bu durumda hesap ve içeriklerinize erişim kaybedilir.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Uygulanacak Hukuk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              11. Uygulanacak Hukuk ve Yetkili Mahkeme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Bu sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Sözleşmeden doğabilecek 
              her türlü uyuşmazlıkta Eskişehir Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </CardContent>
        </Card>

        {/* İletişim */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              12. İletişim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Kullanım şartları hakkında sorularınız için:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="font-semibold text-foreground mb-2">Okuyamayanlar Kitap Kulübü</p>
              <p>Eskişehir Teknik Üniversitesi</p>
              <p>Telefon: 0553 189 83 95</p>
              <p>E-posta: okuyamayanlar2022@gmail.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Accept Button - Kayıt sayfasından gelindiyse */}
        {fromSignup && (
          <Card className="sticky bottom-4 border-2 border-primary shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {hasScrolledToBottom ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <Shield className="h-6 w-6 text-primary flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {hasScrolledToBottom 
                        ? "Kullanım Şartlarını Okudum" 
                        : "Lütfen Aşağı Kaydırın"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hasScrolledToBottom 
                        ? "Şartları onaylayıp kayıt sayfasına dönebilirsiniz" 
                        : `İlerleme: ${Math.round(scrollProgress)}%`
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAccept}
                  disabled={!hasScrolledToBottom}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Onaylıyorum
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </>
  )
}
