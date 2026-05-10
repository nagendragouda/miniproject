import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import PdfParse from 'pdf-parse'

// Initialize AI providers
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Multi-provider AI analysis - will try multiple providers in order of preference
async function analyzeResumeWithAI(resumeText: string, apiLayerData: any, jobDescription: string): Promise<any> {
  const analysisPrompt = buildAnalysisPrompt(resumeText, apiLayerData, jobDescription);

  // 1. Try Gemini (Primary)
  try {
    console.log('🤖 Attempting Gemini Analysis...')
    return await analyzeWithGemini(analysisPrompt);
  } catch (geminiError: any) {
    console.warn('⚠️ Gemini failed:', geminiError.message);
    
    // 2. Fallback to Cohere (Secondary)
    try {
      console.log('🔄 Fallback to Cohere Chat API...')
      return await analyzeWithCohere(analysisPrompt);
    } catch (cohereError: any) {
      console.warn('⚠️ Cohere failed:', cohereError.message);
      
      // 3. Fallback to local analysis (Final resort)
      console.log('🔄 Using local pattern-based analysis...')
      return generateLocalAnalysis(resumeText, apiLayerData);
    }
  }
}

// Gemini Analysis with recursive model fallback
async function analyzeWithGemini(prompt: string): Promise<any> {
  if (!process.env.GEMINI_API_KEY) throw new Error('Gemini API key not configured');
  
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🛰️ Trying Gemini Model: ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 8000,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();
      
      if (!analysisText) throw new Error('Empty response from AI');
      
      return parseJSONSafely(analysisText);
    } catch (err: any) {
      console.warn(`⚠️ Gemini ${modelName} failed:`, err.message);
      lastError = err;
      continue; // Try next model
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

// Cohere Analysis (Updated to v1/chat API)
async function analyzeWithCohere(prompt: string): Promise<any> {
  const cohereKey = process.env.COHERE_API_KEY;
  if (!cohereKey) throw new Error('Cohere API key not configured');

  const response = await fetch('https://api.cohere.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cohereKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: prompt,
      model: 'command-r-plus', // Using a more modern model
      preamble: "You are an expert resume analyzer. Respond ONLY with valid JSON.",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cohere API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.text || '';

  return parseJSONSafely(text);
}

// Helper to extract JSON from AI response
function parseJSONSafely(text: string): any {
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) throw new Error('No JSON found in response');
    
    const jsonString = text.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Failed to parse JSON: ' + error);
  }
}

