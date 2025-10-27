'use client'

import { getUserLevel, getLevelColorClasses } from "@/lib/user-level"

interface UserLevelBadgeProps {
  activityScore: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function UserLevelBadge({ activityScore, size = 'md', showIcon = true }: UserLevelBadgeProps) {
  const userLevel = getUserLevel(activityScore)
  const colors = getLevelColorClasses(userLevel.color)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${colors.bg} ${colors.text} ${sizeClasses[size]}
        border ${colors.border}
        transition-all duration-200 hover:scale-105
      `}
      title={`${userLevel.title} - ${activityScore} puan`}
    >
      {showIcon && <span className="text-base leading-none">{userLevel.icon}</span>}
      <span className="leading-none">{userLevel.title}</span>
    </span>
  )
}
