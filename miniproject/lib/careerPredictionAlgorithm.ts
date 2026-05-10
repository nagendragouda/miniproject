/**
 * Career Prediction Algorithm
 * Builds user scores and predicts career matches based on profile, quiz responses and custom answers.
 */

export interface UserScore {
  technical: number
  creative: number
  leadership: number
  analytical: number
  social: number
  entrepreneurial: number
}

export interface CareerPrediction {
  name: string
  match: number
  description: string
  skills: string[]
  salaryRange: string
  growthOutlook: string
}

/**
 * Build a user score from profile data, quiz responses, and custom answers.
 */
export function buildUserScore(
  userProfile: Record<string, any> = {},
  quizResponses: Record<string, any> = {},
  customAnswers: Record<string, any> = {}
): UserScore {
  const score: UserScore = {
    technical: 5,
    creative: 5,
    leadership: 5,
    analytical: 5,
    social: 5,
    entrepreneurial: 5
  }

  // Adjust from profile interests/skills
  const interests = (userProfile.interests || '').toLowerCase()
  const skills = (userProfile.skills || '').toLowerCase()

  if (interests.includes('tech') || interests.includes('coding') || skills.includes('programming')) {
    score.technical += 3
  }
  if (interests.includes('design') || interests.includes('creative') || skills.includes('art')) {
    score.creative += 3
  }
  if (skills.includes('leadership') || skills.includes('management')) {
    score.leadership += 3
  }
  if (interests.includes('data') || interests.includes('analysis') || skills.includes('analytical')) {
    score.analytical += 3
  }
  if (interests.includes('teaching') || interests.includes('helping') || skills.includes('communication')) {
    score.social += 3
  }
  if (interests.includes('business') || interests.includes('startup') || interests.includes('entrepreneur')) {
    score.entrepreneurial += 3
  }

  // Normalize scores to max 10
  const keys = Object.keys(score) as (keyof UserScore)[]
  for (const key of keys) {
    score[key] = Math.min(10, score[key])
  }

  return score
}

/**
 * Predict top career matches for a user.
 */
export function predictCareers(
  userProfile: Record<string, any> = {},
  quizResponses: Record<string, any> = {},
  customAnswers: Record<string, any> = {}
): CareerPrediction[] {
  const score = buildUserScore(userProfile, quizResponses, customAnswers)

  const careers: CareerPrediction[] = [
    {
      name: 'Software Engineer',
      match: Math.round((score.technical * 8 + score.analytical * 5 + score.creative * 2) / 15 * 10),
      description: 'Design, develop, and maintain software systems and applications.',
      skills: ['Programming', 'Problem Solving', 'System Design', 'Algorithms'],
      salaryRange: '₹8-40 LPA',
      growthOutlook: 'Excellent — high demand across all industries'
    },
    {
      name: 'Data Scientist',
      match: Math.round((score.analytical * 9 + score.technical * 6 + score.creative * 2) / 17 * 10),
      description: 'Extract insights from complex data using statistics and machine learning.',
      skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization'],
      salaryRange: '₹10-45 LPA',
      growthOutlook: 'Excellent — one of the fastest-growing fields'
    },
    {
      name: 'Product Manager',
      match: Math.round((score.leadership * 8 + score.analytical * 5 + score.social * 4 + score.entrepreneurial * 3) / 20 * 10),
      description: 'Lead product development from conception to launch.',
      skills: ['Strategic Thinking', 'Communication', 'Market Analysis', 'Leadership'],
      salaryRange: '₹15-60 LPA',
      growthOutlook: 'Very Good — growing demand in tech companies'
    },
    {
      name: 'UX/UI Designer',
      match: Math.round((score.creative * 9 + score.social * 5 + score.analytical * 3) / 17 * 10),
      description: 'Create intuitive and beautiful digital experiences for users.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Visual Design'],
      salaryRange: '₹6-30 LPA',
      growthOutlook: 'Good — essential role in all digital products'
    },
    {
      name: 'Business Analyst',
      match: Math.round((score.analytical * 8 + score.social * 5 + score.leadership * 4) / 17 * 10),
      description: 'Bridge the gap between business needs and technical solutions.',
      skills: ['Requirements Analysis', 'Data Analysis', 'Communication', 'SQL'],
      salaryRange: '₹7-25 LPA',
      growthOutlook: 'Good — needed in every major industry'
    }
  ]

  // Sort by match score descending and return top 3
  return careers.sort((a, b) => b.match - a.match).slice(0, 3)
}

/**
 * Predict a single top career path (used by other modules).
 */
export function predictCareerPath(
  userProfile: Record<string, any> = {},
  quizResponses: Record<string, any> = {},
  customAnswers: Record<string, any> = {}
): CareerPrediction {
  const careers = predictCareers(userProfile, quizResponses, customAnswers)
  return careers[0]
}
