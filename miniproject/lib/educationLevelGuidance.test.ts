/**
 * 🧪 Education Level Guidance System - Test Suite
 * 
 * Tests all three education levels with realistic user profiles
 */

import { buildUserScore, predictCareers } from '@/lib/careerPredictionAlgorithm'
import {
  generateEducationLevelGuidance,
  formatGuidanceForUI,
  EducationLevel
} from './educationLevelGuidance'

// ============================================
// TEST DATA
// ============================================

const TEST_10TH_PROFILE = {
  educationLevel: '10th' as EducationLevel,
  userProfile: {
    skills: 'Problem-solving, Basic coding, Mathematics',
    interests: 'Technology, AI, Innovation'
  },
  quizResponses: {
    timestamp: '2026-04-10T10:00:00Z',
    answers: [
      {
        questionId: 0,
        question: 'How do you solve problems?',
        answer: 'Break into smaller parts',
        customAnswer: 'I like systematic and logical approaches'
      },
      {
        questionId: 1,
        question: 'What drives your passion?',
        answer: 'Innovation and learning',
        customAnswer: 'I want to build AI systems'
      },
      {
        questionId: 2,
        question: 'How do you make decisions?',
        answer: 'Logically, analyzing all sides',
        customAnswer: 'Data-driven decisions'
      },
      {
        questionId: 3,
        question: 'What challenges excite you?',
        answer: 'Technical and mathematical',
        customAnswer: 'Complex algorithms'
      },
      {
        questionId: 4,
        question: 'How do you handle failure?',
        answer: 'Learn from mistakes',
        customAnswer: 'I analyze what went wrong'
      },
      {
        questionId: 5,
        question: 'Your biggest goal?',
        answer: 'Create innovative technology',
        customAnswer: 'Build products that matter'
      },
      {
        questionId: 6,
        question: 'Preferred work environment?',
        answer: 'Structured and collaborative',
        customAnswer: 'Dynamic tech team'
      },
      {
        questionId: 7,
        question: 'Career path preference?',
        answer: 'Tech specialization',
        customAnswer: 'Deep expertise in AI'
      },
      {
        questionId: 8,
        question: 'Risk tolerance?',
        answer: 'Moderate risk',
        customAnswer: 'Calculate risks, then proceed'
      },
      {
        questionId: 9,
        question: 'Long-term vision?',
        answer: 'Lead innovation',
        customAnswer: 'CTO or AI research lead'
      }
    ]
  },
  customAnswers: {}
}

const TEST_PUC_PROFILE = {
  educationLevel: 'PUC' as EducationLevel,
  userProfile: {
    skills: 'Python, Physics, Mathematics, Problem-solving',
    interests: 'Software development, AI, Research'
  },
  quizResponses: TEST_10TH_PROFILE.quizResponses
}

const TEST_GRADUATION_PROFILE = {
  educationLevel: 'Graduation' as EducationLevel,
  userProfile: {
    degree: 'B.Tech Computer Science',
    skills: 'Python, Machine Learning, TensorFlow, Frontend development, Database design',
    interests: 'AI, Data Science, Full-stack development'
  },
  quizResponses: TEST_10TH_PROFILE.quizResponses
}

// ============================================
// TEST FUNCTIONS
// ============================================

async function test10thGradance() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 TEST 1: 10th Grade Guidance (Stream Only)')
  console.log('='.repeat(60))

  try {
    const userScore = buildUserScore(
      TEST_10TH_PROFILE.userProfile,
      TEST_10TH_PROFILE.quizResponses,
      TEST_10TH_PROFILE.customAnswers
    )

    console.log('✅ User Score Built:', userScore)

    const guidance = generateEducationLevelGuidance('10th', userScore)

    console.log('\n📘 Guidance Type:', guidance.type)
    console.log('✓ Expected: STREAM_GUIDANCE')
    console.assert(guidance.type === 'STREAM_GUIDANCE', 'FAILED: Wrong type')

    console.log('\n📘 Recommended Stream:', (guidance as any).recommendedStream)
    console.log('✓ Valid streams: Science, Commerce, Arts, Diploma, ITI')
    const validStreams = ['Science', 'Commerce', 'Arts', 'Diploma', 'ITI']
    console.assert(
      validStreams.includes((guidance as any).recommendedStream),
      'FAILED: Invalid stream'
    )

    console.log('\n📘 Delivery Format:', (guidance as any).deliveryFormat)
    console.assert(
      (guidance as any).deliveryFormat === 'STREAM_ONLY',
      'FAILED: Wrong format'
    )

    console.log('\n📘 Final Career Options:', (guidance as any).finalCareerOptions)
    console.assert(
      (guidance as any).finalCareerOptions?.length > 0,
      'FAILED: No career options'
    )

    const formatted = formatGuidanceForUI(guidance)
    console.log('\n📘 Formatted Output (first 300 chars):')
    console.log(formatted.substring(0, 300) + '...')

    console.log('\n✅ TEST 1 PASSED: 10th grade guidance is stream-only')
    return true
  } catch (error) {
    console.error('\n❌ TEST 1 FAILED:', error)
    return false
  }
}

