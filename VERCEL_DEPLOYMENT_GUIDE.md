# Vercel Deployment Rehberi

Bu rehber, Okuyamayanlar Kitap Kulübü uygulamasını Vercel'e deploy etmek için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

### 1. Gereksinimler

- GitHub hesabı
- Vercel hesabı (ücretsiz)
- PostgreSQL veritabanı (Vercel Postgres, Supabase, Neon, vb.)
- Google Cloud Console hesabı (OAuth ve Maps için)
- Gmail hesabı (Email gönderimi için)

### 2. Proje Dosyaları Kontrolü

✅ `.env.example` dosyası oluşturuldu
✅ `vercel.json` yapılandırması hazır
✅ `.gitignore` dosyası güncellendi
✅ `package.json` build scriptleri ayarlandı

## 🚀 Adım Adım Deployment

### Adım 1: GitHub'a Push

```powershell
# Değişiklikleri commit edin
git add .
git commit -m "Vercel deployment için hazırlık"
git push origin main
```

### Adım 2: Vercel'e Giriş

1. [vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" veya "Log In" yapın
3. GitHub ile bağlanın

### Adım 3: Yeni Proje Oluştur

1. Dashboard'da "Add New..." > "Project" tıklayın
2. GitHub repository'nizi seçin: `Okuyamayanlar-web-sayfas-`
3. "Import" butonuna tıklayın

### Adım 4: Proje Ayarları

**Framework Preset:** Next.js (otomatik algılanır)
**Root Directory:** `./` (varsayılan)
**Build Command:** `npm run build` (otomatik)
**Output Directory:** `.next` (otomatik)

### Adım 5: Environment Variables Ekleyin

Aşağıdaki environment variables'ları ekleyin:

#### 🔐 Zorunlu Değişkenler

**DATABASE_URL**

- PostgreSQL connection string
- Örnek: `postgresql://user:pass@host:5432/dbname?pgbouncer=true&connection_limit=1`
- Supabase/Neon kullanıyorsanız onların connection pooling URL'ini kullanın

**NEXTAUTH_URL**

- Production URL'iniz (Vercel'den alacaksınız)
- İlk deploymenttan sonra güncelleyin
- Örnek: `https://okuyamayanlar.vercel.app`

**NEXTAUTH_SECRET**

- Güçlü bir secret key (minimum 32 karakter)
- Terminal'de oluşturun: `openssl rand -base64 32`
- Ya da online: https://generate-secret.vercel.app/32

**EMAIL_HOST**: `smtp.gmail.com`
**EMAIL_PORT**: `587`
**EMAIL_SECURE**: `false`
**EMAIL_USER**: Gmail adresiniz
**EMAIL_PASSWORD**: Gmail App Password (16 haneli)
**EMAIL_FROM**: Gmail adresiniz
**EMAIL_FROM_NAME**: `Okuyamayanlar Kitap Kulübü`

**NODE_ENV**: `production`

#### 🔧 Opsiyonel Değişkenler

**GOOGLE_CLIENT_ID**: Google OAuth Client ID
**GOOGLE_CLIENT_SECRET**: Google OAuth Client Secret
**NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**: Google Maps API Key

> 💡 **Not:** Her variable için Production, Preview, Development seçeneklerini işaretleyin

### Adım 6: Deploy Başlat

"Deploy" butonuna tıklayın ve deployment'ın tamamlanmasını bekleyin (2-5 dakika)

### Adım 7: Veritabanı Kurulumu

#### Seçenek A: Vercel Postgres

```powershell
# Vercel Dashboard'da:
# 1. Storage sekmesine gidin
# 2. Create Database > Postgres seçin
# 3. DATABASE_URL otomatik environment variables'a eklenecek
```

#### Seçenek B: Harici PostgreSQL (Supabase/Neon)

1. Supabase veya Neon'da yeni proje oluşturun
2. Connection string'i alın (pooling mode kullanın)
3. Vercel'de DATABASE_URL'i güncelleyin

### Adım 8: Database Migration

Vercel Dashboard > Deployments > Son deployment > "..." > "Redeploy"

Ya da terminal'den:

```powershell
# Vercel CLI kurulu ise
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma migrate deploy
```

### Adım 9: NEXTAUTH_URL Güncelleme

1. İlk deployment tamamlandıktan sonra URL'inizi kopyalayın
2. Settings > Environment Variables > NEXTAUTH_URL'i güncelleyin
3. Yeniden deploy edin

