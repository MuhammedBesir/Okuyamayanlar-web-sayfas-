# Google Maps Places API Kurulumu

Etkinlik konum seçiminde arama özelliği için Google Places API'yi aktif etmeniz gerekiyor.

## Adımlar:

### 1. Google Cloud Console'a Gidin
https://console.cloud.google.com/

### 2. Projenizi Seçin
- Sol üst köşeden projenizi seçin
- Eğer proje yoksa yeni bir proje oluşturun

### 3. Places API'yi Etkinleştirin

1. Sol menüden **APIs & Services** → **Library**'ye gidin
2. Arama kutusuna **"Places API"** yazın
3. **Places API** (yeni ismi: **Places API (New)**)  seçin
4. **ENABLE** butonuna tıklayın

### 4. API Key'inizi Kontrol Edin

1. **APIs & Services** → **Credentials**
2. Mevcut API Key'inizi bulun veya yeni bir tane oluşturun
3. API Key kısıtlamalarını ayarlayın:
   - **Application restrictions**: HTTP referrers
   - Allowed referrers:
     ```
     http://localhost:3000/*
     https://okuyamayanlar-web-sayfasi.vercel.app/*
     ```
   - **API restrictions**: 
     - Maps JavaScript API ✅
     - Places API ✅
     - Geocoding API ✅ (opsiyonel ama önerilir)

### 5. Environment Variables

`.env.local` dosyanızda (zaten var):
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyApksl9pdoowu2f7s6GqZB3ribq5DyZDlU"
```

**Vercel'de de** aynı değişkeni ekleyin:
- Settings → Environment Variables
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = API Key değeriniz

### 6. Test Edin

1. Etkinlik oluşturma/düzenleme sayfasına gidin
2. Konum seçme bölümünde arama kutusunu görün
3. Bir adres yazın (örn: "Eskişehir Teknik Üniversitesi")
4. Açılan önerilerden birini seçin
5. Haritada otomatik olarak o konuma gitmelidir

## Sorun Giderme

### "This page can't load Google Maps correctly" hatası
- API Key'in doğru olduğundan emin olun
- Places API'nin etkin olduğunu kontrol edin
- API Key kısıtlamalarını kontrol edin (domain'iniz listeye ekli mi?)

### Arama çalışmıyor ama harita çalışıyor
- Places API'nin etkin olup olmadığını kontrol edin
- Console'da hata var mı bakın (F12 → Console)
- API Key'de Places API izninin olduğunu kontrol edin

### Autocomplete önerileri çıkmıyor
- Internet bağlantınızı kontrol edin
- API kotanızı kontrol edin (Google Cloud Console → Quotas)
- Türkçe karakter kullanmayı deneyin

## Ücretlendirme

Google Maps Platform ücretsiz kullanım limitleri:
- **Places Autocomplete**: İlk $200 kredi (aylık)
- **Places Details**: İlk $200 kredi (aylık)
- Genellikle küçük projeler için yeterlidir

Daha fazla bilgi: https://mapsplatform.google.com/pricing/
