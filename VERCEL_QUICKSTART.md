# 🎯 Vercel Deployment - Hızlı Başlangıç

## 🚀 1. Hızlı Hazırlık (5 dakika)

### Script ile Otomatik Kontrol

```powershell
.\vercel-quickstart.ps1
```

Bu script:

- ✅ Git durumunu kontrol eder
- ✅ Dependencies'i kontrol eder
- ✅ Build testi yapar
- ✅ Environment dosyalarını kontrol eder

### Manuel Hazırlık

```powershell
# 1. Build test
npm run build

# 2. Git commit
git add .
git commit -m "Vercel deployment hazırlığı"
git push origin main
```

## 🌐 2. Vercel'de Proje Oluştur (3 dakika)

1. **Vercel'e Git**: https://vercel.com
2. **Import Project** > GitHub
3. **Repository Seç**: `Okuyamayanlar-web-sayfas-`
4. **Import** butonuna tıkla

## 🔐 3. Environment Variables Ekle (5 dakika)

Vercel Dashboard > Settings > Environment Variables

### Minimum Gerekli Variables:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü
```

> 💡 **İpucu**: `.env.example` dosyasında tüm değişkenler var!

## 🗄️ 4. Database Hazırla (Seçenekler)

### A) Vercel Postgres (En Kolay)

1. Vercel Dashboard > Storage > Create Database
2. Postgres seç
3. DATABASE_URL otomatik eklenir

### B) Supabase (Ücretsiz 500MB)

1. https://supabase.com > New project
2. Settings > Database > Connection string
3. Pooling URL'i kopyala (Transaction mode)
4. Vercel'e ekle

### C) Neon (Ücretsiz 3GB)

1. https://neon.tech > New project
2. Connection string'i kopyala
3. Vercel'e ekle

## 🎯 5. Deploy Et! (2 dakika)

1. **Deploy** butonuna tıkla
2. Build tamamlanmasını bekle (2-5 dk)
3. Production URL'i kopyala

## ✅ 6. Deployment Sonrası (3 dakika)

### NEXTAUTH_URL'i Güncelle

```
1. Vercel > Settings > Environment Variables
2. NEXTAUTH_URL değerini güncelle
3. Redeploy et
```

### Database Migration

Vercel Dashboard > Deployments > Son deployment > "..." > Redeploy

## 🧪 7. Test Et!

- [ ] Site açılıyor: `https://your-app.vercel.app`
- [ ] Kayıt olma çalışıyor
- [ ] Giriş yapma çalışıyor
- [ ] Email gönderimi çalışıyor

## 🆘 Sorun mu var?

### Build Hatası

```powershell
# Local'de test et
npm run build
```

### Database Bağlantı Hatası

- DATABASE_URL doğru mu?
- Connection pooling var mı? (`?pgbouncer=true`)

### Email Gönderilmiyor

- Gmail App Password doğru mu?
- 2-Step Verification aktif mi?

## 📚 Detaylı Rehber

Daha fazla bilgi için:

- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Detaylı deployment rehberi
- [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md) - Adım adım checklist
- [README.md](./README.md) - Genel proje dokümantasyonu

## 🎉 Tamamlandı!

Tebrikler! Uygulamanız artık canlıda! 🚀

---

**⏱️ Toplam Süre**: ~20 dakika
**💰 Maliyet**: Ücretsiz (Hobby plan)