// Local pattern-based dynamic analysis (fallback)
function generateLocalAnalysis(resumeText: string, apiLayerData: any): any {
  console.log('📊 Generating dynamic local analysis...');

  const text = resumeText.toLowerCase();
  
  // Dynamic Skills Extraction
  const allTechSkills = ['python', 'javascript', 'react', 'node.js', 'sql', 'html', 'css', 'java', 'c++', 'aws', 'docker', 'kubernetes', 'git', 'mongodb', 'postgresql', 'typescript', 'next.js', 'vue', 'angular', 'spring boot', 'django', 'flask', 'azure', 'gcp', 'linux'];
  const extractedSkills = allTechSkills.filter(skill => text.includes(skill));
  const missingTechSkills = allTechSkills.filter(skill => !text.includes(skill)).slice(0, 4);
  
  // Dynamic Experience Level & Profile Type
  let experienceLevel = 'Fresher';
  const isStudent = text.includes('10th') || text.includes('12th') || text.includes('pcmb') || text.includes('high school') || text.includes('class 10') || text.includes('class 12') || text.includes('cbse');
  
  if (isStudent) experienceLevel = 'Student';
  else if (text.includes('senior') || text.includes('10+ years') || text.includes('lead') || text.includes('manager') || text.includes('director')) experienceLevel = 'Expert';
  else if (text.includes('5-10 years') || text.includes('mid') || text.includes('intermediate') || text.includes('3 years') || text.includes('4 years')) experienceLevel = 'Intermediate';
  
  // Heuristic Scoring
  const hasMetrics = text.includes('%') || text.includes('$') || /\d+/.test(text);
  const hasActionVerbs = text.includes('spearheaded') || text.includes('orchestrated') || text.includes('engineered') || text.includes('optimized') || text.includes('achieved') || text.includes('awarded');
  
  const skills_score = Math.min(100, Math.max(40, extractedSkills.length * 7));
  const experience_score = experienceLevel === 'Expert' ? 95 : experienceLevel === 'Intermediate' ? 75 : experienceLevel === 'Student' ? 85 : 60;
  const formatting_score = (hasMetrics ? 15 : 0) + (hasActionVerbs ? 10 : 0) + 60;
  const ats_score = Math.round((skills_score + formatting_score) / 2);
  const total_score = Math.round((skills_score + experience_score + formatting_score + ats_score) / 4);

  // Dynamic Pros & Cons
  const strengths = isStudent ? ['Strong academic foundation highlighted'] : ['Strong keyword matching for core technologies'];
  if (hasMetrics) strengths.push('Excellent use of quantifiable metrics and data');
  if (hasActionVerbs) strengths.push('Strong action-oriented vocabulary');
  if (experienceLevel === 'Expert') strengths.push('Demonstrates clear leadership progression');

  const weaknesses = [];
  if (!hasMetrics) weaknesses.push('Lacks quantifiable achievements (missing %, grades, or specific numbers)');
  if (!hasActionVerbs) weaknesses.push('Overuse of passive vocabulary (e.g., "responsible for")');
  if (!isStudent && extractedSkills.length < 5) weaknesses.push('Sparse technical skill section detected');
  if (weaknesses.length === 0) weaknesses.push('Could further align summary with specific target roles');

  // Dynamic Interview Questions based on detected skills
  const questions = [];
  const answers = [];
  
  if (isStudent) {
    questions.push('What inspired you to choose the PCMB/Science stream?');
    questions.push('How do you balance board exam preparation with competitive entrance exams?');
    questions.push('What are your top 3 target universities and why?');
    answers.push('I have always been fascinated by problem-solving and the intersection of biology and technology, which makes PCMB the perfect foundation.');
    answers.push('I maintain a strict schedule, prioritizing conceptual clarity for boards while dedicating specific hours strictly to MCQ-based mock tests.');
    answers.push('I am aiming for top-tier institutes like IITs or AIIMS because of their research facilities and peer ecosystem.');
  } else {
    if (text.includes('react')) questions.push('Can you explain React hooks and how you manage complex state?');
    else if (text.includes('python')) questions.push('How do you optimize performance in Python applications?');
    else questions.push(`Describe a challenging project you built using your core skills.`);
    
    questions.push(`As a ${experienceLevel.toLowerCase()} professional, how do you handle cross-team collaboration?`);
    if (!hasMetrics) questions.push('Can you provide specific metrics for the impact of your past projects?');
    else questions.push('Describe the exact process you used to achieve the metrics listed on your resume.');

    answers.push('I focus on breaking down state into modular components and using contexts or Redux for global management.');
    answers.push('I prioritize active listening and setting clear expectations during stakeholder alignments.');
    answers.push('I document baseline performance before deploying changes, ensuring measurable improvements.');
  }

  // Generate roadmap based on profile type
  const roadmap = isStudent ? [
    {
      phase: "Academic Core Focus",
      duration: "11th Grade (1 Year)",
      title: "Master 11th Grade Fundamentals",
      strategy: "Build a strong conceptual foundation in core subjects. Start solving competitive exam modules (JEE/NEET) alongside the board syllabus to gain an early advantage.",
      milestones: ["Complete NCERT Phase 1", "Score 90%+ in 11th Midterms", "Solve 500+ JEE/NEET practice questions"]
    },
    {
      phase: "Competitive Prep",
      duration: "12th Grade (6 Months)",
      title: "Intensive Entrance Exam Preparation",
      strategy: "Transition to high-frequency mock tests. Identify weak subjects via test analysis and focus relentlessly on high-weightage topics.",
      milestones: ["Join Intensive Test Series", "Master Physics & Math high-weightage topics", "Achieve target percentile in monthly mocks"]
    },
    {
      phase: "Board Exams",
      duration: "12th Grade (Final 3 Months)",
      title: "Board Examination Excellence",
      strategy: "Shift focus slightly to descriptive answers, derivations, and NCERT mastery to secure 95%+ in the final board exams.",
      milestones: ["Finish sample papers for all subjects", "Master NCERT Exemplar problems", "Review past 10 years of board papers"]
    },
    {
      phase: "College Admission",
      duration: "Post-12th (3 Months)",
      title: "Counseling & University Selection",
      strategy: "Evaluate entrance scores, participate in counseling (JoSAA/State level), and finalize the optimal university for your advanced degree.",
      milestones: ["Finalize list of preferred colleges", "Submit all required admission documents", "Complete university orientation"]
    }
  ] : [
    {
      phase: "Foundation & Mastery",
      duration: "0-3 Months",
      title: `Master Advanced Patterns in ${extractedSkills[0] || 'Core Stack'}`,
      strategy: "Focus on deep-dive system design, memory management, and optimizing computational complexity within your primary tech stack.",
      milestones: ["Complete Advanced Design Patterns Course", "Refactor core module for 20% better performance", "Publish 1 technical deep-dive article"]
    },
    {
      phase: "Execution & Delivery",
      duration: "3-6 Months",
      title: "Lead a Cross-Functional Refactoring Project",
      strategy: "Identify technical debt, propose a scalable architectural solution, and coordinate with product/design teams to execute the migration.",
      milestones: ["Successfully merge architecture overhaul", "Reduce system latency by 15%", "Lead 3 high-impact code reviews"]
    },
    {
      phase: "Mentorship & Scaling",
      duration: "6-12 Months",
      title: "Establish Engineering Best Practices",
      strategy: "Mentor junior developers, enforce stringent CI/CD protocols, and introduce automated testing benchmarks across repositories.",
      milestones: ["Onboard 2 junior developers", "Implement 100% CI/CD coverage", "Standardize API documentation across teams"]
    },
    {
      phase: "Strategic Authority",
      duration: "1-2 Years",
      title: "Open Source & High-Level Architecture",
      strategy: "Contribute to major open-source frameworks or dictate core business-level technical strategies. Publish architectural teardowns.",
      milestones: ["Become a core contributor to an OS project", "Design and launch a multi-region system", "Speak at a major tech conference"]
    }
  ];

  return {
    score_report: {
      total_score,
      breakdown: {
        skills: skills_score,
        experience: experience_score,
        formatting: formatting_score,
        ats_compatibility: ats_score,
      },
      ats_check: {
        status: ats_score > 80 ? 'Excellent' : ats_score > 60 ? 'Good' : 'Critical',
        missing_keywords: isStudent ? ['Leadership', 'Extracurriculars', 'Olympiads'] : (missingTechSkills.length > 0 ? missingTechSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)) : ['System Architecture', 'CI/CD Automation']),
        optimization_tips: [
          !hasMetrics ? 'CRITICAL: Add quantifiable metrics (e.g., Grades, Percentages, Rank).' : 'Maintain high density of impact-driven metrics.',
          !hasActionVerbs ? 'Upgrade passive verbs to active verbs (e.g., Awarded, Achieved, Led).' : 'Action verbs detected; ensure they map directly to achievements.',
          'Format standard headers clearly to ensure parser accuracy.',
        ],
      },
    },
    professional_profile: {
      experience_level: experienceLevel,
      detected_role: isStudent ? 'High School Student / Aspirant' : (apiLayerData?.job_title || (extractedSkills.includes('react') ? 'Frontend Developer' : 'Software Professional')),
      strengths: strengths,
      weaknesses: weaknesses,
      grammar_check: 'Clean',
      action_verb_fixes: [
        { original: 'Responsible for', suggested: isStudent ? 'Participated in' : 'Spearheaded' },
        { original: 'Worked on', suggested: isStudent ? 'Studied' : 'Engineered' },
      ],
    },
    skill_intelligence: {
      extracted_skills: isStudent ? ['Mathematics', 'Science', 'Analytical Thinking'] : (extractedSkills.length > 0 ? extractedSkills : ['General Programming', 'Problem Solving']),
      skill_gaps: isStudent ? ['Advanced Coding', 'Public Speaking'] : missingTechSkills,
      job_match_percentage: Math.round(skills_score * 0.9),
      visual_data: {
        labels: isStudent ? ['Academics', 'Aptitude', 'Extracurriculars', 'Clarity'] : ['Technical Base', 'Impact Delivery', 'Modern Stacks', 'Parsing Sync'],
        values: [skills_score, formatting_score, Math.min(100, extractedSkills.length * 10), ats_score],
      },
    },
    section_feedback: {
      education: 'Academic details parsed successfully. Ensure graduation dates are clear.',
      skills: isStudent ? 'Highlight subject proficiencies and soft skills.' : `Detected ${extractedSkills.length} core technologies. Group them by domain for ATS ranking.`,
      experience: experienceLevel === 'Fresher' || isStudent ? 'Focus on academic projects, olympiads, and internships.' : 'Good timeline structure detected. Keep bullets under 2 lines.',
      formatting: hasMetrics ? 'Data-driven impact found. Strong formatting.' : 'Standard layout, but needs more bold data points.',
    },
    career_growth: {
      prediction: isStudent ? 'Trajectory aligned for Top Tier Engineering/Medical Universities based on current momentum.' : `Trajectory aligned for ${experienceLevel === 'Expert' ? 'Staff/Principal Engineer' : 'Senior Roles'} within 24 months.`,
      roadmap: roadmap,
      recommended_courses: isStudent ? [
        { title: "Advanced Calculus & Mechanics", duration: "12 Weeks", level: "Academic" },
        { title: "Competitive Problem Solving Strategies", duration: "8 Weeks", level: "Entrance Prep" },
        { title: "Time Management for Students", duration: "2 Weeks", level: "Self-Improvement" }
      ] : [
        { title: "Advanced System Design Mastery", duration: "8 Weeks", level: "Expert" },
        { title: "Engineering Leadership Practicum", duration: "4 Weeks", level: "Intermediate" },
        { title: "Cloud-Native Scalability Patterns", duration: "6 Weeks", level: "Advanced" }
      ],
      suggested_projects: isStudent ? [
        { title: "Participate in National Science Olympiad", duration: "Academic Year", complexity: "High" },
        { title: "Build a foundational code/robotics project", duration: "1 Month", complexity: "Beginner" }
      ] : [
        { title: "Architect a distributed microservices platform", duration: "3 Months", complexity: "High" },
        { title: "Build a real-time event-streaming pipeline", duration: "2 Months", complexity: "Medium" }
      ],
      certifications: isStudent ? ['NTSE Scholar', 'KVPY Fellow'] : ['AWS Solutions Architect', 'CKAD / Kubernetes Developer'],
    },
    online_presence: {
      linkedin_tips: isStudent ? [
        'Create a student LinkedIn profile highlighting academic achievements.',
        'Connect with alumni from your target universities.',
      ] : [
        'Sync your top skills from this resume directly into your LinkedIn "Skills" section.',
        'Request 2 recommendations that highlight your work ethic.',
      ],
      portfolio_suggestions: isStudent ? [
        'Maintain a digital portfolio of science fair projects and certificates.',
      ] : [
        'Add a highly technical README to your top pinned GitHub repo.',
        'Deploy a live version of your best project and link it.',
      ],
      github_critique: isStudent ? 'Consider starting a GitHub profile to track early coding projects.' : 'Ensure your pinned repositories have recent commits to show active learning.',
    },
    interview_kit: {
      likely_questions: questions,
      ai_suggested_answers: answers,
    },
    one_click_improvements: [
      {
        section: 'Summary',
        original_text: 'I am a 10th grade student.',
        improved_text: `Highly motivated high school student with a strong aptitude for sciences, aiming to pursue excellence in higher education.`,
      },
    ],
  };
}

