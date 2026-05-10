import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-client'
import { validateCareerResults } from '@/lib/careerResultValidation'
import { getCareerVideos, getCareerWebsite } from '@/lib/careerVideosAndWebsites'
import { searchCareerVideos } from '@/lib/youtube-service'

// Detect education stage and what the NEXT STEP should be
function detectEducationStage(educationLevel: string): string {
  const level = (educationLevel || '').toLowerCase()
  if (level.includes('10th') || level.includes('sslc') || level.includes('matric') || level.includes('secondary')) return 'after_10th'
  if (level.includes('puc') || level.includes('12th') || level.includes('hsc') || level.includes('higher secondary') || level.includes('intermediate')) return 'after_12th'
  if (level.includes('diploma')) return 'diploma'
  if (level.includes('post') || level.includes('master') || level.includes('mba') || level.includes('mtech') || level.includes('msc') || level.includes('pg')) return 'postgrad'
  if (level.includes('phd') || level.includes('doctorate')) return 'phd'
  return 'graduation' // B.Tech, BBA, B.Sc, BA, etc.
}

// What is the next step for each stage?
function getNextStepContext(stage: string, stream: string): { nextStepLabel: string; careerTypeOptions: string; examples: string } {
  switch (stage) {
    case 'after_10th':
      return {
        nextStepLabel: 'choosing a stream for Class 11th & 12th',
        careerTypeOptions: '"Stream" (Science / Commerce / Arts / Vocational)',
        examples: 'Science (PCM, PCB), Commerce (with/without Maths), Arts/Humanities, Vocational (IT, Agriculture, Healthcare)'
      }
    case 'after_12th':
      return {
        nextStepLabel: 'choosing an undergraduate degree program',
        careerTypeOptions: '"Undergraduate Course" (B.Tech, MBBS, BBA, BA, B.Sc, BCA, B.Com, B.Arch, etc.)',
        examples: `B.Tech (Engineering), MBBS (Medicine), BBA (Business), B.Sc (Sciences), BCA (Computer Applications), B.Com (Commerce), BA (Humanities), B.Arch (Architecture), B.Design${stream ? ` — specifically for ${stream} stream graduates` : ''}`
      }
    case 'diploma':
      return {
        nextStepLabel: 'entering the workforce or pursuing a degree via lateral entry',
        careerTypeOptions: '"Job Role" OR "Lateral Entry Course" (B.Tech via lateral entry, Degree upgrade)',
        examples: 'Junior Engineer, Technical Trainee, Lateral Entry to B.Tech (2nd year), Advanced Diploma, Certification Programs'
      }
    case 'graduation':
      return {
        nextStepLabel: 'entering your career or pursuing higher education',
        careerTypeOptions: '"Job Role" OR "Postgraduate Course" (MBA, M.Tech, M.Sc, LLM, PGDM, etc.)',
        examples: `Based on ${stream || 'their degree'}: Software Engineer, Data Analyst, Product Manager, MBA (Business), M.Tech (Engineering), M.Sc (Sciences), PGDM`
      }
    case 'postgrad':
      return {
        nextStepLabel: 'advancing into specialized career roles or research',
        careerTypeOptions: '"Senior Job Role" OR "Research/PhD" OR "Specialization"',
        examples: 'Senior Engineer, Research Scientist, Consultant, PhD Program, Industry Leader, Faculty/Academia'
      }
    case 'phd':
      return {
        nextStepLabel: 'leading research or top-level professional roles',
        careerTypeOptions: '"Research Leadership" OR "Industry Expert" OR "Academia"',
        examples: 'Principal Researcher, Professor, R&D Director, Chief Scientist, Industry Consultant'
      }
    default:
      return {
        nextStepLabel: 'the most suitable next career step',
        careerTypeOptions: '"Job Role" OR "Course" OR "Higher Education"',
        examples: 'Based on their profile and interests'
      }
  }
}

