# 📚 Okuyamayanlar Kitap Kulübü

Modern ve kullanıcı dostu bir kitap kulübü web uygulaması. Next.js 15, TypeScript, Prisma ve PostgreSQL ile geliştirilmiştir.

## ✨ Özellikler

- 📖 **Kitap Yönetimi**: Kitap ekleme, düzenleme, silme ve ödünç alma sistemi
- 👥 **Kullanıcı Yönetimi**: Kayıt, giriş, profil düzenleme, rozet sistemi
- 💬 **Forum**: Tartışma başlatma, yanıtlama, beğeni sistemi
- 🎉 **Etkinlikler**: Etkinlik oluşturma, katılım, yorumlama, fotoğraf paylaşma
- 📱 **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- 🌙 **Dark Mode**: Karanlık ve aydınlık tema desteği
- 🔐 **Güvenli Authentication**: NextAuth.js ile güvenli kimlik doğrulama
- 📧 **Email Sistemi**: Şifre sıfırlama ve bildirimler
- 🗺️ **Google Maps Entegrasyonu**: Etkinlik konumları
- 🏆 **Rozet Sistemi**: Kullanıcı başarı rozetleri

## 🚀 Teknolojiler

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)

## 📋 Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm veya yarn
- Git

## 🛠️ Kurulum

### 1. Repository'yi Clone Edin

```bash
git clone https://github.com/MuhammedBesir/Okuyamayanlar-web-sayfas-.git
cd Okuyamayanlar-web-sayfas-
```

### 2. Dependencies Yükleyin

```bash
npm install
```

### 3. Environment Variables Ayarlayın

`.env.local.example` dosyasını `.env.local` olarak kopyalayın:

```bash
# Windows
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

Ardından `.env.local` dosyasını düzenleyin ve gerekli değerleri doldurun.

### 4. Database Oluşturun

```bash
# Prisma migration çalıştır
npx prisma migrate dev

# Seed data ekle (opsiyonel)
npm run db:seed
```

### 5. Development Server Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🌐 Deployment

### Vercel'e Deploy (Önerilen)

Detaylı deployment rehberi için:

- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md)

#### Hızlı Başlangıç

```powershell
# Hazırlık script'ini çalıştırın
.\vercel-quickstart.ps1
```

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile bağlanın
3. Repository'nizi seçin
4. Environment variables ekleyin (`.env.example`'dan)
5. Deploy edin!

### Railway'e Deploy

```powershell
.\railway-quickstart.ps1
```

Detaylı rehber: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Admin paneli
│   ├── auth/              # Authentication sayfaları
│   ├── forum/             # Forum sayfaları
│   ├── events/            # Etkinlik sayfaları
│   ├── library/           # Kütüphane sayfaları
│   └── profile/           # Profil sayfaları
├── components/            # React bileşenleri
│   └── ui/               # UI bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
├── prisma/                # Database schema ve migrations
├── public/                # Statik dosyalar
└── types/                 # TypeScript type definitions
```

## 🔧 Scriptler

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint çalıştır
npm run db:push      # Schema'yı database'e push et
npm run db:seed      # Seed data ekle
```

## 🗄️ Database Schema

- **User**: Kullanıcılar ve kimlik doğrulama
- **Book**: Kitap bilgileri
- **Event**: Etkinlikler
- **ForumTopic**: Forum başlıkları
- **ForumReply**: Forum yanıtları
- **Badge**: Kullanıcı rozetleri
- **ReadingList**: Okuma listeleri
- **Notification**: Bildirimler

Detaylı schema için: [prisma/schema.prisma](./prisma/schema.prisma)

## 🔐 Environment Variables

Gerekli environment variables:

### Zorunlu

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Uygulama URL'i
- `NEXTAUTH_SECRET`: NextAuth secret key
- `EMAIL_*`: SMTP email ayarları

### Opsiyonel

- `GOOGLE_CLIENT_ID`: Google OAuth
- `GOOGLE_CLIENT_SECRET`: Google OAuth Secret
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API

Tüm değişkenler için: [.env.example](./.env.example)

## 📧 Email Konfigürasyonu

Gmail App Password oluşturma:

1. [myaccount.google.com](https://myaccount.google.com) > Security
2. 2-Step Verification'ı aktif edin
3. App passwords > Mail için password oluşturun
4. `.env.local` dosyasına ekleyin

## 🎨 Özelleştirme

### Tema Renkleri

`tailwind.config.ts` dosyasından tema renklerini özelleştirebilirsiniz.

### Logo ve Favicon

- Logo: `public/logo.jpg`
- Favicon: `public/favicon.png`

## 🐛 Sorun Giderme

### Build Hataları

```bash
# Dependencies'i yeniden yükle
rm -rf node_modules
npm install

# Build test et
npm run build
```

### Database Bağlantı Hatası

```bash
# Prisma client'i yeniden oluştur
npx prisma generate

# Migration durumunu kontrol et
npx prisma migrate status
```

### Email Gönderilmiyor

- Gmail App Password doğru mu kontrol edin
- 2-Step Verification aktif mi kontrol edin
- SMTP ayarları doğru mu kontrol edin

## 📚 Dokümantasyon

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip

**Okuyamayanlar Kitap Kulübü Geliştirme Ekibi**

## 📞 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**
