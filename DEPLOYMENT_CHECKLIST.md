# 🔴 Vercel 502 BAD_GATEWAY Hatası - Acil Çözüm

## ❌ Hata:
```
502: BAD_GATEWAY
Code: DNS_HOSTNAME_NOT_FOUND
ID: fra1::6tf6s-1761329840726-fee158b3a8d8
```

**Sebep:** Vercel production'da DATABASE_URL'ye ulaşamıyor.

---

## ✅ ÇÖZÜM: Vercel Environment Variables Kontrolü

### 🚨 Kritik: DATABASE_URL Kontrolü

Vercel'de `DATABASE_URL` doğru mu kontrol edin:

**Yanlış (Local):**
```
postgresql://postgres:Aynur7230@localhost:5432/bookclub
```

**Doğru (Production - Neon):**
```
postgresql://neondb_owner:npg_DxKiIB72eCYg@ep-odd-mountain-agm7soa1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 📝 Adım Adım Çözüm:

### 1️⃣ Vercel Dashboard'a Git
https://vercel.com/dashboard

### 2️⃣ Projenizi Seçin
**Okuyamayanlar-web-sayfas-**

### 3️⃣ Settings → Environment Variables

### 4️⃣ DATABASE_URL'i Kontrol Edin

**Mevcut değer localhost içeriyorsa değiştirin:**

1. **DATABASE_URL** satırını bulun
2. **Edit** butonuna tıklayın
3. Değeri şununla değiştirin:
```
postgresql://neondb_owner:npg_DxKiIB72eCYg@ep-odd-mountain-agm7soa1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
4. **Production**, **Preview**, **Development** seçin (hepsini)
5. **Save** butonuna tıklayın

---

## 🔧 Diğer Eksik Environment Variables

Aynı zamanda şunları da ekleyin:

### Google OAuth:
```
GOOGLE_CLIENT_ID=808173437591-l2kh0029hucu4h46bjgoc260gccn8el8.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### Email Config:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=okuyamayanlar@gmail.com
EMAIL_PASSWORD=njtt pibg pteq vgdu
EMAIL_FROM=okuyamayanlar@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü
```

### Google Maps:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyApksl9pdoowu2f7s6GqZB3ribq5DyZDlU
```

**Not:** Her birini ayrı ayrı ekleyin, Environment olarak **Production + Preview + Development** seçin.

---

## 🚀 Deployment'ı Tetikleme

Environment variables ekledikten sonra:

### Otomatik (Önerilen):
```bash
git commit --allow-empty -m "Trigger redeploy after env vars update"
git push
```

### Manuel:
1. Vercel Dashboard → **Deployments**
2. En son deployment → **⋯** (üç nokta)
3. **Redeploy**
4. **Use existing Build Cache** ❌ KAPALI
5. **Redeploy** butonuna tıklayın

---

## ✅ Test

Deployment tamamlandıktan sonra (1-2 dakika):

1. Production URL'yi açın
2. **502 hatası gitmeli**
3. Sayfa yüklenmeli

---

## 🔍 Vercel Logs'ları Kontrol

Hala sorun varsa:

1. Vercel Dashboard → **Deployments**
2. En son deployment'a tıklayın
3. **Build Logs** ve **Function Logs** sekmelerini kontrol edin
4. Hata mesajlarını arayın

---

## 📋 Kontrol Listesi

- [ ] DATABASE_URL doğru (Neon PostgreSQL URL'i)
- [ ] GOOGLE_CLIENT_ID eklendi
- [ ] GOOGLE_CLIENT_SECRET eklendi
- [ ] EMAIL_* variables eklendi (7 tane)
- [ ] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY eklendi
- [ ] NEXTAUTH_URL doğru (production domain)
- [ ] NEXTAUTH_SECRET eklendi
- [ ] Redeploy tetiklendi
- [ ] Deployment başarılı
- [ ] 502 hatası gitti

---

## ⚠️ Önemli Notlar

### DATABASE_URL:
- **localhost** ASLA production'da çalışmaz
- Neon PostgreSQL URL'ini kullanın
- `sslmode=require` parametresi olmalı

### NEXTAUTH_URL:
Local'de:
```
http://localhost:3000
```

Production'da:
```
https://okuyamayanlar-web-sayfas-5omz975xf-muhammed-besirs-projects.vercel.app
```

---

## 🆘 Hala 502 Hatası Alıyorsanız

### 1. Vercel Function Logs'larını Kontrol Edin:
```
Dashboard → Deployments → Latest → Function Logs
```

### 2. Prisma Bağlantısını Test Edin:
Logs'larda şunları arayın:
- "Can't reach database server"
- "Connection refused"
- "ECONNREFUSED"
- "getaddrinfo ENOTFOUND"

### 3. DATABASE_URL Formatını Kontrol Edin:
Doğru format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### 4. Neon Dashboard'da Kontrol Edin:
- Database aktif mi?
- Connection string doğru mu?
- IP kısıtlaması var mı?

---

## 🎯 Hızlı Çözüm Özeti

1. ✅ Vercel → Settings → Environment Variables
2. ✅ DATABASE_URL'i Neon PostgreSQL URL ile değiştir
3. ✅ Diğer tüm variables'ları ekle
4. ✅ Redeploy yap
5. ✅ Test et

**Tahmini Süre:** 5 dakika

---

**Son Güncelleme:** 24 Ekim 2025
**Hata Kodu:** DNS_HOSTNAME_NOT_FOUND
**Çözüm:** DATABASE_URL güncelleme
