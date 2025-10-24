# 🚀 Railway Deployment Rehberi - Okuyamayanlar Kitap Kulübü

Bu rehber, projenizi Railway platformunda adım adım nasıl yayınlayacağınızı gösterir.

## 📋 Ön Hazırlık

### 1. GitHub Repository Hazırlığı

Projenizin GitHub'da olması gerekiyor. Eğer yoksa:

```bash
git init
git add .
git commit -m "Initial commit - Railway deployment ready"
git branch -M main
git remote add origin https://github.com/MuhammedBesir/Okuyamayanlar-web-sayfas-.git
git push -u origin main
```

### 2. Gerekli Dosyaların Kontrolü

Aşağıdaki dosyaların oluşturulduğundan emin olun:

- ✅ `.railwayignore` - Yüklenmeyecek dosyaları belirtir
- ✅ `railway.json` - Railway konfigürasyonu
- ✅ `.env.example` - Environment variables şablonu
- ✅ `package.json` - Güncellenmiş build script'leri

---

## 🎯 Railway Deployment Adımları

### ADIM 1: Railway Hesabı Oluşturun

1. [railway.app](https://railway.app) adresine gidin
2. **"Start a New Project"** veya **"Login with GitHub"** ile giriş yapın
3. GitHub hesabınızla bağlanın

### ADIM 2: Yeni Proje Oluşturun

1. Railway Dashboard'da **"New Project"** butonuna tıklayın
2. **"Deploy from GitHub repo"** seçeneğini seçin
3. **"Configure GitHub App"** ile Railway'e repository erişimi verin
4. `Okuyamayanlar-web-sayfas-` repository'sini seçin

### ADIM 3: PostgreSQL Database Ekleyin

1. Proje sayfasında **"+ New"** butonuna tıklayın
2. **"Database"** → **"Add PostgreSQL"** seçin
3. PostgreSQL servisi otomatik olarak oluşturulacak
4. PostgreSQL servisine tıklayın ve **"Variables"** sekmesine gidin
5. **`DATABASE_URL`** değişkenini kopyalayın (daha sonra kullanacağız)

### ADIM 4: Environment Variables Ayarlayın

1. Ana projenize (Next.js servisi) tıklayın
2. **"Variables"** sekmesine gidin
3. Aşağıdaki değişkenleri **"New Variable"** ile ekleyin:

#### 🔑 Zorunlu Değişkenler:

```bash
# Database (PostgreSQL'den kopyaladığınız)
DATABASE_URL=postgresql://postgres:****@roundhouse.proxy.rlwy.net:****/*****

# NextAuth (Railway size bir URL verecek, örn: okuyamayanlar.up.railway.app)
# Önce boş bırakabilirsiniz, deployment sonrası güncelleyin
NEXTAUTH_URL=https://your-app-name.up.railway.app

# Secret Key (güçlü bir key oluşturun)
# PowerShell'de oluşturmak için: [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-CHANGE-THIS

# Node Environment
NODE_ENV=production
```

#### 📧 Email Değişkenleri (Gmail kullanıyorsanız):

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü
```

#### 🗺️ Google Maps API (varsa):

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### 🔐 Google OAuth (opsiyonel):

```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### ADIM 5: Build ve Deploy

1. Değişkenleri kaydettikten sonra Railway otomatik olarak build başlatacak
2. **"Deployments"** sekmesinde build ilerlemesini izleyin
3. Build tamamlandığında **"Settings"** → **"Networking"** → **"Generate Domain"** ile bir domain oluşturun
4. Örnek: `okuyamayanlar.up.railway.app`

### ADIM 6: NEXTAUTH_URL'i Güncelleyin

1. Railway'den aldığınız domain'i kopyalayın
2. **"Variables"** sekmesine dönün
3. `NEXTAUTH_URL` değişkenini bulun ve domain ile güncelleyin:
   ```
   NEXTAUTH_URL=https://okuyamayanlar.up.railway.app
   ```
4. Kaydet - Railway otomatik redeploy yapacak

### ADIM 7: Google OAuth Redirect URI Güncellemesi (Eğer kullanıyorsanız)

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Credentials
2. OAuth 2.0 Client'inizi seçin
3. **Authorized redirect URIs** kısmına ekleyin:
   ```
   https://okuyamayanlar.up.railway.app/api/auth/callback/google
   ```
4. Kaydedin

### ADIM 8: Database Migration'ları Çalıştırın

Railway otomatik olarak `prisma migrate deploy` çalıştıracak.
Kontrol etmek için:

1. **"Deployments"** → Son deployment'e tıklayın
2. **"View Logs"** ile logları kontrol edin
3. "Migration applied successfully" mesajını görmelisiniz

---

## ✅ Deployment Kontrolü

### Test Edilmesi Gerekenler:

- [ ] Ana sayfa açılıyor mu? → `https://your-app.up.railway.app`
- [ ] Kullanıcı girişi çalışıyor mu?
- [ ] Google OAuth çalışıyor mu? (varsa)
- [ ] Database bağlantısı başarılı mı?
- [ ] Kitaplar listelenebiliyor mu?
- [ ] Etkinlikler sayfası çalışıyor mu?
- [ ] Forum sayfası çalışıyor mu?
- [ ] Email gönderimi çalışıyor mu?

---

## 🐛 Sorun Giderme

### Problem: Build Başarısız Oluyor

**Çözüm:**

1. Railway Dashboard → Deployments → Build Logs'u kontrol edin
2. Eksik environment variable olabilir
3. `railway.json` dosyasının doğru olduğundan emin olun

### Problem: Database Bağlantı Hatası

**Çözüm:**

1. `DATABASE_URL` değişkeninin doğru kopyalandığından emin olun
2. PostgreSQL servisi çalışıyor mu kontrol edin
3. Migration'lar çalıştı mı? Logs'u kontrol edin

### Problem: NEXTAUTH_URL Hatası

**Çözüm:**

1. `NEXTAUTH_URL` Railway domain'i ile güncellenmiş mi?
2. `https://` ile başladığından emin olun
3. Sonunda `/` olmamalı

### Problem: 500 Internal Server Error

**Çözüm:**

1. **View Logs** ile hata detaylarına bakın
2. Environment variables eksik olabilir
3. Database migration çalışmamış olabilir

### Problem: Upload Klasörü Yazma Hatası

**Çözüm:**
Railway'de dosya sistemi ephemeral'dir. Kalıcı dosya yükleme için:

1. **Cloudinary** kullanın (ücretsiz 25GB)
2. **AWS S3** kullanın
3. **Railway Volume** ekleyin (ücretli)

---

## 🔄 Güncelleme Yapmak

### Kod Değişikliği Sonrası:

```bash
git add .
git commit -m "Yeni özellik: ..."
git push origin main
```

Railway otomatik olarak yeni değişiklikleri algılayıp deploy edecek.

### Manual Redeploy:

Railway Dashboard → Service → **"Deploy"** → **"Redeploy"**

---

## 💰 Railway Ücretsiz Plan Limitleri

- ✅ **$5/ay ücretsiz kredi**
- ✅ **500 saat execution time/ay**
- ✅ **Sınırsız proje**
- ✅ **100 GB bandwidth/ay**
- ✅ **1 GB RAM per service**

Projeniz bu limitlere uygun olmalı. Limit aşımı durumunda kredi kartı eklenebilir.

---

## 📚 Yararlı Linkler

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [Next.js Railway Deploy Guide](https://railway.app/template/next-js)

---

## 🎉 Tebrikler!

Projeniz artık canlıda! 🚀

**Production URL:** https://your-app.up.railway.app

Herhangi bir sorunla karşılaşırsanız Railway Discord kanalına sorabilirsiniz.

---

## 📝 Notlar

- Railway otomatik SSL sertifikası sağlar (HTTPS)
- Her push sonrası otomatik deployment yapılır
- Health check'ler otomatiktir
- Logs'a her zaman erişebilirsiniz
- Database backupları Railway tarafından yönetilir

İyi şanslar! 🍀
