# ✅ VERCEL ENVIRONMENT VARIABLES CHECKLIST

## 📍 Vercel Dashboard → Settings → Environment Variables

### 🔴 ZORUNLU (Mutlaka Ekle)

```bash
# 1. DATABASE (Postgres)
DATABASE_URL="${POSTGRES_PRISMA_URL}"
# Vercel Postgres kullanıyorsanız yukarıdaki değişken otomatik inject edilir
# Manuel PostgreSQL kullanıyorsanız:
# DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# 2. NEXTAUTH SECRET (Mutlaka yeni random key!)
NEXTAUTH_SECRET="<buraya-random-key-oluştur>"
# 🔑 Oluşturmak için PowerShell'de:
# [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# 3. NEXTAUTH URL (Production domain)
NEXTAUTH_URL="https://your-domain.vercel.app"
# ⚠️ "your-domain" kısmını kendi domain'iniz ile değiştirin!

# 4. GOOGLE OAUTH (Google ile giriş için - Opsiyonel)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
# 📝 Google Cloud Console'dan OAuth 2.0 Client ID alın
# Authorized redirect URI: https://your-domain.vercel.app/api/auth/callback/google

# 5. EMAIL (Şifre sıfırlama için - Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"
EMAIL_FROM="Okuyamayanlar <noreply@okuyamayanlar.com>"

# 📧 EMAIL_PASSWORD için Gmail App Password oluşturun:
# 1. https://myaccount.google.com
# 2. Security → 2-Step Verification (Aktifleştir)
# 3. App Passwords → Mail seçip Generate
# 4. 16 haneli şifreyi buraya yapıştır
```

---

### 🟡 OPSİYONEL (İsterseniz Ekleyin)

```bash
# Google Maps API (Etkinlik haritası için)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
# 🗺️ Google Cloud Console'dan al:
# https://console.cloud.google.com → APIs & Services → Credentials

# Public App Info
NEXT_PUBLIC_APP_NAME="Okuyamayanlar"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

---

## 🎯 HIZLI SETUP ADIMLARı

### 1. NEXTAUTH_SECRET Oluştur

**PowerShell'de çalıştır:**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Çıktıyı kopyala ve `NEXTAUTH_SECRET` olarak kullan.

---

### 2. Gmail App Password Al

1. **Google Account:** https://myaccount.google.com
2. **Security → 2-Step Verification** ✅ Aktifleştir
3. **App Passwords** → Select App: **Mail** → Generate
4. **16 haneli şifreyi** kopyala → `EMAIL_PASSWORD` olarak kullan

Örnek: `abcd efgh ijkl mnop`

---

### 3. Vercel'de Env Variables Ekle

1. **Vercel Dashboard'a git:** https://vercel.com/dashboard
2. **Projenizi seçin** → **Settings**
3. **Environment Variables** tab
4. **Her bir variable'ı ekle:**

   - Key: `DATABASE_URL`
   - Value: `${POSTGRES_PRISMA_URL}`
   - Environment: **Production** ✅

5. **Save** her variable için

---

### 4. Redeploy

Environment variables ekledikten sonra:

**Yöntem A: Vercel Dashboard**

- Deployments → Latest → **...** → Redeploy

**Yöntem B: Git Push**

```powershell
git add .
git commit -m "chore: update environment variables"
git push
```

---

## 🔍 PRODUCTION TEST

Deployment tamamlandıktan sonra şunları test edin:

### 1. Database Connectivity

```
https://your-domain.vercel.app/api/health/db
```

**Beklenen:** `{"ok": true}`

### 2. Authentication

- Sign up: `https://your-domain.vercel.app/auth/signup`
- Sign in: `https://your-domain.vercel.app/auth/signin`

### 3. Email (Forgot Password)

- Forgot password: `https://your-domain.vercel.app/auth/forgot-password`
- Email gelip gelmediğini kontrol et

### 4. Admin Panel

- Admin login: `wastedtr34@gmail.com` / `admin123`
- ⚠️ **İlk giriş sonrası şifreyi mutlaka değiştir!**
- Admin panel: `https://your-domain.vercel.app/admin`

---

## 🚨 SORUN GİDERME

### ❌ "Database connection failed"

- `DATABASE_URL` doğru mu kontrol et
- Vercel Postgres prefix `POSTGRES` mi?
- IP whitelist: Vercel IP'lerini database'e ekle

### ❌ "NEXTAUTH_SECRET not found"

- Environment variable ekledin mi?
- Scope: **Production** ✅ seçili mi?
- Redeploy yaptın mı?

### ❌ "Email sending failed"

- Gmail 2-Step Verification aktif mi?
- App Password kullanıyor musun? (normal şifre değil!)
- EMAIL_USER ve EMAIL_PASSWORD doğru mu?

### ❌ "Google Maps not loading"

- `NEXT_PUBLIC_` prefix var mı?
- API key doğru mu?
- Maps JavaScript API ve Places API aktif mi?

---

## 📋 CHECKLIST ÖZET

- [ ] `DATABASE_URL` eklendi
- [ ] `NEXTAUTH_SECRET` oluşturuldu ve eklendi
- [ ] `NEXTAUTH_URL` production domain ile güncellendi
- [ ] Gmail App Password oluşturuldu
- [ ] `EMAIL_*` variables eklendi
- [ ] (Opsiyonel) `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` eklendi
- [ ] Vercel'de redeploy yapıldı
- [ ] `/api/health/db` endpoint test edildi
- [ ] Sign up/sign in test edildi
- [ ] Forgot password (email) test edildi
- [ ] Admin şifresi değiştirildi

---

## 🎉 Tamamlandı mı?

Tüm checklistler ✅ ise production hazır!

**İyi okumalar! 📚**