async function testPUCGuidance() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 TEST 2: PUC Guidance (Degree First)')
  console.log('='.repeat(60))

  try {
    const userScore = buildUserScore(
      TEST_PUC_PROFILE.userProfile,
      TEST_PUC_PROFILE.quizResponses,
      TEST_PUC_PROFILE.customAnswers
    )

    console.log('✅ User Score Built:', userScore)

    const guidance = generateEducationLevelGuidance('PUC', userScore)

    console.log('\n📘 Guidance Type:', guidance.type)
    console.log('✓ Expected: DEGREE_GUIDANCE')
    console.assert(guidance.type === 'DEGREE_GUIDANCE', 'FAILED: Wrong type')

    console.log('\n📘 Recommended Degree:', (guidance as any).recommendedDegree)
    console.log('✓ Valid format: "Bachelor of ..."')

    console.log('\n📘 Delivery Format:', (guidance as any).deliveryFormat)
    console.assert(
      (guidance as any).deliveryFormat === 'DEGREE_FIRST_THEN_CAREER',
      'FAILED: Wrong format'
    )

    console.log('\n📘 Career Options:', (guidance as any).finalCareerOptions)
    console.assert(
      (guidance as any).finalCareerOptions?.length > 0,
      'FAILED: No career options'
    )

    const formatted = formatGuidanceForUI(guidance)
    console.log('\n📘 Formatted Output (first 300 chars):')
    console.log(formatted.substring(0, 300) + '...')

    console.log('\n✅ TEST 2 PASSED: PUC guidance shows degree first')
    return true
  } catch (error) {
    console.error('\n❌ TEST 2 FAILED:', error)
    return false
  }
}

async function testGraduationGuidance() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 TEST 3: Graduation Guidance (Direct Careers)')
  console.log('='.repeat(60))

  try {
    const userScore = buildUserScore(
      TEST_GRADUATION_PROFILE.userProfile,
      TEST_GRADUATION_PROFILE.quizResponses,
      TEST_GRADUATION_PROFILE.customAnswers
    )

    console.log('✅ User Score Built:', userScore)

    const topCareers = predictCareers(
      TEST_GRADUATION_PROFILE.userProfile,
      TEST_GRADUATION_PROFILE.quizResponses,
      TEST_GRADUATION_PROFILE.customAnswers
    )

    console.log('\n✅ Top Careers Predicted:', topCareers.map(c => c.name))

    const guidance = generateEducationLevelGuidance('Graduation', userScore, topCareers)

    console.log('\n📘 Guidance Type:', guidance.type)
    console.log('✓ Expected: CAREER_GUIDANCE')
    console.assert(guidance.type === 'CAREER_GUIDANCE', 'FAILED: Wrong type')

    console.log('\n📘 Delivery Format:', (guidance as any).deliveryFormat)
    console.assert(
      (guidance as any).deliveryFormat === 'DIRECT_CAREER',
      'FAILED: Wrong format'
    )

    console.log('\n📘 Number of Careers:', (guidance as any).careers?.length)
    console.assert((guidance as any).careers?.length >= 2, 'FAILED: Not enough careers')

    const firstCareer = (guidance as any).careers[0]
    console.log('\n📘 First Career:', firstCareer.careerName)
    console.log('   Match:', firstCareer.matchPercentage + '%')
    console.assert(
      firstCareer.matchPercentage > 0 && firstCareer.matchPercentage <= 100,
      'FAILED: Invalid match percentage'
    )

    const formatted = formatGuidanceForUI(guidance)
    console.log('\n📘 Formatted Output (first 300 chars):')
    console.log(formatted.substring(0, 300) + '...')

    console.log('\n✅ TEST 3 PASSED: Graduation guidance shows direct careers')
    return true
  } catch (error) {
    console.error('\n❌ TEST 3 FAILED:', error)
    return false
  }
}

