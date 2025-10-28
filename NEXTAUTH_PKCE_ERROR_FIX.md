# 🔧 NEXTAUTH PKCE ERROR FİX

## ❌ Hata:

```
InvalidCheck: pkceCodeVerifier value could not be parsed
```

Bu hata, NextAuth'un session/cookie yönetiminde sorun olduğunu gösterir.

---

## ✅ ÇÖZÜMLER

### ÇÖZÜM 1: NEXTAUTH_URL Kontrolü (En Yaygın Sebep!)

Vercel'de `NEXTAUTH_URL` **tam domain** ile eşleşmeli!

#### Yanlış Örnekler:

```bash
❌ NEXTAUTH_URL = http://your-domain.vercel.app  (http yerine https!)
❌ NEXTAUTH_URL = https://your-domain.vercel.app/ (sonda / var!)
❌ NEXTAUTH_URL = your-domain.vercel.app (protokol yok!)
```

#### Doğru:

```bash
✅ NEXTAUTH_URL = https://your-exact-domain.vercel.app
```

**ADIMLAR:**

1. Vercel'deki **gerçek domain**'inizi öğrenin:

   - Deployments → Latest → **Visit** tıklayın
   - URL'yi kopyalayın (örn: `https://okuyamayanlar.vercel.app`)

2. Settings → Environment Variables → `NEXTAUTH_URL`
3. Value'yu **tam olarak** bu URL ile değiştirin:

   ```
   https://okuyamayanlar.vercel.app
   ```

   ⚠️ Sonunda `/` olmamalı!
   ⚠️ `https://` ile başlamalı (http değil!)

4. Save → Redeploy (without cache)

---

### ÇÖZÜM 2: NEXTAUTH_SECRET Yenile

Eski/geçersiz secret bu hataya sebep olabilir.

**PowerShell'de yeni secret oluştur:**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Vercel'de güncelle:**

1. Settings → Environment Variables → `NEXTAUTH_SECRET`
2. Yeni oluşturduğunuz secret'i yapıştırın
3. Save → Redeploy

---

### ÇÖZÜM 3: Trusted Host Ayarı (auth.ts)

NextAuth v5'te `trustHost` ayarı gerekebilir.

**Kontrol: `auth.ts` dosyası**

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true, // ← BU SATIR EKLENMEL İ!
  pages: {
    signIn: "/auth/signin",
  },
  // ...diğer ayarlar
});
```

---

### ÇÖZÜM 4: Environment Variables Scope

`NEXTAUTH_URL` ve `NEXTAUTH_SECRET` **3 scope'ta da** olmalı:

```
NEXTAUTH_URL
  ✅ Production
  ✅ Preview
  ✅ Development

NEXTAUTH_SECRET
  ✅ Production
  ✅ Preview
  ✅ Development
```

---

### ÇÖZÜM 5: Cookie Secure Ayarları

Vercel production'da cookies `secure` olmalı (HTTPS).

**auth.ts'de cookies ayarı:**

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...diğer ayarlar
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true, // Production için true!
      },
    },
  },
});
```

---

## 🎯 HIZLI FİX (En Yaygın Çözüm)

### 1. Gerçek Domain'i Öğren

Tarayıcıda production sitenize gidin, URL'yi kopyalayın:

```
https://okuyamayanlar-book-club.vercel.app
```

### 2. Vercel Environment Variable Güncelle

```bash
NEXTAUTH_URL = https://okuyamayanlar-book-club.vercel.app
```

⚠️ **TAM OLARAK** bu formatta, son karaktere kadar aynı!

### 3. Redeploy

Deployments → Redeploy (without cache)

---

## 🔍 AUTH.TS KONTROL

Mevcut `auth.ts` dosyanızı kontrol edelim:

```typescript
export const runtime = "nodejs";
import NextAuth from "next-auth";
// ... imports

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true, // ← BUNU EKLEY İN!
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // ...
    }),
  ],
  callbacks: {
    // ...mevcut callbacks
  },
});
```

`trustHost: true` eklenmediyse ekleyin!

---

## 📋 CHECKLIST

- [ ] `NEXTAUTH_URL` gerçek domain ile eşleşiyor (https://)
- [ ] `NEXTAUTH_URL` sonunda `/` yok
- [ ] `NEXTAUTH_SECRET` 32+ karakter random string
- [ ] `NEXTAUTH_URL` scope: Production + Preview + Development
- [ ] `NEXTAUTH_SECRET` scope: Production + Preview + Development
- [ ] `auth.ts` dosyasında `trustHost: true` var
- [ ] Redeploy without cache yapıldı
- [ ] Test: Giriş çalışıyor

---

## 🚨 HALA SORUN VARSA

### Custom Domain Kullanıyorsanız

Eğer `your-custom-domain.com` kullanıyorsanız:

```bash
NEXTAUTH_URL = https://your-custom-domain.com
```

Vercel domain değil, **custom domain** kullanın!

### Multiple Domains

Eğer birden fazla domain varsa (örn: preview branches):

```bash
# Production
NEXTAUTH_URL = https://okuyamayanlar.com

# Preview
NEXTAUTH_URL = https://okuyamayanlar-git-main.vercel.app
```

Her environment için ayrı `NEXTAUTH_URL` ayarlayın!

---

## 💡 ÖNERİ: Environment Variables Tam Liste

Vercel'de şunlar olmalı:

```bash
# Database
DATABASE_URL = ${POSTGRES_PRISMA_URL}

# NextAuth (EN ÖNEMLİ!)
NEXTAUTH_URL = https://your-exact-domain.vercel.app
NEXTAUTH_SECRET = your-long-random-secret-key

# Email
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-gmail-app-password
EMAIL_FROM = Okuyamayanlar <noreply@okuyamayanlar.com>

# Google OAuth (Opsiyonel)
GOOGLE_CLIENT_ID = your-client-id
GOOGLE_CLIENT_SECRET = your-client-secret
```

**HER BİRİ:** Production + Preview + Development ✅

---

## ✅ TEST

Redeploy sonrası:

1. `https://your-domain.vercel.app/auth/signin`
2. Email ile giriş dene
3. Google ile giriş dene (eğer setup yaptıysanız)
4. ✅ Başarılı!

---

**🎉 PKCE hatası çözülecek! En önemli: NEXTAUTH_URL doğru olmalı!**
