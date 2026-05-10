import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock database for saved roadmaps
const mockRoadmaps = [
  {
    id: 'roadmap-001',
    title: 'Software Development Learning Path',
    description: 'Complete journey from web development fundamentals to full-stack expertise',
    careerGoal: 'Software Developer',
    currentLevel: 'Beginner',
    duration: 12,
    progress: 35,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    nodes: [
      {
        id: 'node-1',
        title: 'HTML & CSS Fundamentals',
        type: 'course',
        description: 'Learn the basics of web markup and styling',
        duration: '2 weeks',
        difficulty: 'beginner',
        completed: true,
        resources: ['FreeCodeCamp HTML/CSS', 'MDN Web Docs'],
        skills: ['HTML', 'CSS', 'Responsive Design']
      },
      {
        id: 'node-2',
        title: 'JavaScript Essentials',
        type: 'course',
        description: 'Master JavaScript fundamentals and DOM manipulation',
        duration: '4 weeks',
        difficulty: 'beginner',
        completed: true,
        resources: ['JavaScript.info', 'Codecademy'],
        skills: ['JavaScript', 'DOM', 'ES6+']
      },
      {
        id: 'node-3',
        title: 'React Basics',
        type: 'course',
        description: 'Introduction to React framework and component development',
        duration: '4 weeks',
        difficulty: 'intermediate',
        completed: false,
        resources: ['React Official Docs', 'Udemy React Course'],
        skills: ['React', 'JSX', 'Hooks', 'State Management']
      },
      {
        id: 'node-4',
        title: 'Backend Development with Node.js',
        type: 'course',
        description: 'Build server-side applications with Node.js and Express',
        duration: '6 weeks',
        difficulty: 'intermediate',
        completed: false,
        resources: ['Node.js Official Docs', 'Express.js Guide'],
        skills: ['Node.js', 'Express', 'REST APIs', 'Databases']
      }
    ],
    phases: [
      {
        id: 'phase-1',
        title: 'Foundation',
        description: 'Core web development skills',
        type: 'foundation',
        nodes: ['node-1', 'node-2']
      },
      {
        id: 'phase-2',
        title: 'Frontend Development',
        description: 'Modern frontend frameworks',
        type: 'intermediate',
        nodes: ['node-3']
      },
      {
        id: 'phase-3',
        title: 'Full Stack Development',
        description: 'Complete end-to-end development',
        type: 'advanced',
        nodes: ['node-4']
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, fetch from database where user_id = authenticated user
    // For now, return mock roadmaps
    
    return NextResponse.json({
      success: true,
      roadmaps: mockRoadmaps,
      total: mockRoadmaps.length
    })
  } catch (error) {
    console.error('Error fetching roadmaps:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch roadmaps' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      careerGoal,
      currentLevel,
      duration,
      nodes,
      phases
    } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Create new roadmap
    const newRoadmap = {
      id: `roadmap-${Date.now()}`,
      title,
      description,
      careerGoal: careerGoal || 'Career Development',
      currentLevel: currentLevel || 'Intermediate',
      duration: duration || 12,
      progress: 0,
      status: 'in-progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nodes: nodes || [],
      phases: phases || [],
      milestones: []
    }

    // In a real app, save to database
    // For now, just return the created roadmap
    
    return NextResponse.json({
      success: true,
      roadmap: newRoadmap,
      message: 'Roadmap created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating roadmap:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create roadmap' },
      { status: 500 }
    )
  }
}
