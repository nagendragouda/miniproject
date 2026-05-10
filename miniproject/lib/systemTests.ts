/**
 * SYSTEM TEST - Verify complete flow works without errors
 * Tests: Algorithm, Validation, Videos, Websites
 */

import { predictCareerPath } from '@/lib/careerPredictionAlgorithm'
import { validateCareerResults } from '@/lib/careerResultValidation'
import { getCareerVideos, getCareerWebsite, getAllCareersWithVideos } from '@/lib/careerVideosAndWebsites'

// ════════════════════════════════════════════════════════════════════════════
// TEST CASE 1: 10th Grade Science PCM Student
// ════════════════════════════════════════════════════════════════════════════
export async function testCase1() {
  console.log('\n🧪 TEST CASE 1: 10th Grade - Science PCM')
  console.log('═'.repeat(60))

  const profile = {
    firebase_uid: 'test_user_123',
    education_level: '10th grade',
    course_stream: 'Science PCM',
    skills: [
      { name: 'Mathematics', level: 9 },
      { name: 'Physics', level: 8 },
      { name: 'Problem-solving', level: 7 },
    ],
    interests: ['Technology', 'Innovation', 'Engineering'],
  }

  const quiz = {
    q1: 'A', q2: 'A', q3: 'A', q4: 'B',
    q5: 'A', q6: 'A', q7: 'A', q8: 'B',
    q9: 'A', q10: 'A',
  }

  try {
    // Step 1: Run prediction algorithm
    console.log('\n✓ Step 1: Running prediction algorithm...')
    const result = predictCareerPath(profile, quiz)
    console.log('✓ Prediction completed')
    console.log(`  - Stage: ${result.stage}`)
    console.log(`  - Personality: ${result.personalityType}`)
    
    // Step 2: Get recommendations
    const recommendations = result.analysis.recommendedStreams || []
    console.log(`\n✓ Step 2: Got ${recommendations.length} recommendations`)
    
    // Step 3: Validate results
    console.log('\n✓ Step 3: Validating results...')
    const validated = validateCareerResults(recommendations)
    console.log(`✓ All ${validated.length} results validated`)
    
    // Step 4: Check for videos and websites
    console.log('\n✓ Step 4: Checking videos and websites...')
    validated.forEach((rec: any, idx: number) => {
      const name = rec.streamName || 'Stream'
      const videos = getCareerVideos(name)
      const website = getCareerWebsite(name)
      
      console.log(`\n  [${idx + 1}] ${name}`)
      console.log(`      Score: ${rec.matchScore}%`)
      console.log(`      Videos: ${videos.length}`)
      console.log(`      Website: ${website}`)
      
      // Validate no empty fields
      if (!rec.overview || rec.overview.length === 0) console.warn(`    ⚠️ Empty overview!`)
      if (!rec.requiredSkills || rec.requiredSkills.length === 0) console.warn(`    ⚠️ Empty skills!`)
      if (!videos || videos.length === 0) console.warn(`    ⚠️ No videos found!`)
      if (!website) console.warn(`    ⚠️ No website!`)
    })
    
    console.log('\n✅ TEST CASE 1 PASSED\n')
    return true
  } catch (error: any) {
    console.error('\n❌ TEST CASE 1 FAILED')
    console.error(`Error: ${error.message}`)
    console.error(error.stack)
    return false
  }
}

// ════════════════════════════════════════════════════════════════════════════
// TEST CASE 2: PUC Student - Engineering Track
// ════════════════════════════════════════════════════════════════════════════
export async function testCase2() {
  console.log('\n🧪 TEST CASE 2: PUC - Engineering Track')
  console.log('═'.repeat(60))

  const profile = {
    firebase_uid: 'test_user_456',
    education_level: '12th PUC',
    course_stream: 'Science PCM',
    skills: [
      { name: 'Programming', level: 7 },
      { name: 'Problem-solving', level: 8 },
      { name: 'System thinking', level: 6 },
    ],
    interests: ['Software', 'AI/ML', 'Web Development'],
  }

  const quiz = {
    q1: 'A', q2: 'A', q3: 'B', q4: 'A',
    q5: 'A', q6: 'A', q7: 'A', q8: 'A',
    q9: 'A', q10: 'B',
  }

  try {
    console.log('\n✓ Step 1: Running prediction algorithm...')
    const result = predictCareerPath(profile, quiz)
    console.log('✓ Prediction completed')
    console.log(`  - Stage: ${result.stage}`)
    console.log(`  - Personality: ${result.personalityType}`)
    
    const recommendations = result.analysis.recommendedCourses || []
    console.log(`\n✓ Step 2: Got ${recommendations.length} recommendations`)
    
    console.log('\n✓ Step 3: Validating results...')
    const validated = validateCareerResults(recommendations)
    console.log(`✓ All ${validated.length} results validated`)
    
    console.log('\n✓ Step 4: Checking videos and websites...')
    validated.forEach((rec: any, idx: number) => {
      const name = rec.courseName || 'Course'
      const videos = getCareerVideos(name)
      const website = getCareerWebsite(name)
      
      console.log(`\n  [${idx + 1}] ${name}`)
      console.log(`      Score: ${rec.matchScore}%`)
      console.log(`      Videos: ${videos.length}`)
      console.log(`      Website: ${website}`)
    })
    
    console.log('\n✅ TEST CASE 2 PASSED\n')
    return true
  } catch (error: any) {
    console.error('\n❌ TEST CASE 2 FAILED')
    console.error(`Error: ${error.message}`)
    return false
  }
}

