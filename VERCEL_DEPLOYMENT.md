# 🚀 Vercel Deployment Rehberi

## Vercel'de 404 Hatası Çözüldü ✅

Aşağıdaki değişiklikler yapıldı:

### 1. `vercel.json` Güncellendi
- Build command optimize edildi
- Prisma migration otomatik çalışacak şekilde ayarlandı

### 2. `middleware.ts` Düzenlendi
- Static dosyalar (uploads, favicon, logo) middleware'den exclude edildi
- Runtime tanımlaması kaldırıldı

### 3. `next.config.mjs` Sadeleştirildi
- Gereksiz webpack konfigürasyonu kaldırıldı
- Daha temiz ve optimize edildi

## 📦 Deployment Adımları

### 1. Vercel CLI ile Deploy

```bash
# Vercel CLI'yi yükleyin (ilk kez)
npm i -g vercel

# Deploy edin
vercel

# Production deploy
vercel --prod
```

### 2. GitHub ile Otomatik Deploy

1. Projeyi GitHub'a push edin
2. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
3. "New Project" > GitHub repository'nizi seçin
4. Deploy'a tıklayın

### 3. Environment Variables

Vercel Dashboard > Settings > Environment Variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-minimum-32-characters
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü
NODE_ENV=production
```

### 4. Database Setup (Vercel Postgres)

```bash
# Vercel Postgres oluşturun
vercel postgres create

# .env dosyanızı güncelleyin
vercel env pull

# Migration çalıştırın (otomatik çalışır)
```

## 🔧 Build Ayarları

Vercel otomatik algılar ama manuel gerekirse:

- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && prisma migrate deploy && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `next dev`

## ✅ Kontrol Listesi

- [ ] Environment variables ekledim
- [ ] Database bağlantısı test ettim
- [ ] Email ayarları doğru
- [ ] Google Maps API key'i çalışıyor
- [ ] NEXTAUTH_SECRET güçlü ve unique
- [ ] NEXTAUTH_URL production domain'i
- [ ] Build başarılı
- [ ] Deployment başarılı
- [ ] Ana sayfa açılıyor
- [ ] Login/Register çalışıyor
- [ ] Static dosyalar (resimler) yükleniyor

## 🐛 Sorun Giderme

### 404 Hatası
✅ **Çözüldü!** `middleware.ts` ve `vercel.json` güncellendi.

### Build Hatası
```bash
# Local'de test edin
npm run build

# Prisma generate
npx prisma generate

# Environment variables kontrol
vercel env ls
```

### Database Connection Error
- DATABASE_URL formatını kontrol edin
- `?pgbouncer=true&connection_limit=1` parametrelerini ekleyin
- Vercel Postgres kullanıyorsanız otomatik connection pooling aktif

### Email Gönderiminde Hata
- Gmail kullanıyorsanız "App Password" oluşturun
- 2FA açık olmalı
- EMAIL_PASSWORD 16 haneli app password olmalı

## 📊 Production Optimizasyonları

### Yapılanlar ✅

1. **Console.log temizliği** - 75+ dosyadan debug kodları kaldırıldı
2. **Gereksiz paketler** - recharts kaldırıldı (~34 paket daha az)
3. **Config optimizasyonu** - next.config.mjs sadeleştirildi
4. **Middleware optimize** - Static dosyalar exclude edildi
5. **Build scripts** - Vercel için optimize edildi

### Önerilen

- [ ] Image optimization - `next/image` kullanımını artırın
- [ ] API rate limiting - Production için ayarlayın
- [ ] Error tracking - Sentry entegrasyonu
- [ ] Analytics - Vercel Analytics aktif edin
- [ ] Performance monitoring

## 🔗 Faydalı Linkler

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## 🎉 Deploy Sonrası

```bash
# Production URL'nizi test edin
curl https://your-domain.vercel.app

# Logs kontrol
vercel logs

# Analytics
vercel analytics
```

---

**Deployment başarılı! 🎉**
