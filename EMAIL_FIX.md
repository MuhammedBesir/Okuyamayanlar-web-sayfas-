# 📧 Email Gönderme Hatası - Çözüm Rehberi

## ❌ Sorun: Gmail Authentication Hatası

```
Invalid login: 535-5.7.8 Username and Password not accepted
```

## 🔍 Neden Oluyor?

Gmail App Password'ünüz geçersiz, yanlış veya süresi dolmuş olabilir.

---

## ✅ Çözüm: Yeni Gmail App Password Oluştur

### ADIM 1: Google Hesap Güvenlik Ayarlarını Kontrol Edin

1. **2 Adımlı Doğrulama Açık Olmalı:**
   - https://myaccount.google.com/security
   - "2-Step Verification" bölümünü bulun
   - Eğer kapalıysa **AÇ**

### ADIM 2: Yeni App Password Oluşturun

1. Bu linke gidin: **https://myaccount.google.com/apppasswords**
2. Google hesabınızla giriş yapın
3. **"Select app"** → **"Mail"** seçin (veya "Other" de seçebilirsiniz)
4. **"Select device"** → **"Other (Custom name)"** seçin
5. İsim girin: `Okuyamayanlar Web App`
6. **"Generate"** butonuna tıklayın
7. **16 haneli şifreyi kopyalayın** (örn: `abcd efgh ijkl mnop`)

### ADIM 3: .env.local Dosyasını Güncelleyin

`.env.local` dosyasını açın ve şu satırı yeni şifre ile güncelleyin:

```bash
EMAIL_PASSWORD="yeni-16-haneli-app-password"
```

⚠️ **NOT:** Boşluklarını kaldırın! Örnek:

- ❌ Yanlış: `"abcd efgh ijkl mnop"`
- ✅ Doğru: `"abcdefghijklmnop"`

### ADIM 4: Test Edin

Terminalde çalıştırın:

```bash
node test-email.mjs
```

Çıktıda şunu görmelisiniz:

```
✅ SMTP Connection: SUCCESS
✅ Email Sent: SUCCESS
🎉 EMAIL SİSTEMİ ÇALIŞIYOR!
```

---

## 🚀 Railway Deployment İçin

Railway'de deployment yaparken, **Variables** sekmesinde:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=okuyamayanlar@gmail.com
EMAIL_PASSWORD=yeni-16-haneli-app-password
EMAIL_FROM=okuyamayanlar@gmail.com
EMAIL_FROM_NAME=Okuyamayanlar Kitap Kulübü
```

---

## 🔧 Alternatif: Başka Email Servisleri

Eğer Gmail ile sorun yaşamaya devam ederseniz:

### 1. **SendGrid** (Ücretsiz 100 email/gün)

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=sendgrid-api-key
```

### 2. **Mailgun** (Ücretsiz 5000 email/ay)

```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@your-domain
EMAIL_PASSWORD=mailgun-password
```

### 3. **Resend** (Ücretsiz 100 email/gün)

Daha basit API, nodemailer yerine direkt kullanılır.

---

## 🐛 Hâlâ Çalışmıyor mu?

Kontrol listesi:

- [ ] 2-Step Verification açık mı?
- [ ] App Password yeni oluşturuldu mu?
- [ ] App Password doğru kopyalandı mı? (boşluksuz)
- [ ] `EMAIL_USER` ile App Password'ün hesabı aynı mı?
- [ ] `.env.local` dosyasını kaydettiniz mi?
- [ ] Dev server'ı yeniden başlattınız mı? (`npm run dev`)

---

## 📝 Güncel .env.local Örneği

```.env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/bookclub"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production-min-32-chars"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Email Configuration (Gmail App Password)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="okuyamayanlar@gmail.com"
EMAIL_PASSWORD="yeni-16-haneli-app-password-buraya"
EMAIL_FROM="okuyamayanlar@gmail.com"
EMAIL_FROM_NAME="Okuyamayanlar Kitap Kulübü"
```

---

**Şimdi ne yapmalısınız?**

1. ✅ https://myaccount.google.com/apppasswords → Yeni App Password oluşturun
2. ✅ `.env.local` dosyasında `EMAIL_PASSWORD` güncelleyin
3. ✅ `node test-email.mjs` ile test edin
4. ✅ Çalışırsa Railway'e deployment yapın!

İyi şanslar! 🚀
