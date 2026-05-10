/**
 * CAREER RESULT VALIDATION UTILITY
 * Ensures no empty fields in career recommendations
 * Provides fallback data for missing fields
 */

export interface FieldValidationResult {
  isValid: boolean
  missingFields: string[]
  filledFields: number
  totalFields: number
}

const FALLBACK_VALUES = {
  string: {
    overview: 'Career path with promising opportunities in the industry.',
    personalityFit: 'Matches your professional profile and interests.',
    reason: 'Recommended based on your skills, interests, and educational background.',
    step1: 'Build a strong foundation in core concepts and practices.',
    step2: 'Develop advanced skills through real-world projects and experience.',
    entryLevel: '₹5-10 LPA',
    midLevel: '₹15-30 LPA',
    seniorLevel: '₹50-100+ LPA',
    currentDemand: 'High - Steady demand in the job market',
    growthRate: '5-8% annually',
    futureScope: 'Positive growth outlook in the industry',
    automationRisk: 'Moderate - Evolving roles with new opportunities',
    competitionLevel: 'Moderate - Good opportunities for qualified professionals',
    websiteGuide: 'https://www.shiksha.com/careers',
  },
  array: {
    requiredSkills: ['Problem-solving', 'Communication', 'Technical knowledge'],
    suggestedSubjects: ['Core Theory', 'Applied Concepts', 'Practical Skills'],
    currentSkills: [],
    missingSkills: ['Advanced techniques', 'Industry practices'],
    improvementAreas: ['Technical depth', 'Soft skills', 'Domain expertise'],
    toolsAndTechnologies: ['Industry standard tools', 'Frameworks', 'Platforms'],
    recommendedProjects: [
      'Practical implementation project',
      'Real-world case study',
      'Capstone project',
    ],
    learningResources: [
      'Official documentation',
      'Industry courses',
      'Practical tutorials',
      'Mentorship programs',
    ],
    commonMistakesToAvoid: [
      'Ignoring fundamentals',
      'Skipping practical work',
      'Poor communication',
      'Not seeking feedback',
    ],
    beginner: [
      'Master foundational concepts',
      'Build basic projects',
      'Join learning communities',
      'Practice regularly',
    ],
    intermediate: [
      'Advanced problem-solving',
      'Real-world project implementation',
      'Industry tool proficiency',
      'Continuous learning',
    ],
    next30Days: [
      'Set clear learning objectives',
      'Complete foundational course',
      'Build 1-2 basic projects',
      'Network with professionals',
    ],
    midTerm: [
      'Master advanced concepts',
      'Build 2-3 portfolio projects',
      'Gain internship experience',
      'Prepare for interviews',
    ],
  },
}

/**
 * Validate career result and ensure no empty fields
 */
