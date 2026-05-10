import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AIs
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');

const SHARED_PROMPT = (query: string, location: string, type: string, level: string, stream: string) => `
You are an expert Indian college and institution recommendation engine with deep knowledge of India's education system.

### USER PARAMETERS:
- Location: ${location || 'India (any state)'}
- Institution Type: ${type || 'Any (Government, Private, or Deemed)'}
- Education Level: ${level || 'Graduation'}
- Academic Stream / Interest: ${stream || 'General'}
- Additional Preferences: ${query || 'None'}

### EDUCATION LEVEL INTERPRETATION — Follow these rules strictly:

${level === '10th' ? `
- The user has completed 10th standard (SSLC/Matriculation).
- Recommend PRE-UNIVERSITY COLLEGES (PUC), JUNIOR COLLEGES, or HIGHER SECONDARY SCHOOLS that offer 11th and 12th grade.
- Focus on institutions offering Science, Commerce, or Arts streams for +2 education.
- Examples: PU Colleges, Junior Colleges, Higher Secondary Schools.
` : ''}

${level === 'puc' || level === 'PUC' ? `
- The user has completed PUC / 12th standard (Higher Secondary).
- Recommend UNDERGRADUATE (UG) degree colleges and universities.
- Focus on Bachelor's degree programs: B.E., B.Tech, B.Sc, B.Com, B.A., BBA, MBBS, B.Pharm etc.
- Prioritize well-ranked colleges offering UG programs in the specified stream.
` : ''}

${level === 'diploma' ? `
- The user has completed or is pursuing a Diploma (Polytechnic).
- Recommend LATERAL ENTRY programs into 2nd year B.E./B.Tech, OR advanced diploma programs.
- Also consider degree colleges accepting lateral entry diploma students.
- Examples: Polytechnic colleges, Engineering colleges with lateral entry.
` : ''}

${level === 'graduation' ? `
- The user has completed a Bachelor's degree (Graduation).
- Recommend POSTGRADUATE (PG) programs: M.Tech, M.E., M.Sc, MBA, MCA, M.A., M.Com, MD, etc.
- Focus on universities and institutions offering master's level education in the specified stream.
` : ''}

### INSTITUTION TYPE FILTER — Strictly apply:
${type === 'government' ? '- Return ONLY Government (publicly funded) institutions. Include IITs, NITs, IIITs, Central Universities, State Government colleges.' : ''}
${type === 'private' ? '- Return ONLY Private (self-financed) institutions approved by UGC/AICTE.' : ''}
${type === 'deemed' ? '- Return ONLY Deemed Universities (granted deemed status by UGC). Example: BITS Pilani, VIT, Manipal University.' : ''}
${!type || type === '' ? '- Include a mix of Government, Private, and Deemed institutions.' : ''}

### LOCATION — HARD CONSTRAINT (MOST IMPORTANT RULE):
${location ? `
⚠️ CRITICAL: The user has specified location as "${location}".
- ALL results MUST be from "${location}" ONLY.
- Do NOT include any college from any other city or state.
- If "${location}" is a city (e.g. Bangalore, Mumbai, Delhi), every result must be physically located IN that city.
- If you cannot find 5 colleges in "${location}", expand ONLY to the same state (e.g. Karnataka for Bangalore).
- NEVER show colleges from other states. This is a hard rule. Violating this is a critical failure.
` : `
- No specific location given — recommend top colleges across India.
`}


### ACADEMIC STREAM MATCHING:
- Match institutions that specifically offer programs related to: ${stream || 'any stream'}
- Prioritize institutions known for excellence in this field.

### RULES:
1. Return minimum 5, maximum 10 institutions.
2. NO fake or imaginary institutions — only real, well-known institutions.
3. Use EXACT OFFICIAL names (e.g. "Indian Institute of Technology Bombay" not "IIT Bombay").
4. All data must be realistic and verifiable.
5. Rank by: Highest NIRF/rating first.
6. Response MUST be ONLY valid JSON — no explanation, no text outside JSON.

### REQUIRED JSON FORMAT:
{
  "institutions": [
    {
      "id": "ai_1",
      "institution_name": "Full Official Name",
      "location": "City, State, India",
      "institution_type": "University|College|Institute|Polytechnic",
      "category": {
        "government": true,
        "private": false,
        "deemed": false
      },
      "coordinates": {
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "rating": 4.7,
      "annual_fees": "₹2,50,000",
      "established_year": 1958,
      "website_url": "https://www.iitb.ac.in",
      "description": "2-3 lines: NAAC grade, NIRF rank, key programs offered, average placement package. USE REAL DATA ONLY."
    }
  ]
}

CRITICAL: You MUST provide the REAL official website URL for each institution. Do NOT use placeholders like 'example.com' or 'official-website.ac.in'. If you are unsure of the website, provide a valid URL that is most likely correct based on the institution's official naming convention (usually .ac.in or .edu.in).

Return ONLY the JSON. No extra text.
`;


function cleanJSON(text: string): any {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Attempt to extract JSON if there's surrounding text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    // Advanced cleaning: remove trailing commas in arrays/objects
    cleaned = cleaned.replace(/,\s*([\]\}])/g, '$1');
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Neural parsing failure:', text);
    throw new Error('Neural engine returned unparsable intelligence');
  }
}

// AI Provider 1: Gemini
async function fetchWithGemini(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error('Gemini returned empty response');
    const data = cleanJSON(text);
    return data.institutions || [];
  } catch (error: any) {
    console.error('Gemini Provider Error:', error.message);
    throw error;
  }
}

