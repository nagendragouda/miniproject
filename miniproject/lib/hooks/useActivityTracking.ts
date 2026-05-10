/**
 * Hook: useActivityTracking
 * Automatically tracks page views when a page loads
 * Usage: useActivityTracking('Page Title', userId)
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/activity-tracker'

export function useActivityTracking(pageTitle: string, userId?: string) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view when pathname changes
    trackPageView(pathname, pageTitle, userId)
  }, [pathname, pageTitle, userId])
}
