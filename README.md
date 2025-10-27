# 📚 Okuyamayanlar Kitap Kulübü

Modern, kullanıcı dostu bir kitap kulübü web uygulaması. Next.js 15, TypeScript, Prisma ve PostgreSQL ile geliştirilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql)

---

## ✨ Özellikler

### 👥 Kullanıcı Yönetimi

- ✅ Kayıt olma ve giriş yapma (NextAuth v5)
- ✅ Şifre sıfırlama (email ile)
- ✅ Profil düzenleme
- ✅ Avatar yükleme
- ✅ Kullanıcı seviyeleri ve rozetler
- ✅ Okuma listesi

### 📖 Kitap Kütüphanesi

- ✅ Kitap arama ve filtreleme
- ✅ Kitap detay sayfaları
- ✅ Kitap değerlendirme ve yorumlama
- ✅ "Bu Ayın Kitabı" özelliği
- ✅ Kitap kategorileri
- ✅ Kitap ödünç alma sistemi

### 🎉 Etkinlikler

- ✅ Etkinlik oluşturma ve yönetimi
- ✅ Etkinliklere katılma
- ✅ Google Maps entegrasyonu
- ✅ Etkinlik fotoğrafları ve yorumları
- ✅ Etkinlik değerlendirmeleri
- ✅ Geçmiş ve gelecek etkinlikler

### 💬 Forum

- ✅ Tartışma konuları oluşturma
- ✅ Kategoriler ve etiketler
- ✅ Yanıtlama sistemi
- ✅ Beğeni sistemi
- ✅ Sabitlenmiş konular
- ✅ Moderasyon araçları

### 🏆 Gamification

- ✅ Kullanıcı seviyeleri (XP sistemi)
- ✅ Rozet sistemi
- ✅ Başarı rozetleri
- ✅ Liderlik tablosu (potansiyel)

### 🔔 Bildirimler

- ✅ Etkinlik hatırlatmaları
- ✅ Forum yanıt bildirimleri
- ✅ Rozet kazanma bildirimleri
- ✅ Email bildirimleri

### 👨‍💼 Admin Panel

- ✅ Kullanıcı yönetimi
- ✅ Kitap ekleme/düzenleme/silme
- ✅ Etkinlik yönetimi
- ✅ Forum moderasyonu
- ✅ Rozet verme
- ✅ İstatistikler ve raporlar

---

## 🚀 Teknolojiler

### Frontend

- **Next.js 15** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **Radix UI** - Accessible components
- **Lucide Icons** - İkonlar

### Backend

- **Next.js API Routes** - Backend API
- **NextAuth v5** - Authentication
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **Nodemailer** - Email gönderimi

### Dev Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting (opsiyonel)
- **TypeScript** - Type checking

---

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL 13+
- npm veya yarn

### Adımlar

1. **Repository'yi klonla**

```bash
git clone https://github.com/MuhammedBesir/Okuyamayanlar-web-sayfasi.git
cd Okuyamayanlar-web-sayfasi
```

2. **Bağımlılıkları yükle**

```bash
npm install
```

3. **Environment variables ayarla**

```bash
# .env.example dosyasını .env olarak kopyala
cp .env.example .env

# .env dosyasını düzenle (DATABASE_URL, NEXTAUTH_SECRET, etc.)
```

4. **Database migration**

```bash
npx prisma migrate dev
```

5. **Seed data (opsiyonel)**

```bash
npm run db:seed
```

6. **Development server'ı başlat**

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

---

## 🌐 Deployment

Detaylı deployment rehberi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

### Hızlı Deploy

#### Vercel (Önerilen)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammedBesir/Okuyamayanlar-web-sayfasi)

#### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/MuhammedBesir/Okuyamayanlar-web-sayfasi)

---

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── auth/              # Authentication pages
│   ├── events/            # Event pages
│   ├── forum/             # Forum pages
│   ├── library/           # Library pages
│   ├── profile/           # Profile pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── badges.ts         # Badge logic
│   ├── user-level.ts     # Level system
│   └── ...
├── prisma/               # Prisma schema & migrations
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed data
│   └── migrations/       # Database migrations
├── public/               # Static files
│   └── uploads/          # User uploads
├── types/                # TypeScript types
├── auth.ts               # NextAuth config
├── middleware.ts         # Next.js middleware
└── ...
```

---

## 🔑 Environment Variables

Gerekli environment variables için `.env.example` dosyasına bakın.

### Temel Değişkenler

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 📊 Database Schema

Detaylı schema için [prisma/schema.prisma](./prisma/schema.prisma) dosyasına bakın.

### Ana Modeller

- `User` - Kullanıcılar
- `Book` - Kitaplar
- `Event` - Etkinlikler
- `ForumTopic` - Forum konuları
- `ForumReply` - Forum yanıtları
- `Badge` - Rozetler
- `Notification` - Bildirimler
- `ReadingListItem` - Okuma listesi
- `BookBorrowing` - Kitap ödünç alma

---

## 🧪 Test

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📝 Lisans

Bu proje MIT lisansı altındadır.

---

## 👨‍💻 Geliştirici

**Muhammed Besir**

- GitHub: [@MuhammedBesir](https://github.com/MuhammedBesir)

---

## 🙏 Teşekkürler

- Next.js takımına
- Vercel'e
- Prisma takımına
- Tüm açık kaynak katkıda bulunanlara

---

## 📞 İletişim

Sorularınız için:

- GitHub Issues: [Issues](https://github.com/MuhammedBesir/Okuyamayanlar-web-sayfasi/issues)
- Email: (projenizin email adresi)

---

**Happy Reading! 📚✨**
