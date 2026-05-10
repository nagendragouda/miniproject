/**
 * 📈 Career Growth Tracking System
 * Tracks career progress, milestones, skills, and goals over time
 */

export interface CareerMilestone {
  id: string
  title: string
  description: string
  category: 'skill' | 'project' | 'achievement' | 'certification' | 'promotion' | 'goal'
  date: string // ISO date
  status: 'completed' | 'in-progress' | 'planned'
  impact: 'low' | 'medium' | 'high'
  evidence?: string // URL or description
}

export interface SkillProgress {
  name: string
  startLevel: number // 1-10
  currentLevel: number // 1-10
  targetLevel: number // 1-10
  yearsToAchieve: number
  lastUpdated: string
  milestones: string[] // milestone IDs
}

export interface CareerGrowthEntry {
  id: string
  date: string // ISO date
  role: string
  salary?: number
  experience: string
  skills: string[]
  achievements: string[]
  rating: number // 1-10 satisfaction
  notes: string
}

export interface CareerGrowthData {
  userId: string
  startDate: string // When user started tracking
  currentRole: string
  targetRole: string
  targetDate: string // When they want to reach target role
  
  // Timeline data
  entries: CareerGrowthEntry[]
  milestones: CareerMilestone[]
  skillProgress: SkillProgress[]
  
  // Statistics
  totalSkillsLearned: number
  projectsCompleted: number
  certificationsClaimed: number
  promotionsEarned: number
  
  // Goals
  goals: {
    shortTerm: string[] // 3-6 months
    mediumTerm: string[] // 6-12 months
    longTerm: string[] // 1-5 years
  }
  
  // Metadata
  createdAt: string
  lastUpdated: string
  version: number
}

/**
 * Initialize career growth tracking
 */
export function initializeCareerGrowth(userId: string): CareerGrowthData {
  return {
    userId,
    startDate: new Date().toISOString(),
    currentRole: '',
    targetRole: '',
    targetDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 5 years from now
    entries: [],
    milestones: [],
    skillProgress: [],
    totalSkillsLearned: 0,
    projectsCompleted: 0,
    certificationsClaimed: 0,
    promotionsEarned: 0,
    goals: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    },
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    version: 1
  }
}

/**
 * Add a career entry (log current status)
 */
