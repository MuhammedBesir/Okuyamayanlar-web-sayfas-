'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Heart, Award, TrendingUp, Calendar, Edit, Mail, Lock, Flame, Trophy, Clock, Sparkles, Trash2, AlertTriangle, RefreshCw } from "lucide-react"
import UserBadges from "@/components/user-badges"
import { Progress } from "@/components/ui/progress"
import { generateCartoonAvatar } from "@/lib/avatars"
import Link from 'next/link'

interface ProfileClientProps {
  user: any
  stats: {
    totalBooks: number
    completedBooks: number
    readingBooks: number
    totalTopics: number
    totalReplies: number
    daysSinceMember: number
    readingStreak: number
    activityScore: number
    level: number
    progressToNextLevel: number
  }
}

export default function ProfileClient({ user, stats }: ProfileClientProps) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Sabit bubble pozisyonları - hydration hatasını önlemek için useMemo kullan
  const bubbles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      width: (i * 7 % 4) + 2,
      height: (i * 11 % 4) + 2,
      left: (i * 17 % 100),
      top: (i * 23 % 100),
      duration: (i % 3) + 2,
      delay: (i % 2),
    }))
  , [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Next.js router'ı yenile
    router.refresh()
    // Biraz bekle ve state'i güncelle
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsRefreshing(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('⚠️ UYARI: Hesabınızı silmek üzeresiniz!\n\nBu işlem GERİ ALINAMAZ!\n\n✗ Tüm kitap listeniz\n✗ Forum gönderileriniz\n✗ Yorumlarınız\n✗ Rozetleriniz\n✗ Tüm verileriniz\n\nKALICI OLARAK SİLİNECEK!\n\nDevam etmek istediğinizden emin misiniz?')) {
      return
    }

    if (!confirm('SON UYARI!\n\nGerçekten hesabınızı silmek istiyor musunuz?\n\nBu işlem geri alınamaz!')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('✓ Hesabınız başarıyla silindi. Sayfa yönlendirilecek...')
        await signOut({ redirect: false })
        router.push('/')
      } else {
        const data = await response.json()
        alert('✗ Hata: ' + (data.error || 'Hesap silinemedi'))
      }
    } catch (error) {
      alert('✗ Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsDeleting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const statCards = [
    {
      title: "Kitap Koleksiyonu",
      value: stats.totalBooks,
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-amber-950/20",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-400",
      subtitle: `${stats.completedBooks} tamamlandı`,
      progress: stats.totalBooks > 0 ? (stats.completedBooks / stats.totalBooks) * 100 : 0
    },
    {
      title: "Forum Konuları",
      value: stats.totalTopics,
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-blue-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-400",
      subtitle: "Açtığım konu",
      progress: Math.min((stats.totalTopics / 10) * 100, 100)
    },
    {
      title: "Yorumlarım",
      value: stats.totalReplies,
      icon: Heart,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      subtitle: "Forum yanıtı",
      progress: Math.min((stats.totalReplies / 50) * 100, 100)
    },
    {
      title: "Seviye",
      value: stats.level,
      icon: Trophy,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-700 dark:text-purple-400",
      subtitle: `${stats.activityScore} puan`,
      progress: stats.progressToNextLevel
    }
  ]

  return (
    <motion.div 
      className="container py-4 sm:py-8 px-3 sm:px-4 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Modern Profile Header with Animation */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl group">
          <div className="h-32 md:h-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    className="absolute bg-white rounded-full"
                    style={{
                      width: bubble.width + 'px',
                      height: bubble.height + 'px',
                      left: bubble.left + '%',
                      top: bubble.top + '%',
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: bubble.duration,
                      repeat: Infinity,
                      delay: bubble.delay,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Level badge */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                <span className="font-bold text-sm">Seviye {stats.level}</span>
              </div>
            </motion.div>
          </div>
          
          <CardContent className="pt-0 px-4 md:px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 -mt-16 md:-mt-20">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar className="h-32 md:h-40 w-32 md:w-40 border-4 border-background shadow-2xl ring-4 ring-amber-500/50">
                  <AvatarImage 
                    src={user.image || generateCartoonAvatar(user.email || user.name || 'user', 'avataaars')} 
                    alt={user.name || ""} 
                  />
                  <AvatarFallback className="text-4xl md:text-5xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Streak badge */}
                {stats.readingStreak > 0 && (
                  <motion.div 
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-xl"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Flame className="h-6 w-6" />
                  </motion.div>
                )}
              </motion.div>
              
              <div className="flex-1 text-center md:text-left mt-4 w-full">
                <motion.h1 
                  className="text-3xl md:text-5xl font-black mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {user.name}
                </motion.h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 text-xs md:text-sm">
                  <motion.div 
                    className="flex items-center gap-2 text-muted-foreground bg-muted px-2 md:px-3 py-1 rounded-full max-w-[200px] md:max-w-none"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Mail className="h-3 md:h-4 w-3 md:w-4 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-muted-foreground bg-muted px-2 md:px-3 py-1 rounded-full whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="h-3 md:h-4 w-3 md:w-4 text-blue-600 flex-shrink-0" />
                    <span>{stats.daysSinceMember} gün</span>
                  </motion.div>
                  {stats.readingStreak > 0 && (
                    <motion.div 
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 md:px-3 py-1 rounded-full whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      animate={{
                        boxShadow: ['0 0 0 0 rgba(249, 115, 22, 0.4)', '0 0 0 10px rgba(249, 115, 22, 0)'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <Flame className="h-3 md:h-4 w-3 md:w-4 flex-shrink-0" />
                      <span className="font-bold">{stats.readingStreak} gün streak!</span>
                    </motion.div>
                  )}
                </div>
                
                {user.bio && (
                  <motion.p 
                    className="text-sm md:text-base text-muted-foreground mb-4 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user.bio}
                  </motion.p>
                )}
                
                {/* Level Progress */}
                <motion.div 
                  className="mb-4 bg-muted p-3 rounded-lg max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Seviye {stats.level} → {stats.level + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stats.progressToNextLevel}/100 XP
                    </span>
                  </div>
                  <Progress value={stats.progressToNextLevel} className="h-1.5" />
                </motion.div>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center md:justify-start">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-sm md:text-base h-10 shadow-lg hover:shadow-xl w-full sm:w-auto" asChild>
                      <Link href="/reading-list">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Okuma Listem
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm md:text-base h-10 shadow-lg hover:shadow-xl w-full sm:w-auto" asChild>
                      <Link href="/profile/edit">
                        <Edit className="mr-2 h-4 w-4" />
                        Profili Düzenle
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="border-2 hover:border-purple-300 dark:hover:border-purple-700 text-sm md:text-base h-10 w-full sm:w-auto" asChild>
                      <Link href="/profile/change-password">
                        <Lock className="mr-2 h-4 w-4" />
                        Şifre Değiştir
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="destructive" 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-sm md:text-base h-10 w-full sm:w-auto" 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? 'Siliniyor...' : 'Hesabı Sil'}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Animated Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={`bg-gradient-to-br ${stat.bgGradient} border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden group relative`}>
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 relative z-10">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <motion.div 
                  className={`p-1.5 sm:p-2 ${stat.iconBg} rounded-full`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </motion.div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0 relative z-10">
                <motion.div 
                  className={`text-2xl sm:text-3xl md:text-4xl font-black ${stat.textColor} mb-1 sm:mb-2`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-xs text-muted-foreground mb-1.5 sm:mb-2">{stat.subtitle}</p>
                <Progress value={stat.progress} className="h-1 sm:h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity Cards with Animations */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-300 hover:shadow-2xl group overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 sm:p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <motion.div 
                    className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base truncate">Son Eklenen Kitaplar</CardTitle>
                    <CardDescription className="text-xs sm:text-sm hidden sm:block">Okuma listenize eklediğiniz son kitaplar</CardDescription>
                  </div>
                </div>
                <motion.button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1.5 sm:p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Yenile"
                >
                  <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="space-y-3">
                {user.readingLists && user.readingLists.length > 0 ? (
                  user.readingLists.slice(0, 5).map((item: any, index: number) => (
                    <Link href={`/library/${item.book.id}`} key={item.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 10, backgroundColor: "rgba(251, 191, 36, 0.1)" }}
                        className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-all cursor-pointer"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="font-semibold text-sm truncate">{item.book.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.book.author}</p>
                        </div>
                        <motion.span 
                          className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                            item.status === "reading" 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                              : (item.status === "COMPLETED" || item.status === "completed")
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.status === "reading" 
                            ? "📖 Okuyorum" 
                            : (item.status === "COMPLETED" || item.status === "completed")
                            ? "✅ Tamamlandı" 
                            : "📚 Okunacak"}
                        </motion.span>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground mb-3">Henüz kitap eklenmemiş</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/library">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Kitap Keşfet
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-2xl group overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 sm:p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-2 sm:gap-3 relative z-10 min-w-0">
                <motion.div 
                  className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm sm:text-base truncate">Son Forum Aktivitesi</CardTitle>
                  <CardDescription className="text-xs sm:text-sm hidden sm:block">Forum&apos;daki son aktiviteleriniz</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="space-y-3">
                {user.forumTopics && user.forumTopics.length > 0 ? (
                  user.forumTopics.slice(0, 5).map((topic: any, index: number) => (
                    <Link href={`/forum/${topic.id}`} key={topic.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 10, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                        className="p-3 rounded-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
                      >
                        <p className="font-semibold text-sm mb-1 line-clamp-2">{topic.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{new Date(topic.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground mb-3">Henüz forum aktivitesi yok</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/forum">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Forum'a Git
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rozet Bölümü */}
      <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
        <UserBadges />
      </motion.div>
    </motion.div>
  )
}