const getPrompt = (profile: any, quiz: any, stage: string) => {
  const skillNames = Array.isArray(profile.skills)
    ? profile.skills.map((s: any) => (typeof s === 'string' ? s : s?.name || 'General')).join(', ')
    : 'Not specified'

  const interestNames = Array.isArray(profile.interests)
    ? profile.interests.map((i: any) => (typeof i === 'string' ? i : i?.name || 'General')).join(', ')
    : 'Not specified'

  const stream = profile.course_stream || ''

  // Stage-specific instruction block
  const stageInstruction: Record<string, string> = {
    after_10th: `
STUDENT STATUS: Completed 10th grade
PRIMARY GOAL: Identify the immediate next part (11th/12th Stream) that builds the foundation.
WHAT TO GENERATE (3 predictions, each covering a DIFFERENT stream direction):
- Prediction 1: Best-fit STREAM for Class 11-12 based on their top skill/interest
- Prediction 2: Alternative STREAM or Vocational path
- Prediction 3: Specialized Stream with specific subject focus

CRITICAL NAMING RULE: The "careerName" MUST be the name of the STREAM (e.g., "Science Stream - PCM with Computer Science"). 
DO NOT put the ultimate job (like Software Engineer) in the title. Put it in "careerPreview".

For each stream prediction, also fill:
  "coursesAfter10th": ["2-3 diploma/certificate courses they can do alongside or after this stream"]
  "streamSubjects": ["list of subjects in this stream, e.g. Physics, Chemistry, Maths, Computer Science"]
  "careerPreview": ["3 ULTIMATE career paths this stream leads to (e.g. AI Engineer, Researcher)"]
  "entranceExams": [] (leave empty for 10th stage)
`,
    after_12th: `
STUDENT STATUS: Completed 12th / PUC / HSC (Stream: ${stream || 'unknown'})
PRIMARY GOAL: Identify the immediate next part (Undergraduate Degree).
WHAT TO GENERATE (3 predictions for different degree paths):
- Prediction 1: Best-fit DEGREE PROGRAM matching their stream + top skill/interest
- Prediction 2: Alternative degree in a related field
- Prediction 3: Professional course or creative degree path

CRITICAL NAMING RULE: The "careerName" MUST be the name of the DEGREE (e.g., "B.Tech in Artificial Intelligence & Data Science").
DO NOT put the ultimate job in the title. Put it in "careerPreview".

For each degree prediction, also fill:
  "entranceExams": ["specific exams needed, e.g. JEE Main, NEET, CLAT, CAT, CUET, NDA"]
  "topColleges": ["3-4 top colleges/institutions in India for this course"]
  "careerPathsAfter": ["3 ultimate career paths this degree leads to"]
  "coursesAfter10th": [] (leave empty for 12th stage)
`,
    diploma: `
STUDENT STATUS: Completed Diploma in ${stream || 'a technical field'}
WHAT TO GENERATE (3 predictions):
- Prediction 1: Lateral Entry into B.Tech (most relevant branch based on their diploma)
- Prediction 2: Direct JOB ROLE they can apply for NOW with their diploma
- Prediction 3: Skill enhancement / certification path or Advanced Diploma

For each prediction, also fill:
  "lateralEntryOptions": ["specific lateral entry options available, e.g. B.Tech Lateral Entry Year 2 in [specific branch]"]
  "recommendedCertifications": ["3 certifications that boost their profile immediately"]
  "entranceExams": ["lateral entry exams if applicable, e.g. LEET, State-level lateral entry tests"]
  "topColleges": ["colleges accepting lateral entry for this course, or top companies for the job role"]
`,
    graduation: `
STUDENT STATUS: Completed Graduation (${stream || 'degree'})
WHAT TO GENERATE (3 predictions):
- Prediction 1: Best JOB ROLE they can apply for NOW with their degree + skills
- Prediction 2: POSTGRADUATE COURSE (MBA/M.Tech/M.Sc/PGDM) for career advancement
- Prediction 3: Alternative job role OR specialization/certification path

For each prediction, also fill:
  "specializationAreas": ["3-4 specialization areas within this career/course"]
  "entranceExams": ["entrance exams if PG course, e.g. CAT, GATE, GRE, GMAT, MAT, SNAP, XAT"]
  "topColleges": ["top companies (for job role) OR top colleges (for PG course) in India"]
  "recommendedCertifications": ["2-3 certifications to get before/alongside this path"]
`,
    postgrad: `
STUDENT STATUS: Completed Post-Graduation (${stream || 'PG degree'})
WHAT TO GENERATE (3 predictions):
- Prediction 1: Senior/specialist JOB ROLE in their domain
- Prediction 2: Research / PhD opportunity
- Prediction 3: Consulting / entrepreneurship / academia path

For each prediction, also fill:
  "specializationAreas": ["advanced specialization areas"]
  "topColleges": ["top institutions for PhD / top companies for this role"]
  "recommendedCertifications": ["2-3 advanced certifications"]
`,
    phd: `
STUDENT STATUS: Completed PhD in ${stream || 'research'}
WHAT TO GENERATE (3 predictions):
- Prediction 1: Top-tier research / R&D leadership role
- Prediction 2: Academia / teaching / professor path
- Prediction 3: Industry expert / consultant / startup founder role

For each prediction, also fill:
  "specializationAreas": ["advanced research or industry domains"]
  "topColleges": ["top institutions / research labs / companies"]
`
  }

  return `You are FutureMatrix AI — an expert Indian career counselor. Analyze the student profile and quiz data below, then generate EXACTLY 3 highly PERSONALIZED career predictions for their NEXT STEP.

════════════════════════════════════════
STUDENT PROFILE
════════════════════════════════════════
Education Level: ${profile.education_level}
Detection Stage: ${stage}
Stream/Branch: ${stream || 'Not specified'}
Academic Score/CGPA: ${profile.academic_score || 'Not mentioned'}
Skills (what they know): ${skillNames}
Interests (what they love): ${interestNames}
Work Experience: ${profile.experience_years || 0} year(s) — ${profile.experience_details || 'fresher/student'}
Location: ${profile.state || 'India'}

QUIZ / PERSONALITY RESULTS:
${JSON.stringify(quiz, null, 2)}

════════════════════════════════════════
STAGE-SPECIFIC INSTRUCTIONS
════════════════════════════════════════
${stageInstruction[stage] || stageInstruction['graduation']}

════════════════════════════════════════
UNIVERSAL RULES — NEVER BREAK THESE
════════════════════════════════════════
1. careerName must ALWAYS be SPECIFIC:
   ✓ "Science Stream - Physics, Chemistry, Maths (PCM)"
   ✓ "B.Tech Computer Science & Engineering"
   ✓ "MBA Marketing & Digital Strategy"
   ✗ "Science" ✗ "Engineering" ✗ "MBA" (too vague)
2. All 3 predictions must be DIFFERENT fields/directions
3. matchScore must differ across 3 predictions (e.g. 94, 88, 82)
4. reason must explicitly mention their skills: [${skillNames.split(',').slice(0, 2).join(' and ')}] and interests: [${interestNames.split(',').slice(0, 2).join(' and ')}]
5. Do NOT recommend something they already completed
6. All predictions must match stage: "${stage}"

════════════════════════════════════════
RETURN FORMAT — RAW JSON ONLY
════════════════════════════════════════
Return ONLY raw JSON, no markdown, no explanation:
{
  "personalityType": "Analytical | Creative | Social | Entrepreneurial | Technical | Investigative",
  "predictions": [
    {
      "careerName": "SPECIFIC full name",
      "careerType": "Stream | Undergraduate Degree | Postgraduate Course | Job Role | Lateral Entry Course | Certification | Research",
      "duration": "e.g. 2 years (Class 11-12) | 4 years | 2 years | Ongoing | 6 months",
      "matchScore": 94,
      "basedOnStream": "${stream || profile.education_level}",
      "reason": "Specific 2-3 sentence reason mentioning their skills and interests",
      "personalityFit": "How their quiz answers support this specific choice",
      "careerOverview": "Full overview: what they study/do, how to get in, what career it leads to, India-specific context",
      "careerPersonalityFit": "Detailed match explanation between their personality type and this path",
      "streamSubjects": ["subjects in this stream — fill only for stream predictions"],
      "coursesAfter10th": ["diploma/certificate courses alongside this stream — fill only for 10th stage"],
      "careerPreview": ["3 ultimate career paths this stream/course leads to"],
      "entranceExams": ["specific exam names like JEE Main, NEET, CAT, GATE, CLAT, CUET, LEET, NDA etc."],
      "topColleges": ["3-4 specific colleges/companies in India relevant to this path"],
      "lateralEntryOptions": ["specific lateral entry paths — fill only for diploma stage"],
      "specializationAreas": ["3-4 specializations within this career/course"],
      "recommendedCertifications": ["2-3 certifications to do alongside/before this path"],
      "requiredSkills": ["5 key skills needed for this path"],
      "suggestedSubjects": ["4-5 subjects to master for this path"],
      "skillGapAnalysis": {
        "currentSkills": ["skills from their profile useful for this path"],
        "missingSkills": ["skills they need to develop"],
        "improvementAreas": ["specific areas to improve"]
      },
      "roadmap": {
        "step1": "Immediate first action",
        "step2": "Second concrete step",
        "beginner": ["3 Month 1-3 actions"],
        "intermediate": ["3 Month 4-12 actions"],
        "advanced": ["2 Year 2+ actions"]
      },
      "actionPlan": {
        "next30Days": ["4 specific actions for this month"],
        "midTerm": ["4 actions for months 2-6"]
      },
      "salaryGrowth": {
        "entryLevel": "₹X-Y LPA after completing this path",
        "midLevel": "₹X-Y LPA (3-5 years experience)",
        "seniorLevel": "₹X-Y LPA (10+ years)"
      },
      "marketDemand": {
        "currentDemand": "India 2024 demand context",
        "growthRate": "X% annually",
        "futureScope": "5-10 year India-specific outlook"
      },
      "riskAnalysis": {
        "automationRisk": "Low/Medium/High — specific reason",
        "competitionLevel": "Low/Medium/High — India context"
      },
      "toolsAndTechnologies": ["5 specific tools/platforms for this path"],
      "recommendedProjects": ["3 specific portfolio projects"],
      "learningResources": ["3 specific resources with platform names"],
      "commonMistakesToAvoid": ["3 mistakes students make on this path"]
    },
    {
      "careerName": "Second Prediction...",
      "comment": "Generate the full object for the 2nd prediction here"
    },
    {
      "careerName": "Third Prediction...",
      "comment": "Generate the full object for the 3rd prediction here"
    }
  ]
}`
}

