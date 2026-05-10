import { NextRequest, NextResponse } from 'next/server'
import { buildUserScore, predictCareers } from '@/lib/careerPredictionAlgorithm'
import {
  generateEducationLevelGuidance,
  formatGuidanceForUI,
  EducationLevel
} from '@/lib/educationLevelGuidance'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      educationLevel,
      userProfile = {},
      quizResponses = {},
      customAnswers = {}
    } = body

    // ❌ Validate education level
    const validLevels: EducationLevel[] = ['10th', 'PUC', 'Graduation']
    if (!validLevels.includes(educationLevel)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid education level. Must be one of: ${validLevels.join(', ')}`
        },
        { status: 400 }
      )
    }

    console.log(`\n🎓 Education Level Guidance - ${educationLevel}`)
    console.log(`📊 Processing user profile...`)

    // Build user score
    const userScore = buildUserScore(userProfile, quizResponses, customAnswers)
    console.log(`✅ User score built:`, userScore)

    // Get top careers (needed for Graduation guidance)
    let topCareers = []
    if (educationLevel === 'Graduation') {
      topCareers = predictCareers(userProfile, quizResponses, customAnswers)
      console.log(`✅ Top careers predicted: ${topCareers.map(c => c.name).join(', ')}`)
    }

    // Generate education-level-based guidance
    console.log(`🔍 Generating ${educationLevel} guidance...`)
    const guidance = generateEducationLevelGuidance(
      educationLevel,
      userScore,
      educationLevel === 'Graduation' ? topCareers : undefined
    )
    console.log(`✅ Guidance generated: ${guidance.type}`)

    // Format for UI
    const formattedOutput = formatGuidanceForUI(guidance)

    // Return structured response
    return NextResponse.json({
      success: true,
      data: {
        educationLevel: educationLevel,
        guidanceType: guidance.type,
        guidance: guidance,
        formattedOutput: formattedOutput,
        userScore: userScore,
        topCareers: educationLevel === 'Graduation' ? topCareers : null,
        timestamp: new Date().toISOString(),

        // ✅ STRICT RULE ENFORCEMENT
        rules: {
          '10th': 'NO direct careers - ONLY stream suggestions with full roadmap',
          'PUC': 'Degree FIRST, then step-by-step path, THEN final career options',
          'Graduation': 'Direct career options with roadmaps allowed'
        },
        appliedRule: generateRuleMessage(educationLevel, guidance)
      }
    })
  } catch (error) {
    console.error('❌ Error in education guidance:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      endpoint: '/api/career-guidance/education-level',
      method: 'POST',
      description: 'Get education-level-based career guidance',
      educationLevels: ['10th', 'PUC', 'Graduation'],
      rules: {
        '10th': {
          description: 'Stream guidance only',
          output: 'Stream name, why it fits, step-by-step roadmap, final career options'
        },
        'PUC': {
          description: 'Degree guidance with career path',
          output: 'Recommended degree, step-by-step roadmap, final career options'
        },
        'Graduation': {
          description: 'Direct career guidance',
          output: 'Top 2-3 careers with individual roadmaps and match percentages'
        }
      },
      requestExample: {
        educationLevel: '10th',
        userProfile: {
          skills: 'Problem-solving, Basic coding',
          interests: 'Technology, AI'
        },
        quizResponses: {
          timestamp: '2026-04-10T10:00:00Z',
          answers: [
            {
              questionId: 1,
              question: 'How do you solve problems?',
              answer: 'Break into smaller parts',
              customAnswer: 'I like logical approaches'
            }
          ]
        },
        customAnswers: {
          '0': 'I love systematic problem-solving'
        }
      },
      responseExample: {
        success: true,
        data: {
          educationLevel: '10th',
          guidanceType: 'STREAM_GUIDANCE',
          guidance: {
            educationLevel: '10th',
            type: 'STREAM_GUIDANCE',
            recommendedStream: 'Science',
            whyThisStream: 'Based on your analysis...',
            steps: {
              step1: 'Choose Stream: Science',
              step2: 'Focus on Physics and Math',
              step3: 'Build projects',
              step4: 'Complete PUC',
              step5: 'Apply for degree',
              step6: 'Pursue careers'
            },
            finalCareerOptions: ['Software Engineer', 'AI/ML Engineer', 'Data Scientist']
          },
          formattedOutput: 'User-friendly formatted text',
          rules: {
            '10th': 'NO direct careers - ONLY stream suggestions',
            'PUC': 'Degree FIRST, then roadmap, THEN career options',
            'Graduation': 'Direct career options allowed'
          },
          appliedRule: 'APPLIED: 10th education level → Stream guidance only!'
        }
      }
    }
  })
}

function generateRuleMessage(educationLevel: EducationLevel, guidance: any): string {
  if (educationLevel === '10th') {
    return `✅ APPLIED: 10th education level → Stream guidance only! NO direct careers given. Full roadmap provided from 10th → Stream → PUC → Degree → Career`
  } else if (educationLevel === 'PUC') {
    return `✅ APPLIED: PUC education level → Degree suggested FIRST, then step-by-step learning path, THEN final career options shown`
  } else {
    return `✅ APPLIED: Graduation education level → Direct career options allowed! Showing top 3 careers with individual roadmaps and match percentages`
  }
}
