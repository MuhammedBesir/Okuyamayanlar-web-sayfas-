"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cookie, Settings, Eye, Shield, CheckCircle, CheckCircle2 } from "lucide-react"

export default function CookiePolicyPage() {
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
        window.opener.postMessage({ type: 'COOKIES_ACCEPTED' }, window.location.origin)
        window.close()
      } else {
        // Eğer yeni sekmede açılmışsa kayıt sayfasına yönlendir
        router.push('/auth/signup?cookies=accepted')
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
          <Cookie className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Çerez Politikası</h1>
          <p className="text-muted-foreground">
            Son güncelleme: 24 Ekim 2025
          </p>
        </div>

        <div className="space-y-6">
        {/* Giriş */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              1. Çerezler Nedir?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Çerezler (cookies), web sitelerini ziyaret ettiğinizde cihazınıza kaydedilen 
              küçük metin dosyalarıdır. Çerezler, web sitesinin daha iyi çalışmasını sağlar 
              ve kullanıcı deneyimini iyileştirir.
            </p>
            <p>
              Okuyamayanlar Kitap Kulübü platformu, kullanıcı deneyimini geliştirmek, 
              platformun işlevselliğini sağlamak ve kullanım istatistiklerini toplamak 
              amacıyla çerezler kullanmaktadır.
            </p>
          </CardContent>
        </Card>

        {/* Çerez Türleri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              2. Kullandığımız Çerez Türleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                2.1. Zorunlu Çerezler
              </h3>
              <p className="mb-2">
                Bu çerezler platformun çalışması için gereklidir ve devre dışı bırakılamazlar:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Oturum Çerezleri:</strong> Giriş yapmış kullanıcıların kimlik doğrulaması</li>
                <li><strong>Güvenlik Çerezleri:</strong> Güvenlik önlemleri ve dolandırıcılığın önlenmesi</li>
                <li><strong>Yük Dengeleme:</strong> Sunucu yükünün dengeli dağıtılması</li>
                <li><strong>CSRF Token:</strong> Cross-site request forgery saldırılarına karşı koruma</li>
              </ul>
              <p className="text-sm mt-2 italic">
                Saklama süresi: Oturum süresi veya maksimum 30 gün
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                2.2. İşlevsel Çerezler
              </h3>
              <p className="mb-2">
                Bu çerezler gelişmiş özellikler ve kişiselleştirme sağlar:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Dil Tercihi:</strong> Seçtiğiniz dil ayarını hatırlar</li>
                <li><strong>Tema Tercihi:</strong> Karanlık/aydınlık mod tercihini saklar</li>
                <li><strong>Sayfa Ayarları:</strong> Sıralama, filtreleme tercihlerinizi saklar</li>
                <li><strong>&quot;Beni Hatırla&quot;:</strong> Otomatik giriş özelliği</li>
              </ul>
              <p className="text-sm mt-2 italic">
                Saklama süresi: 1 yıl
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-600" />
                2.3. Analitik Çerezler
              </h3>
              <p className="mb-2">
                Bu çerezler platformun nasıl kullanıldığını anlamamıza yardımcı olur:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Ziyaret İstatistikleri:</strong> Sayfa görüntülemeleri, oturum süreleri</li>
                <li><strong>Kullanıcı Davranışları:</strong> En çok ziyaret edilen sayfalar</li>
                <li><strong>Hata Takibi:</strong> Teknik sorunların tespit edilmesi</li>
                <li><strong>Performans:</strong> Sayfa yükleme sürelerinin ölçülmesi</li>
              </ul>
              <p className="text-sm mt-2 italic">
                Saklama süresi: 2 yıl
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-600" />
                2.4. Üçüncü Taraf Çerezleri
              </h3>
              <p className="mb-2">
                Platformumuzda kullanılan üçüncü taraf hizmetler:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Google OAuth:</strong> Google ile giriş yapma özelliği</li>
                <li><strong>Google Maps:</strong> Etkinlik konumu gösterimi</li>
                <li><strong>Vercel Analytics:</strong> (Eğer kullanılıyorsa) Performans izleme</li>
              </ul>
              <p className="text-sm mt-2 italic">
                Bu çerezler ilgili hizmet sağlayıcıların politikalarına tabidir.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Çerez Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              3. Detaylı Çerez Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Çerez Adı</th>
                    <th className="p-2 text-left">Amaç</th>
                    <th className="p-2 text-left">Tür</th>
                    <th className="p-2 text-left">Süre</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">next-auth.session-token</td>
                    <td className="p-2">Kullanıcı oturumu</td>
                    <td className="p-2">Zorunlu</td>
                    <td className="p-2">30 gün</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">next-auth.csrf-token</td>
                    <td className="p-2">CSRF koruması</td>
                    <td className="p-2">Zorunlu</td>
                    <td className="p-2">Oturum</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">theme</td>
                    <td className="p-2">Tema tercihi</td>
                    <td className="p-2">İşlevsel</td>
                    <td className="p-2">1 yıl</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">_ga</td>
                    <td className="p-2">Google Analytics</td>
                    <td className="p-2">Analitik</td>
                    <td className="p-2">2 yıl</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Çerez Yönetimi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              4. Çerezleri Nasıl Yönetebilirsiniz?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">4.1. Tarayıcı Ayarları</h3>
              <p>
                Çoğu web tarayıcısı çerezleri otomatik olarak kabul eder, ancak tarayıcı 
                ayarlarınızdan çerezleri kontrol edebilir veya silebilirsiniz:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">4.2. Çerezleri Reddetme</h3>
              <p>
                Zorunlu çerezler dışındaki çerezleri reddetmeyi seçebilirsiniz. Ancak bu durumda 
                platformun bazı özellikleri düzgün çalışmayabilir:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Otomatik giriş yapamayabilirsiniz</li>
                <li>Tercihleriniz hatırlanmayabilir</li>
                <li>Kişiselleştirilmiş deneyim sağlanamayabilir</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Gizlilik */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              5. Gizlilik ve Güvenlik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Çerezler aracılığıyla toplanan veriler, gizlilik politikamıza uygun olarak 
              işlenir ve korunur. Kişisel verileriniz üçüncü taraflarla paylaşılmaz.
            </p>
            <p>
              Çerezler hakkında daha fazla bilgi için{" "}
              <a href="/privacy-policy" className="text-primary hover:underline font-semibold">
                Gizlilik Politikası
              </a>
              &apos;nı inceleyebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Onay */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              6. Çerez Onayı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Platformumuzu kullanarak, bu çerez politikasını kabul etmiş ve çerezlerin 
              kullanılmasına onay vermiş olursunuz. İlk ziyaretinizde çerez bildirimi 
              görüntülenir ve tercihlerinizi belirtebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Değişiklikler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              7. Politika Değişiklikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Bu çerez politikası gerektiğinde güncellenebilir. Önemli değişiklikler 
              platformda duyurulacaktır. Güncel politikayı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </CardContent>
        </Card>

        {/* İletişim */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              8. İletişim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Çerez politikamız hakkında sorularınız için:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="font-semibold text-foreground mb-2">Okuyamayanlar Kitap Kulübü</p>
              <p>Eskişehir Teknik Üniversitesi</p>
              <p>Telefon: 0553 189 83 95</p>
              <p>E-posta: okuyamayanlar2022@gmail.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Bilgi Notu */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Cookie className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-semibold mb-1">💡 Bilgi</p>
                <p>
                  Çerezleri tamamen devre dışı bırakırsanız, platformun bazı özellikleri 
                  çalışmayabilir. En iyi deneyim için en azından zorunlu çerezlerin aktif 
                  olmasını öneririz.
                </p>
              </div>
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
                        ? "Çerez Politikasını Okudum" 
                        : "Lütfen Aşağı Kaydırın"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hasScrolledToBottom 
                        ? "Politikayı onaylayıp kayıt sayfasına dönebilirsiniz" 
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
