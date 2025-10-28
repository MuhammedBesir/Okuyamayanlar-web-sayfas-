# 🔧 VERCEL DATABASE_URL SORUN GİDERME

## Sorun: `the URL must start with the protocol postgresql://`

Bu hata, Vercel'in build/deploy sırasında `DATABASE_URL`'yi okuyamaması demektir.

---

## ✅ ÇÖZÜM ADIMLARI

### 1. Vercel Dashboard → Settings → Environment Variables

### 2. DATABASE_URL'yi Kontrol Et

#### Option A: POSTGRES_PRISMA_URL Değerini KOPYALA

**Eğer Vercel Postgres kullanıyorsanız:**

1. **Storage** → Postgres database'inize tıklayın
2. **Quickstart** veya **.env.local** tab'ına tıklayın
3. Environment variables'ı görün:

   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← BUNDAN DEĞERİ KOPYALA
   - `POSTGRES_URL_NON_POOLING`

4. **Settings** → **Environment Variables** git
5. `DATABASE_URL` değişkenini bulun ve **Edit**
6. Value alanına, `POSTGRES_PRISMA_URL`'in GERÇEK DEĞERİNİ yapıştırın

   Örnek (değer örnektir):

   ```
   postgres://username:password@host:5432/db?sslmode=require&pgbouncer=true&connection_limit=1
   ```

   ⚠️ ÖNEMLİ: Vercel, `${VAR}` şeklinde değişken İNTERPOLASYONU YAPMAZ. `${POSTGRES_PRISMA_URL}` YAZMAYIN. TIRNAK DA KOYMAYIN.

7. **Environment** bölümünde ÜÇÜNÜ DE SEÇİN:

   - ✅ Production
   - ✅ Preview
   - ✅ Development

8. **Save**

---

### 3. Vercel Postgres Environment Variables'ları Kontrol Et

Eğer `POSTGRES_PRISMA_URL` yoksa:

1. **Storage** → Postgres database
2. Sağ üst → **...** (3 nokta) → **Manage**
3. **Connect** → **Environment Variables** kopyala
4. **Settings** → **Environment Variables** → Her birini manuel ekle:

```bash
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

**Environment:** Production, Preview, Development HEPS İ ✅

---

### 4. DATABASE_URL Scope Kontrolü

`DATABASE_URL` environment variable'ı **3 scope'ta da** olmalı:

```
Name: DATABASE_URL
Value: postgres://... (tam bağlantı stringi)
Environment:
   ✅ Production
   ✅ Preview
   ✅ Development
```

**NEDEN?**

- **Production:** Canlı site için
- **Preview:** Pull request preview'ları için
- **Development:** `vercel dev` için

Eğer sadece Production'da varsa, build sırasında erişilemeyebilir!

---

### 5. Custom Prefix Kontrolü

Vercel Postgres'in **Custom Prefix**'i farklı olabilir (örn: `POSTGRES_2`). Bu durumda da mantık aynı:

- `POSTGRES_PRISMA_URL` veya `POSTGRES_2_PRISMA_URL` DEĞERİNİ kopyalayıp `DATABASE_URL` alanına YAPIŞTIRIN.
- `${...}` kullanmayın; Vercel değer interpolasyonu yapmaz.

---

### 6. Redeploy (Without Cache!)

1. **Deployments** tab
2. En son deployment → **...** → **Redeploy**
3. ✅ **"Use existing Build Cache"** seçimini KALDIR
4. **Redeploy**

---

## 🎯 DOĞRU SETUP ÖRNEĞİ

Vercel Environment Variables şu şekilde olmalı:

```bash
# Vercel Postgres Variables (otomatik eklenir)
POSTGRES_URL = postgres://...
POSTGRES_PRISMA_URL = postgres://...
POSTGRES_URL_NON_POOLING = postgres://...
POSTGRES_USER = ...
POSTGRES_HOST = ...
POSTGRES_PASSWORD = ...
POSTGRES_DATABASE = ...

# Manuel eklediğiniz (DEĞERİ YAPIŞTIRIN)
DATABASE_URL = postgres://username:password@host:5432/db?sslmode=require&pgbouncer=true&connection_limit=1
NEXTAUTH_SECRET = your-secret
NEXTAUTH_URL = https://your-domain.vercel.app
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password
EMAIL_FROM = Okuyamayanlar <noreply@okuyamayanlar.com>
```

**HER BİRİNİN Environment Scope'u:** Production, Preview, Development ✅

---

## 🔍 Alternatif: Manuel PostgreSQL URL

Eğer Vercel Postgres kullanmıyorsanız, DATABASE_URL'yi direkt connection string olarak ekleyin:

```bash
DATABASE_URL = postgresql://username:password@host:5432/database?sslmode=require&pgbouncer=true
```

**Önemli parametreler:**

- `sslmode=require` → SSL zorunlu
- `pgbouncer=true` → Connection pooling
- `connection_limit=1` → Serverless için

**Tam örnek:**

```bash
postgresql://myuser:MyP@ssw0rd@my-db.postgres.azure.com:5432/bookclub?sslmode=require&pgbouncer=true&connection_limit=1
```

---

## ✅ TEST

Redeploy tamamlandıktan sonra:

1. `https://your-domain.vercel.app/api/auth/signin`
2. Email: `wastedtr34@gmail.com`
3. Şifre: `admin123`
4. ✅ Giriş başarılı!

---

## 🚨 HALA SORUN VARSA

### Build Logs'u Kontrol Et

1. **Deployments** → Failed deployment'a tıkla
2. **Build Logs** açılır
3. `prisma generate` çıktısını incele
4. DATABASE_URL error var mı bak

### Prisma Logs

Eğer runtime error alıyorsanız:

1. **Deployments** → **Functions**
2. Log'larda Prisma error'ları ara
3. Connection string format hatası varsa DATABASE_URL'yi kontrol et

---

## 💡 HIZLI FİX CHECKLİST

- [ ] `DATABASE_URL` tam bir `postgres://` URL'si (`${...}` YOK, tırnak YOK)
- [ ] Environment scope: Production + Preview + Development ✅
- [ ] `POSTGRES_PRISMA_URL` değişkeni mevcut
- [ ] Custom Prefix doğru (POSTGRES veya başka?)
- [ ] Redeploy without cache yapıldı
- [ ] Build logs'da error yok
- [ ] Test: Giriş yapılabiliyor

---

**🎉 Artık Vercel'de DATABASE_URL doğru çalışacak!**
