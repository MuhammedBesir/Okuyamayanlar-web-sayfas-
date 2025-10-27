# 🚀 Deployment Rehberi - Okuyamayanlar Kitap Kulübü

Bu proje **Vercel** veya **Railway** üzerinde canlıya alınabilir.

---

## ✅ Yapılan Temizlikler

- ❌ `app/api/page.tsx` silindi (gereksiz duplicate)
- ❌ `data-export.json` silindi
- ❌ Test scriptleri temizlendi (`export-data.ts`, `import-data.ts`, `check-users.ts`, etc.)
- ✅ Production için optimize edildi

---

## 🔧 Gereksinimler

### 1. Database (PostgreSQL)

Aşağıdaki servislerden birini kullanabilirsiniz:

- **Vercel Postgres** (Önerilen - Vercel ile entegre)
- **Supabase** (Ücretsiz tier mevcut)
- **Neon** (Serverless PostgreSQL)
- **Railway Postgres** (Railway kullanıyorsanız)

### 2. Email Servisi (SMTP)

- Gmail App Password
- SendGrid
- Resend
- Mailgun

### 3. Google Maps API

- Google Cloud Console'dan Maps JavaScript API

---

## 📦 VERCEL İLE DEPLOYMENT

### Adım 1: Vercel'e Kayıt

1. [vercel.com](https://vercel.com) adresine git
2. GitHub hesabınla giriş yap

### Adım 2: Projeyi Import Et

1. "New Project" butonuna tıkla
2. GitHub repository'nizi seçin (MuhammedBesir/Okuyamayanlar-web-sayfasi)
3. Framework Preset: **Next.js** (otomatik seçilir)
4. Root Directory: `./`
5. Build Command: `npm run build` (varsayılan)
6. Output Directory: `.next` (varsayılan)

### Adım 3: Database Ekle

1. Vercel Dashboard > Storage > Create Database
2. **Postgres** seçin
3. Database oluşturulduktan sonra `DATABASE_URL` otomatik eklenir

### Adım 4: Environment Variables Ayarla

Vercel Dashboard > Settings > Environment Variables:

```env
# Database (Vercel Postgres kullanıyorsanız otomatik gelir)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth (Opsiyonel)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key

# Email (Gmail örneği)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü

# Node Environment
NODE_ENV=production
```

### Adım 5: İlk Deploy

1. "Deploy" butonuna tıkla
2. Build loglarını izle
3. Deploy tamamlandığında URL'nizi alın

### Adım 6: Database Migration

1. Vercel Dashboard > Deployments > Son deployment
2. "View Function Logs" > Terminal açılır
3. Veya lokal terminalde:

```bash
# Vercel CLI kur
npm i -g vercel

# Login
vercel login

# Proje bağla
vercel link

# Migration çalıştır
vercel env pull .env.local
npx prisma migrate deploy
```

### Adım 7: Seed Data (İsteğe Bağlı)

```bash
# Admin kullanıcısı ve örnek veriler eklemek için
npm run db:seed
```

---

## 🚂 RAILWAY İLE DEPLOYMENT

### Adım 1: Railway'e Kayıt

1. [railway.app](https://railway.app) adresine git
2. GitHub hesabınla giriş yap

### Adım 2: Yeni Proje Oluştur

1. "New Project" > "Deploy from GitHub repo"
2. Repository seçin
3. "Deploy Now" butonuna tıkla

### Adım 3: PostgreSQL Ekle

1. Proje dashboard > "New" > "Database" > "PostgreSQL"
2. Database oluşturulduktan sonra Variables sekmesinde `DATABASE_URL` görünür

### Adım 4: Environment Variables

Railway Dashboard > Variables:

```env
# Database (Railway otomatik oluşturur)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü

# Node
NODE_ENV=production
```

### Adım 5: Build Settings (Otomatik)

Railway `railway.json` dosyasını kullanır:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start"
  }
}
```

### Adım 6: Domain Ayarla

1. Settings > Networking > Generate Domain
2. Custom domain ekleyebilirsiniz

---

## 🔑 Önemli Environment Variables

### NEXTAUTH_SECRET Oluşturma

```bash
# Terminal'de çalıştır
openssl rand -base64 32
```

### Gmail App Password Oluşturma

1. Google Hesabınız > Güvenlik
2. 2 Adımlı Doğrulama aktif olmalı
3. Uygulama Şifreleri > Mail > Şifre oluştur
4. 16 haneli şifreyi `EMAIL_PASSWORD` olarak kullan

### Google Maps API

1. [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services > Credentials > Create API Key
3. Maps JavaScript API & Maps Embed API aktif olmalı
4. API key'i kısıtla (HTTP referrers - your-domain.com)

### Google OAuth (Opsiyonel)

1. Google Cloud Console > Credentials > Create OAuth 2.0 Client ID
2. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.com/api/auth/callback/google` (prod)

