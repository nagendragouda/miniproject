import { NextRequest, NextResponse } from 'next/server'
import { 
  generateCareerPrediction, 
  formatPredictionResults,
  UserProfile,
  EducationLevel
} from '@/lib/educationLevelCareerPrediction'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.educationLevel) {
      return NextResponse.json(
        { 
          error: 'Missing educationLevel. Must be one of: "10th", "12th", "Diploma", "Degree"' 
        },
        { status: 400 }
      )
    }

    const validLevels: EducationLevel[] = ['10th', '12th', 'Diploma', 'Degree']
    if (!validLevels.includes(body.educationLevel)) {
      return NextResponse.json(
        { 
          error: `Invalid educationLevel: "${body.educationLevel}". Must be one of: ${validLevels.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Build user profile
    const userProfile: UserProfile = {
      name: body.name || 'User',
      email: body.email,
      educationLevel: body.educationLevel as EducationLevel,
      skills: body.skills ? Array.isArray(body.skills) ? body.skills : [body.skills] : [],
      interests: body.interests ? Array.isArray(body.interests) ? body.interests : [body.interests] : [],
      traits: body.traits || {}
    }

    // Generate prediction
    const prediction = generateCareerPrediction(userProfile)

    return NextResponse.json({
      success: true,
      data: prediction,
      formatted: formatPredictionResults(prediction)
    })

  } catch (error: any) {
    console.error('Career prediction error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate career prediction',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/career-prediction-new',
    method: 'POST',
    description: 'Generate career predictions based on education level and user profile',
    required_fields: {
      educationLevel: 'string (10th, 12th, Diploma, or Degree)'
    },
    optional_fields: {
      name: 'string',
      email: 'string',
      skills: 'string[] - e.g., ["Python", "JavaScript", "Leadership"]',
      interests: 'string[] - e.g., ["Technology", "Business", "Helping people"]',
      traits: 'object - e.g., { technical: 8, analytical: 7, creativity: 6 }'
    },
    example_request: {
      educationLevel: '12th',
      name: 'Ali Ahmed',
      email: 'ali@example.com',
      skills: ['Python', 'Problem Solving'],
      interests: ['AI', 'Technology', 'Problem Solving'],
      traits: {
        logic: 8,
        technical: 9,
        analytical: 8,
        creativity: 6,
        communication: 7,
        leadership: 6,
        business: 5,
        helping: 4,
        risk: 5
      }
    }
  })
}
