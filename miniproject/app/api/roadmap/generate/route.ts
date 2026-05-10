import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RoadmapRequest {
  educationLevel: '10th' | 'PUC' | 'Graduation'
  targetCareer: string
  skills: string[]
  interests: string[]
  strengths: string[]
  weaknesses: string[]
  userProfile?: any
}

// Generate step-by-step roadmap based on education level
function generateRoadmapFor10th(request: RoadmapRequest): any {
  const { targetCareer, skills, interests, strengths } = request
  
  return {
    career: targetCareer,
    educationLevel: '10th',
    overview: `Complete career roadmap from 10th standard to ${targetCareer}`,
    
    roadmapSteps: [
      {
        step: 1,
        title: 'Choose Your Stream',
        duration: 'Decision Point',
        details: `Based on your interest in ${interests.join(', ')}, choose an appropriate stream`,
        stream: determineStream(interests),
        actions: [
          'Evaluate Science, Commerce, or Arts based on career goal',
          'Consider JEE/NEET if aiming for engineering/medical',
          'Meet with school counselor to finalize stream',
          'Enroll in chosen stream for 11th standard'
        ],
        focus: determineSubjectFocus(interests, strengths)
      },
      {
        step: 2,
        title: 'Master Core Subjects (11th & 12th)',
        duration: '2 Years',
        details: 'Build strong foundation in core subjects',
        details_expanded: `Focus on subjects required for ${targetCareer}`,
        actions: [
          'Study core subjects thoroughly',
          'Achieve 75%+ marks in competitive exams',
          `Master subjects relevant to ${targetCareer}`,
          'Join coaching if needed',
          'Participate in school projects'
        ],
        focus: ['Physics', 'Mathematics', 'Chemistry', 'Computer Science']
      },
      {
        step: 3,
        title: 'Prepare for Board Exams & Entrance Tests',
        duration: '6-8 Months',
        details: 'Prepare for 12th board and career entrance exams',
        actions: [
          'Take mock tests regularly',
          'Solve previous year papers',
          'Join test series programs',
          'Focus on weak areas',
          'Maintain consistency and discipline'
        ],
        focus: ['Strategic preparation', 'Time management', 'Practice']
      },
      {
        step: 4,
        title: 'Learn Basic Skills Online',
        duration: '3-6 Months (Parallel)',
        details: `Start learning foundational skills for ${targetCareer}`,
        actions: [
          recommendBeginnerCourse(interests),
          'Complete beginner-level tutorials',
          'Build first small project',
          'Join online communities',
          'Create portfolio on GitHub'
        ],
        focus: getBeginnerSkills(targetCareer)
      },
      {
        step: 5,
        title: 'Choose Relevant Degree',
        duration: 'After 12th',
        details: `Select a degree that aligns with ${targetCareer}`,
        degreeOptions: getRecommendedDegrees(targetCareer),
        actions: [
          `Research best colleges offering ${getRecommendedDegrees(targetCareer)[0]}`,
          'Prepare for entrance exams if required',
          'Apply to colleges',
          'Choose college based on placement records'
        ]
      },
      {
        step: 6,
        title: 'Excel in Your Degree (Years 1-3)',
        duration: '3 Years',
        details: `Complete your degree while building practical skills`,
        actions: [
          'Maintain 7%+ GPA',
          'Learn languages and tools relevant to career',
          'Build projects in your curriculum',
          'Participate in hackathons',
          'Start internships from 2nd year'
        ],
        focus: getIntermediateSkills(targetCareer)
      },
      {
        step: 7,
        title: 'Gain Practical Experience',
        duration: '1-2 Years (During Degree)',
        details: 'Build real-world experience through internships',
        actions: [
          'Do 2-3 internships during college',
          'Contribute to open-source projects',
          'Build 4-5 solid portfolio projects',
          'Write technical blog posts',
          'Network with industry professionals'
        ],
        focus: ['Internships', 'Open-source', 'Projects']
      },
      {
        step: 8,
        title: 'Apply for Entry-Level Jobs',
        duration: 'Final year/After Graduation',
        details: `Start applying for entry-level positions in ${targetCareer}`,
        actions: [
          'Polish resume and LinkedIn profile',
          'Apply to companies in your target field',
          'Prepare for technical interviews',
          'Practice coding/design problems',
          `Target roles like "Junior ${targetCareer.split('/')[0]}"`,
          'Negotiate offer based on skills'
        ],
        focus: ['Interview Preparation', 'Resume', 'Networking']
      }
    ],

    skillsToFocus: {
      technical: getCompleteSkills(targetCareer).technical,
      soft: ['Communication', 'Problem-solving', 'Teamwork', 'Time management', 'Adaptability'],
      domain: getCompleteSkills(targetCareer).domain
    },

    courses: {
      beginner: getBeginnerCourses(targetCareer),
      intermediate: getIntermediateCourses(targetCareer),
      advanced: getAdvancedCourses(targetCareer)
    },

    timeline: {
      phases: [
        { phase: '10th-12th', duration: '2-3 years', focus: 'Foundation & Stream Selection' },
        { phase: 'Degree', duration: '4 years', focus: 'Academic & Skill Development' },
        { phase: 'Job Search', duration: '3-6 months', focus: 'Practical Application' }
      ]
    },

    finalGoal: `Successfully establish a career as a ${targetCareer}. You will have completed your degree, built a strong portfolio, and secured an entry-level position with growth opportunities. Expected salary range for entry-level: ₹3-6 LPA, with growth to ₹10+ LPA within 3-5 years.`,

    appliedRule: '✅ 10th Standard: Comprehensive roadmap from stream selection through degree and career entry. No direct job jumps - full educational progression required.'
  }
}

