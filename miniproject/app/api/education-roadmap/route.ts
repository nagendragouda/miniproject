import { NextRequest, NextResponse } from 'next/server'
import {
  EDUCATION_TRANSITIONS,
  EDUCATION_LEVELS,
  getEducationTransition,
  getNextEducationSteps,
  generateEducationRoadmap,
} from '@/lib/educationRoadmapData'

interface EducationRoadmapRequest {
  current_education: string
  next_education: string
  profile_data?: {
    full_name?: string
    interests?: string[]
    skills?: string[]
    gap?: {
      missingSkills?: string[]
      improvementAreas?: string[]
    }
    academic_score?: number
    education_level?: string
  }
  pdf_context?: string
}

interface EducationRoadmapResponse {
  success: boolean
  title: string
  description: string
  current_education: string
  next_education: string
  duration: string
  steps: Array<{
    phase: number
    title: string
    duration: string
    description: string
    keyActivities: string[]
    resources: Array<{
      title: string
      type: string
      url?: string
    }>
    milestones: string[]
  }>
  projects: Array<{
    title: string
    description: string
    duration: string
    difficulty: string
    skillsBuilt: string[]
  }>
  resources: Array<{
    title: string
    type: string
    url?: string
  }>
  timeline: {
    month1_2: string
    month3_6: string
    month7_12: string
    after12: string
  }
  commonMistakes: string[]
  successCriteria: string[]
  estimatedCost?: string
}

