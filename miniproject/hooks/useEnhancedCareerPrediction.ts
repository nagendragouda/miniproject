/**
 * React Hook for Enhanced Career Predictions with Hugging Face
 * useEnhancedCareerPrediction
 */

import { useState, useCallback } from 'react'

interface UseEnhancedPredictionOptions {
  verbose?: boolean
  includeDetailedAnalysis?: boolean
}

interface EnhancedPredictionResult {
  success: boolean
  data?: {
    prediction: any
    hfAnalysis: {
      semanticMatches: Array<{ career: string; similarity: number }>
      traitAnalysis: Record<string, number>
      method: 'hybrid' | 'deterministic'
    }
    detailedAnalysis: any
    timestamp: string
    note: string
  }
  error?: string
  errorType?: string
}

export function useEnhancedCareerPrediction(options: UseEnhancedPredictionOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EnhancedPredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(
    async (userProfile: any, quizResponses: any) => {
      setLoading(true)
      setError(null)

      try {
        if (options.verbose) {
          console.log('🚀 Starting enhanced career prediction...')
          console.log('📋 User profile:', userProfile)
          console.log('📝 Quiz responses:', quizResponses)
        }

        const response = await fetch('/api/career-prediction/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userProfile,
            quizResponses,
            includeAnalysis: options.includeDetailedAnalysis || false
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data: EnhancedPredictionResult = await response.json()

        if (options.verbose) {
          console.log('✅ Prediction complete:', data)
          console.log(`Method used: ${data.data?.hfAnalysis.method}`)
          console.log(`Semantic matches: ${data.data?.hfAnalysis.semanticMatches.length || 0}`)
        }

        setResult(data)
        return data
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to generate prediction'
        setError(errorMsg)
        console.error('❌ Prediction error:', err)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  const resetResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    predict,
    loading,
    result,
    error,
    resetResult,
    bestCareer: result?.data?.prediction?.best_career,
    alternatives: result?.data?.prediction?.alternatives,
    hfAnalysis: result?.data?.hfAnalysis,
    userInsights: result?.data?.prediction?.overall_insights
  }
}

/**
 * Format result for display
 */
export function formatEnhancedPredictionResult(result: EnhancedPredictionResult) {
  if (!result.success || !result.data) {
    return null
  }

  const { prediction, hfAnalysis, timestamp, note } = result.data

  return {
    bestMatch: {
      name: prediction.best_career.name,
      category: prediction.best_career.category,
      matchPercentage: prediction.best_career.match_percentage,
      confidence: prediction.best_career.confidence_level,
      reasons: prediction.best_career.reasons,
      skillGaps: prediction.best_career.skill_gap,
      courses: prediction.best_career.courses,
      salaryRange: prediction.best_career.salaryRange,
      growthRate: prediction.best_career.growthRate
    },
    alternatives: prediction.alternatives.map((alt: any) => ({
      name: alt.name,
      matchPercentage: alt.match_percentage,
      confidence: alt.confidence_level
    })),
    semanticMatches: hfAnalysis.semanticMatches,
    traitAnalysis: hfAnalysis.traitAnalysis,
    method: hfAnalysis.method,
    insights: prediction.overall_insights,
    timestamp,
    note
  }
}
