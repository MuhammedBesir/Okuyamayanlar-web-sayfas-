# Google OAuth Test Adımları

## ✅ Migration Başarılı!

Username kolonu artık opsiyonel (nullable). Google OAuth için hazır!

**Doğrulama:**

```powershell
Invoke-RestMethod -Uri "https://okuyamayanlar-web-sayfasi.vercel.app/api/migrations/username-optional"
```

Sonuç:

```
isOptional: True  ✅
is_nullable: YES  ✅
```

---

## 🔧 YAPILMASI GEREKENLER

### 1. Vercel Environment Variables Güncelle

**Vercel Dashboard** → Settings → Environment Variables

Şu değişkenleri kontrol et ve **doğru domain ile** güncelle:

```bash
# ⚠️ ÖNEMLİ: Doğru domain kullan!
NEXTAUTH_URL=https://okuyamayanlar-web-sayfasi.vercel.app

# Diğer değişkenler (kontrol et):
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
NEXTAUTH_SECRET=<32+ karakter random string>
DATABASE_URL=<Neon PostgreSQL URL>
```

**Değişiklikten sonra:**

- Deployments → Latest deployment → ⋯ → **Redeploy**

---

### 2. Google Cloud Console Güncelle

**Google Cloud Console** → APIs & Services → Credentials

**Authorized redirect URIs** kısmına şunu ekle:

```
https://okuyamayanlar-web-sayfasi.vercel.app/api/auth/callback/google
```

⚠️ **DİKKAT:**

- `https://` ile başlamalı (http değil!)
- Sonunda `/` olmamalı
- Tam olarak bu domain olmalı

---

### 3. Test Et

**Redeploy bittikten sonra:**

1. **Incognito/Private mode** aç
2. https://okuyamayanlar-web-sayfasi.vercel.app/auth/signin adresine git
3. **"Google ile Giriş Yap"** butonuna tıkla
4. Google hesabını seç
5. ✅ Başarılı olacak!

---

## 🐛 Sorun Devam Ederse

### Vercel Function Logs Kontrol Et

1. Vercel Dashboard → Deployments → Latest
2. **Function Logs** tab'ına git
3. Google ile giriş yapmayı dene
4. Log'larda error'a bak

### Environment Variables Doğrula

PowerShell'de kontrol scripti çalıştır:

```powershell
# Vercel'de çalışacak şekilde test et
Invoke-RestMethod -Uri "https://okuyamayanlar-web-sayfasi.vercel.app/api/health/db"
```

Başarılı olursa: `{"ok": true}`

---

## 📋 Checklist

- [ ] Vercel'de `NEXTAUTH_URL` = `https://okuyamayanlar-web-sayfasi.vercel.app` (sonunda `/` yok)
- [ ] Vercel'de `GOOGLE_CLIENT_ID` ayarlandı
- [ ] Vercel'de `GOOGLE_CLIENT_SECRET` ayarlandı
- [ ] Vercel'de `NEXTAUTH_SECRET` ayarlandı (32+ karakter)
- [ ] Vercel'de `DATABASE_URL` ayarlandı
- [ ] Google Cloud Console'da redirect URI = `https://okuyamayanlar-web-sayfasi.vercel.app/api/auth/callback/google`
- [ ] Vercel redeploy yapıldı
- [ ] Incognito modda test edildi
- [ ] Google OAuth başarılı ✅

---

## 💡 Not

Migration endpoint artık silinebilir (güvenlik için):

```powershell
Remove-Item -Path "app\api\migrations\username-optional" -Recurse -Force
git add -A
git commit -m "security: remove migration endpoint after successful migration"
git push origin main
```

Ama önce Google OAuth'u test et! 🚀
