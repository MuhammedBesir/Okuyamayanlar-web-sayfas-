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
