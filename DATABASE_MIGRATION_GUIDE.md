# 🔄 VERİTABANI AKTARIMI REHBERİ

## 📊 Mevcut Verilerinizi Yeni Veritabanına Taşıma

### Adım 1: Eski Veritabanından Veri Dışa Aktarma (Export)

**Yöntem A: pg_dump ile (Önerilen)**

```powershell
# Eski veritabanından tam yedek al
pg_dump "postgresql://USER:PASSWORD@OLD_HOST:5432/OLD_DATABASE" -f backup.sql

# VEYA sadece verileri (CREATE TABLE komutları olmadan)
pg_dump "postgresql://USER:PASSWORD@OLD_HOST:5432/OLD_DATABASE" --data-only -f data-only.sql
```

**Yöntem B: Prisma Studio ile**

1. Eski veritabanına bağlan:

```powershell
# .env.local'de eski DATABASE_URL'i ayarla
# Sonra çalıştır:
npx prisma studio
```

2. Verileri manuel olarak CSV'ye export et (her tablo için)

---

### Adım 2: Yeni Veritabanını Hazırla

```powershell
# Yeni veritabanı URL'ini .env.local'e ekle
# DATABASE_URL="postgresql://NEW_USER:NEW_PASSWORD@NEW_HOST:5432/NEW_DATABASE?sslmode=require"

# Migration'ları çalıştır (tablolar oluşturulsun)
npm run migrate:deploy

# Veya development modunda:
npx prisma db push
```

---

### Adım 3: Verileri Yeni Veritabanına Aktar

**Yöntem A: pg_restore ile (backup.sql varsa)**

```powershell
# Sadece verileri import et (tablolar zaten Prisma ile oluştu)
psql "postgresql://NEW_USER:NEW_PASSWORD@NEW_HOST:5432/NEW_DATABASE?sslmode=require" -f data-only.sql
```

**Yöntem B: Seed Script ile (Önerilen - Temiz Başlangıç)**

```powershell
# Mevcut seed.ts dosyasını çalıştır
npm run db:seed
```

⚠️ **DİKKAT:** Seed script sadece örnek verileri ekler. Gerçek kullanıcı verileriniz değil!

**Yöntem C: Manuel Migrasyon Script'i (Gerçek Veriler İçin)**

Aşağıdaki script'i kullanarak eski DB'den yeni DB'ye veri kopyalayın:

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from "@prisma/client";

const oldDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.OLD_DATABASE_URL!,
    },
  },
});

const newDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});

async function main() {
  console.log("🔄 Migrating users...");
  const users = await oldDb.user.findMany();
  for (const user of users) {
    await newDb.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  console.log("🔄 Migrating books...");
  const books = await oldDb.book.findMany();
  for (const book of books) {
    await newDb.book.create({ data: book }).catch(() => {
      console.log(`Skipping existing book: ${book.title}`);
    });
  }

  // Diğer tablolar için tekrarla...

  console.log("✅ Migration complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  });
```

Çalıştırma:

```powershell
# .env.local'e ekle:
# OLD_DATABASE_URL="eski_db_url_buraya"
# DATABASE_URL="yeni_db_url_buraya"

npx ts-node scripts/migrate-data.ts
```

---

### Adım 4: Verileri Doğrula

```powershell
# Prisma Studio ile kontrol et
npx prisma studio

# Veya komut satırında:
npx prisma db seed --preview-feature
```

---

## 🔐 ENVIRONMENT VARIABLES GÜNCELLEMESİ

### Local Development (.env.local)

```bash
# YENİ DATABASE
DATABASE_URL="postgresql://USER:PASSWORD@NEW_HOST:5432/NEW_DATABASE?sslmode=require"

# ESKİ DATABASE (migration için geçici)
OLD_DATABASE_URL="postgresql://OLD_USER:OLD_PASSWORD@OLD_HOST:5432/OLD_DATABASE"
```

### Vercel Production

1. **Vercel Dashboard'a git:**

   - Settings → Environment Variables

2. **Şu değişkenleri EKLE/GÜNCELLE:**

```bash
# DATABASE (ZORUNLU)
DATABASE_URL="${POSTGRES_PRISMA_URL}"
# VEYA manuel URL:
# DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require&connection_limit=1&pool_timeout=0"

# NEXTAUTH (ZORUNLU)
NEXTAUTH_SECRET="YENI_RANDOM_SECRET_KEY"  # openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.vercel.app"

# EMAIL (Şifre sıfırlama için - ZORUNLU)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"  # Google App Password
EMAIL_FROM="Okuyamayanlar <noreply@okuyamayanlar.com>"

# GOOGLE MAPS (Opsiyonel - etkinlik haritası için)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# PUBLIC VARIABLES (Opsiyonel)
NEXT_PUBLIC_APP_NAME="Okuyamayanlar"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

---

## 📧 GMAIL APP PASSWORD ALMA

1. **Google Account'a git:** https://myaccount.google.com
2. **Security** → **2-Step Verification** (Aktifleştir)
3. **App Passwords** → **Select app: Mail** → **Generate**
4. **16 haneli şifreyi** `EMAIL_PASSWORD` olarak kullan

---

## ✅ DEPLOYMENT SONRASı KONTROLLER

### 1. Migration Çalıştır

```powershell
# Vercel production'da (tek sefer):
vercel env pull .env.production
npm run migrate:deploy
```

### 2. Seed Verilerini Ekle (isteğe bağlı)

```powershell
npm run db:seed
```

### 3. Health Check

```bash
# Production URL'de test et:
https://your-domain.vercel.app/api/health/db

# Beklenen sonuç:
{"ok": true, "timestamp": "..."}
```

---

## 🚨 SORUN GİDERME

### "Connection refused" hatası

```bash
# Firewall/IP whitelist kontrolü
# Vercel IP'lerini database'e ekle (Supabase/PlanetScale/Neon ise)
```

### "SSL required" hatası

```bash
# DATABASE_URL sonuna ekle:
?sslmode=require

# VEYA connection pooling için:
?sslmode=require&connection_limit=1&pool_timeout=0
```

### "Migration failed" hatası

```powershell
# Migration durumunu kontrol et:
npm run migrate:status

# Sıfırdan migration (DİKKAT: Veri kaybı!):
npm run db:reset
```

---

## 📝 ÖNEMLİ NOTLAR

✅ **Local geliştirme:** `.env.local` kullan (git'e eklenmesin!)
✅ **Production:** Vercel Dashboard'dan env variables ekle
✅ **NEXTAUTH_SECRET:** Mutlaka production'da değiştir!
✅ **EMAIL_PASSWORD:** Gmail App Password kullan (normal şifre değil!)
⚠️ **Seed admin:** Default şifre `admin123` - Mutlaka değiştir!
🔒 **Database backup:** Migration öncesi mutlaka yedek al!

---

## 🎯 HIZLI BAŞLANGIÇ

```powershell
# 1. Yeni veritabanı URL'ini .env.local'e ekle
# 2. Migration'ları çalıştır:
npm run migrate:deploy

# 3. Seed verilerini ekle:
npm run db:seed

# 4. Local'de test et:
npm run dev

# 5. Vercel'de env variables ekle
# 6. Redeploy
```
