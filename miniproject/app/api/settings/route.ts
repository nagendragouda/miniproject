import { NextRequest, NextResponse } from 'next/server'

// GET /api/settings - Fetch user settings
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'default-user'

    // Mock settings data - in production, fetch from database
    const settings = {
      userId,
      notifications: {
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false,
        security_alerts: true,
        quiz_reminders: true,
        roadmap_updates: true,
        achievement_notifications: true
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        currency: 'USD',
        date_format: 'DD/MM/YYYY',
        two_factor_enabled: false
      },
      privacy: {
        profile_visibility: 'private',
        show_achievements: false,
        allow_analytics: true
      }
    }

    return NextResponse.json({ success: true, settings }, { status: 200 })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update user settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { notifications, preferences, privacy } = body

    // Validation
    const validThemes = ['dark', 'light', 'system']
    const validLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'hi']
    const validVisibility = ['public', 'private', 'friends']

    if (preferences?.theme && !validThemes.includes(preferences.theme)) {
      return NextResponse.json(
        { success: false, error: 'Invalid theme selected' },
        { status: 400 }
      )
    }

    if (preferences?.language && !validLanguages.includes(preferences.language)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language selected' },
        { status: 400 }
      )
    }

    if (privacy?.profile_visibility && !validVisibility.includes(privacy.profile_visibility)) {
      return NextResponse.json(
        { success: false, error: 'Invalid visibility setting' },
        { status: 400 }
      )
    }

    // Mock update - in production, save to database
    const updatedSettings = {
      notifications: notifications || {},
      preferences: preferences || {},
      privacy: privacy || {},
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Settings updated successfully',
        settings: updatedSettings 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