// Function to clean and parse JSON
function cleanJSON(text: string): any {
  let cleaned = text.trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }
  return JSON.parse(cleaned)
}

// Function to call Gemini for Career Prediction
async function predictWithGemini(profile: any, quiz: any, stage: string, apiKey: string) {
  const prompt = getPrompt(profile, quiz, stage)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
method: 'POST',
  headers: {
  'Content-Type': 'application/json',
      },
signal: controller.signal,
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  }),
    })

clearTimeout(timeout)
const data = await response.json()

if (!response.ok) {
  console.error('Gemini API Error Response:', data)
  throw new Error(`Gemini API Error: ${data.error?.message || response.statusText}`)
}

const text = data.candidates?.[0]?.content?.parts?.[0]?.text
if (!text) {
  throw new Error('Empty response from Gemini (Possible safety block)')
}

return cleanJSON(text)
  } catch (err) {
  clearTimeout(timeout)
  throw err
}
}

// Function to call Cohere for Career Prediction
async function predictWithCohere(profile: any, quiz: any, stage: string, apiKey: string) {
  const prompt = getPrompt(profile, quiz, stage)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 40000)

  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'accept': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        message: prompt,
        model: 'command-r',
        temperature: 0.3,
        max_tokens: 4000
      })
    })

    clearTimeout(timeout)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Cohere API Error: ${data.message || response.statusText}`)
    }

    const text = data.text
    if (!text) {
      throw new Error('Empty response from Cohere')
    }

    return cleanJSON(text)
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

// Function to call OpenRouter (Llama 3) for Career Prediction
async function predictWithOpenRouter(profile: any, quiz: any, stage: string, apiKey: string) {
  const prompt = getPrompt(profile, quiz, stage)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 40000)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    })

    clearTimeout(timeout)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${data.error?.message || response.statusText}`)
    }

    const text = data?.choices?.[0]?.message?.content
    if (!text) {
      throw new Error('Empty response from OpenRouter')
    }

    return cleanJSON(text)
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

