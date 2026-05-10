import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Get the authenticated user from headers/session
    // 2. Query database (supabase) for quiz_results where user_id = current_user
    // 3. Return paginated results
    // For now, return mock historical data

    const mockResults = [
      {
        id: 'quiz-001',
        career_path: 'Software Engineer',
        score: 92,
        interests: ['Programming', 'Problem Solving', 'Building', 'Technology'],
        skills: ['JavaScript', 'Python', 'System Design', 'Testing'],
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        salaryRange: '₹8-25 LPA'
      },
      {
        id: 'quiz-002',
        career_path: 'Data Scientist',
        score: 78,
        interests: ['Data Analysis', 'Statistics', 'Machine Learning'],
        skills: ['Python', 'SQL', 'Statistical Analysis', 'Visualization'],
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        salaryRange: '₹10-30 LPA'
      },
      {
        id: 'quiz-003',
        career_path: 'Product Manager',
        score: 85,
        interests: ['Leadership', 'Strategy', 'Communication', 'Business'],
        skills: ['Analytical Thinking', 'Decision Making', 'Leadership', 'Planning'],
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        salaryRange: '₹8-35 LPA'
      }
    ]

    return NextResponse.json({
      success: true,
      results: mockResults,
      total: mockResults.length,
      hasMore: false
    })
  } catch (error) {
    console.error('Error fetching past quiz results:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz results' },
      { status: 500 }
    )
  }
}
