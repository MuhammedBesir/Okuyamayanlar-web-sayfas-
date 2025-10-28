# OAuthAccountNotLinked Hatası Çözümü

## 🔍 Sorun Nedir?

`OAuthAccountNotLinked` hatası, **aynı email adresi ile hem normal kayıt hem de Google OAuth kullanmaya çalıştığında** oluşur.

### Senaryo:
1. ✅ `test@gmail.com` ile email/password kaydı yaptın
2. ❌ Sonra aynı `test@gmail.com` Google hesabı ile giriş yapmaya çalıştın
3. ⚠️ NextAuth güvenlik için bu iki hesabı otomatik birleştirmiyor

---

## ✅ ÇÖZÜMLER

### Çözüm 1: Farklı Email Kullan (EN KOLAY)

Google OAuth'u **daha önce kayıt olmadığın** bir Gmail hesabı ile test et:

```
1. Incognito mode aç
2. https://okuyamayanlar-web-sayfasi.vercel.app/auth/signin
3. "Google ile Giriş Yap"
4. Farklı bir Gmail hesabı seç
5. ✅ Başarılı!
```

---

### Çözüm 2: Mevcut Kullanıcıyı Sil (TEST İÇİN)

Eğer aynı email ile devam etmek istiyorsan:

**Admin panelinden:**
1. https://okuyamayanlar-web-sayfasi.vercel.app/admin/users
2. Kullanıcıyı bul ve sil
3. Tekrar Google ile giriş yap
4. ✅ Yeni hesap OAuth ile oluşturulacak

**Veya API ile:**
```powershell
$body = @{
  email = "test@gmail.com"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://okuyamayanlar-web-sayfasi.vercel.app/api/admin/delete-user-for-oauth" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

### Çözüm 3: Account Linking (GELİŞMİŞ)

Production'da kullanıcılar için hesap birleştirme özelliği ekle:

**auth.ts'ye ekle:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true }
        })

        if (existingUser) {
          // Check if Google account already linked
          const hasGoogleAccount = existingUser.accounts.some(
            acc => acc.provider === "google"
          )

          if (!hasGoogleAccount) {
            // Link Google account to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            })
            
            return true // Allow sign in
          }
        }
      }
      
      return true
    },
    // ... diğer callbacks
  }
})
```

⚠️ **Dikkat:** Bu yaklaşım güvenlik riski taşır çünkü herkes başkasının email'ine sahip Google hesabı ile giriş yapabilir.

---

## 🎯 ÖNERİLEN YAKLAŞIM

### Test Aşaması:
- **Farklı email** kullan (test1@gmail.com, test2@gmail.com, vs.)
- Her test için yeni Gmail hesabı

### Production:
- **Kullanıcı Eğitimi:** "Bu email adresi zaten kayıtlı. Normal giriş yapın."
- **Şifre Sıfırlama:** Kullanıcıya şifre sıfırlama linki göster
- **Manuel Account Linking:** Admin onayı ile hesap birleştirme

---

## 📋 Test Senaryoları

### Senaryo 1: Yeni Kullanıcı (OAuth)
```
1. test1@gmail.com daha önce kayıt olmamış
2. Google ile giriş yap
3. ✅ Otomatik hesap oluşturulur
4. ✅ Username otomatik: "test1" veya "test11"
5. ✅ emailVerified: true (Google zaten doğruladı)
```

### Senaryo 2: Mevcut Kullanıcı (Email/Password)
```
1. test2@gmail.com ile email/password kaydı yaptın
2. Google ile aynı email ile giriş yapmaya çalış
3. ❌ OAuthAccountNotLinked hatası
4. ℹ️ "Bu email zaten kayıtlı. Normal giriş yapın."
```

### Senaryo 3: Mevcut Kullanıcı Silindi
```
1. test2@gmail.com kullanıcısı silindi
2. Google ile test2@gmail.com ile giriş yap
3. ✅ Yeni hesap OAuth ile oluşturulur
```

---

## 🔧 Vercel Environment Variables Kontrol

Google OAuth'un çalışması için:

```bash
# Vercel Dashboard → Settings → Environment Variables

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
NEXTAUTH_URL=https://okuyamayanlar-web-sayfasi.vercel.app
NEXTAUTH_SECRET=<32+ karakter>
DATABASE_URL=postgresql://...
```

**Test komutu:**
```powershell
Invoke-RestMethod -Uri "https://okuyamayanlar-web-sayfasi.vercel.app/api/health/db"
```

Başarılı: `ok : True`

---

## 💡 Öneriler

1. **Test için:** Farklı Gmail hesapları kullan
2. **Production için:** Kullanıcıya açık hata mesajı göster
3. **Gelecek için:** Profile sayfasına "Google hesabını bağla" özelliği ekle
4. **Güvenlik için:** Account linking yaparken email doğrulama yap

---

## ✅ Hızlı Test

```powershell
# 1. Database health check
Invoke-RestMethod -Uri "https://okuyamayanlar-web-sayfasi.vercel.app/api/health/db"

# 2. Migration status
Invoke-RestMethod -Uri "https://okuyamayanlar-web-sayfasi.vercel.app/api/migrations/username-optional"

# 3. Google OAuth test
# Tarayıcıda: https://okuyamayanlar-web-sayfasi.vercel.app/auth/signin
# Yeni Gmail hesabı ile giriş yap
```

✅ Username artık opsiyonel: `isOptional: True`
✅ Google OAuth hazır, sadece **Vercel environment variables** ayarlanmalı!