### Adım 10: Google OAuth Ayarları (Opsiyonel)

#### Google Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services > Credentials
3. OAuth 2.0 Client ID oluşturun
4. Authorized redirect URIs ekleyin:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. Client ID ve Secret'i Vercel environment variables'a ekleyin

#### Google Maps API

1. Google Cloud Console > APIs & Services
2. Maps JavaScript API'yi enable edin
3. Maps Embed API'yi enable edin
4. API Key oluşturun
5. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY olarak ekleyin

### Adım 11: Gmail App Password

1. Google hesabınıza gidin: [myaccount.google.com](https://myaccount.google.com)
2. Security > 2-Step Verification'ı aktif edin
3. Security > App passwords
4. "Mail" için yeni app password oluşturun
5. 16 haneli şifreyi EMAIL_PASSWORD olarak ekleyin

## 🧪 Test Etme

### Production URL'i Ziyaret Edin

```
https://your-app.vercel.app
```

### Test Listesi

- [ ] Ana sayfa yükleniyor
- [ ] Kullanıcı kaydı çalışıyor
- [ ] Giriş yapılabiliyor
- [ ] Email gönderimi çalışıyor (şifre sıfırlama)
- [ ] Kitap ekleme/düzenleme
- [ ] Forum oluşturma
- [ ] Etkinlik oluşturma
- [ ] Google Maps gösteriliyor (varsa)
- [ ] Dosya yükleme çalışıyor

## 📊 Veritabanı Seed (İlk Veriler)

```powershell
# Local'de .env.local oluşturun
vercel env pull .env.local

# Seed verilerini ekleyin
npx prisma db seed
```

Ya da Vercel Dashboard > Deployments > "..." > "Run Command":

```bash
npx prisma db seed
```

## 🔧 Sorun Giderme

### Build Hataları

```powershell
# Local'de test edin
npm run build
```

### Database Bağlantı Hatası

- DATABASE_URL'in doğru olduğundan emin olun
- Connection pooling kullanıyor musunuz? (`?pgbouncer=true`)
- SSL gerekiyor mu? (`?sslmode=require`)

### Prisma Hataları

```powershell
# Prisma client'i yeniden oluştur
npx prisma generate

# Migration'ları kontrol et
npx prisma migrate status
```

### Email Gönderimi Çalışmıyor

- Gmail App Password'ün doğru olduğundan emin olun
- 2-Step Verification aktif mi?
- EMAIL_HOST, EMAIL_PORT doğru mu?

## 🔄 Güncelleme ve Yeniden Deploy

### Otomatik Deploy

Her `git push` yaptığınızda Vercel otomatik deploy eder.

### Manuel Deploy

Vercel Dashboard > Deployments > "Redeploy"

### Environment Variables Değişti

1. Settings > Environment Variables
2. Değişkeni güncelleyin
3. Redeploy edin

## 🌐 Custom Domain Ekleme

1. Vercel Dashboard > Settings > Domains
2. Domain adınızı ekleyin
3. DNS ayarlarını yapın (Vercel size gösterecek)
4. NEXTAUTH_URL'i yeni domain ile güncelleyin
5. Google OAuth redirect URI'larını güncelleyin

## 📈 Monitoring

### Vercel Analytics

Settings > Analytics'i aktif edin (ücretsiz)

### Error Tracking

- Vercel Dashboard > Deployments > Logs
- Runtime Logs'u kontrol edin

## 🔒 Güvenlik Kontrol Listesi

- [ ] `.env` dosyası `.gitignore`'da
- [ ] NEXTAUTH_SECRET güçlü (32+ karakter)
- [ ] Database şifreleri güvenli
- [ ] Google API Key restrictions ayarlı
- [ ] Admin kullanıcısı oluşturuldu

## 📚 Faydalı Linkler

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 💡 İpuçları

1. **Preview Deployments**: Her PR için otomatik preview URL oluşur
2. **Environment Variables**: Production ve Preview için ayrı değerler kullanabilirsiniz
3. **Logs**: Real-time logs için Vercel CLI kullanın: `vercel logs`
4. **Rollback**: Eski bir versiyona dönmek için eski deployment'ı "Promote to Production" yapın

## 🎉 Başarılı Deployment!

Tebrikler! Uygulamanız artık canlıda 🚀

Sorun yaşarsanız: [Vercel Support](https://vercel.com/support)
