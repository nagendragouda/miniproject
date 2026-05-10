/**
 * INTEGRATION GUIDE: How to Save Career Results to Database
 * Add this code to your Career Result page after AI generates predictions
 */

import { saveCareerResult, saveMultipleCareerPredictions, CareerPredictionInput } from '@/lib/careerResultsDatabase'

/**
 * Example: Save All Career Predictions After Analysis
 * Call this function after receiving AI predictions
 */
export async function saveCareerAnalysisResults(
  firebaseUid: string,
  personalityType: string,
  careerPredictions: any[], // Array of career items from your API
  quizId?: string
) {
  try {
    // Step 1: Save the main career result
    const careerResult = await saveCareerResult({
      firebaseUid,
      personalityType,
      quizId,
      totalCareersAnalyzed: careerPredictions.length,
      topMatchScore: Math.max(...careerPredictions.map(c => c.matchScore || 0)),
      streamPreference: careerPredictions[0]?.basedOnStream,
      learningStyle: 'Visual Learning', // From user profile if available
      workStyle: 'Independent', // From user profile if available
      summaryNotes: `${personalityType} personality with ${careerPredictions.length} career recommendations`,
    })

    console.log('Career result saved:', careerResult.id)

    // Step 2: Format and save all career predictions
    const predictions: CareerPredictionInput[] = careerPredictions.map((item, index) => ({
      resultId: careerResult.id,
      firebaseUid,
      rank: index + 1,
      careerName: item.careerName || item.pathName || item.streamName || 'Career',
      alternateNames: item.alternateNames || [],
      basedOnStream: item.basedOnStream,
      matchScore: item.matchScore || 0,
      personalityAlignmentScore: item.personalityAlignmentScore || 0,
      overview: item.overview || item.careerOverview || 'Career path with promising opportunities',
      personalityFit: item.personalityFit || item.careerPersonalityFit || 'Matches your professional profile',
      careerSummary: item.careerSummary || item.courseOverview,
      
      // Education
      suggestedSubjects: item.suggestedSubjects || [],
      suggestedCourses: item.suggestedCourses || [],
      requiredSkills: item.requiredSkills || item.skillsToDevelop || [],
      softSkills: item.softSkills || [],
      technicalSkills: item.technicalSkills || [],
      
      // Skills Gap
      currentSkills: item.skillGapAnalysis?.currentSkills || [],
      missingSkills: item.skillGapAnalysis?.missingSkills || [],
      improvementAreas: item.skillGapAnalysis?.improvementAreas || [],
      
      // Tools & Tech
      toolsAndTechnologies: item.toolsAndTechnologies || [],
      programmingLanguages: item.programmingLanguages || [],
      frameworksLibraries: item.frameworksLibraries || [],
      
      // Development
      recommendedProjects: item.recommendedProjects || [],
      learningResources: item.learningResources || [],
      commonMistakesToAvoid: item.commonMistakesToAvoid || [],
      
      // Salary
      salaryEntryLevel: item.salaryGrowth?.entryLevel || '₹5-10 LPA',
      salaryMidLevel: item.salaryGrowth?.midLevel || '₹15-30 LPA',
      seniorLevel: item.salaryGrowth?.seniorLevel || '₹50-100+ LPA',
      
      // Market
      currentDemand: item.marketDemand?.currentDemand || 'High',
      growthRate: item.marketDemand?.growthRate || '5-8% annually',
      futureScope: item.marketDemand?.futureScope,
      
      // Risk
      automationRisk: item.riskAnalysis?.automationRisk || 'Moderate',
      competitionLevel: item.riskAnalysis?.competitionLevel || 'Moderate',
      
      // Roadmap
      step1Description: item.roadmap?.step1,
      step2Description: item.roadmap?.step2,
      beginnerPhase: item.roadmap?.beginner || [],
      intermediatePhase: item.roadmap?.intermediate || [],
      advancedPhase: item.roadmap?.advanced || [],
      
      // Goals & Action Plan
      goalsNext30Days: item.actionPlan?.next30Days || [],
      goals3to6Months: item.actionPlan?.midTerm || [],
      goalsLongTerm: item.actionPlan?.longTerm || [],
      
      // Resources
      websiteGuideUrl: item.websiteGuide,
      relatedVideos: item.relatedVideos || [],
    }))

    // Step 3: Bulk insert all predictions
    const savedPredictions = await saveMultipleCareerPredictions(predictions)
    console.log(`${savedPredictions.length} career predictions saved`)

    return {
      resultId: careerResult.id,
      predictions: savedPredictions,
    }
  } catch (error) {
    console.error('Error saving career analysis:', error)
    throw error
  }
}