export function validateCareerResult(result: any): {
  isValid: boolean
  validatedResult: any
  issues: FieldValidationResult
} {
  const missingFields: string[] = []
  const validatedResult = { ...result }

  // String fields that must not be empty
  const requiredStringFields = [
    'overview',
    'personalityFit',
    'reason',
    'websiteGuide',
  ]

  requiredStringFields.forEach((field) => {
    if (!validatedResult[field] || validatedResult[field].trim() === '') {
      validatedResult[field] =
        FALLBACK_VALUES.string[field as keyof typeof FALLBACK_VALUES.string] ||
        FALLBACK_VALUES.string.overview
      missingFields.push(field)
    }
  })

  // Nested object validation - salaryGrowth
  if (!validatedResult.salaryGrowth) {
    validatedResult.salaryGrowth = {}
  }
  const salaryFields = ['entryLevel', 'midLevel', 'seniorLevel']
  salaryFields.forEach((field) => {
    if (
      !validatedResult.salaryGrowth[field] ||
      validatedResult.salaryGrowth[field].trim() === ''
    ) {
      validatedResult.salaryGrowth[field] =
        FALLBACK_VALUES.string[field as keyof typeof FALLBACK_VALUES.string]
      missingFields.push(`salaryGrowth.${field}`)
    }
  })

  // Nested object validation - marketDemand
  if (!validatedResult.marketDemand) {
    validatedResult.marketDemand = {}
  }
  const demandFields = ['currentDemand', 'growthRate', 'futureScope']
  demandFields.forEach((field) => {
    if (
      !validatedResult.marketDemand[field] ||
      validatedResult.marketDemand[field].trim() === ''
    ) {
      validatedResult.marketDemand[field] =
        FALLBACK_VALUES.string[field as keyof typeof FALLBACK_VALUES.string]
      missingFields.push(`marketDemand.${field}`)
    }
  })

  // Nested object validation - riskAnalysis
  if (!validatedResult.riskAnalysis) {
    validatedResult.riskAnalysis = {}
  }
  const riskFields = ['automationRisk', 'competitionLevel']
  riskFields.forEach((field) => {
    if (
      !validatedResult.riskAnalysis[field] ||
      validatedResult.riskAnalysis[field].trim() === ''
    ) {
      validatedResult.riskAnalysis[field] =
        FALLBACK_VALUES.string[field as keyof typeof FALLBACK_VALUES.string]
      missingFields.push(`riskAnalysis.${field}`)
    }
  })

  // Nested object validation - roadmap
  if (!validatedResult.roadmap) {
    validatedResult.roadmap = {}
  }
  const roadmapFields = ['step1', 'step2']
  roadmapFields.forEach((field) => {
    if (
      !validatedResult.roadmap[field] ||
      validatedResult.roadmap[field].trim() === ''
    ) {
      validatedResult.roadmap[field] =
        FALLBACK_VALUES.string[field as keyof typeof FALLBACK_VALUES.string]
      missingFields.push(`roadmap.${field}`)
    }
  })

  // Array fields validation
  const requiredArrayFields = [
    'requiredSkills',
    'suggestedSubjects',
    'toolsAndTechnologies',
    'recommendedProjects',
    'learningResources',
    'commonMistakesToAvoid',
  ]

  requiredArrayFields.forEach((field) => {
    if (!Array.isArray(validatedResult[field]) || validatedResult[field].length === 0) {
      validatedResult[field] =
        FALLBACK_VALUES.array[field as keyof typeof FALLBACK_VALUES.array] || []
      if (validatedResult[field].length === 0) {
        missingFields.push(field)
      }
    }
  })

  // Nested arrays validation - skillGapAnalysis
  if (!validatedResult.skillGapAnalysis) {
    validatedResult.skillGapAnalysis = {
      currentSkills: [],
      missingSkills: [],
      improvementAreas: [],
    }
  }
  const gapFields = ['currentSkills', 'missingSkills', 'improvementAreas']
  gapFields.forEach((field) => {
    if (
      !Array.isArray(validatedResult.skillGapAnalysis[field]) ||
      validatedResult.skillGapAnalysis[field].length === 0
    ) {
      validatedResult.skillGapAnalysis[field] =
        FALLBACK_VALUES.array[field as keyof typeof FALLBACK_VALUES.array] || []
    }
  })

  // Nested arrays validation - roadmap
  const roadmapArrayFields = ['beginner', 'intermediate']
  roadmapArrayFields.forEach((field) => {
    if (
      !Array.isArray(validatedResult.roadmap[field]) ||
      validatedResult.roadmap[field].length === 0
    ) {
      validatedResult.roadmap[field] =
        FALLBACK_VALUES.array[field as keyof typeof FALLBACK_VALUES.array] || []
    }
  })

  // Nested arrays validation - actionPlan
  if (!validatedResult.actionPlan) {
    validatedResult.actionPlan = {}
  }
  const actionFields = ['next30Days', 'midTerm']
  actionFields.forEach((field) => {
    if (
      !Array.isArray(validatedResult.actionPlan[field]) ||
      validatedResult.actionPlan[field].length === 0
    ) {
      validatedResult.actionPlan[field] =
        FALLBACK_VALUES.array[field as keyof typeof FALLBACK_VALUES.array] || []
    }
  })

  // Ensure matchScore is valid
  if (typeof validatedResult.matchScore !== 'number' || validatedResult.matchScore < 0 || validatedResult.matchScore > 100) {
    validatedResult.matchScore = 85
  }

  // Count total fields
  const totalFields = requiredStringFields.length +
    salaryFields.length +
    demandFields.length +
    riskFields.length +
    roadmapFields.length +
    requiredArrayFields.length +
    gapFields.length +
    roadmapArrayFields.length +
    actionFields.length +
    1 // matchScore
  
  const filledFields = totalFields - missingFields.length

  return {
    isValid: missingFields.length === 0,
    validatedResult,
    issues: {
      isValid: missingFields.length === 0,
      missingFields,
      filledFields,
      totalFields,
    },
  }
}

/**
 * Validate array of career results
 */
export function validateCareerResults(results: any[]): any[] {
  return results.map((result) => {
    const { validatedResult } = validateCareerResult(result)
    return validatedResult
  })
}

/**
 * Check if result has empty details
 */
export function hasEmptyDetails(result: any): boolean {
  const checkEmpty = (val: any): boolean => {
    if (typeof val === 'string') return val.trim() === ''
    if (Array.isArray(val)) return val.length === 0
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).some((v) => checkEmpty(v))
    }
    return false
  }

  return checkEmpty(result)
}

/**
 * Get detailed validation report
 */
export function getValidationReport(result: any) {
  const report = {
    careerName: result.careerName || result.courseName || result.streamName || 'Unknown',
    hasEmptyDetails: hasEmptyDetails(result),
    emptyFields: [] as string[],
    summary: '',
  }

  // Check each critical section
  const sections = [
    { name: 'Overview', field: 'overview' },
    { name: 'Personality Fit', field: 'personalityFit' },
    { name: 'Skills', field: 'requiredSkills' },
    { name: 'Salary Info', field: 'salaryGrowth' },
    { name: 'Market Demand', field: 'marketDemand' },
    { name: 'Risk Analysis', field: 'riskAnalysis' },
    { name: 'Roadmap', field: 'roadmap' },
    { name: 'Action Plan', field: 'actionPlan' },
  ]

  sections.forEach((section) => {
    const value = result[section.field]
    if (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
      report.emptyFields.push(section.name)
    }
  })

  report.summary = report.emptyFields.length === 0
    ? `✓ ${report.careerName}: All details complete and filled`
    : `✗ ${report.careerName}: Missing ${report.emptyFields.join(', ')}`

  return report
}
