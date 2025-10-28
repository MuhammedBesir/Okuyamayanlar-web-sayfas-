# Cloudinary Kurulumu

Dosya yükleme işlemleri için Cloudinary kullanıyoruz çünkü Vercel'in dosya sistemi read-only'dir.

## 1. Cloudinary Hesabı Oluşturma

1. https://cloudinary.com adresine gidin
2. "Sign Up for Free" butonuna tıklayın
3. Email ile ücretsiz hesap oluşturun
4. Email'inizi doğrulayın

## 2. Cloudinary Ayarları

1. Dashboard'a gidin: https://console.cloudinary.com/console
2. Sağ üstten hesap bilgilerinizi göreceksiniz:
   - **Cloud Name**: `dxxxxxx` (örnek)
   - **API Key**: `123456789012345` (örnek)
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz123` (örnek)

## 3. Environment Variables Ayarlama

### Yerel Geliştirme (.env.local)

```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Vercel Production

1. Vercel Dashboard'a gidin: https://vercel.com/dashboard
2. Projenizi seçin (okuyamayanlar-web-sayfasi)
3. Settings > Environment Variables
4. Aşağıdaki değişkenleri ekleyin:

| Name | Value | Environment |
|------|-------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Dashboard'dan aldığınız Cloud Name | Production, Preview |
| `CLOUDINARY_API_KEY` | Dashboard'dan aldığınız API Key | Production, Preview |
| `CLOUDINARY_API_SECRET` | Dashboard'dan aldığınız API Secret | Production, Preview |

5. "Save" butonuna tıklayın
6. Projeyi yeniden deploy edin (otomatik olacak veya manuel tetikleyin)

## 4. Cloudinary Ayarları (İsteğe Bağlı)

### Upload Presets

1. Settings > Upload
2. "Add upload preset" butonuna tıklayın
3. Preset name: `okuyamayanlar`
4. Signing Mode: `Signed` (güvenli)
5. Folder: `okuyamayanlar`
6. Save

### Media Library Organization

1. Media Library > Folders
2. `okuyamayanlar` klasörü otomatik oluşturulacak
3. Tüm yüklenen dosyalar bu klasörde olacak

## 5. Test Etme

1. Lokal'de test edin:
   ```bash
   npm run dev
   ```
2. Profil fotoğrafı yüklemeyi deneyin
3. Cloudinary Dashboard > Media Library'de dosyanın göründüğünü kontrol edin

## 6. Ücretsiz Plan Limitleri

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/ay
- **Transformations**: 25,000/ay

Bu limitler bir kitap kulübü için yeterlidir. Eğer limitler dolacak gibi olursa:
- Eski dosyaları temizleyin
- Resim kalitesini optimize edin
- Gerekirse ücretli plana geçin

## Sorun Giderme

### "Invalid API credentials" hatası
- Environment variables'ları doğru kopyaladığınızdan emin olun
- Vercel'de environment variables'ları kaydettikten sonra redeploy yapın

### "Upload failed" hatası
- Cloudinary hesabınızın aktif olduğundan emin olun
- API Key ve Secret'ın doğru olduğunu kontrol edin
- Browser console'da detaylı hata mesajına bakın

### Dosya yüklenmiyor
- Dosya boyutunun 10MB'dan küçük olduğundan emin olun
- Dosya formatının desteklendiğini kontrol edin (JPG, PNG, GIF, WebP, HEIC)
- Network sekmesinde request'i inceleyin
