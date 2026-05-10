import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { from, to } = await request.json()

    if (!from || !to) {
      return NextResponse.json({ success: false, error: 'Source and Target education are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    })

    const prompt = `
      You are an elite career counselor and education strategist.
      Create a detailed, high-impact education roadmap from "${from}" to "${to}".
      
      CRITICAL ARCHITECTURE RULES:
      1. NO REDUNDANT DEGREES: If the user is already pursuing a professional degree (e.g. B.Tech), DO NOT suggest parallel or lower degrees (e.g. BCA). Focus on the direct academic progression.
      2. LOGICAL SEQUENCING: Only insert bridging steps if there is a real academic gap (e.g., PUC to Master's requires a Bachelor's in between).
      3. DEEP SEARCH ACCURACY: Provide specific, real-world course names, industry-standard toolsets, and realistic milestones.
      4. ELITE FORMATTING: The roadmap must be practical, elite, and professionally architected.

      REQUIRED JSON STRUCTURE:
      {
        "success": true,
        "title": "Elite Path from ${from} to ${to}",
        "description": "A comprehensive, neural-synced roadmap designed for high-performance career progression.",
        "current_education": "${from}",
        "next_education": "${to}",
        "duration": "Total estimated years",
        "steps": [
          {
            "phase": 1,
            "title": "Phase Title",
            "duration": "e.g., 6 Months",
            "description": "Deep summary of this phase",
            "keyActivities": ["Activity 1", "Activity 2", "Activity 3"],
            "milestones": ["Milestone 1", "Milestone 2"],
            "resources": [{"title": "Course/Book Name", "type": "Online Course|Book|Cert"}]
          }
        ],
        "projects": [
          {
            "title": "Project Name",
            "description": "Why this project matters for ${to}",
            "duration": "4 Weeks",
            "difficulty": "Beginner|Intermediate|Advanced",
            "skillsBuilt": ["Skill 1", "Skill 2"]
          }
        ],
        "timeline": {
          "month1_2": "Strategy for early stages",
          "month3_6": "Strategy for middle stages",
          "month7_12": "Strategy for advanced stages",
          "after12": "Long term goal achievement"
        },
        "commonMistakes": ["Mistake 1", "Mistake 2"],
        "successCriteria": ["Goal 1", "Goal 2"],
        "estimatedCost": "Approximate cost range"
      }
      
      Respond with valid JSON only.
    `

    console.log(`📡 Generating Deep Roadmap: ${from} → ${to}`)
    const result = await model.generateContent(prompt)
    const response = await result.response
    const data = JSON.parse(response.text())

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Roadmap Generation Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