/**
 * USAGE IN CAREER RESULT PAGE:
 * 
 * After your API returns career predictions, call:
 */

/*
// In your component or API route:
const handleSaveResults = async () => {
  try {
    const result = await saveCareerAnalysisResults(
      user?.uid || 'guest_user',
      'Analytical', // From your personality detection
      careerPredictions, // Array from AI API
      quizResponseId // Optional
    )
    console.log('All results saved successfully:', result)
    // Show success message to user
  } catch (error) {
    console.error('Failed to save results:', error)
    // Show error message to user
  }
}
*/

/**
 * EXAMPLE: How to use in Career Result Page Component
 */

export function CareerResultPageWithSaving() {
  // Example component showing integration

  /*
  
  async function saveResultsToDatabase(careerData: any, personality: string) {
    try {
      const saveResult = await saveCareerAnalysisResults(
        firebaseUser.uid,
        personality,
        careerData.predictions,
        careerData.quizId
      );

      // Update UI to show saved status
      setIsSaved(true);
      setMessage('Career analysis saved successfully!');
      
      // Store result ID for future retrieval
      localStorage.setItem('lastCareerResultId', saveResult.resultId);
      
    } catch (error) {
      setMessage('Error saving career analysis');
      console.error(error);
    }
  }

  // Call after AI generates results
  useEffect(() => {
    if (careerResults && !isResultsSaved) {
      saveResultsToDatabase(careerResults, personalityType);
    }
  }, [careerResults]);

  */
}

/**
 * DATABASE INTEGRATION CHECKLIST
 * 
 * ✓ 1. Run SQL schema setup:
 *      - Execute /sql/career_results_schema.sql in Supabase
 * 
 * ✓ 2. Set up RLS policies (included in schema)
 * 
 * ✓ 3. Import functions in your component:
 *      import { saveCareerAnalysisResults, getLatestCareerResult } from '@/lib/careerResultsDatabase'
 * 
 * ✓ 4. Call after AI predicts results:
 *      const result = await saveCareerAnalysisResults(uid, personality, predictions)
 * 
 * ✓ 5. Retrieve results later:
 *      const latest = await getLatestCareerResult(uid)
 *      const predictions = await getUserCareerPredictions(uid)
 * 
 * ✓ 6. Allow users to save favorites:
 *      await saveCareerAsFavorite(predictionId, uid, "My notes")
 *      const saved = await getSavedCareers(uid)
 */

/**
 * API ROUTE EXAMPLE: /api/career-results/save
 * 
 * import { saveCareerAnalysisResults } from '@/lib/careerResultsDatabase'
 * import { NextRequest, NextResponse } from 'next/server'
 * 
 * export async function POST(req: NextRequest) {
 *   try {
 *     const { firebaseUid, personality, predictions, quizId } = await req.json()
 *     
 *     const result = await saveCareerAnalysisResults(
 *       firebaseUid,
 *       personality,
 *       predictions,
 *       quizId
 *     )
 *     
 *     return NextResponse.json({
 *       success: true,
 *       resultId: result.resultId,
 *       message: 'Career analysis saved successfully'
 *     })
 *   } catch (error) {
 *     return NextResponse.json({
 *       success: false,
 *       error: error.message
 *     }, { status: 500 })
 *   }
 * }
 */

/**
 * QUERY EXAMPLES FOR RETRIEVING DATA
 * 
 * // Get user's latest career result
 * const latest = await getLatestCareerResult(firebaseUid)
 * 
 * // Get all predictions for a user
 * const predictions = await getUserCareerPredictions(firebaseUid)
 * 
 * // Get full details of a specific career
 * const details = await getCareerPredictionDetails(predictionId, firebaseUid)
 * 
 * // Get user's saved/bookmarked careers
 * const saved = await getSavedCareers(firebaseUid)
 * 
 * // Save a career as favorite
 * await saveCareerAsFavorite(predictionId, firebaseUid, "This is my dream role!")
 * 
 * // Remove from favorites
 * await removeCareerFromFavorites(predictionId, firebaseUid)
 * 
 * // Clean up old results (keep only last 5)
 * await deleteOldCareerResults(firebaseUid, 5)
 */
