import { NextRequest, NextResponse } from 'next/server'

// GET /api/profile - Fetch user profile
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'default-user'
    
    // Mock profile data - in production, fetch from database
    const profile = {
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      avatar_url: null,
      bio: 'Career enthusiast and learner',
      phone: '+91 98765 43210',
      location: 'India',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, profile }, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { first_name, last_name, avatar_url, bio, phone, location } = body

    // Validation
    if (!first_name?.trim() || !last_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    if (first_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'First name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (last_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Last name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (phone && !/^\+?[\d\s\-()]{7,}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Mock update - in production, save to database
    const updatedProfile = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      avatar_url: avatar_url || null,
      bio: bio?.trim() || '',
      phone: phone?.trim() || '',
      location: location?.trim() || '',
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Profile updated successfully',
        profile: updatedProfile 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
