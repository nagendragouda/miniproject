import { NextRequest, NextResponse } from 'next/server'

const ROADMAP_PROMPT = (edu: string, career: string, skills: string, duration: string, score: string) => `
You are an ELITE Career and Academic Strategy AI. Your goal is to architect a flawless, hyper-detailed, step-by-step roadmap from "${edu}" to "${career}".

USER PROFILE (STARTING POINT):
- Current Education: ${edu}
${score ? `- Academic Performance (Last Year): ${score}%` : ''}
${skills ? `- Existing Skills: ${skills}` : ''}

USER REQUIREMENT (DESTINATION):
- Target Role: ${career}
${duration ? `- Required Duration: ${duration} (MANDATORY)` : ''}

CRITICAL ARCHITECTURE RULES:
1. START FROM REALITY: The roadmap MUST begin exactly at the user's current education level (${edu}). 
2. NO REDUNDANT DEGREES: If the user is already in a professional degree (e.g. B.Tech), DO NOT suggest parallel degrees (e.g. BCA). Focus on completing the current degree and transitioning to industry roles or specialized certifications.
3. ACADEMIC BRIDGING (SMART ROADMAP PROTOCOL):
   - Only insert bridging steps if there is a real gap (e.g. High School to Degree).
   - If user is in B.Tech, the roadmap should cover the remaining years of B.Tech, Internships, and then the first job.
   - For 10th/11th/12th students: Specify the EXACT stream (e.g., PCMC, Commerce) and board exam focus.
4. STRICT DURATION RULE: ${duration ? `The ENTIRE roadmap must strictly span exactly ${duration}. The sum of all stage durations MUST equal ${duration}.` : 'Provide a realistic timeline based on industry standards.'}
5. COMPLETENESS & ACCURACY: Use "Deep Search" logic — provide accurate course names, industry-standard tools, and realistic salaries or job titles.

Return ONLY this precise JSON structure with 4-6 stages:
{
  "roadmap": [
    {
      "stage_title": "Stage Name",
      "description": "2-3 sentence description",
      "skills": ["skill1", "skill2"],
      "subjects": ["topic1", "topic2"],
      "tools": ["tool1", "tool2"],
      "courses": ["Real Course Name"],
      "tasks": ["Action item"],
      "projects": ["Project idea"],
      "resources": ["Reference link or name"],
      "duration": "e.g. 6 Months",
      "difficulty": "Beginner|Intermediate|Advanced",
      "outcome": "Achievable result",
      "prerequisites": "What's needed before",
      "progress": 0
    }
  ]
}

RULES:
- End exactly at ${career} readiness.
- Include real, current tool/course names.
- Output ONLY JSON. No markdown. No text.
`.trim()

function cleanJSON(text: string): any {
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
  }
  return JSON.parse(cleaned)
}

async function geminiGenerate(edu: string, career: string, skills: string, duration: string, score: string, apiKey: string): Promise<any> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: ROADMAP_PROMPT(edu, career, skills, duration, score) }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
        }),
      }
    )
    clearTimeout(timeout)
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return cleanJSON(text)
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

async function llamaGenerate(edu: string, career: string, skills: string, duration: string, score: string, apiKey: string): Promise<any> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: ROADMAP_PROMPT(edu, career, skills, duration, score) }],
        temperature: 0.2,
        max_tokens: 2048,
      }),
    })
    clearTimeout(timeout)
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''
    return cleanJSON(text)
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const edu = body.current_education || 'High School'
    const career = body.predicted_path || 'Software Engineer'
    const duration = body.target_duration || ''
    const score = body.current_score || ''
    const skills = (body.current_skills || []).join(', ')

    const gKey = process.env.GEMINI_API_KEY || ''
    const oKey = process.env.OPENROUTER_API_KEY || ''

    if (!gKey) return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })

    console.log(`[Roadmap] Generating for ${edu} (${score}%) → ${career}`)

    const promises: Promise<any>[] = [geminiGenerate(edu, career, skills, duration, score, gKey)]
    if (oKey) promises.push(llamaGenerate(edu, career, skills, duration, score, oKey))

    let result: any = null
    let source = 'gemini-flash'

    try {
      result = await Promise.any(promises)
      source = 'dual-ai-race'
    } catch {
      try {
        result = await geminiGenerate(edu, career, skills, duration, score, gKey)
        source = 'gemini-fallback'
      } catch (finalErr) {
        return NextResponse.json({ error: 'AI engines failed' }, { status: 500 })
      }
    }

    if (!result?.roadmap) return NextResponse.json({ error: 'Invalid structure' }, { status: 500 })
    return NextResponse.json({ success: true, roadmap: result, source })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