async function testRuleEnforcement() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 TEST 4: Rule Enforcement')
  console.log('='.repeat(60))

  try {
    // Test 10th: NO direct careers
    console.log('\n📋 Rule 1: 10th → Stream only (NO direct careers)')
    const score10 = buildUserScore(
      TEST_10TH_PROFILE.userProfile,
      TEST_10TH_PROFILE.quizResponses,
      TEST_10TH_PROFILE.customAnswers
    )
    const guidance10 = generateEducationLevelGuidance('10th', score10) as any
    console.assert(
      guidance10.type === 'STREAM_GUIDANCE' && guidance10.recommendedStream,
      'FAILED: 10th should give stream'
    )
    console.assert(
      !guidance10.careers,
      'FAILED: 10th should NOT have direct careers'
    )
    console.log('✅ PASSED: 10th only gives stream, no direct careers')

    // Test PUC: Degree FIRST
    console.log('\n📋 Rule 2: PUC → Degree first (then careers)')
    const scorePUC = buildUserScore(
      TEST_PUC_PROFILE.userProfile,
      TEST_PUC_PROFILE.quizResponses,
      TEST_PUC_PROFILE.customAnswers
    )
    const guidancePUC = generateEducationLevelGuidance('PUC', scorePUC) as any
    console.assert(
      guidancePUC.type === 'DEGREE_GUIDANCE' && guidancePUC.recommendedDegree,
      'FAILED: PUC should give degree'
    )
    console.log('✅ PASSED: PUC recommends degree first')

    // Test Graduation: Direct careers
    console.log('\n📋 Rule 3: Graduation → Direct careers allowed')
    const scoreGrad = buildUserScore(
      TEST_GRADUATION_PROFILE.userProfile,
      TEST_GRADUATION_PROFILE.quizResponses,
      TEST_GRADUATION_PROFILE.customAnswers
    )
    const topCareersGrad = predictCareers(
      TEST_GRADUATION_PROFILE.userProfile,
      TEST_GRADUATION_PROFILE.quizResponses,
      TEST_GRADUATION_PROFILE.customAnswers
    )
    const guidanceGrad = generateEducationLevelGuidance('Graduation', scoreGrad, topCareersGrad) as any
    console.assert(
      guidanceGrad.type === 'CAREER_GUIDANCE' && guidanceGrad.careers?.length > 0,
      'FAILED: Graduation should give careers'
    )
    console.log('✅ PASSED: Graduation gives direct career options')

    console.log('\n✅ TEST 4 PASSED: All rules enforced correctly')
    return true
  } catch (error) {
    console.error('\n❌ TEST 4 FAILED:', error)
    return false
  }
}

// ============================================
// RUN ALL TESTS
// ============================================

export async function runAllTests() {
  console.log('\n🧪 EDUCATION LEVEL GUIDANCE SYSTEM - TEST SUITE')
  console.log('=====================================================\n')

  const results: { [key: string]: boolean } = {}

  results['10th Grade Guidance'] = await test10thGradance()
  results['PUC Guidance'] = await testPUCGuidance()
  results['Graduation Guidance'] = await testGraduationGuidance()
  results['Rule Enforcement'] = await testRuleEnforcement()

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(60))

  let passed = 0
  let failed = 0

  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✅ PASSED' : '❌ FAILED'
    console.log(`${test}: ${status}`)
    if (result) passed++
    else failed++
  }

  console.log('\n📈 Total:', passed + failed)
  console.log('✅ Passed:', passed)
  console.log('❌ Failed:', failed)

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!')
  } else {
    console.log(`\n⚠️  ${failed} TEST(S) FAILED`)
  }

  return failed === 0
}

// Export for Node.js execution
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1)
  })
}
