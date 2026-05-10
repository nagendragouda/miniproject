/**
 * User Activity Tracking System
 * Logs all user page visits and interactions
 */

import { createClient } from '@supabase/supabase-js'

export interface UserActivity {
  user_id?: string
  page_path: string
  page_title: string
  referrer?: string
  timestamp?: string
  user_agent?: string
  session_id?: string
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  
  let sessionId = sessionStorage.getItem('activity_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('activity_session_id', sessionId)
  }
  return sessionId
}

/**
 * Track user activity/page visit
 */
export async function trackUserActivity(activity: UserActivity): Promise<void> {
  try {
    // Skip tracking for certain internal paths
    const skipPaths = ['/api/', '/_next', '/health-check']
    if (skipPaths.some(path => activity.page_path.includes(path))) {
      return
    }

    const trackingData = {
      user_id: activity.user_id || 'anonymous',
      page_path: activity.page_path,
      page_title: activity.page_title,
      referrer: activity.referrer || document.referrer || null,
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      session_id: activity.session_id || getSessionId(),
    }

    // Send to API endpoint
    const response = await fetch('/api/track-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData),
    })

    if (!response.ok) {
      console.warn('Failed to track activity:', response.statusText)
    }
  } catch (error) {
    // Silently fail - don't break the app if tracking fails
    console.warn('Activity tracking error:', error)
  }
}

/**
 * Track page view
 */
export function trackPageView(pagePath: string, pageTitle: string, userId?: string): void {
  if (typeof window === 'undefined') return

  // Debounce rapid calls
  const debounceKey = `tracked_${pagePath}`
  const lastTracked = sessionStorage.getItem(debounceKey)
  const now = Date.now()
  
  if (lastTracked && now - parseInt(lastTracked) < 1000) {
    return // Skip if tracked within last second
  }

  sessionStorage.setItem(debounceKey, now.toString())

  trackUserActivity({
    user_id: userId,
    page_path: pagePath,
    page_title: pageTitle,
    session_id: getSessionId(),
  })
}

/**
 * Track specific user action/event
 */
export async function trackEvent(
  eventName: string,
  eventData: Record<string, any>,
  userId?: string
): Promise<void> {
  try {
    const eventPayload = {
      user_id: userId || 'anonymous',
      page_path: typeof window !== 'undefined' ? window.location.pathname : 'server',
      page_title: eventName,
      event_data: eventData,
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      session_id: getSessionId(),
    }

    await fetch('/api/track-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    })
  } catch (error) {
    console.warn('Event tracking error:', error)
  }
}
