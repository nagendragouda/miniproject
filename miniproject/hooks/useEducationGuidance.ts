import { useState, useCallback } from 'react'
import { EducationLevel } from '@/lib/educationLevelGuidance'

export interface EducationGuidanceResult {
  success: boolean
  data?: {
    educationLevel: EducationLevel
    guidanceType: string
    guidance: any
    formattedOutput: string
    userScore: any
    topCareers: any[] | null
    rules: Record<string, string>
    appliedRule: string
  }
  error?: string
}

export function useEducationGuidance() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EducationGuidanceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getGuidance = useCallback(
    async (
      educationLevel: EducationLevel,
      userProfile: any,
      quizResponses: any,
      customAnswers?: Record<number, string>
    ) => {
      setLoading(true)
      setError(null)

      try {
        console.log(`\n🎓 Fetching guidance for ${educationLevel}...`)

        const response = await fetch('/api/career-guidance/education-level', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            educationLevel,
            userProfile,
            quizResponses,
            customAnswers: customAnswers || {}
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get guidance')
        }

        console.log(`✅ Guidance received:`, data.data)
        setResult(data)
        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error(`❌ Error:`, errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const resetResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  const getFormattedGuidance = useCallback(() => {
    if (!result?.data) return null

    return {
      educationLevel: result.data.educationLevel,
      guidanceType: result.data.guidanceType,
      formattedOutput: result.data.formattedOutput,
      rawGuidance: result.data.guidance,
      appliedRule: result.data.appliedRule,
      userScore: result.data.userScore,
      topCareers: result.data.topCareers
    }
  }, [result])

  return {
    getGuidance,
    loading,
    result,
    error,
    resetResult,
    getFormattedGuidance,
    isSuccess: result?.success || false,
    educationLevel: result?.data?.educationLevel,
    guidanceType: result?.data?.guidanceType,
    formattedOutput: result?.data?.formattedOutput
  }
}