// Generate roadmap for PUC
function generateRoadmapForPUC(request: RoadmapRequest): any {
  const { targetCareer, skills, interests, strengths } = request

  return {
    career: targetCareer,
    educationLevel: 'PUC',
    overview: `Career roadmap from PUC to becoming a ${targetCareer}`,
    
    roadmapSteps: [
      {
        step: 1,
        title: 'Choose Relevant Degree',
        duration: 'Immediate (After 12th)',
        details: `Select degree that directly leads to ${targetCareer}`,
        recommendedDegrees: getRecommendedDegrees(targetCareer),
        actions: [
          `Research top colleges for ${getRecommendedDegrees(targetCareer)[0]}`,
          'Check placement records and average salary',
          'Prepare for entrance exams if needed',
          'Apply to colleges based on rank'
        ]
      },
      {
        step: 2,
        title: 'Learn Core Skills (Year 1)',
        duration: '6-9 Months',
        details: `Master foundational skills needed for ${targetCareer}`,
        actions: [
          recommendBeginnerCourse(interests),
          'Complete 2-3 beginner-level certifications',
          'Build first project based on coursework',
          'Join dev/tech communities',
          'Start contributing to open-source'
        ],
        focus: getBeginnerSkills(targetCareer)
      },
      {
        step: 3,
        title: 'Build Portfolio (Year 1-2)',
        duration: '1-1.5 Years',
        details: 'Create strong portfolio with 3-4 quality projects',
        actions: [
          'Build projects solving real-world problems',
          'Deploy projects on GitHub/Live platforms',
          'Document projects with README files',
          'Get code reviews from senior developers',
          'Showcase projects on LinkedIn'
        ],
        focus: ['Real-world projects', 'Clean code', 'Documentation']
      },
      {
        step: 4,
        title: 'Get Internship Experience (Year 2)',
        duration: '3-6 Months',
        details: 'Gain professional experience through internships',
        actions: [
          'Apply to 15-20 companies for internships',
          'Do 1-2 summers+semesters internships',
          'Take on challenging tasks',
          'Build relationships with mentors',
          'Document learnings and achievements'
        ],
        focus: getIntermediateSkills(targetCareer)
      },
      {
        step: 5,
        title: 'Learn Advanced Tools (Year 2-3)',
        duration: '6-12 Months',
        details: `Master advanced technologies required for senior roles in ${targetCareer}`,
        actions: [
          'Master industry tools and frameworks',
          'Learn system design principles',
          'Complete advanced certifications',
          'Study company tech stacks',
          'Build advanced projects'
        ],
        focus: getAdvancedSkills(targetCareer)
      },
      {
        step: 6,
        title: 'Prepare for Job Market (Final Year)',
        duration: '6-9 Months',
        details: 'Polish skills and prepare for interviews',
        actions: [
          'Practice coding/design interviews (LeetCode, HackerRank)',
          'Prepare system design questions',
          'Create final polished portfolio',
          'Update resume with achievements',
          'Do mock interviews'
        ],
        focus: ['Interview prep', 'DSA', 'System design']
      },
      {
        step: 7,
        title: 'Apply for Jobs',
        duration: 'Final semester onwards',
        details: `Start applying for ${targetCareer} positions`,
        actions: [
          'Apply to dream companies + backup options',
          'Attend job fairs and campus placements',
          'Leverage LinkedIn network',
          'Practice negotiation',
          `Target roles like "${targetCareer}" or Analyst/Developer`
        ],
        focus: ['Job applications', 'Networking', 'Interviews']
      }
    ],

    skillsToFocus: {
      technical: getCompleteSkills(targetCareer).technical,
      soft: ['Leadership', 'Communication', 'Problem-solving', 'Adaptability'],
      domain: getCompleteSkills(targetCareer).domain
    },

    courses: {
      beginner: getBeginnerCourses(targetCareer),
      intermediate: getIntermediateCourses(targetCareer),
      advanced: getAdvancedCourses(targetCareer)
    },

    timeline: {
      phases: [
        { phase: 'Degree (Year 1)', duration: '1 year', focus: 'Fundamentals' },
        { phase: 'Intermediate (Year 2)', duration: '1 year', focus: 'Portfolio & Internships' },
        { phase: 'Advanced (Year 3-4)', duration: '1-2 years', focus: 'Specialization & Job Search' }
      ]
    },

    finalGoal: `Secure a position as a ${targetCareer} after completing your degree. Expected timeline: 3-4 years from PUC. Entry-level salary: ₹5-10 LPA, growing to ₹12-25 LPA within 3-5 years based on performance and specialization.`,

    appliedRule: '✅ PUC Level: Degree selection FIRST, then progressive skill development, internships, and finally job placement. Clear linear progression enforced.'
  }
}