function buildAnalysisPrompt(resumeText: string, apiLayerData: any, jobDescription: string): string {
  return `
Perform an ELITE 32-POINT CAREER AUDIT on the following resume. 

${jobDescription ? `CRITICAL CONTEXT - TARGET JOB:
"${jobDescription}"
Analyze for direct alignment, technical gap overlap, and relevance indexing.` : "General high-level executive career audit."}

STRUCTURAL GROUND TRUTH (FROM PARSER):
${apiLayerData ? JSON.stringify(apiLayerData) : "No structural metadata available"}

RAW SEMANTIC CONTENT:
${resumeText}

ANALYSIS REQUIREMENTS:
1. QUANTIFIABLE IMPACT: Identify if the user uses metrics (%, $, time). If not, suggest specific ways to add them.
2. ATS BENCHMARKING: Cross-reference with standard ATS filtering patterns.
3. EXECUTIVE PRESENCE: Evaluate the tone for leadership and initiative.
4. ACTION VERB UPGRADE: Replace all passive "responsible for" style phrases with "orchestrated", "engineered", etc.
5. SKILL INTELLIGENCE: Group skills into Tech, Soft, Leadership, and Domain.
6. CAREER ROADMAP: First, calculate the exact total duration from the user's CURRENT state to their TARGET goal. Then, divide that specific total duration into a complete, highly accurate 4-step progressive timeline. Each phase must show its exact duration block (e.g., 0-6 Months, 11th Grade, etc.) based on the total calculated time, accompanied by deep tactical strategies and specific key milestones.
7. ADAPTABILITY: If the resume belongs to a High School Student (e.g., 10th/12th grade, PCMB), adapt the ENTIRE JSON to focus on academic progression, entrance exams (JEE/NEET), and college admissions instead of corporate jobs. The roadmap MUST reflect academic durations (e.g., 11th Grade, 12th Grade).

REQUIRED JSON OUTPUT SCHEMA:
{
  "score_report": {
    "total_score": number (0-100),
    "breakdown": { "skills": number, "experience": number, "formatting": number, "ats_compatibility": number },
    "ats_check": { "status": "Excellent" | "Good" | "Critical", "missing_keywords": [string], "optimization_tips": [string] }
  },
  "professional_profile": {
    "experience_level": "Fresher" | "Intermediate" | "Expert" | "Student",
    "detected_role": string,
    "strengths": [string],
    "weaknesses": [string],
    "grammar_check": "Clean" | "Needs Improvement",
    "action_verb_fixes": [{"original": string, "suggested": string}]
  },
  "skill_intelligence": {
    "extracted_skills": [string],
    "skill_gaps": [string],
    "job_match_percentage": number,
    "visual_data": { "labels": [string], "values": [number] }
  },
  "section_feedback": { "education": string, "skills": string, "experience": string, "formatting": string },
  "career_growth": {
    "prediction": "string",
    "roadmap": [
      {
        "phase": "string",
        "duration": "string",
        "title": "string",
        "strategy": "string",
        "milestones": [string]
      }
    ],
    "recommended_courses": [{"title": "string", "duration": "string", "level": "string"}],
    "suggested_projects": [{"title": "string", "duration": "string", "complexity": "string"}],
    "certifications": [string]
  },
  "online_presence": { "linkedin_tips": [string], "portfolio_suggestions": [string], "github_critique": string },
  "interview_kit": { "likely_questions": [string], "ai_suggested_answers": [string] },
  "one_click_improvements": [{"section": string, "original_text": string, "improved_text": string}]
}

IMPORTANT: Respond with valid JSON ONLY. No preamble or markdown markers.`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string || ""
    
    if (!file) return NextResponse.json({ success: false, error: 'No resume file provided' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // 1. Structural Intelligence (APILayer)
    // This provides a high-accuracy baseline of the resume's technical structure
    let apiLayerData = null
    const apiKey = process.env.RESUME_ANALYZER_KEY;

    if (apiKey) {
      try {
        console.log('📡 Fetching Structural Data from APILayer...')
        const response = await fetch("https://api.apilayer.com/resume_parser/upload", {
          method: 'POST',
          headers: { 
            "apikey": apiKey,
            "Content-Type": "application/octet-stream" 
          },
          body: buffer
        })
        
        if (response.ok) {
          apiLayerData = await response.json()
          console.log('✅ Structural Analysis complete.')
        } else {
          console.warn('⚠️ APILayer structural parsing skipped (Status:', response.status, ')')
        }
      } catch (e: any) {
        console.warn('⚠️ APILayer integration failed:', e.message)
      }
    }

    // 2. High-Fidelity Text Extraction
    let resumeText = ""
    try {
      const pdfData = await PdfParse(buffer)
      resumeText = pdfData.text?.trim()
    } catch (e: any) {
      console.warn('⚠️ PDF-Parse extraction failed, falling back to basic conversion...')
      resumeText = buffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, '') // Basic fallback
    }

    if (!resumeText || resumeText.length < 50) {
      throw new Error('Resume content is too sparse or unreadable for a deep audit.')
    }

    // 3. Neural Synthesis (AI Multi-Engine)
    // We limit text to 18,000 chars to avoid token overflow while preserving deep context
    const analysisData = await analyzeResumeWithAI(
      resumeText.substring(0, 18000), 
      apiLayerData, 
      jobDescription
    );

    // 4. Advanced Score Weighting
    // We merge structural precision with semantic depth
    if (apiLayerData && analysisData.score_report) {
      // If APILayer found fewer skills than expected, we slightly penalize the ATS score
      const structuralQuality = (apiLayerData.skills?.length || 0) > 5 ? 1 : 0.9;
      analysisData.score_report.total_score = Math.round(analysisData.score_report.total_score * structuralQuality);
    }

    return NextResponse.json({ 
      success: true, 
      data: analysisData,
      metadata: {
        engine: "Neural-Sync v2.1",
        structural_verified: !!apiLayerData,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ Advanced Audit Critical Failure:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'The neural audit encountered a critical processing error.' 
    }, { status: 500 })
  }
}
