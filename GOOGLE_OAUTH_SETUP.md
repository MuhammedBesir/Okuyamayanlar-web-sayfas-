# Google OAuth Kurulum Talimatları

## 1. Google Cloud Console Ayarları

### Adım 1: Google Cloud Console'a Giriş
1. https://console.cloud.google.com/ adresine gidin
2. Projenizi seçin veya yeni bir proje oluşturun

### Adım 2: OAuth Consent Screen
1. Sol menüden **APIs & Services** > **OAuth consent screen** seçin
2. **External** seçin (kullanıcı tipi için)
3. Uygulama bilgilerini doldurun:
   - App name: `Okuyamayanlar Kitap Kulübü`
   - User support email: `wastedtr34@gmail.com`
   - Developer contact: `wastedtr34@gmail.com`
4. **Save and Continue** tıklayın

### Adım 3: Credentials Oluşturma
1. Sol menüden **APIs & Services** > **Credentials** seçin
2. **+ CREATE CREDENTIALS** > **OAuth client ID** seçin
3. Application type: **Web application**
4. Name: `Okuyamayanlar Web App`

### Adım 4: Authorized Redirect URIs Ekleme
**ÖNEMLİ:** Aşağıdaki URL'leri **Authorized redirect URIs** bölümüne ekleyin:

```
http://localhost:3000/api/auth/callback/google
https://okuyamayanlar-web-sayfas-5omz975xf-muhammed-besirs-projects.vercel.app/api/auth/callback/google
```

**NOT:** Eğer Vercel'de özel domain kullanacaksanız, o domain'i de eklemelisiniz:
```
https://your-custom-domain.com/api/auth/callback/google
```

### Adım 5: Client ID ve Secret'ı Kopyalama
1. **Create** butonuna tıklayın
2. Açılan pencereden **Client ID** ve **Client Secret** değerlerini kopyalayın
3. Bu değerleri güvenli bir yerde saklayın

---

## 2. Vercel Environment Variables Ayarları

### Adım 1: Vercel Dashboard'a Giriş
1. https://vercel.com/dashboard adresine gidin
2. Projenizi seçin: **Okuyamayanlar-web-sayfas-**

### Adım 2: Environment Variables Ekleme
1. **Settings** > **Environment Variables** seçin
2. Aşağıdaki değişkenleri ekleyin:

#### GOOGLE_CLIENT_ID
- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** Google Cloud Console'dan kopyaladığınız Client ID
- **Environment:** Production, Preview, Development (hepsini seçin)

#### GOOGLE_CLIENT_SECRET
- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** Google Cloud Console'dan kopyaladığınız Client Secret
- **Environment:** Production, Preview, Development (hepsini seçin)

### Adım 3: Redeployment
1. Environment variables eklendikten sonra **Redeploy** yapın
2. Ya da yeni bir commit push edin (otomatik deploy olur)

---

## 3. Test Etme

### Lokal Test
1. `.env.local` dosyanızı kontrol edin:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

2. Development server'ı başlatın:
```bash
npm run dev
```

3. http://localhost:3000/auth/signin adresine gidin
4. "Google ile Giriş Yap" butonuna tıklayın

### Production Test
1. https://okuyamayanlar-web-sayfas-5omz975xf-muhammed-besirs-projects.vercel.app/auth/signin
2. "Google ile Giriş Yap" butonuna tıklayın
3. Google hesabınızla giriş yapın

---

## Sorun Giderme

### "redirect_uri_mismatch" Hatası
- Google Cloud Console'da Authorized redirect URIs'ı kontrol edin
- URL'nin tam olarak eşleştiğinden emin olun (sonunda / olmamalı)
- Değişiklik yaptıktan sonra birkaç dakika bekleyin

### "access_denied" Hatası
- OAuth consent screen'in doğru yapılandırıldığından emin olun
- Test users ekleyin (eğer app henüz production'da değilse)

### Kullanıcılar Google ile giriş yapamıyor
- Vercel'de environment variables'ların doğru eklendiğinden emin olun
- Vercel'de yeni deployment yapın (değişikliklerin uygulanması için)
- Browser console'da hata mesajlarını kontrol edin

---

## Mevcut Durumunuz

✅ **Yapılanlar:**
- NextAuth.js Google Provider yapılandırması
- Username otomatik oluşturma (Google kullanıcıları için)
- Email verification otomatik (Google hesapları için)
- Veritabanı şeması hazır

⏳ **Yapılması Gerekenler:**
- [ ] Google Cloud Console'da Authorized Redirect URIs eklenmesi
- [ ] Vercel'de GOOGLE_CLIENT_ID environment variable eklenmesi
- [ ] Vercel'de GOOGLE_CLIENT_SECRET environment variable eklenmesi
- [ ] Vercel'de yeni deployment

---

## Güvenlik Notları

🔒 **ÖNEMLİ:**
- Client Secret'ı asla GitHub'a commit etmeyin
- `.env.local` dosyası `.gitignore`'da olmalı
- Production environment variables sadece Vercel'de saklanmalı
- Periyodik olarak client secret'ı rotate edin

---

## Yardım

Herhangi bir sorunla karşılaşırsanız:
1. Vercel deployment logs'larını kontrol edin
2. Browser console'da hata mesajlarını kontrol edin
3. Google Cloud Console'da quotas ve limits'leri kontrol edin

**Deployment URL:** https://okuyamayanlar-web-sayfas-5omz975xf-muhammed-besirs-projects.vercel.app
**Admin Email:** wastedtr34@gmail.com
**Admin Password:** admin123
