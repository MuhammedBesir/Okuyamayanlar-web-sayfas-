# 🚀 Railway Hızlı Başlangıç Komutları

# 1. NEXTAUTH_SECRET Oluştur (PowerShell'de çalıştır)
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Alternatif (daha basit):
# "okuyamayanlar-super-secret-key-" + (Get-Random -Maximum 999999)

# 2. Git Kontrolü
git status
git add .
git commit -m "Railway deployment ready - all config files added"
git push origin main

# 3. Railway CLI Kurulumu (Opsiyonel - Web UI kullanabilirsiniz)
# PowerShell'de:
# iwr https://railway.app/install.ps1 | iex

# 4. Railway Login (CLI kullanıyorsanız)
# railway login

# 5. Railway Proje Bağlantısı (CLI kullanıyorsanız)
# railway link

# 6. Environment Variables Kontrolü (Local Test)
# .env.local dosyanızı kontrol edin

# 7. Local Build Test
npm install
npm run build

# 8. Local Production Test
npm start

# =====================================
# Railway Web Dashboard'dan Deployment
# =====================================
# 1. railway.app → Login with GitHub
# 2. New Project → Deploy from GitHub repo
# 3. Repository seçin: Okuyamayanlar-web-sayfas-
# 4. + New → Database → PostgreSQL
# 5. Service → Variables → Environment variables ekle
# 6. Otomatik deploy başlayacak
# 7. Settings → Networking → Generate Domain
# 8. Variables → NEXTAUTH_URL güncelle (domain ile)
# 9. Test edin!

# =====================================
# Environment Variables (Railway'de)
# =====================================

# DATABASE_URL -> Railway PostgreSQL'den otomatik gelecek
# NEXTAUTH_URL -> https://your-app.up.railway.app
# NEXTAUTH_SECRET -> Yukarıda oluşturduğunuz secret
# NODE_ENV -> production

# Email Variables (varsa):
# EMAIL_HOST -> smtp.gmail.com
# EMAIL_PORT -> 587
# EMAIL_SECURE -> false
# EMAIL_USER -> okuyamayanlar@gmail.com
# EMAIL_PASSWORD -> (Gmail App Password)
# EMAIL_FROM -> okuyamayanlar@gmail.com
# EMAIL_FROM_NAME -> Okuyamayanlar Kitap Kulübü

# Google Services (varsa):
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY -> Your API Key
# GOOGLE_CLIENT_ID -> Your Client ID
# GOOGLE_CLIENT_SECRET -> Your Client Secret

# =====================================
# Sorun Giderme Komutları
# =====================================

# Railway Logs (CLI)
# railway logs

# Railway Environment Variables Listele (CLI)
# railway variables

# Railway Database Bağlantısı Test (CLI)
# railway run psql $DATABASE_URL

# Local Prisma Migration Test
# npx prisma migrate deploy

# Prisma Studio Aç (Database görsel yönetimi)
# npx prisma studio

# =====================================
# Deployment Sonrası Kontrol
# =====================================

# 1. Ana sayfa: https://your-app.up.railway.app
# 2. API Health: https://your-app.up.railway.app/api/health (varsa)
# 3. Admin panel: https://your-app.up.railway.app/admin
# 4. Forum: https://your-app.up.railway.app/forum
# 5. Etkinlikler: https://your-app.up.railway.app/events

# =====================================
# Güncellemeler İçin
# =====================================

# Kod değişikliği sonrası:
git add .
git commit -m "Yeni özellik: ..."
git push origin main
# Railway otomatik deploy edecek!

# =====================================
# Kullanışlı Linkler
# =====================================

# Railway Dashboard: https://railway.app/dashboard
# Railway Docs: https://docs.railway.app/
# Prisma Docs: https://www.prisma.io/docs/
# Next.js Docs: https://nextjs.org/docs

Write-Host "🎉 Tüm hazırlıklar tamamlandı!" -ForegroundColor Green
Write-Host "📖 RAILWAY_DEPLOYMENT.md dosyasını okuyun" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT_CHECKLIST.md'yi takip edin" -ForegroundColor Cyan
Write-Host "🚀 Railway.app'e gidin ve deployment başlatın!" -ForegroundColor Yellow
