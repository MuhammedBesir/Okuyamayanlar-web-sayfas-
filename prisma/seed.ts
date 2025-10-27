import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Admin kullanıcı oluştur (Süper Admin)
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "wastedtr34@gmail.com" },
    update: { role: "ADMIN" }, // Eğer varsa role'ünü ADMIN yap
    create: {
      email: "wastedtr34@gmail.com",
      name: "Süper Admin",
      username: "superadmin",
      password: adminPassword,
      role: "ADMIN",
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

  // Rozetleri oluştur
  const badges = await Promise.all([
    // Okuma Rozetleri
    prisma.badge.create({
      data: {
        name: "İlk Adım",
        description: "İlk kitabını okuma listesine ekle",
        icon: "📖",
        color: "#3b82f6",
        category: "READING",
        requirement: 1,
        order: 1,
        isImportant: false,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Kitap Kurdu",
        description: "10 kitap oku",
        icon: "🐛",
        color: "#10b981",
        category: "READING",
        requirement: 10,
        order: 2,
        isImportant: true, // Önemli milestone
      },
    }),
    prisma.badge.create({
      data: {
        name: "Kütüphane Ustası",
        description: "50 kitap oku",
        icon: "📚",
        color: "#f59e0b",
        category: "READING",
        requirement: 50,
        order: 3,
        isImportant: true, // Önemli milestone
      },
    }),
    prisma.badge.create({
      data: {
        name: "Edebiyat Profesörü",
        description: "100 kitap oku",
        icon: "🎓",
        color: "#8b5cf6",
        category: "READING",
        requirement: 100,
        order: 4,
        isImportant: true, // Önemli milestone
      },
    }),
    // Forum Rozetleri
    prisma.badge.create({
      data: {
        name: "İlk Yorum",
        description: "Forum'da ilk yorumunu yap",
        icon: "💬",
        color: "#06b6d4",
        category: "FORUM",
        requirement: 1,
        order: 5,
        isImportant: false,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Tartışmacı",
        description: "50 forum yorumu yap",
        icon: "🗣️",
        color: "#ec4899",
        category: "FORUM",
        requirement: 50,
        order: 6,
        isImportant: true, // Önemli milestone
      },
    }),
    prisma.badge.create({
      data: {
        name: "Forum Kahramanı",
        description: "100 forum yorumu yap",
        icon: "🦸",
        color: "#ef4444",
        category: "FORUM",
        requirement: 100,
        order: 7,
        isImportant: true, // Önemli milestone
      },
    }),
    // Etkinlik Rozetleri
    prisma.badge.create({
      data: {
        name: "İlk Etkinlik",
        description: "İlk etkinliğine katıl",
        icon: "🎉",
        color: "#14b8a6",
        category: "EVENT",
        requirement: 1,
        order: 8,
        isImportant: false,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Etkinlik Bağımlısı",
        description: "10 etkinliğe katıl",
        icon: "🎊",
        color: "#a855f7",
        category: "EVENT",
        requirement: 10,
        order: 9,
        isImportant: true, // Önemli milestone
      },
    }),
    prisma.badge.create({
      data: {
        name: "Topluluk Yıldızı",
        description: "25 etkinliğe katıl",
        icon: "⭐",
        color: "#f59e0b",
        category: "EVENT",
        requirement: 25,
        order: 10,
        isImportant: true, // Önemli milestone
      },
    }),
    // Profil Rozetleri
    prisma.badge.create({
      data: {
        name: "Hoş Geldin",
        description: "Hesabını oluştur",
        icon: "👋",
        color: "#6366f1",
        category: "PROFILE",
        requirement: 1,
        order: 11,
        isImportant: false,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Profil Tamamlayıcı",
        description: "Profilini tamamen doldur",
        icon: "✅",
        color: "#22c55e",
        category: "PROFILE",
        requirement: 1,
        order: 12,
        isImportant: false,
      },
    }),
    // Özel Rozetler
    prisma.badge.create({
      data: {
        name: "Kurucu Üye",
        description: "Kulübün ilk üyelerinden biri",
        icon: "👑",
        color: "#fbbf24",
        category: "SPECIAL",
        isSpecial: true,
        order: 13,
        isImportant: true, // Özel rozetler her zaman önemli
      },
    }),
    prisma.badge.create({
      data: {
        name: "Yönetici",
        description: "Kulüp yönetim ekibi",
        icon: "🛡️",
        color: "#dc2626",
        category: "SPECIAL",
        isSpecial: true,
        order: 14,
        isImportant: true, // Özel rozetler her zaman önemli
      },
    }),
    prisma.badge.create({
      data: {
        name: "Değerli Katkı",
        description: "Kulübe özel katkıları için",
        icon: "🏆",
        color: "#f97316",
        category: "SPECIAL",
        isSpecial: true,
        order: 15,
        isImportant: true, // Özel rozetler her zaman önemli
      },
    }),
  ])

  console.log("✅ Badges created")

  // Admin'e rozetler ver
  await Promise.all([
    prisma.userBadge.create({
      data: {
        userId: admin.id,
        badgeId: badges[0].id, // İlk Adım
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: admin.id,
        badgeId: badges[10].id, // Hoş Geldin
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: admin.id,
        badgeId: badges[12].id, // Kurucu Üye
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: admin.id,
        badgeId: badges[13].id, // Yönetici
      },
    }),
  ])

  console.log("✅ User badges assigned")

  // Kitaplar oluştur
  const books = await Promise.all([
    // Türk Klasikleri
    prisma.book.create({
      data: {
        title: "İnce Memed",
        author: "Yaşar Kemal",
        description: "Türk edebiyatının önemli eserlerinden biri. Sosyal adalet, direniş ve özgürlük mücadelesi üzerine güçlü bir roman.",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        genre: "Roman",
        publishedYear: 1955,
        pageCount: 423,
        featured: true,
      },
    }),
    prisma.book.create({
      data: {
        title: "Tutunamayanlar",
        author: "Oğuz Atay",
        description: "Modern Türk edebiyatının en önemli eserlerinden biri. Varoluş, yabancılaşma ve kimlik arayışı üzerine derinlikli bir roman.",
        coverImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400",
        genre: "Modern Roman",
        publishedYear: 1971,
        pageCount: 724,
        featured: true,
      },
    }),
    prisma.book.create({
      data: {
        title: "Kürk Mantolu Madonna",
        author: "Sabahattin Ali",
        description: "Aşk, tutku ve hayal kırıklığı üzerine dokunaklı bir hikaye. Türk edebiyatının en çok okunan romanlarından biri.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        genre: "Roman",
        publishedYear: 1943,
        pageCount: 176,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Bereketli Topraklar Üzerinde",
        author: "Orhan Kemal",
        description: "Çukurova'da pamuk tarlalarında çalışan emekçilerin hikayesi. Sosyal gerçekçi edebiyatın önemli örneklerinden.",
        coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
        genre: "Roman",
        publishedYear: 1954,
        pageCount: 295,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Huzur",
        author: "Ahmet Hamdi Tanpınar",
        description: "İstanbul'un kültürel atmosferinde geçen, aşk ve arayış hikayesi. Modern Türk edebiyatının başyapıtı.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        genre: "Roman",
        publishedYear: 1949,
        pageCount: 462,
        featured: false,
      },
    }),
    // Dünya Klasikleri
    prisma.book.create({
      data: {
        title: "Suç ve Ceza",
        author: "Fyodor Dostoyevski",
        description: "Klasik Rus edebiyatının başyapıtlarından biri. İnsan psikolojisinin derinliklerine inen, etik ve ahlak üzerine düşündüren etkileyici bir roman.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        genre: "Klasik Edebiyat",
        publishedYear: 1866,
        pageCount: 671,
        featured: true,
      },
    }),
    prisma.book.create({
      data: {
        title: "Sefiller",
        author: "Victor Hugo",
        description: "19. yüzyıl Fransa'sında geçen epik bir hikaye. Adalet, aşk, kurtuluş ve toplumsal eşitsizlik temaları üzerine muhteşem bir eser.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        genre: "Klasik Edebiyat",
        publishedYear: 1862,
        pageCount: 1463,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Anna Karenina",
        author: "Lev Tolstoy",
        description: "Aşk, aile ve toplum üzerine derin bir inceleme. Rus edebiyatının ve dünya edebiyatının en önemli romanlarından.",
        coverImage: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400",
        genre: "Klasik Edebiyat",
        publishedYear: 1877,
        pageCount: 864,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Madame Bovary",
        author: "Gustave Flaubert",
        description: "Gerçekçi edebiyatın en önemli örneklerinden. Bir kadının hayal kırıklıkları ve tutkuları üzerine etkileyici bir roman.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
        genre: "Klasik Edebiyat",
        publishedYear: 1856,
        pageCount: 341,
        featured: false,
      },
    }),
    // Distopya ve Bilim Kurgu
    prisma.book.create({
      data: {
        title: "1984",
        author: "George Orwell",
        description: "Distopik edebiyatın vazgeçilmez eseri. Totaliter bir rejimin bireyin yaşamına olan etkilerini anlatan, günümüzde de geçerliliğini koruyan önemli bir eser.",
        coverImage: "https://images.unsplash.com/photo-1495640452828-3df6795cf331?w=400",
        genre: "Distopya",
        publishedYear: 1949,
        pageCount: 328,
        featured: true,
      },
    }),
    prisma.book.create({
      data: {
        title: "Cesur Yeni Dünya",
        author: "Aldous Huxley",
        description: "Teknolojinin ve bilimin insanlığı nasıl şekillendireceğine dair karanlık bir vizyon. Modern toplumun eleştirisi.",
        coverImage: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400",
        genre: "Distopya",
        publishedYear: 1932,
        pageCount: 268,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        description: "Kitapların yakıldığı distopik bir gelecekte geçen, bilgi özgürlüğü ve sansür üzerine güçlü bir alegorik roman.",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        genre: "Distopya",
        publishedYear: 1953,
        pageCount: 249,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Biz",
        author: "Yevgeny Zamyatin",
        description: "Modern distopya edebiyatının öncüsü. Totaliter bir toplumda bireyselliğin ve özgürlüğün yok oluşu.",
        coverImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400",
        genre: "Distopya",
        publishedYear: 1924,
        pageCount: 225,
        featured: false,
      },
    }),
    // Felsefe ve Düşünce
    prisma.book.create({
      data: {
        title: "Simyacı",
        author: "Paulo Coelho",
        description: "Kişisel efsanenizi bulma yolculuğu. Hayallerinizin peşinden gitme cesareti ve kader üzerine ilham verici bir hikaye.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
        genre: "Felsefe",
        publishedYear: 1988,
        pageCount: 163,
        featured: true,
      },
    }),
    prisma.book.create({
      data: {
        title: "Otomatik Portakal",
        author: "Anthony Burgess",
        description: "Özgür irade, şiddet ve toplumsal kontrol üzerine rahatsız edici ve düşündürücü bir roman.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        genre: "Felsefe",
        publishedYear: 1962,
        pageCount: 213,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Yabancı",
        author: "Albert Camus",
        description: "Varoluşçu felsefenin en önemli edebi örneklerinden. Anlamsızlık ve yabancılaşma üzerine derin bir inceleme.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        genre: "Felsefe",
        publishedYear: 1942,
        pageCount: 123,
        featured: false,
      },
    }),
    // Fantastik ve Macera
    prisma.book.create({
      data: {
        title: "Hobbit",
        author: "J.R.R. Tolkien",
        description: "Orta Dünya'nın büyülü dünyasında geçen unutulmaz bir macera. Modern fantastik edebiyatın temel taşlarından.",
        coverImage: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400",
        genre: "Fantastik",
        publishedYear: 1937,
        pageCount: 310,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Harry Potter ve Felsefe Taşı",
        author: "J.K. Rowling",
        description: "Büyücülük dünyasında geçen efsanevi serinin ilk kitabı. Dostluk, cesaret ve iyi ile kötü arasındaki mücadele.",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        genre: "Fantastik",
        publishedYear: 1997,
        pageCount: 223,
        featured: false,
      },
    }),
    // Modern Edebiyat
    prisma.book.create({
      data: {
        title: "Uçurtma Avcısı",
        author: "Khaled Hosseini",
        description: "Afganistan'da geçen, dostluk, ihanet, bağışlama ve kurtuluş üzerine dokunaklı bir hikaye.",
        coverImage: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400",
        genre: "Modern Roman",
        publishedYear: 2003,
        pageCount: 371,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Beyaz Geceler",
        author: "Fyodor Dostoyevski",
        description: "Romantik aşk ve hayal kırıklığı üzerine lirik bir hikaye. Petersburg'un beyaz gecelerinde geçen kısa ama etkileyici bir eser.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        genre: "Roman",
        publishedYear: 1848,
        pageCount: 78,
        featured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: "Çavdar Tarlasında Çocuklar",
        author: "J.D. Salinger",
        description: "Gençlik, yabancılaşma ve kimlik arayışı üzerine etkili bir roman. Modern Amerikan edebiyatının klasiklerinden.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
        genre: "Modern Roman",
        publishedYear: 1951,
        pageCount: 234,
        featured: false,
      },
    }),
  ])

  console.log("✅ Books created")

  // Etkinlikler oluştur
  const events = await Promise.all([
    // Gelecek Etkinlikler
    prisma.event.create({
      data: {
        title: "Söyleşi: Edebiyatta Kadın Kahramanlar",
        description: "Edebiyat tarihindeki güçlü kadın karakterleri ve yazarları inceliyoruz. Feminist edebiyat akımı ve kadın yazarların edebiyat dünyasına katkıları üzerine derin bir sohbet.",
        location: "Merkez Kütüphane Konferans Salonu",
        isOnline: false,
        startDate: new Date("2025-10-28T14:00:00"),
        time: "14:00 - 16:00",
        eventType: "Söyleşi",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
        maxAttendees: 50,
        status: "UPCOMING",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kitap Ortağım: Suç ve Ceza",
        description: "Dostoyevski'nin ünlü eseri Suç ve Ceza'yı birlikte okuyup tartışacağız. Her hafta bir bölüm okuyup buluşuyoruz. Kitap değişimi yapabilir, notlarınızı paylaşabilirsiniz.",
        location: "Okuyamayanlar Kulüp Evi",
        isOnline: false,
        startDate: new Date("2025-11-02T18:00:00"),
        time: "18:00 - 20:00",
        eventType: "Kitap Ortağım",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        maxAttendees: 20,
        status: "UPCOMING",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kafamda Deli Sorular: Zaman Yolculuğu Mümkün mü?",
        description: "Bilim kurgu edebiyatından yola çıkarak zamanın doğası, zaman yolculuğu ve paralel evrenler üzerine felsefi ve bilimsel tartışma. Fizik ve edebiyatın kesiştiği noktada.",
        location: "Online (Zoom)",
        isOnline: true,
        startDate: new Date("2025-11-05T20:00:00"),
        time: "20:00 - 22:00",
        eventType: "Kafamda Deli Sorular",
        image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800",
        maxAttendees: 100,
        status: "UPCOMING",
      },
    }),
    prisma.event.create({
      data: {
        title: "Yazar Buluşması: Modern Türk Edebiyatı",
        description: "Ünlü Türk yazarımız ile modern Türk edebiyatı, yazma süreci, ilham kaynakları ve edebiyatın geleceği hakkında samimi bir söyleşi. Kitap imza etkinliği de olacak.",
        location: "Eskişehir Üniversitesi Kütüphane",
        isOnline: false,
        startDate: new Date("2025-11-10T15:00:00"),
        time: "15:00 - 17:00",
        eventType: "Söyleşi",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800",
        maxAttendees: 80,
        status: "UPCOMING",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kitap Kahve: Rahat Sohbet",
        description: "Elinizdeki kitabı getirin, kahve içelim ve kitaplar üzerine sohbet edelim. Resmi bir tartışma değil, sadece kitapseverler arası samimi bir buluşma.",
        location: "Kahve Diyarı Cafe",
        isOnline: false,
        startDate: new Date("2025-11-15T17:00:00"),
        time: "17:00 - 19:00",
        eventType: "Kitap Kahve",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        maxAttendees: 25,
        status: "UPCOMING",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kafamda Deli Sorular: Gerçeklik Bir Simülasyon mu?",
        description: "Matrix filminden Platon'un mağara alegorisine, simülasyon teorisinden felsefi skeptisizme. Gerçekliğin doğası üzerine zihin açıcı bir tartışma.",
        location: "Online (Zoom)",
        isOnline: true,
        startDate: new Date("2025-11-20T20:00:00"),
        time: "20:00 - 22:00",
        eventType: "Kafamda Deli Sorular",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        maxAttendees: 100,
        status: "UPCOMING",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kitap Değişim Pazarı",
        description: "Okuduğunuz kitapları başkalarıyla değiştirebileceğiniz eğlenceli bir etkinlik. Kahve ve atıştırmalıklar bizden! Kitaplarınızı getirin, yeni kitaplarla dönün.",
        location: "Okuyamayanlar Kulüp Evi Bahçesi",
        isOnline: false,
        startDate: new Date("2025-11-25T10:00:00"),
        time: "10:00 - 15:00",
        eventType: "Kitap Değişim",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
        maxAttendees: 40,
        status: "UPCOMING",
      },
    }),
    // Geçmiş Etkinlikler
    prisma.event.create({
      data: {
        title: "Söyleşi: Bilim Kurgu Edebiyatı",
        description: "Türk bilim kurgu edebiyatının öncüleri ve geleceği üzerine yapılan söyleşi. İlginç tartışmalar ve yeni kitap önerileri ile dolu bir etkinlikti.",
        location: "Merkez Kütüphane",
        isOnline: false,
        startDate: new Date("2025-09-15T14:00:00"),
        time: "14:00 - 16:00",
        eventType: "Söyleşi",
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800",
        maxAttendees: 45,
        status: "COMPLETED",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kitap Ortağım: 1984",
        description: "George Orwell'in distopik başyapıtı 1984'ü okuduk ve totalitarizm, özgürlük ve gözetim toplumu üzerine tartıştık.",
        location: "Okuyamayanlar Kulüp Evi",
        isOnline: false,
        startDate: new Date("2025-09-22T18:00:00"),
        time: "18:00 - 20:00",
        eventType: "Kitap Ortağım",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
        maxAttendees: 20,
        status: "COMPLETED",
      },
    }),
    prisma.event.create({
      data: {
        title: "Kafamda Deli Sorular: Özgür İrade Var mı?",
        description: "Felsefenin en eski sorularından biri: İnsanların özgür iradesi var mı yoksa her şey önceden belirlenmiş mi? Harika tartışmalar yapıldı.",
        location: "Online (Zoom)",
        isOnline: true,
        startDate: new Date("2025-10-01T20:00:00"),
        time: "20:00 - 22:00",
        eventType: "Kafamda Deli Sorular",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        maxAttendees: 100,
        status: "COMPLETED",
      },
    }),
  ])

  console.log("✅ Events created")

  // Forum konuları oluştur
  const topics = await Promise.all([
    prisma.forumTopic.create({
      data: {
        title: "Bu ay hangi kitapları okudunuz?",
        content: "Merhaba arkadaşlar! Bu ay okuma serüvenlerinizi paylaşalım. Ben Suç ve Ceza'yı bitirdim ve çok etkilendim. Siz neler okudunuz?",
        userId: users[0].id,
        pinned: true,
      },
    }),
    prisma.forumTopic.create({
      data: {
        title: "Klasik edebiyat mı, modern edebiyat mı?",
        content: "Sizce hangisi daha değerli? Klasik eserlerin derinliği mi yoksa modern edebiyatın güncel konulara yaklaşımı mı daha önemli?",
        userId: users[1].id,
      },
    }),
    prisma.forumTopic.create({
      data: {
        title: "E-kitap mı, basılı kitap mı?",
        content: "Teknoloji çağında e-kitap okumaya geçtiniz mi? Yoksa hala basılı kitapların kokusunu ve dokusunu mu tercih ediyorsunuz?",
        userId: users[2].id,
      },
    }),
  ])

  console.log("✅ Forum topics created")

  // Forum cevapları
  await Promise.all([
    prisma.forumReply.create({
      data: {
        content: "Ben de Suç ve Ceza'yı çok sevdim! Raskolnikov'un psikolojik değişimi inanılmazdı.",
        userId: users[1].id,
        topicId: topics[0].id,
      },
    }),
    prisma.forumReply.create({
      data: {
        content: "Simyacı'yı okudum. Paulo Coelho'nun yazım tarzı çok akıcı, ilham verici bir kitaptı.",
        userId: users[2].id,
        topicId: topics[0].id,
      },
    }),
  ])

  console.log("✅ Forum replies created")

  console.log("🎉 Seeding completed successfully!")
  console.log("\n📧 Test hesapları:")
  console.log("🔒 Süper Admin: wastedtr34@gmail.com / admin123")
  console.log("👤 User: mehmet@example.com / user123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