// Static Fallback Logic (O*NET-inspired rule-based predictions)
function getStaticFallback(profile: any, stage: string): any {
  const stream = (profile.course_stream || '').toLowerCase()
  const edu = (profile.education_level || '').toLowerCase()

  let careerName = "Strategic Professional"
  let matchScore = 85
  let overview = "A high-growth career path aligned with your educational background and interests."

  if (stream.includes('science') || stream.includes('cs') || stream.includes('it')) {
    careerName = "Software Systems Engineer"
  } else if (stream.includes('commerce') || stream.includes('business')) {
    careerName = "Business Intelligence Analyst"
  } else if (stream.includes('art') || stream.includes('design')) {
    careerName = "Digital Experience Designer"
  } else if (edu.includes('10')) {
    careerName = "Science & Technology Stream"
  } else {
    careerName = "Advanced Professional Path"
  }

  const fallbackTemplate = {
    matchScore: 85,
    reason: "Recommended based on your academic stream and technical aptitude.",
    personalityFit: "Your profile shows a strong alignment with structured problem-solving and industry growth.",
    overview,
    requiredSkills: ["Technical proficiency", "Analytical thinking", "Strategic planning"],
    suggestedSubjects: ["Core Industry Concepts", "Applied Methodologies"],
    skillGapAnalysis: {
      currentSkills: ["Fundamental knowledge"],
      missingSkills: ["Industry-specific tools", "Advanced certifications"],
      improvementAreas: ["Practical implementation"]
    },
    roadmap: {
      step1: "Complete specialized certification",
      step2: "Build professional portfolio",
      beginner: ["Learn fundamentals", "Master core tools"],
      intermediate: ["Advanced projects", "Industry networking"]
    },
    actionPlan: {
      next30Days: ["Research top companies", "Enroll in online specialization"],
      midTerm: ["Gain internship experience", "Build capstone projects"]
    },
    salaryGrowth: { entryLevel: "₹6-12 LPA", midLevel: "₹18-35 LPA", seniorLevel: "₹50-90 LPA" },
    marketDemand: { currentDemand: "High", growthRate: "15-20% annually", futureScope: "Positive" },
    riskAnalysis: { automationRisk: "Low", competitionLevel: "Moderate" },
    toolsAndTechnologies: ["Industry Standard Software", "Analytical Platforms"],
    recommendedProjects: ["End-to-end industry case study", "Technical implementation project"],
    learningResources: ["Professional Documentation", "Industry Journals"],
    commonMistakesToAvoid: ["Ignoring soft skills", "Lack of practical exposure"]
  }

  return {
    personalityType: "Analytical & Growth-Oriented",
    predictions: [
      { ...fallbackTemplate, careerName: careerName, matchScore: 92 },
      { ...fallbackTemplate, careerName: careerName + " Specialist", matchScore: 85 },
      { ...fallbackTemplate, careerName: "Consultant / " + careerName, matchScore: 78 }
    ]
  }
}