// Generate roadmap for Graduation
function generateRoadmapForGraduation(request: RoadmapRequest): any {
  const { targetCareer, skills, interests, strengths, weaknesses } = request

  return {
    career: targetCareer,
    educationLevel: 'Graduation',
    overview: `Accelerated path to becoming a ${targetCareer} post-graduation`,
    
    roadmapSteps: [
      {
        step: 1,
        title: 'Identify Skill Gaps',
        duration: '1-2 Weeks',
        details: `Analyze and identify missing skills for ${targetCareer}`,
        actions: [
          `Compare your current skills (${skills.join(', ')}) with required skills`,
          `List gaps: ${identifySkillGaps(skills, targetCareer)}`,
          'Prioritize high-impact skills',
          'Create learning plan for gaps'
        ],
        focus: ['Gap analysis', 'Prioritization']
      },
      {
        step: 2,
        title: 'Learn Advanced Skills (Quick Track)',
        duration: '2-4 Months',
        details: `Master required skills using intensive programs`,
        actions: [
          'Enroll in intensive bootcamps or courses',
          'Complete 1-2 certification programs',
          'Focus on industry-demanded technologies',
          `Recommended: ${getAdvancedCourses(targetCareer)[0]}`,
          'Learn through project-based learning'
        ],
        focus: getAdvancedSkills(targetCareer)
      },
      {
        step: 3,
        title: 'Build Strong Portfolio (Accelerated)',
        duration: '4-8 Weeks',
        details: 'Create 2-3 impressive portfolio projects quickly',
        actions: [
          'Build real-world problem-solving projects',
          'Deploy projects live (GitHub, Vercel, Heroku)',
          'Write detailed project documentation',
          'Get feedback and iterate',
          'Publish projects on portfolio website'
        ],
        focus: ['Quality over quantity', 'Real-world impact', 'Documentation']
      },
      {
        step: 4,
        title: 'Get Professional Certifications',
        duration: '4-12 Weeks (Parallel)',
        details: 'Earn industry-recognized certifications',
        actions: [
          `Get certified: ${getRelevantCertifications(targetCareer)}`,
          'Add certifications to LinkedIn',
          'Mention in resume and interviews',
          'Consider multiple relevant certifications'
        ],
        focus: ['Industry-recognized certs', 'Resume boost']
      },
      {
        step: 5,
        title: 'Apply for Jobs',
        duration: '2-4 Weeks (Simultaneous with Step 4)',
        details: `Start applying for ${targetCareer} positions immediately`,
        actions: [
          'Update LinkedIn profile with new skills',
          `Apply to 20-30 companies for "${targetCareer}" roles`,
          'Use LinkedIn, Facebook, Angel List, etc',
          'Network with recruiters on LinkedIn',
          'Apply for both permanent and contract roles'
        ],
        focus: ['Job applications', 'Networking', 'Personal branding']
      },
      {
        step: 6,
        title: 'Interview Preparation',
        duration: '2-6 Weeks',
        details: `Prepare for interviews and secure ${targetCareer} position`,
        actions: [
          'Practice technical interview questions',
          'Prepare system design answers',
          'Do mock interviews (with AI or mentors)',
          'Prepare story/experience narratives',
          'Research company before interviews'
        ],
        focus: ['Technical prep', 'Behavioral prep', 'Research']
      },
      {
        step: 7,
        title: 'Negotiate & Join',
        duration: '1-2 Weeks',
        details: `Finalize offer and start your ${targetCareer} journey`,
        actions: [
          'Negotiate salary and benefits',
          'Understand role and team structure',
          'Plan onboarding',
          'Connect with team members early',
          'Start strong in your new role'
        ],
        focus: ['Negotiation', 'Preparation', 'Onboarding']
      }
    ],

    skillsToFocus: {
      technical: getCompleteSkills(targetCareer).technical,
      soft: ['Leadership', 'Strategic thinking', 'Mentoring', 'Business acumen'],
      domain: getCompleteSkills(targetCareer).domain
    },

    courses: {
      beginner: null,
      intermediate: 'Already covered - focus on advanced',
      advanced: getAdvancedCourses(targetCareer)
    },

    timeline: {
      fastTrack: '3-6 months',
      standardTrack: '6-12 months',
      phases: [
        { phase: 'Skill Gap (1-2 weeks)', focus: 'Assessment & Planning' },
        { phase: 'Intensive Learning (2-4 months)', focus: 'Skills & Certifications' },
        { phase: 'Job Search & Interview (2-6 weeks)', focus: 'Landing the job' }
      ]
    },

    finalGoal: `Successfully transition into a ${targetCareer} role. As a graduate, you're expected to contribute immediately. Expected timeline: 3-6 months with focused effort. Entry salary: ₹8-15 LPA depending on background, reaching ₹15-35 LPA within 3-5 years with specialization and growth.`,

    appliedRule: '✅ Graduation Level: Fast-track career entry allowed! Focus on upskilling through bootcamps, certifications, and project building. Direct job application recommended. Timeline compressed to 3-6 months.'
  }
}

