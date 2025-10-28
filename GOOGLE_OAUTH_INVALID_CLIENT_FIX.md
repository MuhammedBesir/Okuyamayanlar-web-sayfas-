# Google OAuth "invalid_client" Hatası Çözümü

## Hata Mesajı
```
[auth][cause]: server responded with an error in the response body
[auth][details]: {
  "error": "invalid_client",
  "error_description": "Unauthorized",
  "provider": "google"
}
```

## Sorun
Google OAuth yapılandırmasında bir problem var. Bu genellikle şu sebeplerden olur:

1. ❌ Google Client ID veya Client Secret yanlış
2. ❌ Authorized Redirect URIs eksik veya yanlış
3. ❌ OAuth Consent Screen tamamlanmamış
4. ❌ Vercel environment variables yanlış ayarlanmış

## Çözüm Adımları

### 1. Google Cloud Console Kontrolü

**A. OAuth Credentials Kontrolü**

1. [Google Cloud Console](https://console.cloud.google.com/) → "Okuyamayanlar Kitap Kulübü" projesi
2. **APIs & Services** → **Credentials**
3. OAuth 2.0 Client ID'nizi bulun (Web application)
4. Sağ taraftaki **✏️ Edit** butonuna tıklayın

**B. Authorized Redirect URIs Kontrolü**

Aşağıdaki URL'lerin **TAM OLARAK** eklendiğinden emin olun:

```
https://okuyamayanlar.vercel.app/api/auth/callback/google
```

⚠️ **ÖNEMLİ NOTLAR:**
- Sonunda `/` (slash) olmamalı
- `https://` ile başlamalı (http değil!)
- Alan adınız tam olarak doğru olmalı
- Büyük/küçük harf önemli DEĞİL ama yine de dikkatli olun

**C. OAuth Consent Screen Kontrolü**

1. **APIs & Services** → **OAuth consent screen**
2. **Publishing status** = "Testing" veya "Production" olmalı
3. **Test users** kısmına kendi Gmail adresinizi ekleyin (Testing modundaysa)
4. **Save and Continue** yapın

### 2. Vercel Environment Variables Kontrolü

1. [Vercel Dashboard](https://vercel.com/) → Projeniz
2. **Settings** → **Environment Variables**
3. Aşağıdaki değişkenleri kontrol edin:

#### Kontrol Listesi:

```bash
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
NEXTAUTH_URL=https://okuyamayanlar.vercel.app
NEXTAUTH_SECRET=<strong-random-secret>
DATABASE_URL=postgresql://neondb_owner:...
```

⚠️ **Dikkat Edilmesi Gerekenler:**

- ✅ `GOOGLE_CLIENT_ID` `.apps.googleusercontent.com` ile bitmeli
- ✅ `GOOGLE_CLIENT_SECRET` `GOCSPX-` ile başlamalı
- ✅ `NEXTAUTH_URL` sonunda `/` olmamalı
- ✅ `NEXTAUTH_URL` tam olarak production domain olmalı
- ✅ Tüm değişkenler **Production**, **Preview** ve **Development** scope'unda olmalı

### 3. Google Cloud Console'da Yeni Credentials Oluşturma (Gerekirse)

Eğer mevcut credentials'ları düzeltemezseniz, yeniden oluşturun:

1. **APIs & Services** → **Credentials**
2. **+ CREATE CREDENTIALS** → **OAuth client ID**
3. **Application type**: Web application
4. **Name**: Okuyamayanlar Web App
5. **Authorized JavaScript origins**:
   ```
   https://okuyamayanlar.vercel.app
   ```
6. **Authorized redirect URIs**:
   ```
   https://okuyamayanlar.vercel.app/api/auth/callback/google
   ```
7. **CREATE** butonuna tıklayın
8. Açılan pencereden **Client ID** ve **Client secret** kopyalayın
9. Bu değerleri Vercel environment variables'a yapıştırın

### 4. Test Users Ekleme (Testing Mode için)

Eğer OAuth consent screen "Testing" modundaysa:

1. **OAuth consent screen** → **Test users**
2. **+ ADD USERS**
3. Kendi Gmail adresinizi ekleyin
4. **SAVE**

### 5. Production'a Alma (Opsiyonel)

Eğer herkese açmak istiyorsanız:

1. **OAuth consent screen** → **PUBLISH APP**
2. Google review sürecini bekleyin (birkaç gün sürebilir)

---

## Hızlı Test

1. Değişiklikleri yaptıktan sonra Vercel'de yeniden deploy olmasını bekleyin
2. Veya manuel deploy tetikleyin: **Deployments** → **Redeploy**
3. Tarayıcıda incognito/private mode açın
4. `https://okuyamayanlar.vercel.app/auth/signin` adresine gidin
5. "Google ile Giriş Yap" butonuna tıklayın
6. Google hesabı seçin ve onayla

## Sorun Devam Ederse

### Debug için Environment Variables Kontrol Scripti

Vercel fonksiyon loglarında environment variables'ların doğru yüklendiğini görmek için:

1. `auth.ts` dosyasına geçici olarak log ekleyin:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, // Bu satırı ekleyin
  adapter: PrismaAdapter(prisma),
  // ... geri kalan kod
})
```

2. Deploy edin ve Vercel function logs'unu kontrol edin
3. `GOOGLE_CLIENT_ID` ve `NEXTAUTH_URL` değerlerinin doğru olduğundan emin olun

---

## Yaygın Hatalar

### ❌ Yanlış Redirect URI
```
https://okuyamayanlar.vercel.app/api/auth/callback/google/
                                                         ^ YANLIŞ (sonunda / var)
```

✅ Doğrusu:
```
https://okuyamayanlar.vercel.app/api/auth/callback/google
```

### ❌ Yanlış Domain
```
http://okuyamayanlar.vercel.app/api/auth/callback/google
^ YANLIŞ (http, https olmalı)
```

### ❌ Test User Eklenmemiş (Testing Mode)
Eğer OAuth consent screen "Testing" modundaysa, sadece eklediğiniz test users giriş yapabilir.

---

## Özet Checklist

- [ ] Google Cloud Console'da OAuth credentials oluşturuldu
- [ ] Authorized redirect URI eklendi: `https://okuyamayanlar.vercel.app/api/auth/callback/google`
- [ ] OAuth consent screen tamamlandı
- [ ] Test users eklendi (Testing mode için)
- [ ] Vercel'de `GOOGLE_CLIENT_ID` ayarlandı
- [ ] Vercel'de `GOOGLE_CLIENT_SECRET` ayarlandı
- [ ] Vercel'de `NEXTAUTH_URL` ayarlandı (sonunda `/` yok)
- [ ] Vercel'de `NEXTAUTH_SECRET` ayarlandı
- [ ] Tüm env vars Production + Preview + Development scope'unda
- [ ] Deploy tamamlandı
- [ ] Incognito modda test edildi

Bu adımları takip ettikten sonra Google OAuth düzgün çalışacaktır! 🚀