---

## 🗄️ Database Migration

### İlk Kez Deploy

```bash
# Otomatik çalışır (railway.json veya package.json'da tanımlı)
npx prisma migrate deploy
```

### Yeni Migration Eklemek

```bash
# Lokal geliştirme
npx prisma migrate dev --name migration_name

# Production'a push
git push
# Railway/Vercel otomatik deploy eder
```

---

## 🎯 Deploy Sonrası Kontrol Listesi

- [ ] Ana sayfa açılıyor mu?
- [ ] Kayıt olma çalışıyor mu?
- [ ] Giriş yapma çalışıyor mu?
- [ ] Email gönderme çalışıyor mu? (şifre sıfırlama)
- [ ] Admin paneline erişim var mı? (ilk admin kullanıcısını seed ile oluştur)
- [ ] Kitap ekleme/görüntüleme çalışıyor mu?
- [ ] Etkinlik oluşturma çalışıyor mu?
- [ ] Forum çalışıyor mu?
- [ ] Google Maps görünüyor mu? (etkinlik sayfalarında)
- [ ] Dosya yükleme çalışıyor mu? (kitap kapakları, etkinlik görselleri)

---

## 🐛 Sorun Giderme

### Build Hatası

```bash
# Logları kontrol et
vercel logs # veya
railway logs
```

### Database Bağlantı Hatası

- `DATABASE_URL` doğru mu?
- Database servisi çalışıyor mu?
- Connection limit aşılmış olabilir (pgbouncer kullan)

### Email Gönderemiyor

- Gmail App Password doğru mu?
- 2FA aktif mi?
- SMTP ayarları doğru mu?

### Google Maps Görünmüyor

- API key doğru mu?
- Maps JavaScript API aktif mi?
- API key restrictions doğru ayarlanmış mı?

---

## 📊 İlk Admin Kullanıcısı Oluşturma

### Yöntem 1: Seed Script

```bash
# Lokal veya Railway/Vercel terminal
npm run db:seed
```

### Yöntem 2: Manuel Database

```sql
-- PostgreSQL'de çalıştır
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-email@gmail.com';
```

### Yöntem 3: Kayıt Ol + Database Güncelle

1. Normal kayıt ol
2. Database'de kullanıcının role'ünü ADMIN yap
3. Giriş yap, admin paneline eriş

---

## 🔄 Güncellemeler

### Kod Güncellemesi

```bash
git add .
git commit -m "Update: feature name"
git push
# Vercel/Railway otomatik deploy eder
```

### Environment Variable Değişikliği

- Vercel/Railway dashboard'dan değiştir
- Yeniden deploy gerekebilir (genelde otomatik)

---

## 💾 Backup

### Database Backup (Railway)

```bash
# Railway CLI
railway run pg_dump > backup.sql
```

### Database Backup (Vercel)

```bash
# Vercel Postgres
vercel env pull
psql $DATABASE_URL -c "\copy ..."
```

---

## 🎉 Deployment Tamamlandı!

Projeniz şu linklerden birine deploy edildi:

- **Vercel**: `https://your-app.vercel.app`
- **Railway**: `https://your-app.up.railway.app`

### Sonraki Adımlar:

1. Custom domain bağla (opsiyonel)
2. Analytics ekle (Vercel Analytics ücretsiz)
3. Monitoring ayarla (Sentry, LogRocket, etc.)
4. SEO optimize et (meta tags, sitemap, robots.txt)
5. Performance test et (Lighthouse, PageSpeed Insights)

---

## 📞 Destek

Sorunlarla karşılaşırsanız:

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma: [prisma.io/docs](https://prisma.io/docs)

---

**Başarılar! 🚀📚**
