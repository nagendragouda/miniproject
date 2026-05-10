import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Get the authenticated user
    // 2. Query the activities table for this user
    // For now, return mock activity data

    const mockActivities = [
      {
        id: '1',
        title: 'Completed Career Quiz',
        description: 'Discovered interests in Tech & Innovation',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'quiz_completed'
      },
      {
        id: '2',
        title: 'Saved College',
        description: 'Added IIT Delhi to your college list',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'college_saved'
      },
      {
        id: '3',
        title: 'Achievement Unlocked',
        description: 'Quiz Master - Completed 5 quizzes',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'achievement_unlocked'
      },
      {
        id: '4',
        title: 'Roadmap Generated',
        description: 'Your personalized career roadmap was created',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'roadmap_generated'
      }
    ]

    return NextResponse.json({
      success: true,
      activity: mockActivities
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}
