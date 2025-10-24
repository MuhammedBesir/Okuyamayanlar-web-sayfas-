// Email Test Script - Production'da email çalışıyor mu test eder

import nodemailer from 'nodemailer';

console.log('📧 Email Configuration Test\n');
console.log('━'.repeat(60));

// Environment variables kontrolü
const emailConfig = {
    host: process.env.EMAIL_HOST || 'MISSING',
    port: process.env.EMAIL_PORT || 'MISSING',
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || 'MISSING',
    password: process.env.EMAIL_PASSWORD ? '***SET***' : 'MISSING',
    from: process.env.EMAIL_FROM || 'MISSING',
    fromName: process.env.EMAIL_FROM_NAME || 'MISSING'
};

console.log('🔍 Environment Variables Check:\n');
Object.entries(emailConfig).forEach(([key, value]) => {
    const status = value === 'MISSING' ? '❌' : '✅';
    console.log(`${status} ${key}: ${value}`);
});

console.log('\n━'.repeat(60));

// Test email gönderimi
async function testEmail() {
    if (emailConfig.user === 'MISSING' || emailConfig.password === 'MISSING') {
        console.log('\n❌ ERROR: Email environment variables eksik!');
        console.log('\nVercel\'de şunları kontrol edin:');
        console.log('- EMAIL_HOST');
        console.log('- EMAIL_PORT');
        console.log('- EMAIL_SECURE');
        console.log('- EMAIL_USER');
        console.log('- EMAIL_PASSWORD (Gmail App Password)');
        console.log('- EMAIL_FROM');
        console.log('- EMAIL_FROM_NAME');
        return;
    }

    console.log('\n📤 Attempting to send test email...\n');

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Test connection
        await transporter.verify();
        console.log('✅ SMTP Connection: SUCCESS');

        // Send test email
        const info = await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email - Okuyamayanlar',
            text: 'Bu bir test emailidir. Email sistemi çalışıyor!',
            html: '<h1>✅ Email Çalışıyor!</h1><p>Bu bir test emailidir.</p>'
        });

        console.log('✅ Email Sent: SUCCESS');
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log('\n🎉 EMAIL SİSTEMİ ÇALIŞIYOR!\n');

    } catch (error) {
        console.log('❌ EMAIL ERROR:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n🔐 Authentication hatası!');
            console.log('Çözüm:');
            console.log('1. Gmail App Password doğru mu kontrol edin');
            console.log('2. https://myaccount.google.com/apppasswords');
            console.log('3. Yeni App Password oluşturun');
            console.log('4. Vercel\'de EMAIL_PASSWORD\'ü güncelleyin');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🌐 Connection hatası!');
            console.log('Çözüm:');
            console.log('1. EMAIL_HOST doğru mu: smtp.gmail.com');
            console.log('2. EMAIL_PORT doğru mu: 587');
            console.log('3. EMAIL_SECURE: false olmalı (587 port için)');
        }
    }
}

testEmail();