// ════════════════════════════════════════════════════════════════════════════
// TEST CASE 3: Graduate - Career Selection
// ════════════════════════════════════════════════════════════════════════════
export async function testCase3() {
  console.log('\n🧪 TEST CASE 3: Graduate - Career Path')
  console.log('═'.repeat(60))

  const profile = {
    firebase_uid: 'test_user_789',
    education_level: 'B.Tech Computer Science',
    course_stream: 'Engineering',
    skills: [
      { name: 'Python', level: 9 },
      { name: 'System Design', level: 7 },
      { name: 'Leadership', level: 6 },
      { name: 'Communication', level: 7 },
    ],
    interests: ['Technology', 'Innovation', 'Startup', 'Product Development'],
  }

  const quiz = {
    q1: 'D', q2: 'D', q3: 'B', q4: 'A',
    q5: 'D', q6: 'A', q7: 'D', q8: 'B',
    q9: 'D', q10: 'A',
  }

  try {
    console.log('\n✓ Step 1: Running prediction algorithm...')
    const result = predictCareerPath(profile, quiz)
    console.log('✓ Prediction completed')
    console.log(`  - Stage: ${result.stage}`)
    console.log(`  - Personality: ${result.personalityType}`)
    
    const recommendations = result.analysis.careers || []
    console.log(`\n✓ Step 2: Got ${recommendations.length} recommendations`)
    
    console.log('\n✓ Step 3: Validating results...')
    const validated = validateCareerResults(recommendations)
    console.log(`✓ All ${validated.length} results validated`)
    
    console.log('\n✓ Step 4: Checking videos and websites...')
    validated.forEach((rec: any, idx: number) => {
      const name = rec.careerName || 'Career'
      const videos = getCareerVideos(name)
      const website = getCareerWebsite(name)
      
      console.log(`\n  [${idx + 1}] ${name}`)
      console.log(`      Score: ${rec.matchScore}%`)
      console.log(`      Videos: ${videos.length}`)
      console.log(`      Website: ${website}`)
    })
    
    console.log('\n✅ TEST CASE 3 PASSED\n')
    return true
  } catch (error: any) {
    console.error('\n❌ TEST CASE 3 FAILED')
    console.error(`Error: ${error.message}`)
    return false
  }
}

// ════════════════════════════════════════════════════════════════════════════
// TEST CASE 4: Database Coverage Check
// ════════════════════════════════════════════════════════════════════════════
export async function testCase4() {
  console.log('\n🧪 TEST CASE 4: Database Coverage')
  console.log('═'.repeat(60))

  try {
    console.log('\n✓ Getting all careers with videos...')
    const allCareers = getAllCareersWithVideos()
    console.log(`✓ Found ${allCareers.length} careers in database`)
    
    console.log('\nCareers covered:')
    allCareers.forEach(career => {
      const videos = getCareerVideos(career)
      const website = getCareerWebsite(career)
      const hasVideos = videos.length > 0
      const hasWebsite = website && website !== 'https://www.shiksha.com/careers'
      
      const videoStatus = hasVideos ? `✓ ${videos.length}` : '✗ 0'
      const websiteStatus = hasWebsite ? '✓' : '✗'
      
      console.log(`  ${websiteStatus} ${videoStatus} - ${career}`)
    })
    
    // Verify critical careers exist
    const criticalCareers = [
      'Science (PCM)',
      'B.Tech - Computer Science & Engineering (CSE)',
      'Software Engineer',
      'Data Scientist',
    ]
    
    console.log('\n✓ Checking critical careers...')
    let allFound = true
    criticalCareers.forEach(career => {
      const exists = allCareers.includes(career)
      const status = exists ? '✓' : '✗'
      console.log(`  ${status} ${career}`)
      if (!exists) allFound = false
    })
    
    if (allFound) {
      console.log('\n✅ TEST CASE 4 PASSED\n')
      return true
    } else {
      console.log('\n❌ TEST CASE 4 FAILED - Missing critical careers\n')
      return false
    }
  } catch (error: any) {
    console.error('\n❌ TEST CASE 4 FAILED')
    console.error(`Error: ${error.message}`)
    return false
  }
}

// ════════════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ════════════════════════════════════════════════════════════════════════════
export async function runAllTests() {
  console.clear()
  console.log('\n')
  console.log('█'.repeat(70))
  console.log('█' + ' '.repeat(15) + 'CAREER PREDICTION SYSTEM - FULL TEST SUITE' + ' '.repeat(10) + '█')
  console.log('█'.repeat(70))

  const results: { name: string; passed: boolean }[] = []

  // Run tests
  results.push({ name: 'Test 1: 10th Grade Science PCM', passed: await testCase1() })
  results.push({ name: 'Test 2: PUC Engineering Track', passed: await testCase2() })
  results.push({ name: 'Test 3: Graduate Career Path', passed: await testCase3() })
  results.push({ name: 'Test 4: Database Coverage', passed: await testCase4() })

  // Summary
  console.log('\n')
  console.log('█'.repeat(70))
  console.log('█' + ' '.repeat(25) + 'TEST SUMMARY' + ' '.repeat(32) + '█')
  console.log('█'.repeat(70))

  const passed = results.filter(r => r.passed).length
  const total = results.length

  results.forEach(r => {
    const status = r.passed ? '✅ PASSED' : '❌ FAILED'
    console.log(`${status}  ${r.name}`)
  })

  console.log('\n' + '█'.repeat(70))
  console.log(`█  Total: ${passed}/${total} tests passed` + ' '.repeat(70 - 21 - passed.toString().length) + '█')
  console.log('█'.repeat(70) + '\n')

  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED! System is ready for production!\n')
    return true
  } else {
    console.log(`⚠️  ${total - passed} test(s) failed. Please review and fix.\n`)
    return false
  }
}

// Export for testing
if (typeof window === 'undefined') {
  // This will run in Node.js environment
  runAllTests().catch(console.error)
}