// AI Provider 2: Cohere
async function fetchWithCohere(prompt: string, apiKey: string) {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: prompt,
        model: 'command-r',
        temperature: 0.3,
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Cohere failed');
    const result = cleanJSON(data.text);
    return result.institutions || [];
  } catch (error: any) {
    console.error('Cohere Provider Error:', error.message);
    throw error;
  }
}

// AI Provider 3: OpenRouter (Llama 3)
async function fetchWithOpenRouter(prompt: string, apiKey: string) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'OpenRouter failed');
    const result = JSON.parse(data.choices[0].message.content);
    return result.institutions || [];
  } catch (error: any) {
    console.error('OpenRouter Provider Error:', error.message);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { query, location, type, level, stream } = await req.json();

    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const cohereKey = process.env.COHERE_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!geminiKey && !cohereKey && !openRouterKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Neural engine configuration missing. Please set your API keys.' 
      }, { status: 500 });
    }

    const prompt = SHARED_PROMPT(query, location, type, level, stream);
    
    // Execute Triple AI Race
    const promises: Promise<any[]>[] = [];
    if (geminiKey) promises.push(fetchWithGemini(prompt));
    if (cohereKey) promises.push(fetchWithCohere(prompt, cohereKey));
    if (openRouterKey) promises.push(fetchWithOpenRouter(prompt, openRouterKey));

    console.log(`[AI Synthesis] Running Triple AI race with ${promises.length} engines...`);

    const results = await Promise.allSettled(promises);
    
    // Merge and de-duplicate results
    const allInstitutions: any[] = [];
    results.forEach((res) => {
      if (res.status === 'fulfilled') {
        allInstitutions.push(...res.value);
      }
    });

    if (allInstitutions.length === 0) {
      throw new Error('All neural engines failed to synthesize results');
    }

    // De-duplicate by institution name (case-insensitive)
    const uniqueMap = new Map();
    allInstitutions.forEach(inst => {
      const key = inst.institution_name.toLowerCase().trim();
      if (!uniqueMap.has(key) || Number(inst.rating) > Number(uniqueMap.get(key).rating)) {
        uniqueMap.set(key, inst);
      }
    });

    let finalList = Array.from(uniqueMap.values())
      .sort((a, b) => Number(b.rating) - Number(a.rating));

    let locationExact = true;
    let locationFallbackMsg = '';

    // ── SERVER-SIDE LOCATION ENFORCEMENT ──
    if (location && location.trim()) {
      const loc = location.trim().toLowerCase();
      const exactMatches = finalList.filter(inst =>
        (inst.location || '').toLowerCase().includes(loc)
      );

      if (exactMatches.length > 0) {
        // Exact city matches found — use them
        finalList = exactMatches;
        locationExact = true;
        console.log(`[Location Filter] Exact: ${exactMatches.length} colleges in "${location}"`);
      } else {
        // ── ZERO EXACT MATCHES → Re-ask AI for nearby areas ──
        locationExact = false;
        locationFallbackMsg = `No colleges found directly in "${location}". Showing nearby institutions from the same region.`;
        console.log(`[Location Filter] Zero matches for "${location}", fetching nearby fallback...`);

        const nearbyPrompt = `
You are a college recommendation engine.
The user searched for colleges in "${location}" but there are no colleges there.
Find the 5 to 8 NEAREST colleges to "${location}" in the surrounding region or state.
Match these preferences:
- Education Level: ${level || 'Graduation'}
- Stream: ${stream || 'Any'}
- Type: ${type || 'Any'}
Return ONLY valid JSON in this format:
{
  "institutions": [
    {
      "id": "ai_nearby_1",
      "institution_name": "Full Official Name",
      "location": "City, State, India",
      "institution_type": "University",
      "category": { "government": false, "private": true, "deemed": false },
      "coordinates": { "latitude": 0, "longitude": 0 },
      "rating": 4.5,
      "annual_fees": "₹1,50,000",
      "established_year": 2000,
      "website_url": "https://example.ac.in",
      "description": "Brief description with NAAC grade and key strengths."
    }
  ]
}
Return ONLY the JSON.
`;
        try {
          const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
          if (geminiKey) {
            const nearbyResults = await fetchWithGemini(nearbyPrompt);
            if (nearbyResults.length > 0) {
              finalList = nearbyResults;
            }
          }
        } catch (e) {
          console.error('Nearby fallback failed:', e);
        }
      }
    }

    const mapInstitution = (inst: any, idx: number) => ({
      id: inst.id || `ai_${Date.now()}_${idx}`,
      institution_name: inst.institution_name || inst.name || 'Unknown Institution',
      location: inst.location || '',
      institution_type: inst.institution_type || inst.type || 'University',
      annual_fees: inst.annual_fees || inst.fees || '₹1,50,000',
      established_year: Number(inst.established_year || inst.established) || 1990,
      website_url: inst.website_url || inst.website || '#',
      description: inst.description || 'Premier institution with strong academic record.',
      rating: Number(inst.rating) || 4.5,
      coordinates: {
        latitude: Number(inst.coordinates?.latitude) || 0,
        longitude: Number(inst.coordinates?.longitude) || 0,
      },
      category: inst.category || { government: false, private: true, deemed: false },
    });

    const finalInstitutions = finalList.slice(0, 10).map(mapInstitution);

    return NextResponse.json({ 
      success: true, 
      recommendations: finalInstitutions,
      location_exact: locationExact,
      location_fallback_message: locationFallbackMsg,
      engine_count: promises.length,
      successful_engines: results.filter(r => r.status === 'fulfilled').length
    });
  } catch (error: any) {
    console.error('Multi-AI Synthesis Error:', error);
    return NextResponse.json({ success: false, error: `Synthesis failed: ${error.message}` }, { status: 500 });
  }
}
