# Vercel Deployment - Hızlı Başlangıç Script'i
# PowerShell için

Write-Host "🚀 Vercel Deployment Hazırlığı Başlıyor..." -ForegroundColor Cyan
Write-Host ""

# 1. Git durumunu kontrol et
Write-Host "📋 1. Git durumu kontrol ediliyor..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Uncommitted değişiklikler var!" -ForegroundColor Red
    Write-Host "Önce tüm değişiklikleri commit edin:" -ForegroundColor Red
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Vercel deployment hazırlığı'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
    Write-Host ""
}
else {
    Write-Host "✅ Git temiz, tüm değişiklikler commit edilmiş" -ForegroundColor Green
}

# 2. Dependencies kontrol
Write-Host ""
Write-Host "📦 2. Dependencies kontrol ediliyor..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules mevcut" -ForegroundColor Green
}
else {
    Write-Host "⚠️  node_modules bulunamadı. npm install çalıştırılıyor..." -ForegroundColor Yellow
    npm install
}

# 3. Build test
Write-Host ""
Write-Host "🔨 3. Build testi yapılıyor..." -ForegroundColor Yellow
Write-Host "Bu işlem birkaç dakika sürebilir..." -ForegroundColor Gray
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build başarılı!" -ForegroundColor Green
}
else {
    Write-Host "❌ Build BAŞARISIZ!" -ForegroundColor Red
    Write-Host "Hataları düzeltin ve tekrar deneyin." -ForegroundColor Red
    Write-Host ""
    exit 1
}

# 4. Environment variables kontrol
Write-Host ""
Write-Host "🔐 4. Environment variables kontrol ediliyor..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example mevcut" -ForegroundColor Green
}
else {
    Write-Host "❌ .env.example bulunamadı!" -ForegroundColor Red
}

if (Test-Path ".env.local.example") {
    Write-Host "✅ .env.local.example mevcut" -ForegroundColor Green
}
else {
    Write-Host "⚠️  .env.local.example bulunamadı" -ForegroundColor Yellow
}

# 5. .gitignore kontrol
Write-Host ""
Write-Host "🔒 5. .gitignore kontrol ediliyor..." -ForegroundColor Yellow
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "\.env") {
    Write-Host "✅ .env dosyaları .gitignore'da" -ForegroundColor Green
}
else {
    Write-Host "❌ .env dosyaları .gitignore'da değil!" -ForegroundColor Red
}

# 6. vercel.json kontrol
Write-Host ""
Write-Host "⚙️  6. vercel.json kontrol ediliyor..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json mevcut" -ForegroundColor Green
}
else {
    Write-Host "⚠️  vercel.json bulunamadı (opsiyonel)" -ForegroundColor Yellow
}

# 7. Prisma schema kontrol
Write-Host ""
Write-Host "🗄️  7. Prisma schema kontrol ediliyor..." -ForegroundColor Yellow
if (Test-Path "prisma/schema.prisma") {
    Write-Host "✅ Prisma schema mevcut" -ForegroundColor Green
}
else {
    Write-Host "❌ Prisma schema bulunamadı!" -ForegroundColor Red
}

# Özet
Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 HAZIRLIK ÖZETİ" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Sıradaki Adımlar:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Vercel'e git ve yeni proje oluştur:" -ForegroundColor White
Write-Host "   https://vercel.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2️⃣  GitHub repository'nizi seçin:" -ForegroundColor White
Write-Host "   Okuyamayanlar-web-sayfas-" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Environment Variables ekleyin:" -ForegroundColor White
Write-Host "   .env.example dosyasındaki tüm değişkenleri" -ForegroundColor Cyan
Write-Host ""
Write-Host "4️⃣  Deploy butonuna tıklayın!" -ForegroundColor White
Write-Host ""
Write-Host "5️⃣  Deployment tamamlandıktan sonra:" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL'i production URL ile güncelleyin" -ForegroundColor Cyan
Write-Host "   - Database migration çalıştırın" -ForegroundColor Cyan
Write-Host "   - Seed data ekleyin (opsiyonel)" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Detaylı rehber için:" -ForegroundColor Yellow
Write-Host "   VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "   VERCEL_CHECKLIST.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ Başarılar! 🚀" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
