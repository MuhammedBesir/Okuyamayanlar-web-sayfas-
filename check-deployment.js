#!/usr/bin/env node

/**
 * Vercel Deployment Status Checker
 * Bu script Vercel deployment durumunu kontrol eder
 */

console.log('🔍 Vercel Deployment Status Check\n');
console.log('📋 Yapılacaklar:\n');

const checks = [
    {
        task: '1. Vercel Dashboard\'a Git',
        url: 'https://vercel.com/dashboard',
        status: 'PENDING'
    },
    {
        task: '2. En Son Deployment\'ı Kontrol Et',
        detail: 'Deployments sekmesinde en üstteki deployment\'ın durumunu kontrol edin',
        expectedStatus: [
            '✅ Ready (Hazır) - Deployment başarılı',
            '🔄 Building (İnşa ediliyor) - Bekleyin 2-3 dakika',
            '❌ Error (Hata) - Logs\'lara bakın'
        ],
        status: 'PENDING'
    },
    {
        task: '3. Production URL\'yi Test Et',
        url: 'https://okuyamayanlar-web-sayfas-5omz975xf-muhammed-besirs-projects.vercel.app',
        detail: 'Bu URL\'yi tarayıcıda açın',
        status: 'PENDING'
    },
    {
        task: '4. Google ile Giriş Test Et',
        detail: '/auth/signin sayfasında Google butonuna tıklayın',
        status: 'PENDING'
    }
];

checks.forEach((check, index) => {
    console.log(`\n${check.task}`);
    if (check.url) console.log(`   🔗 URL: ${check.url}`);
    if (check.detail) console.log(`   📝 ${check.detail}`);
    if (check.expectedStatus) {
        console.log('   📊 Olası Durumlar:');
        check.expectedStatus.forEach(status => console.log(`      ${status}`));
    }
});

console.log('\n\n⏱️  Deployment Süresi: 2-3 dakika');
console.log('🔄 Deployment tamamlandıysa yukarıdaki URL\'yi açın\n');

console.log('━'.repeat(60));
console.log('🚨 HALA 502 HATASI ALIYORSANIZ:\n');
console.log('1. Vercel → Settings → Environment Variables');
console.log('   DATABASE_URL doğru mu kontrol edin (localhost olmamalı!)');
console.log('\n2. Vercel → Deployments → En son deployment → Function Logs');
console.log('   Hata mesajlarını okuyun');
console.log('\n3. Browser Console (F12) açın');
console.log('   Console\'da hata var mı kontrol edin');
console.log('━'.repeat(60));
