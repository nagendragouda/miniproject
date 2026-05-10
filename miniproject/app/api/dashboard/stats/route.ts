import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Get the authenticated user from headers/session
    // 2. Query the database for their stats
    // For now, return mock data that increases over time

    const baseStats = {
      completedQuizzes: Math.floor(Math.random() * 10),
      savedColleges: Math.floor(Math.random() * 15),
      skillsAcquired: Math.floor(Math.random() * 8),
      achievementsUnlocked: Math.floor(Math.random() * 5),
      roadmapProgress: Math.floor(Math.random() * 100)
    }

    return NextResponse.json({
      success: true,
      stats: baseStats
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