// Helper functions
function determineStream(interests: string[]): string {
  const interestStr = interests.join(' ').toLowerCase()
  if (interestStr.includes('science') || interestStr.includes('math') || interestStr.includes('physics')) {
    return 'Science (focusing on PCM or PCB)'
  } else if (interestStr.includes('business') || interestStr.includes('economy') || interestStr.includes('commerce')) {
    return 'Commerce'
  }
  return 'Based on your interests, Science is recommended'
}

function determineSubjectFocus(interests: string[], strengths: string[]): string[] {
  return ['Physics', 'Mathematics', 'Chemistry', 'Computer Science']
}

function getRecommendedDegrees(career: string): string[] {
  const careerMap: any = {
    'Software Engineer': ['B.Tech CSE', 'B.Tech IT'],
    'AI/ML Engineer': ['B.Tech CSE with AI', 'B.Sc Physics with CS'],
    'Data Scientist': ['B.Tech CSE', 'B.Tech Data Science'],
    'Full-Stack Developer': ['B.Tech CSE', 'Diploma in CS'],
    'Cloud Architect': ['B.Tech CSE', 'B.Tech IT'],
    'DevOps Engineer': ['B.Tech CSE', 'B.Tech IT'],
    'Product Manager': ['B.Tech', 'MBA (later)'],
    'UX Designer': ['B.Des', 'B.Tech (non-traditional path)']
  }
  return careerMap[career] || ['B.Tech Computer Science', 'B.Tech IT']
}

