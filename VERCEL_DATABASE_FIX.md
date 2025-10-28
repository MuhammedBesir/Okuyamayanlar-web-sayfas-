# 🔧 VERCEL DATABASE_URL HATASI ÇÖZÜMÜ

## ❌ Hata:

```
the URL must start with the protocol `postgresql://` or `postgres://`
```

Bu hata, Vercel'de `DATABASE_URL` environment variable'ın yanlış ayarlandığını gösteriyor.

---

## ✅ ÇÖZÜM

### Seçenek 1: Vercel Postgres Kullanıyorsanız

Vercel Dashboard'da:

1. **Settings** → **Environment Variables**
2. `DATABASE_URL` değişkenini **DÜZENLE** (Edit)
3. `POSTGRES_PRISMA_URL`'in GERÇEK DEĞERİNİ kopyalayın (Storage → Postgres → Quickstart / .env.local)
4. Bu DEĞERİ `DATABASE_URL` alanına YAPIŞTIRIN (ör: `postgres://...` ile başlar)

⚠️ **DİKKAT:** Vercel env değerlerinde `${VAR}` interpolasyonu YOKTUR. `${POSTGRES_PRISMA_URL}` yazmayın. Tırnak işareti de kullanmayın.

5. **Save** tıkla
6. **Deployments** → Latest → **Redeploy** (without cache)

---

### Seçenek 2: Manuel PostgreSQL Kullanıyorsanız

`DATABASE_URL` değerini tam connection string ile değiştir:

```bash
postgresql://username:password@host:5432/database?sslmode=require
```

**Örnek:**

```bash
postgresql://myuser:mypassword@my-db-host.com:5432/bookclub?sslmode=require
```

---

## 🔍 Vercel Environment Variables Kontrol

Şu şekilde olmalı:

```bash
# ✅ DOĞRU
DATABASE_URL = postgres://username:password@host:5432/db?sslmode=require&pgbouncer=true&connection_limit=1

# ❌ YANLIŞ
DATABASE_URL = "${POSTGRES_PRISMA_URL}"
DATABASE_URL = ${POSTGRES_PRISMA_URL}
DATABASE_URL = POSTGRES_PRISMA_URL
DATABASE_URL = ""
DATABASE_URL = undefined
```

---

## 📋 ADIMLAR

### 1. Vercel Dashboard'a Git

https://vercel.com/dashboard → Projeniz

### 2. Settings → Environment Variables

### 3. DATABASE_URL'yi Bul ve Edit

### 4. Value'yu Değiştir

**Eğer Vercel Postgres kullanıyorsanız:** `POSTGRES_PRISMA_URL` değerini kopyalayıp yapıştırın.

**Eğer harici PostgreSQL kullanıyorsanız:**

```
postgresql://user:pass@host:5432/db?sslmode=require
```

### 5. Save

### 6. Redeploy

- **Deployments** tab
- Latest deployment'ın yanındaki **...** (3 nokta)
- **Redeploy**
- ✅ **Use existing Build Cache** seçimini KALDIR
- **Redeploy** tıkla

---

## 🎯 Alternatif: Vercel CLI ile

```powershell
# Vercel CLI kur (eğer yoksa)
npm i -g vercel

# Login
vercel login

# Environment variable ekle
vercel env add DATABASE_URL production

# İstendiğinde DEĞERİ yapıştır (postgres:// ile başlayan tam string)

# Redeploy
vercel --prod
```

---

## ✅ Test Et

Deploy tamamlandıktan sonra:

```
https://your-domain.vercel.app/api/auth/signin
```

Giriş yapabiliyorsanız ✅ sorun çözülmüş!

---

## 🔥 HIZLI ÇÖZÜM

1. Vercel → Settings → Environment Variables
2. DATABASE_URL alanına `POSTGRES_PRISMA_URL`'in GERÇEK DEĞERİNİ yapıştır (`${...}` YOK, tırnak YOK!)
3. Save
4. Deployments → Redeploy (without cache)
5. ✅ Çözüldü!

---

## 📞 Hala Sorun Varsa

Vercel Postgres'in **Custom Prefix**'ini kontrol et:

1. **Storage** tab → Postgres database'iniz
2. **Settings** → **Custom Prefix**
3. Şu olmalı: **POSTGRES** (veya farklı bir prefix olabilir)
4. Prefix farklıysa (örn: POSTGRES_2), o prefix'e ait `..._PRISMA_URL` DEĞERİNİ kopyalayıp `DATABASE_URL`'ye yapıştırın. `${...}` kullanmayın.

---

**🎉 Sorun çözülecek! Redeploy sonrası giriş yapabileceksiniz.**
