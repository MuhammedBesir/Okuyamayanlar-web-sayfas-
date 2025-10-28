/**
 * Environment Variables Kontrol Scripti
 * 
 * Bu script, Google OAuth ve diğer kritik environment variables'ların
 * doğru ayarlanıp ayarlanmadığını kontrol eder.
 * 
 * Kullanım: npx tsx scripts/check-env.ts
 */

console.log('🔍 Environment Variables Kontrolü\n')

interface EnvCheck {
  name: string
  value: string | undefined
  required: boolean
  description: string
  validation?: (value: string) => boolean
  hint?: string
}

const checks: EnvCheck[] = [
  {
    name: 'DATABASE_URL',
    value: process.env.DATABASE_URL,
    required: true,
    description: 'PostgreSQL connection string',
    validation: (v) => v.startsWith('postgres://') || v.startsWith('postgresql://'),
    hint: 'postgresql://... formatında olmalı'
  },
  {
    name: 'GOOGLE_CLIENT_ID',
    value: process.env.GOOGLE_CLIENT_ID,
    required: true,
    description: 'Google OAuth Client ID',
    validation: (v) => v.endsWith('.apps.googleusercontent.com'),
    hint: '.apps.googleusercontent.com ile bitmeli'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    value: process.env.GOOGLE_CLIENT_SECRET,
    required: true,
    description: 'Google OAuth Client Secret',
    validation: (v) => v.startsWith('GOCSPX-') && v.length > 20,
    hint: 'GOCSPX- ile başlamalı ve yeterince uzun olmalı'
  },
  {
    name: 'NEXTAUTH_URL',
    value: process.env.NEXTAUTH_URL,
    required: true,
    description: 'NextAuth base URL',
    validation: (v) => v.startsWith('http') && !v.endsWith('/'),
    hint: 'https:// ile başlamalı, sonunda / olmamalı'
  },
  {
    name: 'NEXTAUTH_SECRET',
    value: process.env.NEXTAUTH_SECRET,
    required: true,
    description: 'NextAuth secret key',
    validation: (v) => v.length >= 32,
    hint: 'En az 32 karakter olmalı'
  },
  {
    name: 'EMAIL_USER',
    value: process.env.EMAIL_USER,
    required: false,
    description: 'Gmail address for sending emails',
    validation: (v) => v.includes('@'),
    hint: 'Gmail adresi olmalı'
  },
  {
    name: 'EMAIL_APP_PASSWORD',
    value: process.env.EMAIL_APP_PASSWORD,
    required: false,
    description: 'Gmail App Password',
    validation: (v) => v.length === 16,
    hint: '16 karakterli App Password'
  },
]

let hasErrors = false
let hasWarnings = false

checks.forEach(check => {
  const exists = !!check.value
  const isValid = exists && check.validation ? check.validation(check.value!) : exists

  let status = '✅'
  let message = check.description

  if (!exists && check.required) {
    status = '❌'
    message += ' - EKSIK!'
    hasErrors = true
  } else if (!exists && !check.required) {
    status = '⚠️'
    message += ' - Opsiyonel (ayarlanmamış)'
    hasWarnings = true
  } else if (exists && !isValid) {
    status = '❌'
    message += ` - HATALI! ${check.hint || ''}`
    hasErrors = true
    
    // Değeri kısmen göster (güvenlik için)
    const maskedValue = check.value!.length > 10 
      ? `${check.value!.substring(0, 10)}...${check.value!.substring(check.value!.length - 5)}`
      : '***'
    console.log(`   Mevcut değer: ${maskedValue}`)
  } else if (exists && isValid) {
    status = '✅'
    message += ' - OK'
    
    // Değeri kısmen göster
    const maskedValue = check.value!.length > 15
      ? `${check.value!.substring(0, 10)}...${check.value!.substring(check.value!.length - 5)}`
      : '***'
    message += ` (${maskedValue})`
  }

  console.log(`${status} ${check.name}`)
  console.log(`   ${message}`)
  if (check.hint && !isValid) {
    console.log(`   💡 İpucu: ${check.hint}`)
  }
  console.log()
})

console.log('\n' + '='.repeat(60))

if (hasErrors) {
  console.log('❌ HATALAR VAR! Lütfen yukarıdaki hataları düzeltin.')
  console.log('\n📝 Vercel Environment Variables için:')
  console.log('   https://vercel.com/your-project/settings/environment-variables')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️  Bazı opsiyonel değişkenler eksik ama devam edebilirsiniz.')
  console.log('✅ Zorunlu tüm değişkenler doğru ayarlanmış!')
} else {
  console.log('✅ Tüm environment variables doğru ayarlanmış!')
}

console.log('\n🎯 Google OAuth Redirect URI:')
console.log(`   ${process.env.NEXTAUTH_URL}/api/auth/callback/google`)
console.log('\n   Bu URL\'yi Google Cloud Console\'da Authorized Redirect URIs\'e ekleyin!')
