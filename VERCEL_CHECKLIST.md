# ✅ Vercel Deployment Hızlı Kontrol Listesi

Vercel'e deploy etmeden önce bu listeyi kontrol edin.

## 🔧 Ön Hazırlık (Local)

- [ ] `npm install` çalıştırıldı
- [ ] `npm run build` başarılı
- [ ] `.env.example` dosyası mevcut ve güncel
- [ ] `.gitignore` dosyası `.env` içeriyor
- [ ] Git'te tüm değişiklikler commit edildi
- [ ] `main` branch'e push edildi

## 🗄️ Veritabanı Hazırlığı

### Vercel Postgres Kullanacaksanız:

- [ ] Vercel Dashboard'da PostgreSQL database oluşturuldu

### Harici PostgreSQL (Supabase/Neon) Kullanacaksanız:

- [ ] PostgreSQL database oluşturuldu
- [ ] Connection string (pooling URL) kopyalandı
- [ ] Connection limit ayarlandı (`?connection_limit=1`)

## 🌐 Vercel Setup

- [ ] Vercel hesabı oluşturuldu
- [ ] GitHub ile bağlantı kuruldu
- [ ] Repository import edildi
- [ ] Framework otomatik algılandı (Next.js)

## 🔐 Environment Variables (Zorunlu)

Vercel Dashboard > Settings > Environment Variables:

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - 32+ karakter random string
- [ ] `NEXTAUTH_URL` - İlk deploy sonrası eklenecek
- [ ] `NODE_ENV` - `production`
- [ ] `EMAIL_HOST` - `smtp.gmail.com`
- [ ] `EMAIL_PORT` - `587`
- [ ] `EMAIL_SECURE` - `false`
- [ ] `EMAIL_USER` - Gmail adresiniz
- [ ] `EMAIL_PASSWORD` - Gmail App Password (16 haneli)
- [ ] `EMAIL_FROM` - Gmail adresiniz
- [ ] `EMAIL_FROM_NAME` - `Okuyamayanlar Kitap Kulübü`

## 🔧 Environment Variables (Opsiyonel)

- [ ] `GOOGLE_CLIENT_ID` - Google OAuth (eğer kullanıyorsanız)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth Secret
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API

## 🚀 İlk Deployment

- [ ] "Deploy" butonuna tıklandı
- [ ] Build başarılı
- [ ] Deployment URL alındı
- [ ] Site açılıyor

## 🔄 Deployment Sonrası

- [ ] `NEXTAUTH_URL` environment variable güncellendi
- [ ] Yeniden deploy edildi
- [ ] Database migration çalıştırıldı
- [ ] Seed data eklendi (opsiyonel)

## 🔑 Google Services (Eğer kullanılıyorsa)

### Google OAuth

- [ ] Google Cloud Console'da OAuth credentials oluşturuldu
- [ ] Authorized redirect URI eklendi: `https://your-app.vercel.app/api/auth/callback/google`
- [ ] Client ID ve Secret Vercel'e eklendi

### Google Maps

- [ ] Maps JavaScript API enabled
- [ ] Maps Embed API enabled
- [ ] API Key oluşturuldu
- [ ] API Key kısıtlamaları ayarlandı

## 📧 Email Setup

- [ ] Gmail 2-Step Verification aktif
- [ ] App Password oluşturuldu
- [ ] Email gönderimi test edildi

## ✅ Test Kontrolleri

- [ ] Ana sayfa açılıyor
- [ ] Kayıt olma çalışıyor
- [ ] Giriş yapma çalışıyor
- [ ] Email gönderimi çalışıyor
- [ ] Veritabanı bağlantısı çalışıyor
- [ ] Dosya upload çalışıyor
- [ ] Admin paneli erişilebilir

## 🔒 Güvenlik Kontrolleri

- [ ] `.env` dosyası Git'e eklenmemiş
- [ ] Hassas bilgiler environment variables'da
- [ ] NEXTAUTH_SECRET güçlü
- [ ] Database şifreleri güçlü
- [ ] Production URL'de HTTPS var

## 📝 Dokümantasyon

- [ ] README.md güncel
- [ ] Deployment guide okundu
- [ ] Takım üyelerine bilgi verildi

## 🎯 İlk Kullanıcı

- [ ] Admin kullanıcısı oluşturuldu
- [ ] Admin rolü atandı
- [ ] Test verileri eklendi

---

## 🆘 Sorun mu var?

### Build Hatası

```powershell
npm run build
```

Local'de çalıştırarak test edin.

### Database Bağlantı Hatası

- DATABASE_URL doğru mu?
- Connection pooling (`?pgbouncer=true`) eklenmiş mi?
- SSL mode gerekiyor mu? (`?sslmode=require`)

### Environment Variables Çalışmıyor

- Vercel Dashboard'da doğru yazıldı mı?
- Production, Preview, Development seçili mi?
- Redeploy yapıldı mı?

## 📚 Detaylı Rehber

Daha fazla bilgi için `VERCEL_DEPLOYMENT_GUIDE.md` dosyasına bakın.

---

**Tüm checkboxlar ✅ işaretli mi? Harika! Deploy'a hazırsınız! 🚀**
