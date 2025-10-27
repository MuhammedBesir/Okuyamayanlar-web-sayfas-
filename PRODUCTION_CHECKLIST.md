# ✅ Canlıya Alma Hazırlık Özeti

## 🎯 Yapılan İşlemler

### 1. ✅ Kod Temizliği

- ❌ Silinen dosyalar:

  - `app/api/page.tsx` (gereksiz duplicate admin panel)
  - `data-export.json` (test export dosyası)
  - `scripts/export-data.ts` (test scripti)
  - `scripts/import-data.ts` (test scripti)
  - `scripts/check-users.ts` (test scripti)
  - `scripts/export-database.mjs` (test scripti)
  - `scripts/import-database.mjs` (test scripti)

- ✅ Kalan önemli script:
  - `scripts/seed-badges.ts` (rozet seed scripti - production'da kullanılabilir)
  - `scripts/check-and-unban.ts` (cron job için kullanılabilir)

### 2. ✅ Dosya Güncellemeleri

- `.gitignore` güncellendi (data-export.json eklendi)
- `README.md` oluşturuldu (detaylı proje dokümantasyonu)
- `DEPLOYMENT.md` oluşturuldu (deployment rehberi)
- `public/uploads/.gitkeep` oluşturuldu (klasör yapısını korumak için)

### 3. ✅ Mevcut Yapılandırmalar

- `vercel.json` hazır ✅
- `railway.json` hazır ✅
- `package.json` production scripts hazır ✅
- `.env.example` detaylı dokümantasyon ile hazır ✅

---

## 🚀 DEPLOYMENT ADIMLARI

### VERCEL İLE (ÖNERİLEN)

#### 1. GitHub'a Push

```bash
git add .
git commit -m "Production için hazırlandı - gereksiz dosyalar temizlendi"
git push origin main
```

#### 2. Vercel'e Deploy

1. [vercel.com](https://vercel.com) → Sign up with GitHub
2. "Import Project" → GitHub repository seç
3. Framework: Next.js (otomatik algılanır)
4. **"Deploy" TIKLAYIN** 🎉

#### 3. Database Ekle

1. Vercel Dashboard → Storage → Create Database → Postgres
2. `DATABASE_URL` otomatik eklenir

#### 4. Environment Variables Ekle

```env
# Vercel Dashboard → Settings → Environment Variables

NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[openssl rand -base64 32 ile oluştur]
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
NODE_ENV=production
```

#### 5. Redeploy

- Environment variables ekledikten sonra
- Deployments → ... → Redeploy

#### 6. İlk Admin Kullanıcısı

```bash
# Lokal terminalde
vercel env pull .env.local
npx prisma db push
npm run db:seed  # admin@okuyamayanlar.com / Admin123!
```

---

### RAILWAY İLE

#### 1. Railway'e Git

1. [railway.app](https://railway.app) → Login with GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Repository seç → Deploy

#### 2. PostgreSQL Ekle

- New → Database → PostgreSQL
- `DATABASE_URL` otomatik bağlanır

#### 3. Environment Variables

```env
# Railway Dashboard → Variables

NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
NODE_ENV=production
```

#### 4. Deploy

- Railway otomatik build başlatır
- Domain: Settings → Generate Domain

---

## 🔑 ÖNEMLİ NOTLAR

### NEXTAUTH_SECRET Oluşturma

```bash
# Terminal'de çalıştır (Git Bash veya WSL)
openssl rand -base64 32

# Windows PowerShell alternatif:
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Minimum 0 -Maximum 256}))
```

### Gmail App Password

1. Google Account → Security → 2-Step Verification ON
2. App Passwords → Mail → Generate
3. 16 haneli şifreyi kopyala
4. `EMAIL_PASSWORD` olarak kullan

### Google Maps API

1. [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create API Key
3. Enable APIs:
   - Maps JavaScript API
   - Maps Embed API
4. Restrict API key (HTTP referrers)

---

## 📋 Deploy Sonrası Kontrol

### Otomatik Test Listesi

- [ ] Ana sayfa yükleniyor ✅
- [ ] Kayıt olma çalışıyor
- [ ] Giriş yapma çalışıyor
- [ ] Email gönderimi (şifre sıfırlama)
- [ ] Admin paneli erişimi
- [ ] Kitap listeleme/arama
- [ ] Etkinlik listeleme
- [ ] Forum konuları
- [ ] Google Maps (etkinliklerde)
- [ ] Dosya yükleme (kitap kapakları)

### Test Kullanıcıları (seed.ts çalıştırılırsa)

```
Admin:
  Email: admin@okuyamayanlar.com
  Şifre: Admin123!

Test User:
  Email: test@example.com
  Şifre: Test123!
```

---

## 🐛 Olası Sorunlar ve Çözümler

### Build Hatası

```bash
# Loglara bak
vercel logs  # veya
railway logs

# Genelde Prisma generate sorunudur
# vercel.json ve railway.json'da zaten var
```

### Database Connection Error

- `DATABASE_URL` format kontrolü
- Connection pooling (pgbouncer) kullan
- Vercel Postgres connection limit: 20-50

### Email Gönderilmiyor

- Gmail App Password kontrolü
- 2FA aktif olmalı
- Less secure apps KAPALI olmalı (App Password kullanın)

### Google Maps Görünmüyor

- API key restrictions kontrol
- Billing aktif olmalı (ücretsiz $200/ay krediniz var)

---

## 🎯 Deployment Sonrası

### 1. Domain Bağlama (Opsiyonel)

- Vercel: Settings → Domains → Add
- Railway: Settings → Custom Domain

### 2. Analytics (Vercel - Ücretsiz)

- Dashboard → Analytics → Enable

### 3. Monitoring

- Vercel: Real-time logs + Analytics
- Railway: Observability sekmesi
- Opsiyonel: Sentry, LogRocket

### 4. SEO

- Google Search Console ekle
- Sitemap.xml oluştur
- robots.txt kontrol

### 5. Performance

- Lighthouse score kontrol
- Core Web Vitals optimizasyonu
- Image optimization (Next.js otomatik yapar)

---

## 📊 Önemli Linkler

### Dokümantasyon

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detaylı deployment rehberi
- [README.md](./README.md) - Proje dokümantasyonu
- [.env.example](./.env.example) - Environment variables

### Platform Dokümantasyonları

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 HAZIR!

Projeniz production'a alınmaya hazır!

### Deployment Süresi

- **Vercel**: ~3-5 dakika
- **Railway**: ~5-10 dakika

### Maliyet

- **Vercel**:
  - Hobby plan: Ücretsiz (kişisel projeler için yeterli)
  - Pro: $20/ay
- **Railway**:
  - Free tier: $5 ücretsiz kredi/ay
  - Hobby: $5/ay'dan başlar

### Sonraki Adım

```bash
git add .
git commit -m "🚀 Production için hazır"
git push origin main
```

Sonra Vercel veya Railway'e git ve deploy et! 🎊

---

**Başarılar! 📚✨**

_Muhammed Besir - 2025_
