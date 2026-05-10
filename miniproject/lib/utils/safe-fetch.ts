/**
 * Safe data fetching utility that prevents pages from crashing
 * Returns data or graceful fallbacks
 */

interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

interface FetchResult<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export async function safeFetch<T>(
  url: string,
  options?: FetchOptions,
  fallback?: T
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      console.warn(`Fetch error: ${url} returned ${response.status}`)
      return {
        data: fallback || null,
        error: `Failed to load data (${response.status})`,
        loading: false,
      }
    }

    const data = await response.json()
    return {
      data: data || fallback || null,
      error: null,
      loading: false,
    }
  } catch (err) {
    console.error(`Fetch failed for ${url}:`, err)
    return {
      data: fallback || null,
      error: `Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`,
      loading: false,
    }
  }
}

/**
 * Hook for safe data fetching in components
 */
import { useEffect, useState } from 'react'

export function useSafeFetch<T>(
  url: string,
  fallback?: T
): { data: T | null; error: string | null; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<T | null>(fallback || null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const result = await safeFetch<T>(url, undefined, fallback)
    setData(result.data)
    setError(result.error)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, error, loading, refetch: fetchData }
}

/**
 * Default fallback data for common API endpoints
 */
export const DEFAULT_FALLBACKS = {
  userStats: {
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    lastQuizDate: null,
    roadsCreated: 0,
    savedColleges: 0,
    achievements: [],
  },
  profile: {
    id: '',
    firstName: 'User',
    lastName: 'Profile',
    email: '',
    avatar: null,
    bio: '',
    careerGoal: '',
    educationLevel: '',
  },
  colleges: {
    colleges: [],
    total: 0,
    hasMore: false,
  },
  quizzes: {
    quizzes: [],
    total: 0,
  },
}
