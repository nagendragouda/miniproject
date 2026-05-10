import { NextRequest, NextResponse } from 'next/server'

// POST /api/settings/password - Change user password
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validation
    if (!currentPassword?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Current password is required' },
        { status: 400 }
      )
    }

    if (!newPassword?.trim()) {
      return NextResponse.json(
        { success: false, error: 'New password is required' },
        { status: 400 }
      )
    }

    if (!confirmPassword?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Password confirmation is required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New passwords do not match' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Check password strength
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordStrengthRegex.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain uppercase, lowercase, number, and special character' },
        { status: 400 }
      )
    }

    // Mock password verification - in production, verify with hashing
    // This is a demo - in real implementation, hash the password
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Password changed successfully. Please log in again.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
