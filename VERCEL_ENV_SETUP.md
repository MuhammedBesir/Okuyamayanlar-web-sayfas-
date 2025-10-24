# Vercel Environment Variables Kurulum Rehberi

## 🔴 ACİL: Şu An Eksik Olan Environment Variables

### 1. Google OAuth (Google ile Giriş İçin)

```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

**Not:** `.env.local` dosyanızdaki değerleri kullanın.

### 2. Email Yapılandırması (Email Gönderimi İçin)

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASSWORD=<your-gmail-app-password>
EMAIL_FROM=<your-email@gmail.com>
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü
```

**Not:** Gmail App Password kullanın, normal şifre değil.

### 3. Google Maps (Etkinlik Lokasyonları İçin)

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
```

**Not:** Google Cloud Console'dan Maps JavaScript API key'inizi kullanın.

---

## 📝 Vercel'de Environment Variables Ekleme Adımları

### Adım 1: Vercel Dashboard'a Giriş

1. https://vercel.com/dashboard adresine gidin
2. **Okuyamayanlar-web-sayfas-** projesini seçin

### Adım 2: Settings Sayfasına Git

1. Sol menüden **Settings** tıklayın
2. Sol sidebar'dan **Environment Variables** seçin

### Adım 3: Her Bir Variable'ı Ekleyin

Her bir environment variable için:

1. **Key** alanına değişken adını girin (örn: `GOOGLE_CLIENT_ID`)
2. **Value** alanına **`.env.local` dosyanızdaki değeri** girin
3. **Environments** bölümünde **Production**, **Preview** ve **Development** seçin (hepsini)
4. **Save** butonuna tıklayın

#### Variable Listesi:

- `GOOGLE_CLIENT_ID` (`.env.local`'den kopyalayın)
- `GOOGLE_CLIENT_SECRET` (`.env.local`'den kopyalayın)
- `EMAIL_HOST` → smtp.gmail.com
- `EMAIL_PORT` → 587
- `EMAIL_SECURE` → false
- `EMAIL_USER` (`.env.local`'den kopyalayın)
- `EMAIL_PASSWORD` (`.env.local`'den kopyalayın - Gmail App Password)
- `EMAIL_FROM` (`.env.local`'den kopyalayın)
- `EMAIL_FROM_NAME` → Okuyamayanlar Kitap Kulübü
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (`.env.local`'den kopyalayın)

---

## 🔧 Mevcut Environment Variables (Zaten Eklenmiş)

Aşağıdaki değişkenler zaten Vercel'de tanımlı:

- ✅ `DATABASE_URL` - Neon PostgreSQL bağlantı string'i
- ✅ `NEXTAUTH_URL` - Production URL
- ✅ `NEXTAUTH_SECRET` - Auth secret key

---

## 🚀 Deployment Sonrası

### 1. Redeploy

Environment variables eklendikten sonra:

1. **Deployments** sekmesine gidin
2. En son deployment'ı bulun
3. **⋯** menüsüne tıklayın
4. **Redeploy** seçin
5. **Use existing Build Cache** seçeneğini KALDIRIN
6. **Redeploy** butonuna tıklayın

Ya da terminal'de:

```bash
git commit --allow-empty -m "Trigger deployment for env vars"
git push
```

### 2. Test Et

#### Google OAuth Testi:

1. Production URL'ye gidin: `/auth/signin`
2. "Google ile Giriş Yap" butonuna tıklayın
3. Hata almadan giriş yapabilmeli

#### Email Testi:

1. Yeni bir hesap oluşturun
2. Email onaylama maili gelmeli
3. Email'deki linke tıklayarak hesabı aktifleştirin

---

## ⚠️ Önemli Notlar

### Google OAuth İçin:

**Google Cloud Console'da redirect URI eklemeyi unutmayın:**

```
https://your-production-domain.vercel.app/api/auth/callback/google
```

Adımlar:

1. https://console.cloud.google.com/apis/credentials
2. OAuth 2.0 Client ID'nizi seçin
3. **Authorized redirect URIs** bölümüne yukarıdaki URL'yi ekleyin
4. **SAVE** butonuna tıklayın

### Email İçin:

- Gmail kullanıyorsanız "App Password" kullanmalısınız
- Normal şifre ÇALIŞMAZ
- App Password oluşturmak için: https://myaccount.google.com/apppasswords

### Google Maps İçin:

- API key'in Maps JavaScript API'ye erişimi olmalı
- Authorized domains listesine production domain'inizi ekleyin

---

## 🔒 Güvenlik

- Environment variables'ı asla GitHub'a commit etmeyin
- `.env.local` dosyası `.gitignore`'da olmalı (✅ zaten var)
- Production secrets'ları sadece Vercel'de saklayın
- Periyodik olarak secrets'ları rotate edin

---

## 📊 Kontrol Listesi

Vercel'de eklenecek environment variables:

### ❌ Eklenecekler:

- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT
- [ ] EMAIL_SECURE
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] EMAIL_FROM
- [ ] EMAIL_FROM_NAME
- [ ] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

### ✅ Mevcut:

- [x] DATABASE_URL
- [x] NEXTAUTH_URL
- [x] NEXTAUTH_SECRET

---

## 🆘 Sorun Giderme

### "Google OAuth redirect_uri_mismatch" hatası:

- Google Cloud Console'da redirect URI'yi kontrol edin
- Tam URL'yi kullanın (sonunda / olmamalı)
- Değişikliklerin yayılması için 5-10 dakika bekleyin

### "Email gönderilmiyor":

- EMAIL_PASSWORD'ün App Password olduğundan emin olun
- EMAIL_SECURE değerinin "false" olduğunu kontrol edin (587 port için)
- Vercel logs'larını kontrol edin

### "Maps görünmüyor":

- API key'in doğru olduğundan emin olun
- Maps JavaScript API'nin enabled olduğunu kontrol edin
- Browser console'da hata mesajlarını kontrol edin

---

## 🎯 Sonraki Adımlar

1. ✅ `.env.local` dosyanızı açın
2. ✅ Tüm environment variables'ları Vercel'e ekleyin (yukarıdaki değerleri kullanarak)
3. ✅ Google Cloud Console'da redirect URI'yi kaydedin
4. ✅ Redeploy yapın
5. ✅ Test edin

**Tahmini süre:** 10-15 dakika

---

**Son Güncelleme:** 24 Ekim 2025
