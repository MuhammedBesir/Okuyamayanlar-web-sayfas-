import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Admin kullanıcı oluştur (Süper Admin)
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "wastedtr34@gmail.com" },
    update: { role: "ADMIN", emailVerified: new Date() },
    create: {
      email: "wastedtr34@gmail.com",
      name: "Süper Admin",
      username: "superadmin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })

  console.log("✅ Super Admin created/updated:", admin.email)

  // Örnek kullanıcılar oluştur
  const userPassword = await bcrypt.hash("user123", 10)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "mehmet@example.com" },
      update: {},
      create: {
        email: "mehmet@example.com",
        name: "Mehmet Yılmaz",
        username: "mehmet",
        password: userPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "ayse@example.com" },
      update: {},
      create: {
        email: "ayse@example.com",
        name: "Ayşe Demir",
        username: "ayse",
        password: userPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "ali@example.com" },
      update: {},
      create: {
        email: "ali@example.com",
        name: "Ali Kaya",
        username: "ali",
        password: userPassword,
      },
    }),
  ])

  console.log("✅ Users created")

  // Rozetleri oluştur (sadece yoksa ekle - unique name)
  const badgeNames = [
    "İlk Adım", "Kitap Kurdu", "Kütüphane Ustası", "Edebiyat Profesörü",
    "İlk Yorum", "Tartışmacı", "Forum Kahramanı",
    "İlk Etkinlik", "Etkinlik Bağımlısı", "Topluluk Yıldızı",
    "Hoş Geldin", "Profil Tamamlayıcı",
    "Kurucu Üye", "Yönetici", "Değerli Katkı"
  ]
  
  const existingBadges = await prisma.badge.findMany()
  const existingBadgeNames = existingBadges.map(b => b.name)
  
  if (existingBadgeNames.length === 0) {
    console.log("📛 Creating badges...")
    await prisma.badge.createMany({
      data: [
        { name: "İlk Adım", description: "İlk kitabını okuma listesine ekle", icon: "📖", color: "#3b82f6", category: "READING", requirement: 1, order: 1, isImportant: false },
        { name: "Kitap Kurdu", description: "10 kitap oku", icon: "🐛", color: "#10b981", category: "READING", requirement: 10, order: 2, isImportant: true },
        { name: "Kütüphane Ustası", description: "50 kitap oku", icon: "📚", color: "#f59e0b", category: "READING", requirement: 50, order: 3, isImportant: true },
        { name: "Edebiyat Profesörü", description: "100 kitap oku", icon: "🎓", color: "#8b5cf6", category: "READING", requirement: 100, order: 4, isImportant: true },
        { name: "İlk Yorum", description: "Forum'da ilk yorumunu yap", icon: "💬", color: "#06b6d4", category: "FORUM", requirement: 1, order: 5, isImportant: false },
        { name: "Tartışmacı", description: "50 forum yorumu yap", icon: "🗣️", color: "#ec4899", category: "FORUM", requirement: 50, order: 6, isImportant: true },
        { name: "Forum Kahramanı", description: "100 forum yorumu yap", icon: "🦸", color: "#ef4444", category: "FORUM", requirement: 100, order: 7, isImportant: true },
        { name: "İlk Etkinlik", description: "İlk etkinliğine katıl", icon: "🎉", color: "#14b8a6", category: "EVENT", requirement: 1, order: 8, isImportant: false },
        { name: "Etkinlik Bağımlısı", description: "10 etkinliğe katıl", icon: "🎊", color: "#a855f7", category: "EVENT", requirement: 10, order: 9, isImportant: true },
        { name: "Topluluk Yıldızı", description: "25 etkinliğe katıl", icon: "⭐", color: "#f59e0b", category: "EVENT", requirement: 25, order: 10, isImportant: true },
        { name: "Hoş Geldin", description: "Hesabını oluştur", icon: "👋", color: "#6366f1", category: "PROFILE", requirement: 1, order: 11, isImportant: false },
        { name: "Profil Tamamlayıcı", description: "Profilini tamamen doldur", icon: "✅", color: "#22c55e", category: "PROFILE", requirement: 1, order: 12, isImportant: false },
        { name: "Kurucu Üye", description: "Kulübün ilk üyelerinden biri", icon: "👑", color: "#fbbf24", category: "SPECIAL", isSpecial: true, order: 13, isImportant: true },
        { name: "Yönetici", description: "Kulüp yönetim ekibi", icon: "🛡️", color: "#dc2626", category: "SPECIAL", isSpecial: true, order: 14, isImportant: true },
        { name: "Değerli Katkı", description: "Kulübe özel katkıları için", icon: "🏆", color: "#f97316", category: "SPECIAL", isSpecial: true, order: 15, isImportant: true },
      ],
      skipDuplicates: true,
    })
  }
  
  const badges = await prisma.badge.findMany({ orderBy: { order: 'asc' } })
  console.log(`✅ Badges ready (${badges.length} total)`)

  // Kitaplar - sadece yoksa ekle
  const bookCount = await prisma.book.count()
  if (bookCount === 0) {
    console.log("📚 Creating books...")
    await prisma.book.createMany({
      data: [
        { title: "İnce Memed", author: "Yaşar Kemal", description: "Türk edebiyatının önemli eserlerinden biri. Sosyal adalet, direniş ve özgürlük mücadelesi üzerine güçlü bir roman.", coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", genre: "Roman", publishedYear: 1955, pageCount: 423, featured: true },
        { title: "Tutunamayanlar", author: "Oğuz Atay", description: "Modern Türk edebiyatının en önemli eserlerinden biri.", coverImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400", genre: "Modern Roman", publishedYear: 1971, pageCount: 724, featured: true },
        { title: "Kürk Mantolu Madonna", author: "Sabahattin Ali", description: "Aşk, tutku ve hayal kırıklığı üzerine dokunaklı bir hikaye.", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", genre: "Roman", publishedYear: 1943, pageCount: 176, featured: false },
        { title: "Suç ve Ceza", author: "Fyodor Dostoyevski", description: "Klasik Rus edebiyatının başyapıtlarından biri.", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", genre: "Klasik Edebiyat", publishedYear: 1866, pageCount: 671, featured: true },
        { title: "1984", author: "George Orwell", description: "Distopik edebiyatın vazgeçilmez eseri.", coverImage: "https://images.unsplash.com/photo-1495640452828-3df6795cf331?w=400", genre: "Distopya", publishedYear: 1949, pageCount: 328, featured: true },
        { title: "Simyacı", author: "Paulo Coelho", description: "Kişisel efsanenizi bulma yolculuğu.", coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", genre: "Felsefe", publishedYear: 1988, pageCount: 163, featured: true },
        { title: "Hobbit", author: "J.R.R. Tolkien", description: "Orta Dünya'nın büyülü dünyasında geçen unutulmaz bir macera.", coverImage: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400", genre: "Fantastik", publishedYear: 1937, pageCount: 310, featured: false },
      ],
    })
    console.log("✅ Books created")
  } else {
    console.log(`✅ Books already exist (${bookCount} books)`)
  }

  // Etkinlikler - sadece yoksa ekle
  const eventCount = await prisma.event.count()
  if (eventCount === 0) {
    console.log("🎉 Creating events...")
    await prisma.event.createMany({
      data: [
        { title: "Söyleşi: Edebiyatta Kadın Kahramanlar", description: "Edebiyat tarihindeki güçlü kadın karakterleri ve yazarları inceliyoruz.", location: "Merkez Kütüphane", isOnline: false, startDate: new Date("2025-11-15T14:00:00"), time: "14:00 - 16:00", eventType: "Söyleşi", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800", maxAttendees: 50, status: "UPCOMING" },
        { title: "Kitap Ortağım: Suç ve Ceza", description: "Dostoyevski'nin ünlü eseri Suç ve Ceza'yı birlikte okuyup tartışacağız.", location: "Okuyamayanlar Kulüp Evi", isOnline: false, startDate: new Date("2025-11-20T18:00:00"), time: "18:00 - 20:00", eventType: "Kitap Ortağım", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800", maxAttendees: 20, status: "UPCOMING" },
        { title: "Online Tartışma: Distopya Edebiyatı", description: "Distopik edebiyat üzerine online tartışma.", location: "Online (Zoom)", isOnline: true, startDate: new Date("2025-11-25T20:00:00"), time: "20:00 - 22:00", eventType: "Kafamda Deli Sorular", image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800", maxAttendees: 100, status: "UPCOMING" },
      ],
    })
    console.log("✅ Events created")
  } else {
    console.log(`✅ Events already exist (${eventCount} events)`)
  }

  // Forum konuları - sadece yoksa ekle
  const topicCount = await prisma.forumTopic.count()
  if (topicCount === 0 && users.length > 0) {
    console.log("💬 Creating forum topics...")
    const topic1 = await prisma.forumTopic.create({
      data: {
        title: "Bu ay hangi kitapları okudunuz?",
        content: "Merhaba arkadaşlar! Bu ay okuma serüvenlerinizi paylaşalım.",
        userId: users[0].id,
        pinned: true,
      },
    })
    
    await prisma.forumReply.create({
      data: {
        content: "Ben Suç ve Ceza'yı bitirdim. Raskolnikov'un psikolojik değişimi inanılmazdı!",
        userId: users[1]?.id || users[0].id,
        topicId: topic1.id,
      },
    })
    console.log("✅ Forum topics created")
  } else {
    console.log(`✅ Forum topics already exist (${topicCount} topics)`)
  }

  console.log("\n🎉 Seeding completed successfully!")
  console.log("\n📧 Test hesapları:")
  console.log("🔒 Admin: wastedtr34@gmail.com / admin123")
  console.log("👤 User: mehmet@example.com / user123")
  console.log("\n⚠️  Admin şifresini ilk girişten sonra mutlaka değiştirin!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