export async function POST(req: NextRequest) {
  try {
    const { profile, quiz } = await req.json()
    // ... (rest of the safeProfile logic)

    // Validate inputs
    if (!profile || !quiz) {
      return NextResponse.json(
        { success: false, error: 'Profile and quiz data required' },
        { status: 400 }
      )
    }

    // Ensure profile has required fields with clean, readable defaults
    const safeProfile = {
      ...profile,
      firebase_uid: profile.firebase_uid || 'unknown',
      education_level: profile.education_level || 'graduate',
      course_stream: profile.course_stream || '',
      institution_name: profile.institution_name || '',
      academic_score: profile.academic_score || null,
      experience_years: profile.experience_years || 0,
      experience_details: profile.experience_details || '',
      state: profile.state || '',
      country: profile.country || 'India',
      gender: profile.gender || '',
      // Keep skills as flat strings for cleaner AI prompt
      skills: Array.isArray(profile.skills)
        ? profile.skills.map((s: any) => (typeof s === 'string' ? s : s?.name || String(s)).trim()).filter(Boolean)
        : [],
      interests: Array.isArray(profile.interests)
        ? profile.interests.map((i: any) => (typeof i === 'string' ? i : i?.name || String(i)).trim()).filter(Boolean)
        : [],
    }

    const stage = detectEducationStage(safeProfile.education_level)
    const geminiKey = process.env.GEMINI_API_KEY
    const cohereKey = process.env.COHERE_API_KEY
    const openRouterKey = process.env.OPENROUTER_API_KEY

    if (!geminiKey && !cohereKey && !openRouterKey) {
      return NextResponse.json({ success: false, error: 'No AI API keys configured' }, { status: 500 })
    }

    console.log(`[Prediction] Running Triple AI race for stage: ${stage}`)

    // Run all configured AIs in parallel, take the first one that succeeds
    const promises: Promise<any>[] = []
    if (geminiKey) promises.push(predictWithGemini(safeProfile, quiz, stage, geminiKey))
    if (cohereKey) promises.push(predictWithCohere(safeProfile, quiz, stage, cohereKey))
    if (openRouterKey) promises.push(predictWithOpenRouter(safeProfile, quiz, stage, openRouterKey))

    let aiResult: any = null

    try {
      aiResult = await Promise.any(promises)
      console.log(`[Prediction] A model successfully returned valid JSON.`)
    } catch (err: any) {
      console.error('[Prediction] Promise.any failed, trying static fallback.', err)
      // ULTIMATE FALLBACK: Generate static but valid result instead of failing
      aiResult = getStaticFallback(safeProfile, stage)
    }

    let results = aiResult?.predictions || []

    if (results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not generate valid recommendations from AI.',
        },
        { status: 422 }
      )
    }

    // All results use 'careers' key — stage is only used for AI context
    const resultKey = 'careers'

    // Enrich each result with next-step metadata for the frontend to display
    const nextStepCtx = getNextStepContext(stage, safeProfile.course_stream || '')
    results = results.map((r: any) => {
      // Ensure careerName is always populated
      if (!r.careerName) r.careerName = r.streamName || r.courseName || r.pathName || 'Career Path'
      // Add next-step context for the UI to use
      r.educationStage = stage
      r.nextStepLabel = nextStepCtx.nextStepLabel
      r.currentEducation = safeProfile.education_level
      return r
    })

    // Apply final validation to ensure NO EMPTY FIELDS
    const finalResults = validateCareerResults(results)

    const ytKey = process.env.YOUTUBE_API_KEY

    // Fetch curated videos and websites for each result
    for (const result of finalResults) {
      const careerName =
        result.careerName ||
        result.courseName ||
        result.streamName ||
        'Career'

      // 1. Try curated videos first
      if (!result.relatedVideos || result.relatedVideos.length === 0) {
        result.relatedVideos = getCareerVideos(careerName)
      }

      // 2. If still empty (AI recommended a new career), fetch from YouTube API
      if ((!result.relatedVideos || result.relatedVideos.length === 0) && ytKey) {
        result.relatedVideos = await searchCareerVideos(careerName, ytKey)
      }

      // 3. Use specific website guides instead of generic
      if (!result.websiteGuide || result.websiteGuide === 'https://www.shiksha.com/careers') {
        result.websiteGuide = getCareerWebsite(careerName)
      }
    }

    // ── STORE IN DATABASE ──────────────────────────────────────────────────
    let dbResultId = null
    const dbPredictionIds: Record<string, string> = {}

    try {
      const supabaseAdmin = getSupabaseAdmin()

      // 1. Create Career Result parent record
      const { data: careerRes, error: resError } = await supabaseAdmin
        .from('career_results')
        .insert({
          firebase_uid: safeProfile.firebase_uid,
          personality_type: aiResult.personalityType || 'Balanced',
          total_careers_analyzed: 100, // AI Analyzes broadly
          top_match_score: finalResults[0]?.matchScore || 0,
          stream_preference: stage || 'General'
        })
        .select()
        .single()

      if (!resError && careerRes) {
        dbResultId = careerRes.id

        // 2. Create individual predictions
        const predictionsToInsert = finalResults.map((res: any, index: number) => ({
          result_id: dbResultId,
          firebase_uid: safeProfile.firebase_uid,
          rank: index + 1,
          career_name: res.careerName || res.courseName || res.streamName || 'Career',
          match_score: res.matchScore || 0,
          overview: res.careerOverview || res.overview || res.courseOverview || '',
          personality_fit: res.careerPersonalityFit || res.personalityFit || '',
          analysis_data: res, // Store the full JSON for backup
          is_saved_by_user: false // Not saved by user yet
        }))

        const { data: savedPredictions, error: predError } = await supabaseAdmin
          .from('career_predictions')
          .insert(predictionsToInsert)
          .select()

        if (!predError && savedPredictions) {
          savedPredictions.forEach((p: any) => {
            dbPredictionIds[p.career_name] = p.id
          })
        }
      }
    } catch (dbErr) {
      console.warn('Database storage failed (skipping):', dbErr)
      // We don't fail the request if DB storage fails, but we log it
    }

    // Build response
    const response = {
      success: true,
      stage: stage,
      personalityType: aiResult.personalityType,
      analysis: {
        ...finalResults[0],
        userId: safeProfile.firebase_uid,
        createdAt: new Date().toISOString(),
        [resultKey]: finalResults.map((r: any) => ({
          ...r,
          dbId: dbPredictionIds[r.careerName || r.courseName || r.streamName || 'Career']
        })),
        dbResultId
      },
    }

    return NextResponse.json(response)
  } catch (err: any) {
    console.error('Career analysis error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to analyze career path',
      },
      { status: 500 }
    )
  }
}
