# 🔧 Google OAuth Redirect URI Hatası Çözümü

## ❌ Hata Mesajı:

```
Google'ın OAuth 2.0 politikasına uymadığı için bu uygulamada oturum açamazsınız.
redirect_uri=https://your-production-domain.vercel.app/api/auth/callback/google
```

---

## ✅ ÇÖZÜM: Redirect URI'yi Google Cloud Console'a Kaydetme

### 1️⃣ Google Cloud Console'a Git

**Link:** https://console.cloud.google.com/apis/credentials

(Okuyamayanlar projenizi seçin)

---

### 2️⃣ OAuth Client ID'nizi Bulun

1. **Credentials** sayfasında **OAuth 2.0 Client IDs** bölümünü bulun
2. Client ID'niz muhtemelen şu isimde: **"Web client"** veya benzer bir isim
3. Yanındaki **✏️ (kalem) ikonuna** tıklayın

**İpucu:** Client ID'niz `.env.local` dosyanızda `GOOGLE_CLIENT_ID` olarak kayıtlı.

---

### 3️⃣ Authorized Redirect URIs Ekle

**"Authorized redirect URIs"** bölümüne şu URL'i ekleyin:

#### ✅ Production URL (Vercel'deki domain'inizle):

```plaintext
https://your-production-domain.vercel.app/api/auth/callback/google
```

**ÖNEMLİ:**

- URL'nin sonunda `/` (slash) OLMAMALI
- `your-production-domain.vercel.app` kısmını kendi Vercel URL'inizle değiştirin
- Tam olarak bu formatı kullanın

#### 📝 Opsiyonel (Local Development İçin):

```plaintext
http://localhost:3000/api/auth/callback/google
```

---

### 4️⃣ Kaydet

1. **SAVE** butonuna tıklayın
2. "OAuth client updated" mesajını görene kadar bekleyin
3. ✅ Değişiklikler 5-10 saniye içinde aktif olur

---

## 🎯 Adım Adım Görsel Rehber

### Ekran 1: Credentials Sayfası

```
APIs & Services > Credentials
┌──────────────────────────────────────┐
│ OAuth 2.0 Client IDs                 │
│                                      │
│ Name                    Type         │
│ Web client              Web app   ✏️ │ ← Buraya tıkla
└──────────────────────────────────────┘
```

### Ekran 2: Edit OAuth Client

```
┌──────────────────────────────────────┐
│ Edit OAuth client                    │
│                                      │
│ Name: Web client                     │
│ Client ID: your-client-id            │
│ Client Secret: your-client-secret    │
│                                      │
│ Authorized JavaScript origins        │
│ [Buraya dokunma]                     │
│                                      │
│ Authorized redirect URIs             │
│ ┌──────────────────────────────┐    │
│ │ https://your-domain.vercel...│← Ekle│
│ └──────────────────────────────┘    │
│ + ADD URI                            │
│                                      │
│ [SAVE]                               │
└──────────────────────────────────────┘
```

---

## 🧪 Test Et

### 1. Google Console'da kaydet

### 2. 10 saniye bekle

### 3. Production URL'ye git: `/auth/signin`

### 4. "Google ile Giriş Yap" butonuna tıkla

### 5. ✅ Artık Google hesabınızla giriş yapabilirsiniz!

---

## ⚠️ Sorun Giderme

### Hala aynı hatayı alıyorsanız:

#### 1. URL'yi kontrol edin:

```diff
✅ DOĞRU:
https://your-domain.vercel.app/api/auth/callback/google

❌ YANLIŞ (sonunda / var):
https://your-domain.vercel.app/api/auth/callback/google/

❌ YANLIŞ (http):
http://your-domain.vercel.app/api/auth/callback/google

❌ YANLIŞ (farklı path):
https://your-domain.vercel.app/auth/callback/google
```

#### 2. Doğru Client ID'yi seçtiğinizden emin olun

- `.env.local` dosyanızdaki `GOOGLE_CLIENT_ID` ile aynı olmalı
- Vercel'deki `GOOGLE_CLIENT_ID` environment variable ile aynı olmalı

#### 3. Tarayıcı cache'ini temizleyin

```
Ctrl + Shift + Delete → Cached images and files → Clear data
```

#### 4. Incognito/Private modda deneyin

#### 5. 5-10 dakika bekleyin

- Google'ın değişiklikleri yayması zaman alabilir

---

## 📋 Kontrol Listesi

Şu adımları tamamladınız mı?

- [ ] Google Cloud Console'a giriş yaptım
- [ ] Credentials > OAuth 2.0 Client IDs sayfasını açtım
- [ ] Doğru Client ID'yi düzenledim
- [ ] Authorized redirect URIs'a production URL'yi ekledim
- [ ] URL'nin sonunda `/` olmadığını kontrol ettim
- [ ] SAVE butonuna tıkladım
- [ ] 10 saniye bekledim
- [ ] Giriş sayfasını yeniledim ve tekrar denedim

---

## 🎉 Başarılı Olduktan Sonra

Google OAuth başarıyla çalışıyor mu? Şimdi şunları test edin:

### ✅ Test Senaryoları:

1. **Yeni Kullanıcı Kaydı:**

   - Google ile giriş yap
   - Otomatik username oluşturulmalı
   - Profile sayfası açılmalı

2. **Mevcut Kullanıcı Girişi:**

   - Daha önce Google ile kayıt olduysan
   - Direkt giriş yapmalısın

3. **Email Doğrulama:**
   - Google ile giriş yapan kullanıcılar için email otomatik doğrulanmış olmalı
   - `emailVerified` field'ı `new Date()` olmalı

---

## 🔗 Faydalı Linkler

- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **NextAuth Google Provider Docs:** https://next-auth.js.org/providers/google
- **OAuth 2.0 Playground:** https://developers.google.com/oauthplayground/

---

## 📞 Hala Sorun mu Var?

Eğer bu adımları takip ettikten sonra hala sorun yaşıyorsanız:

1. `.env.local` dosyanızdaki `GOOGLE_CLIENT_ID` değerini kontrol edin
2. Vercel Environment Variables'da `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` olduğundan emin olun
3. Browser DevTools Console'da hata mesajlarını kontrol edin (F12)
4. Vercel Logs'larını kontrol edin

---

**Son Güncelleme:** 24 Ekim 2025
**Status:** ⏳ Redirect URI eklenmesi bekleniyor
