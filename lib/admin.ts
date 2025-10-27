// Süper admin email adresi - Bu hesap korumalıdır ve değiştirilemez
export const SUPER_ADMIN_EMAIL = "wastedtr34@gmail.com"

/**
 * Verilen email adresinin süper admin olup olmadığını kontrol eder
 */
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
}

/**
 * Kullanıcının süper admin olup olmadığını ID ile kontrol eder
 */
export async function isSuperAdminById(userId: string, prisma: any): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  })
  return isSuperAdmin(user?.email)
}

/**
 * Banlanan kullanıcının tüm içeriklerini siler
 * Forum konuları, yorumlar, değerlendirmeler, etkinlik yorumları vb.
 */
export async function deleteUserContent(userId: string, prisma: any): Promise<{
  success: boolean
  deletedCounts: Record<string, number>
  error?: string
}> {
  try {
    console.log('🗑️ Kullanıcı içerikleri siliniyor:', userId)

    const deletedCounts: Record<string, number> = {}

    // 1. Forum yanıt beğenilerini sil
    const forumReplyLikes = await prisma.forumReplyLike.deleteMany({
      where: { userId }
    })
    deletedCounts.forumReplyLikes = forumReplyLikes.count
    console.log(`  ✓ ${forumReplyLikes.count} forum yanıt beğenisi silindi`)

    // 2. Forum konu beğenilerini sil
    const forumTopicLikes = await prisma.forumTopicLike.deleteMany({
      where: { userId }
    })
    deletedCounts.forumTopicLikes = forumTopicLikes.count
    console.log(`  ✓ ${forumTopicLikes.count} forum konu beğenisi silindi`)

    // 3. Forum yanıtlarını sil
    const forumReplies = await prisma.forumReply.deleteMany({
      where: { userId }
    })
    deletedCounts.forumReplies = forumReplies.count
    console.log(`  ✓ ${forumReplies.count} forum yanıtı silindi`)

    // 4. Forum konularını sil (cascade ile yanıtları ve medyaları da silinir)
    const forumTopics = await prisma.forumTopic.deleteMany({
      where: { userId }
    })
    deletedCounts.forumTopics = forumTopics.count
    console.log(`  ✓ ${forumTopics.count} forum konusu silindi`)

    // 5. Kitap değerlendirmelerini sil
    const reviews = await prisma.review.deleteMany({
      where: { userId }
    })
    deletedCounts.reviews = reviews.count
    console.log(`  ✓ ${reviews.count} kitap değerlendirmesi silindi`)

    // 6. Etkinlik yorumlarını sil
    const eventComments = await prisma.eventComment.deleteMany({
      where: { userId }
    })
    deletedCounts.eventComments = eventComments.count
    console.log(`  ✓ ${eventComments.count} etkinlik yorumu silindi`)

    // 7. Etkinlik fotoğraflarını sil
    const eventPhotos = await prisma.eventPhoto.deleteMany({
      where: { userId }
    })
    deletedCounts.eventPhotos = eventPhotos.count
    console.log(`  ✓ ${eventPhotos.count} etkinlik fotoğrafı silindi`)

    // 8. Etkinlik katılımlarını sil
    const eventRSVPs = await prisma.eventRSVP.deleteMany({
      where: { userId }
    })
    deletedCounts.eventRSVPs = eventRSVPs.count
    console.log(`  ✓ ${eventRSVPs.count} etkinlik katılımı silindi`)

    // 9. Okuma listelerini sil
    const readingLists = await prisma.readingList.deleteMany({
      where: { userId }
    })
    deletedCounts.readingLists = readingLists.count
    console.log(`  ✓ ${readingLists.count} okuma listesi silindi`)

    // 10. Bildirimleri sil
    const notifications = await prisma.notification.deleteMany({
      where: { userId }
    })
    deletedCounts.notifications = notifications.count
    console.log(`  ✓ ${notifications.count} bildirim silindi`)

    // 11. Rozetleri sil
    const userBadges = await prisma.userBadge.deleteMany({
      where: { userId }
    })
    deletedCounts.userBadges = userBadges.count
    console.log(`  ✓ ${userBadges.count} rozet silindi`)

    // 12. Ödünç alınan kitapları temizle
    const borrowedBooks = await prisma.book.updateMany({
      where: { borrowedBy: userId },
      data: { 
        borrowedBy: null,
        borrowDate: null,
        returnDate: null,
        borrowed: false
      }
    })
    deletedCounts.borrowedBooksCleared = borrowedBooks.count
    console.log(`  ✓ ${borrowedBooks.count} ödünç kitap kaydı temizlendi`)

    const totalDeleted = Object.values(deletedCounts).reduce((a, b) => a + b, 0)
    console.log(`✅ Toplam ${totalDeleted} içerik silindi`)

    return {
      success: true,
      deletedCounts
    }
  } catch (error) {
    console.error('❌ Kullanıcı içerikleri silinirken hata:', error)
    return {
      success: false,
      deletedCounts: {},
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }
  }
}
