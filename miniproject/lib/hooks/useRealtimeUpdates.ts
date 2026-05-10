'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Hook for dashboard updates with data fetching
export function useDashboardUpdates() {
  const { user } = useAuth()
  const [stats, setStats] = React.useState({
    completedQuizzes: 0,
    savedColleges: 0,
    skillsAcquired: 0,
    achievementsUnlocked: 0,
    roadmapProgress: 0,
    weeklyProgress: 0
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchDashboardStats = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch stats from user-stats API
      const response = await fetch('/api/user-stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          completedQuizzes: data.stats.completedQuizzes || 0,
          savedColleges: data.stats.savedColleges || 0,
          skillsAcquired: data.stats.skillsAcquired || 0,
          achievementsUnlocked: data.stats.achievementsUnlocked || 0,
          roadmapProgress: data.stats.roadmapProgress || 0,
          weeklyProgress: data.stats.weeklyProgress || 0
        })
      } else {
        console.error('Failed to fetch dashboard stats:', data.error)
        setError('Failed to load dashboard statistics')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError('Failed to load dashboard statistics')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  React.useEffect(() => {
    if (user || process.env.NODE_ENV === 'development') {
      fetchDashboardStats()
    }
  }, [user, fetchDashboardStats])

  return {
    stats,
    isLoading,
    error,
    isConnected: true,
    refresh: fetchDashboardStats
  }
}