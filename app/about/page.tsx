"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Target, Heart, Calendar, Award, Sparkles, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const timelineEvents = [
  {
    year: "2022",
    title: "Kulübün Kuruluşu",
    description: "Eskişehir Teknik Üniversitesi öğrencilerinin girişimiyle Okuyamayanlar Kitap Kulübü kuruldu.",
    icon: Sparkles,
  },
  {
    year: "2022",
    title: "İlk Etkinlik",
    description: "İlk kitap tartışma etkinliğimizi gerçekleştirdik ve 50+ katılımcı ile büyük ilgi gördük.",
    icon: BookOpen,
  },
  {
    year: "2023",
    title: "İlk Yazar Söyleşisi",
    description: "Ünlü yazarımızı ağırlayarak ilk büyük söyleşi etkinliğimizi düzenledik.",
    icon: Users,
  },
  {
    year: "2024",
    title: "Mühendislik kantininde Kütüphanemiz Açıldı",
    description: "100+ kitaptan oluşan fiziksel kütüphanemizi üyelerimizin kullanımına açtık.",
    icon: BookOpen,
  },
  {
    year: "2024",
    title: "100. Üye",
    description: "Büyük bir başarıyla 100. üyemize ulaştık ve genişleme sürecini başlattık.",
    icon: TrendingUp,
  },
  {
    year: "2025",
    title: "Online Platform",
    description: "Modern web platformumuzu hayata geçirerek dijital dönüşümü tamamladık.",
    icon: Sparkles,
  },

]

export default function AboutPage() {
  const { data: session } = useSession()
  
  return (
    <div className="container py-8 md:py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-12 md:mb-20"
      >
        <div className="inline-block mb-3 md:mb-4">
          <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
            2022&apos;den beri faaliyet gösteriyoruz
          </span>
        </div>
        <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent px-4">
          Okuyamayanlar Kitap Kulübü
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
          Eskişehir Teknik Üniversitesi&apos;nde kurulan kulübümüz, kitap severleri bir araya getirerek
          okuma kültürünü yaygınlaştırmayı ve edebiyat sevgisini paylaşmayı amaçlamaktadır.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <Target className="h-6 md:h-8 w-6 md:w-8 mb-2 text-primary" />
            <CardTitle className="text-lg md:text-xl">Misyonumuz</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <p className="text-muted-foreground text-sm md:text-base">
              Okuma kültürünü yaygınlaştırmak, edebiyat sevgisini artırmak ve
              kitapseverleri bir araya getirerek zengin bir paylaşım ortamı oluşturmak.
              Her yaştan insanın kitapla buluşmasını sağlamak en büyük hedefimizdir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <Heart className="h-6 md:h-8 w-6 md:w-8 mb-2 text-primary" />
            <CardTitle className="text-lg md:text-xl">Vizyonumuz</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <p className="text-muted-foreground text-sm md:text-base">
              Türkiye&apos;nin en büyük ve en aktif kitap kulübü olmak. Edebiyat sevgisini
              toplumun her kesimine yaymak ve okuma alışkanlığının artmasına öncülük etmek.
              Gelecek nesillere kitap sevgisini aktarmak.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900 rounded-xl md:rounded-2xl p-6 md:p-10 mb-12 md:mb-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div>
            <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 text-amber-600 dark:text-amber-400">200+</div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Üye</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 text-amber-600 dark:text-amber-400">100+</div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Kitap</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 text-amber-600 dark:text-amber-400">85+</div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Etkinlik</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 text-amber-600 dark:text-amber-400">3+</div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Yıl Tecrübe</div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 md:mb-12 px-4"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Yolculuğumuz</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            2022&apos;den bugüne nasıl büyüdüğümüzü ve geliştirdiğimiz projeleri keşfedin
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6 md:pl-8 pb-8 md:pb-10 border-l-2 border-amber-200 dark:border-amber-900 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-background shadow-lg" />
              
              {/* Content */}
              <div className="bg-card hover:bg-accent/50 transition-colors rounded-xl p-4 md:p-6 shadow-md border-2 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-xl transition-all">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900 flex items-center justify-center shadow-sm">
                    <event.icon className="h-5 md:h-6 w-5 md:w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm md:text-base font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-full">
                        {event.year}
                      </span>
                      <h3 className="text-base md:text-lg font-bold">{event.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed break-words">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What We Do */}
      <div className="mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8 md:mb-12 px-4"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Neler Yapıyoruz?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Üyelerimize sunduğumuz aktiviteler ve etkinlikler
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardHeader className="p-4 md:p-6">
                <BookOpen className="h-8 md:h-10 w-8 md:w-10 mb-2 md:mb-3 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-lg md:text-xl">Kitap Tartışmaları</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Düzenli olarak kitap okuma grupları oluşturarak, okuduğumuz eserleri
                  tartışıyor ve farklı bakış açıları geliştiriyoruz.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardHeader className="p-4 md:p-6">
                <Users className="h-8 md:h-10 w-8 md:w-10 mb-2 md:mb-3 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-lg md:text-xl">Yazar Söyleşileri</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Ünlü yazarları ağırlayarak, yazma süreçleri ve eserler hakkında
                  ilham verici sohbetler gerçekleştiriyoruz.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardHeader className="p-4 md:p-6">
                <Heart className="h-8 md:h-10 w-8 md:w-10 mb-2 md:mb-3 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-lg md:text-xl">Sosyal Etkinlikler</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Felsefi tartışmalar, kahve sohbetleri ve kültürel geziler
                  düzenleyerek topluluğumuzu güçlendiriyoruz.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* CTA - Only show if user is not logged in */}
      {!session && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl md:rounded-2xl p-6 md:p-12 border border-amber-200 dark:border-amber-900"
        >
          <Sparkles className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-3 md:mb-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Bize Katılın!</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-lg leading-relaxed px-4">
            Okuyamayanlar Kitap Kulübü ailesinin bir parçası olmak ve bu güzel yolculukta 
            bizimle birlikte ilerlemek ister misiniz?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white h-10 md:h-11 text-sm md:text-base" asChild>
              <Link href="/auth/signup">
                <Users className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                Üye Ol
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-amber-300 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/50 h-10 md:h-11 text-sm md:text-base" asChild>
              <Link href="/events">
                <Calendar className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                Etkinliklere Göz At
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