function generateStructuredRoadmap(
  currentEducation: string,
  nextEducation: string,
  profileData?: any
): EducationRoadmapResponse {
  // Get the transition data
  const transition = getEducationTransition(currentEducation, nextEducation)

  if (!transition) {
    return {
      success: false,
      title: `Education Transition: ${currentEducation} to ${nextEducation}`,
      description: 'Generic roadmap - specific transition data not available',
      current_education: currentEducation,
      next_education: nextEducation,
      duration: 'Variable',
      steps: [],
      projects: [],
      resources: [],
      timeline: {
        month1_2: 'Begin preparation',
        month3_6: 'Progress through curriculum',
        month7_12: 'Advanced learning',
        after12: 'Mastery and specialization',
      },
      commonMistakes: [],
      successCriteria: [],
    } as any
  }

  // Build structured steps with aligned profile data
  const steps = transition.tasks.map((task, index) => ({
    phase: index + 1,
    title: task.title,
    duration: task.duration,
    description: task.description,
    keyActivities: [
      'Complete assigned work',
      'Regular self-assessment',
      'Seek feedback from mentors',
      'Document progress'
    ],
    resources: transition.resources.filter(r =>
      r.title.toLowerCase().includes(task.title.toLowerCase().substring(0, 5)) ||
      r.type.toLowerCase().includes('course') ||
      r.type.toLowerCase().includes('material')
    ).slice(0, 3),
    milestones: [
      `✓ ${task.title} completed`,
      `✓ Skill validation achieved`,
      `✓ Foundation for next phase`
    ]
  }))

  // Align projects with profile interests if available
  const projects = transition.projects.map(proj => ({
    title: proj.title,
    description: proj.description,
    duration: proj.duration,
    difficulty: proj.difficulty,
    skillsBuilt: transition.keySkills.filter((_, i) => i < 3) || ['Problem Solving', 'Technical Skills']
  }))

  // Expand resources based on profile
  const expandedResources = [...transition.resources]
  if (profileData?.interests?.includes('Online')) {
    expandedResources.push({
      title: 'Udemy / Coursera',
      type: 'Online Learning Platform',
      url: 'https://www.coursera.org'
    })
  }

  // Generate AI Suggestions based on transition
  const generateAISuggestions = (transition: any, profile: any): string[] => {
    const suggestions = [
      `Start preparing for ${nextEducation} 6 months in advance to build strong fundamentals`,
      `Build a network with mentors who have successfully completed this transition from ${currentEducation} to ${nextEducation}`,
      `Create a study plan that balances theory with practical project work`,
      `Join study groups or online communities focused on ${nextEducation}`,
      `Track your progress monthly and adjust your strategy based on performance`,
      `Focus on the ${transition.keySkills[0]} skill first as it forms the foundation`,
      `Take mock exams and competitive tests to assess your readiness`,
      `Document your learning journey - this helps in interviews and applications`,
      `Stay consistent with your routine - dedication matters more than intensity`,
      `Connect with alumni who have taken this path for real-world insights`
    ]
    return suggestions
  }

  // Generate missing skills based on profile
  const generateMissingSkills = (profile: any, transition: any): string[] => {
    const allSkills = transition.keySkills
    const currentSkills = profile?.skills || []
    return allSkills.filter(skill => 
      !currentSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase().substring(0, 5)))
    )
  }

  // Generate tools list
  const generateTools = (transition: any): string[] => {
    const tools = [
      'Google Drive / OneDrive - for documentation',
      'Trello - for task management',
      'GitHub - for project repository',
      'Notion - for personal wiki and notes',
      'Udemy/Coursera - for online learning',
      'Discord/Slack - for community collaboration',
    ]
    
    if (nextEducation.includes('Tech') || nextEducation.includes('B.Tech')) {
      tools.push('VS Code - code editor')
      tools.push('Stack Overflow - for problem solving')
    }
    
    return tools
  }

  // Generate notes
  const generateNotes = (transition: any, profile: any): string[] => {
    return [
      `This roadmap is personalized based on your current education: ${currentEducation}`,
      `Estimated time to complete: ${transition.duration}`,
      `Flexibility is key - adjust pace based on your progress and capacity`,
      `Regular self-assessment will help you stay on track`,
      `Don't hesitate to seek help from mentors and peers`,
      `Celebrate small wins to maintain motivation`,
      `Keep learning even after reaching your goal of ${nextEducation}`
    ]
  }

  const missingSkills = generateMissingSkills(profileData, transition)
  const aiSuggestions = generateAISuggestions(transition, profileData)
  const tools = generateTools(transition)
  const notes = generateNotes(transition, profileData)

  return {
    success: true,
    title: `Your Structured Path from ${currentEducation} to ${nextEducation}`,
    description: `A data-driven, comprehensive roadmap taking you from ${currentEducation} to ${nextEducation}. 
This roadmap is tailored to your profile and includes specific milestones, resources, and success criteria.`,
    current_education: currentEducation,
    next_education: nextEducation,
    duration: transition.duration,
    steps: steps,
    projects: projects,
    resources: expandedResources,
    timeline: {
      month1_2: transition.timeline.month1_2,
      month3_6: transition.timeline.month3_6,
      month7_12: transition.timeline.month7_12,
      after12: 'Mastery phase - specialize and establish expertise in chosen field'
    },
    commonMistakes: transition.commonMistakes,
    successCriteria: [
      'Completed all required coursework',
      'Achieved required proficiency scores',
      'Developed hands-on project portfolio',
      'Built professional network',
      'Ready for next education level or career',
    ],
    estimatedCost: currentEducation.includes('12th') ? '₹3,00,000 - ₹20,00,000' :
                   currentEducation.includes('B.Tech') ? '₹2,00,000 - ₹50,00,000' : 'Variable',
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EducationRoadmapRequest = await request.json()

    if (!body.current_education || !body.next_education) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: current_education, next_education' 
        },
        { status: 400 }
      )
    }

    // Validate education levels exist
    const currentExists = Object.keys(EDUCATION_LEVELS).some(
      e => e.toLowerCase().includes(body.current_education.toLowerCase().substring(0, 5))
    )
    const nextExists = Object.keys(EDUCATION_LEVELS).some(
      e => e.toLowerCase().includes(body.next_education.toLowerCase().substring(0, 5))
    )

    if (!currentExists || !nextExists) {
      console.warn(`Education level not found: ${body.current_education} or ${body.next_education}`)
    }

    // Generate the structured roadmap
    const roadmap = generateStructuredRoadmap(
      body.current_education,
      body.next_education,
      body.profile_data
    )

    return NextResponse.json({
      success: true,
      roadmap: roadmap,
      generatedAt: new Date().toISOString(),
      source: 'structured-education',
    })
  } catch (error: any) {
    console.error('Education roadmap generation error:', error)

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate education roadmap. ' + (error.message || 'Please try again.')
      },
      { status: 500 }
    )
  }
}