export function addCareerEntry(
  data: CareerGrowthData,
  entry: Omit<CareerGrowthEntry, 'id' | 'date'>
): CareerGrowthData {
  const newEntry: CareerGrowthEntry = {
    ...entry,
    id: `entry_${Date.now()}`,
    date: new Date().toISOString()
  }

  return {
    ...data,
    entries: [...data.entries, newEntry],
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Add a milestone
 */
export function addMilestone(
  data: CareerGrowthData,
  milestone: Omit<CareerMilestone, 'id' | 'date'>
): CareerGrowthData {
  const newMilestone: CareerMilestone = {
    ...milestone,
    id: `milestone_${Date.now()}`,
    date: new Date().toISOString()
  }

  const updatedData = {
    ...data,
    milestones: [...data.milestones, newMilestone],
    lastUpdated: new Date().toISOString()
  }

  // Update statistics
  if (milestone.status === 'completed') {
    switch (milestone.category) {
      case 'skill':
        updatedData.totalSkillsLearned += 1
        break
      case 'project':
        updatedData.projectsCompleted += 1
        break
      case 'certification':
        updatedData.certificationsClaimed += 1
        break
      case 'promotion':
        updatedData.promotionsEarned += 1
        break
    }
  }

  return updatedData
}

/**
 * Update skill progress
 */
export function updateSkillProgress(
  data: CareerGrowthData,
  skillName: string,
  newLevel: number
): CareerGrowthData {
  const existingSkill = data.skillProgress.find((s) => s.name === skillName)

  let updatedSkills: SkillProgress[]

  if (existingSkill) {
    updatedSkills = data.skillProgress.map((s) =>
      s.name === skillName
        ? {
            ...s,
            currentLevel: Math.min(newLevel, 10),
            lastUpdated: new Date().toISOString()
          }
        : s
    )
  } else {
    updatedSkills = [
      ...data.skillProgress,
      {
        name: skillName,
        startLevel: 1,
        currentLevel: Math.min(newLevel, 10),
        targetLevel: 10,
        yearsToAchieve: Math.ceil((10 - Math.min(newLevel, 10)) / 2),
        lastUpdated: new Date().toISOString(),
        milestones: []
      }
    ]
  }

  return {
    ...data,
    skillProgress: updatedSkills,
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Calculate growth metrics
 */
export function calculateGrowthMetrics(data: CareerGrowthData) {
  const entries = data.entries

  if (entries.length === 0) {
    return {
      averageSatisfaction: 0,
      skillGrowth: 0,
      projectsTrend: [],
      salaryTrend: [],
      consistency: 0,
      estimatedTimeToTarget: 0
    }
  }

  // Average satisfaction
  const averageSatisfaction =
    entries.reduce((sum, e) => sum + e.rating, 0) / entries.length

  // Skill growth percentage
  const skillGrowth =
    data.skillProgress.length > 0
      ? Math.round(
          (data.skillProgress.reduce((sum, s) => sum + (s.currentLevel - s.startLevel), 0) /
            (data.skillProgress.length * 10)) *
            100
        )
      : 0

  // Projects trend (last 6 entries)
  const projectsTrend = entries.slice(-6).map((e) => ({
    date: new Date(e.date).toLocaleDateString(),
    projects: e.achievements.length
  }))

  // Salary trend
  const salaryTrend = entries
    .filter((e) => e.salary)
    .slice(-6)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString(),
      salary: e.salary || 0
    }))

  // Consistency (entries per month)
  const startDate = new Date(data.startDate)
  const now = new Date()
  const monthsActive = Math.max(
    1,
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  const consistency = Math.round((entries.length / monthsActive) * 10) // points out of 10

  // Estimate time to target
  const monthsSinceStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  const estimatedTimeToTarget =
    monthsSinceStart > 0 ? Math.round(60 / (monthsSinceStart / data.entries.length)) : 0 // months to reach target

  return {
    averageSatisfaction: Math.round(averageSatisfaction * 10) / 10,
    skillGrowth,
    projectsTrend,
    salaryTrend,
    consistency,
    estimatedTimeToTarget
  }
}

/**
 * Get milestone timeline
 */
export function getMilestoneTimeline(data: CareerGrowthData) {
  return data.milestones
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10) // Last 10 milestones
}

/**
 * Get career progression percentage
 */
export function getCareerProgressionPercentage(data: CareerGrowthData): number {
  if (!data.targetDate) return 0

  const start = new Date(data.startDate).getTime()
  const target = new Date(data.targetDate).getTime()
  const now = new Date().getTime()

  if (now >= target) return 100
  if (now <= start) return 0

  return Math.round(((now - start) / (target - start)) * 100)
}

/**
 * Get skill mastery summary
 */
export function getSkillMasterySummary(data: CareerGrowthData) {
  const skills = data.skillProgress

  return {
    expert: skills.filter((s) => s.currentLevel >= 8).length,
    intermediate: skills.filter((s) => s.currentLevel >= 5 && s.currentLevel < 8).length,
    beginner: skills.filter((s) => s.currentLevel < 5).length,
    total: skills.length,
    averageLevel: skills.length > 0 ? Math.round((skills.reduce((sum, s) => sum + s.currentLevel, 0) / skills.length) * 10) / 10 : 0
  }
}

/**
 * Save career growth data to localStorage
 */
export function saveCareerGrowthData(data: CareerGrowthData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`careerGrowth_${data.userId}`, JSON.stringify(data))
    localStorage.setItem(`careerGrowth_${data.userId}_lastSaved`, new Date().toISOString())
  }
}

/**
 * Load career growth data from localStorage
 */
export function loadCareerGrowthData(userId: string): CareerGrowthData | null {
  if (typeof window === 'undefined') return null

  const data = localStorage.getItem(`careerGrowth_${userId}`)
  return data ? JSON.parse(data) : null
}

/**
 * Get or create career growth data
 */
export function getOrCreateCareerGrowthData(userId: string): CareerGrowthData {
  let data = loadCareerGrowthData(userId)

  if (!data) {
    data = initializeCareerGrowth(userId)
    saveCareerGrowthData(data)
  }

  return data
}
