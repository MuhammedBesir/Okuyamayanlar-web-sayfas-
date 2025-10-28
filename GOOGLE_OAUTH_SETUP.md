# 🔐 GOOGLE OAUTH SETUP REHBER İ

## Google ile Giriş Nasıl Aktifleştirilir?

### Adım 1: Google Cloud Console Projesi Oluştur

1. **Google Cloud Console'a git:** https://console.cloud.google.com
2. **Yeni proje oluştur:**
   - Sol üstteki proje seçicisine tıkla
   - **"New Project"** tıkla
   - Proje adı: `Okuyamayanlar Book Club`
   - **Create** tıkla

---

### Adım 2: OAuth Consent Screen Ayarla

1. **Sol menüden:** "APIs & Services" → **"OAuth consent screen"**
2. **User Type:**

   - **External** seç (herkese açık)
   - **Create** tıkla

3. **App information:**

   ```
   App name: Okuyamayanlar
   User support email: your-email@gmail.com
   App logo: (Opsiyonel - logonuzu yükleyin)
   ```

4. **App domain (Opsiyonel):**

   ```
   Application home page: https://your-domain.vercel.app
   Privacy policy: https://your-domain.vercel.app/privacy-policy
   Terms of service: https://your-domain.vercel.app/terms-of-service
   ```

5. **Developer contact:**

   ```
   Email: your-email@gmail.com
   ```

6. **Save and Continue**

7. **Scopes:**

   - **Add or Remove Scopes**
   - Şunları seç:
     - `email`
     - `profile`
     - `openid`
   - **Update** → **Save and Continue**

8. **Test users (Development aşamasında):**

   - **Add Users**
   - Test için kullanacağınız Gmail adreslerini ekleyin
   - **Save and Continue**

9. **Summary:**
   - **Back to Dashboard**

---

### Adım 3: OAuth 2.0 Client ID Oluştur

1. **Sol menüden:** "APIs & Services" → **"Credentials"**
2. **Create Credentials** → **"OAuth client ID"**
3. **Application type:** "Web application"
4. **Name:** `Okuyamayanlar Web`

5. **Authorized JavaScript origins:**

   ```
   http://localhost:3000
   https://your-domain.vercel.app
   ```

6. **Authorized redirect URIs:**

   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```

   ⚠️ **DİKKAT:** "your-domain" kısmını kendi Vercel domain'iniz ile değiştirin!

7. **Create** tıkla

8. **Client ID ve Client Secret** görünecek:
   - 📋 **Her ikisini de kopyalayın!**
   - Güvenli bir yere kaydedin

---

### Adım 4: Environment Variables Ekle

#### Local Development (.env.local)

```.env
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
```

#### Vercel Production

1. **Vercel Dashboard** → Projeniz → **Settings** → **Environment Variables**
2. Şu değişkenleri ekleyin:

```bash
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

**Environment:** Production ✅

---

### Adım 5: Test Edin

#### Local Test

```powershell
npm run dev
```

1. Tarayıcıda: `http://localhost:3000/auth/signin`
2. **"Sign in with Google"** butonuna tıklayın
3. Google hesabınızı seçin
4. İzinleri onaylayın
5. ✅ Giriş başarılı!

#### Production Test

1. Vercel'de redeploy yapın
2. `https://your-domain.vercel.app/auth/signin`
3. Google ile giriş yapın

---

## 🚨 SORUN GİDERME

### ❌ "redirect_uri_mismatch" hatası

**Sebep:** Redirect URI eşleşmiyor

**Çözüm:**

1. Google Cloud Console → Credentials
2. OAuth 2.0 Client ID'nizi düzenleyin
3. Authorized redirect URIs'ı kontrol edin:
   - Production: `https://your-actual-domain.vercel.app/api/auth/callback/google`
   - Local: `http://localhost:3000/api/auth/callback/google`
4. Tam olarak eşleşmeli (https vs http, trailing slash olmamalı!)

---

### ❌ "Access blocked: This app's request is invalid"

**Sebep:** OAuth Consent Screen ayarlanmamış

**Çözüm:**

1. Google Cloud Console → OAuth consent screen
2. Publishing status: **In production** olmalı
3. Veya Test users ekleyin

---

### ❌ "GOOGLE_CLIENT_ID is not defined"

**Sebep:** Environment variables eksik

**Çözüm:**

1. `.env.local` dosyasında `GOOGLE_CLIENT_ID` var mı kontrol et
2. Vercel'de Environment Variables eklenmiş mi?
3. Server'ı restart et: `npm run dev` (local)
4. Vercel'de redeploy yap (production)

---

## 📝 GÜVENLİK NOTLARI

✅ **Client Secret'i asla commit etmeyin!**

- `.env.local` dosyası `.gitignore`'da olmalı

✅ **Production'da Authorized URIs dikkatli ayarlayın**

- Sadece kendi domain'inizi ekleyin
- Wildcard kullanmayın

✅ **OAuth Consent Screen'i Production'a alın**

- Test aşamasından çıkınca "Publish App" yapın

---

## 🎯 CHECKLIST

- [ ] Google Cloud Console'da proje oluşturuldu
- [ ] OAuth Consent Screen ayarlandı
- [ ] OAuth 2.0 Client ID oluşturuldu
- [ ] Authorized redirect URIs eklendi (local + production)
- [ ] `GOOGLE_CLIENT_ID` environment variable'a eklendi
- [ ] `GOOGLE_CLIENT_SECRET` environment variable'a eklendi
- [ ] Local'de test edildi
- [ ] Vercel'de redeploy yapıldı
- [ ] Production'da test edildi

---

## 💡 İPUCU: Hızlı Setup

**PowerShell:**

```powershell
# 1. NEXTAUTH_SECRET oluştur
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# 2. .env.local oluştur
@"
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="<yukarıdaki-output>"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Okuyamayanlar <noreply@okuyamayanlar.com>"
"@ | Out-File -FilePath .env.local -Encoding UTF8

# 3. Çalıştır
npm run dev
```

---

**🎉 Google OAuth aktif! Kullanıcılar artık Google hesapları ile giriş yapabilir!**
