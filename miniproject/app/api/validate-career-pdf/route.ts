import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'

// Map extracted text to valid education levels
function normalizeEducationLevel(text: string): string | null {
  if (!text) return null
  
  const normalized = text.toLowerCase().replace(/\./g, '').trim()
  
  // Valid education levels from database
  const educationLevelMappings: Record<string, string> = {
    'btech': 'B.Tech',
    'be': 'B.Tech',
    'bsc': 'B.Sc',
    'mtech': 'M.Tech',
    'mba': 'MBA',
    'phd': 'PhD',
    'ba': 'B.A',
    'bcom': 'B.Com',
    'msc': 'M.Sc',
    'ma': 'M.A',
    'mcom': 'M.Com',
    'bca': 'B.Tech',
    'mca': 'M.Tech',
    'puc': '12th Grade / PUC',
    '12th': '12th Grade / PUC',
    '10th': '10th Grade',
  }
  
  // Direct match on normalized string
  if (educationLevelMappings[normalized]) return educationLevelMappings[normalized]

  // Partial match check
  for (const [key, value] of Object.entries(educationLevelMappings)) {
    if (normalized.includes(key)) return value
  }
  
  return null
}

async function extractGoalWithAI(text: string, apiKey: string): Promise<string | null> {
  const prompt = `STRICT EXTRACTION TASK: 
  Analyze this Career Prediction Report and identify the SPECIFIC degree or career goal that the report RECOMMENDS for the user.
  
  CRITICAL RULE: Extract only what is written in the report as the "Recommended Path" or "Suggested Career". 
  - If the report recommends "B.A", you MUST return "B.A". 
  - DO NOT suggest the next level (e.g., if it recommends B.A, do NOT return M.A).
  - Extract exact abbreviations: B.Tech, M.Tech, MBA, B.A, M.A, B.Sc, BCA, B.Com, etc.
  
  REPORT TEXT:
  ${text.substring(0, 5000)}
  
  Return ONLY the exact degree abbreviation or career name from the report. No explanations.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('AI Extraction Error Status:', response.status, errorData)
      return null
    }

    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    console.log('AI Extraction Result:', result)
    
    if (!result || result.toLowerCase() === 'null') return null
    return result
  } catch (err) {
    console.error('AI Extraction Exception:', err)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let pdfData;
    let text = '';
    try {
      pdfData = await pdf(buffer)
      text = pdfData.text
    } catch (parseErr) {
      try {
        text = buffer.toString('utf-8')
      } catch {
        return NextResponse.json({ success: false, error: 'Failed to parse file.' }, { status: 422 })
      }
    }

    const apiKey = process.env.GEMINI_API_KEY
    let extractedGoal = null

    if (apiKey) {
      extractedGoal = await extractGoalWithAI(text, apiKey)
    }

    // Fallback normalization
    if (extractedGoal) {
      extractedGoal = normalizeEducationLevel(extractedGoal) || extractedGoal
    }

    return NextResponse.json({
      success: true,
      message: extractedGoal 
        ? `✓ Strategy validated! Detected: ${extractedGoal}` 
        : '⚠️ Could not extract goal. Please ensure your PDF clearly mentions your target degree.',
      extractedText: text.substring(0, 5000),
      extractedGoal: extractedGoal,
      fileName: file.name
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Error: ' + error.message }, { status: 500 })
  }
}