function getBeginnerSkills(career: string): string[] {
  const skillMap: any = {
    'Software Engineer': ['Python', 'JavaScript', 'HTML/CSS'],
    'AI/ML Engineer': ['Python', 'Mathematics', 'Statistics'],
    'Data Scientist': ['Python', 'SQL', 'Data Analysis'],
    'Full-Stack Developer': ['HTML', 'CSS', 'JavaScript'],
    'Cloud Architect': ['Linux', 'Networking', 'Cloud Basics'],
    'DevOps Engineer': ['Linux', 'Git', 'Command Line'],
    'Product Manager': ['Problem-solving', 'Communication', 'Analytics'],
    'UX Designer': ['Design Principles', 'Figma', 'User Psychology']
  }
  return skillMap[career] || ['Programming Basics', 'Problem-solving']
}

function getIntermediateSkills(career: string): string[] {
  const skillMap: any = {
    'Software Engineer': ['Data Structures', 'System Design', 'Databases'],
    'AI/ML Engineer': ['Machine Learning', 'Deep Learning', 'TensorFlow'],
    'Data Scientist': ['Machine Learning', 'Visualization', 'Advanced Stats'],
    'Full-Stack Developer': ['React/Vue', 'Node.js', 'Databases'],
    'Cloud Architect': ['AWS/Azure', 'Docker', 'Kubernetes'],
    'DevOps Engineer': ['CI/CD', 'Infrastructure as Code', 'Monitoring'],
    'Product Manager': ['Roadmapping', 'Analytics', 'Metrics'],
    'UX Designer': ['Prototyping', 'User Research', 'Design Systems']
  }
  return skillMap[career] || ['Intermediate Programming']
}

function getAdvancedSkills(career: string): string[] {
  const skillMap: any = {
    'Software Engineer': ['Microservices', 'Scalability', 'Advanced Databases'],
    'AI/ML Engineer': ['Production ML', 'MLOps', 'Research Papers'],
    'Data Scientist': ['Advanced ML', 'Big Data', 'Statistics'],
    'Full-Stack Developer': ['Deployment', 'Performance', 'Security'],
    'Cloud Architect': ['Multi-cloud', 'Security', 'Cost Optimization'],
    'DevOps Engineer': ['Terraform', 'Helm', 'Advanced Monitoring'],
    'Product Manager': ['Strategy', 'Leadership', 'Business Strategy'],
    'UX Designer': ['Accessibility', 'Advanced Animation', 'A/B Testing']
  }
  return skillMap[career] || ['Advanced Career Skills']
}

function getCompleteSkills(career: string): any {
  return {
    technical: [...getBeginnerSkills(career), ...getIntermediateSkills(career)],
    domain: ['Communication', 'Teamwork', 'Problem-solving']
  }
}

function recommendBeginnerCourse(interests: string[]): string {
  return `Start with a course like "The Complete ${interests[0]} Bootcamp" or similar foundational course`
}

function getBeginnerCourses(career: string): string[] {
  const courseMap: any = {
    'Software Engineer': [
      '[Beginner] The Complete Web Development Bootcamp',
      '[Beginner] Python for Everybody',
      '[Beginner] CS50 - Introduction to Computer Science'
    ],
    'AI/ML Engineer': [
      '[Beginner] Python Basics for Data Science',
      '[Beginner] Khan Academy - Statistics & Probability',
      '[Beginner] Andrew Ng - Machine Learning Basics'
    ],
    'Data Scientist': [
      '[Beginner] Python for Data Analysis',
      '[Beginner] SQL Tutorial for Beginners',
      '[Beginner] Statistics Fundamentals'
    ]
  }
  return courseMap[career] || ['Beginning Course in your field']
}

function getIntermediateCourses(career: string): string[] {
  const courseMap: any = {
    'Software Engineer': [
      '[Intermediate] Complete React Course',
      '[Intermediate] Node.js & Express',
      '[Intermediate] System Design Interview'
    ],
    'AI/ML Engineer': [
      '[Intermediate] Deep Learning Specialization',
      '[Intermediate] Applied Machine Learning',
      '[Intermediate] TensorFlow Advanced'
    ]
  }
  return courseMap[career] || ['Intermediate Professional Course']
}

