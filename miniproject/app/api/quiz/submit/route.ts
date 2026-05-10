import { NextRequest, NextResponse } from 'next/server'
import { generateCareerPrediction } from '@/lib/educationLevelCareerPrediction'
import type { EducationLevel } from '@/lib/educationLevelCareerPrediction'

export const dynamic = 'force-dynamic'


interface QuizResponse {
  questionId: string
  answer: any
  question: string
  type: string
}

interface PersonalInfo {
  name?: string
  email?: string
  interests: string[]
  skills: string[]
  experience?: string
  educationLevel: EducationLevel
  traits?: {
    logic?: number
    technical?: number
    analytical?: number
    creativity?: number
    communication?: number
    leadership?: number
    business?: number
    helping?: number
    risk?: number
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { responses, personalInfo } = body

    if (!personalInfo || !personalInfo.educationLevel) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing educationLevel. Must be one of: "10th", "12th", "Diploma", "Degree"' 
        },
        { status: 400 }
      )
    }

    // Validate education level
    const validLevels: EducationLevel[] = ['10th', '12th', 'Diploma', 'Degree']
    if (!validLevels.includes(personalInfo.educationLevel)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid educationLevel: "${personalInfo.educationLevel}". Must be one of: ${validLevels.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Generate career prediction using Excel-based system
    const prediction = generateCareerPrediction({
      name: personalInfo.name || 'User',
      email: personalInfo.email,
      educationLevel: personalInfo.educationLevel,
      skills: personalInfo.skills || [],
      interests: personalInfo.interests || [],
      traits: personalInfo.traits || {}
    })

    // Format response
    return NextResponse.json({
      success: true,
      data: prediction,
      recommendations: {
        primaryCareer: prediction.top_3_matches[0] || null,
        alternativeCareers: prediction.top_3_matches.slice(1, 4) || [],
        educationLevel: prediction.user_education_level,
        totalCareersEvaluated: prediction.total_careers_evaluated
      },
      analyzedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error processing quiz submission:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process quiz submission' 
      },
      { status: 500 }
    )
  }
}