function getAdvancedCourses(career: string): string[] {
  const courseMap: any = {
    'Software Engineer': [
      '[Advanced] Microservices Architecture',
      '[Advanced] High-Performance Systems',
      '[Advanced] Kubernetes for Developers'
    ],
    'AI/ML Engineer': [
      '[Advanced] Production ML Engineering',
      '[Advanced] Applied LLMs',
      '[Advanced] MLOps Specialization'
    ]
  }
  return courseMap[career] || ['Advanced Professional Specialization']
}

function getRelevantCertifications(career: string): string {
  const certMap: any = {
    'Software Engineer': 'AWS Solutions Architect Associate (or similar)',
    'AI/ML Engineer': 'Google Cloud Professional ML Engineer',
    'Data Scientist': 'Azure Data Scientist Associate',
    'Cloud Architect': 'AWS Solutions Architect Professional'
  }
  return certMap[career] || 'Industry-relevant certification'
}

function identifySkillGaps(currentSkills: string[], career: string): string {
  const requiredSkills = getAllRequiredSkills(career)
  const gaps = requiredSkills.filter(s => !currentSkills.includes(s))
  return gaps.slice(0, 3).join(', ')
}

function getAllRequiredSkills(career: string): string[] {
  return [...getBeginnerSkills(career), ...getIntermediateSkills(career), ...getAdvancedSkills(career)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('🎯 Roadmap Generation Request:', {
      educationLevel: body.educationLevel,
      career: body.career || body.targetCareer,
      userId: body.userId
    })

    // Use career or targetCareer field
    const career = body.career || body.targetCareer || 'Software Engineer'
    const educationLevel = body.educationLevel || 'Graduation'
    
    // Create request object with defaults
    const roadmapRequest: RoadmapRequest = {
      educationLevel: educationLevel as '10th' | 'PUC' | 'Graduation',
      targetCareer: career,
      skills: body.skills || ['Problem-solving', 'Communication'],
      interests: body.interests || ['Technology'],
      strengths: body.strengths || ['Learning', 'Adaptability'],
      weaknesses: body.weaknesses || [],
      userProfile: body.userProfile
    }

    // Validate input
    const validLevels = ['10th', 'PUC', 'Graduation']
    if (!validLevels.includes(roadmapRequest.educationLevel)) {
      return NextResponse.json(
        { success: false, error: 'Invalid education level' },
        { status: 400 }
      )
    }

    if (!roadmapRequest.targetCareer) {
      return NextResponse.json(
        { success: false, error: 'Target career is required' },
        { status: 400 }
      )
    }

    // Generate roadmap based on education level
    let roadmap: any
    if (roadmapRequest.educationLevel === '10th') {
      roadmap = generateRoadmapFor10th(roadmapRequest)
    } else if (roadmapRequest.educationLevel === 'PUC') {
      roadmap = generateRoadmapForPUC(roadmapRequest)
    } else {
      roadmap = generateRoadmapForGraduation(roadmapRequest)
    }

    console.log(`✅ Roadmap generated for ${roadmapRequest.educationLevel}: ${roadmap.overview}`)

    return NextResponse.json({
      success: true,
      career: roadmap.career,
      educationLevel: roadmap.educationLevel,
      overview: roadmap.overview,
      roadmapSteps: roadmap.roadmapSteps,
      skillsToFocus: roadmap.skillsToFocus,
      courses: roadmap.courses,
      finalGoal: roadmap.finalGoal,
      appliedRule: roadmap.appliedRule,
      timeline: roadmap.timeline,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error generating roadmap:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate roadmap', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Personalized Career Roadmap Generator',
    usage: 'POST /api/roadmap/generate with education level, career, skills, interests',
    example: {
      educationLevel: '10th',
      targetCareer: 'Software Engineer',
      skills: ['Python', 'Problem-solving'],
      interests: ['Coding', 'Technology'],
      strengths: ['Mathematics', 'Logical thinking'],
      weaknesses: ['Time management']
    }
  })
}
