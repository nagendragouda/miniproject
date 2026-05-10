/**
 * Hugging Face Integration for AI-Powered Career Predictions
 * Uses embeddings and NLP models for better accuracy
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models'
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || ''

interface HFEmbeddingResponse {
  embeddings?: number[][]
  error?: string
}

interface HFAnalysisResponse {
  scores?: Array<{ label: string; score: number }>
  error?: string
}

/**
 * Get text embeddings from Hugging Face (for semantic similarity)
 * Model: sentence-transformers/all-MiniLM-L6-v2
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    if (!HF_API_KEY || HF_API_KEY === 'hf_your_token_here') {
      console.warn('⚠️  Hugging Face API key not configured. Using local embeddings.')
      return texts.map(() => generateFakeEmbedding())
    }

    const response = await fetch(`${HF_API_URL}/sentence-transformers/all-MiniLM-L6-v2`, {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      method: 'POST',
      body: JSON.stringify({ inputs: texts }),
      timeout: 10000
    })

    if (!response.ok) {
      console.error(`❌ HF API Error: ${response.status}`)
      return texts.map(() => generateFakeEmbedding())
    }

    const data: HFEmbeddingResponse = await response.json()
    if (data.embeddings) {
      return data.embeddings
    }

    console.warn('⚠️  No embeddings returned. Using fallback.')
    return texts.map(() => generateFakeEmbedding())
  } catch (error) {
    console.error('❌ Embedding fetch failed:', error)
    return texts.map(() => generateFakeEmbedding())
  }
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    return 0
  }

  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    magnitude1 += vec1[i] * vec1[i]
    magnitude2 += vec2[i] * vec2[i]
  }

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * Analyze user text for career-relevant keywords and traits
 * Uses zero-shot classification
 */
export async function analyzeCareerTraits(userText: string): Promise<Record<string, number>> {
  try {
    if (!HF_API_KEY || HF_API_KEY === 'hf_your_token_here') {
      console.warn('⚠️  HF API not configured. Using keyword matching.')
      return analyzeTraitsLocally(userText)
    }

    const candidateLabels = [
      'technical skills',
      'creative abilities',
      'business acumen',
      'leadership qualities',
      'analytical thinking',
      'communication skills',
      'problem solving',
      'entrepreneurship',
      'teamwork',
      'independent work'
    ]

    const response = await fetch(`${HF_API_URL}/facebook/bart-large-mnli`, {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      method: 'POST',
      body: JSON.stringify({
        inputs: userText,
        parameters: { candidate_labels: candidateLabels, multi_class: true }
      }),
      timeout: 10000
    })

    if (!response.ok) {
      console.error(`❌ HF Classification failed: ${response.status}`)
      return analyzeTraitsLocally(userText)
    }

    const data: HFAnalysisResponse = await response.json()
    const traitScores: Record<string, number> = {}

    if (data.scores) {
      data.scores.forEach(({ label, score }) => {
        traitScores[label] = Math.round(score * 10) // Convert to 0-10 scale
      })
    }

    return traitScores
  } catch (error) {
    console.error('❌ Trait analysis failed:', error)
    return analyzeTraitsLocally(userText)
  }
}

/**
 * Local trait analysis (fallback when HF API unavailable)
 */
function analyzeTraitsLocally(text: string): Record<string, number> {
  const lowerText = text.toLowerCase()
  const traits: Record<string, number> = {
    'technical skills': 0,
    'creative abilities': 0,
    'business acumen': 0,
    'leadership qualities': 0,
    'analytical thinking': 0,
    'communication skills': 0,
    'problem solving': 0,
    'entrepreneurship': 0,
    'teamwork': 0,
    'independent work': 0
  }

  // Technical keywords
  if (/\b(code|python|java|ai|ml|programming|software|development|tech|tech)\b/i.test(text)) {
    traits['technical skills'] += 7
  }

  // Creative keywords
  if (/\b(design|creative|art|innovation|build|imagine|ui|ux|visual)\b/i.test(text)) {
    traits['creative abilities'] += 7
  }

  // Business keywords
  if (/\b(business|startup|money|profit|sales|marketing|growth|strategy)\b/i.test(text)) {
    traits['business acumen'] += 7
  }

  // Leadership keywords
  if (/\b(lead|manage|organize|team|control|influence|decision)\b/i.test(text)) {
    traits['leadership qualities'] += 7
  }

  // Analytical keywords
  if (/\b(analyze|logic|data|statistics|pattern|research|study|complex)\b/i.test(text)) {
    traits['analytical thinking'] += 7
  }

  // Communication keywords
  if (/\b(communication|speak|present|write|talk|express|explain)\b/i.test(text)) {
    traits['communication skills'] += 7
  }

  // Problem-solving keywords
  if (/\b(solve|problem|challenge|fix|improve|optimize)\b/i.test(text)) {
    traits['problem solving'] += 7
  }

  // Entrepreneurship keywords
  if (/\b(startup|venture|own|entrepreneur|risk|venture|business)\b/i.test(text)) {
    traits['entrepreneurship'] += 7
  }

  // Teamwork keywords
  if (/\b(team|group|collaboration|together|cooperative|work together)\b/i.test(text)) {
    traits['teamwork'] += 7
  }

  // Independent work keywords
  if (/\b(independent|alone|solo|self|autonomous|individual)\b/i.test(text)) {
    traits['independent work'] += 7
  }

  return traits
}

/**
 * Generate fake embeddings for fallback (deterministic, not random)
 * Used when HF API is unavailable
 */
function generateFakeEmbedding(): number[] {
  // Return a simple embedding vector (384 dimensions to match MiniLM)
  const embedding: number[] = []
  for (let i = 0; i < 384; i++) {
    embedding.push(Math.sin(i) * 0.1)
  }
  return embedding
}

/**
 * Batch compare user profile with career descriptions using semantic similarity
 */
export async function getSemanticCareerMatches(
  userProfile: string,
  careerDescriptions: Array<{ name: string; description: string }>
): Promise<Array<{ career: string; similarity: number }>> {
  try {
    // Get embeddings for user profile and all careers
    const allTexts = [userProfile, ...careerDescriptions.map((c) => c.description)]
    const embeddings = await getEmbeddings(allTexts)

    const userEmbedding = embeddings[0]
    const careerMatches: Array<{ career: string; similarity: number }> = []

    careerDescriptions.forEach((career, index) => {
      const careerEmbedding = embeddings[index + 1]
      const similarity = cosineSimilarity(userEmbedding, careerEmbedding)
      careerMatches.push({
        career: career.name,
        similarity: Math.round(similarity * 100) // Convert to percentage
      })
    })

    return careerMatches.sort((a, b) => b.similarity - a.similarity)
  } catch (error) {
    console.error('❌ Semantic matching failed:', error)
    return []
  }
}

/**
 * Extract NLP entities from user input (skills, interests, etc.)
 */
export async function extractEntities(
  text: string
): Promise<{ skills: string[]; interests: string[]; traits: string[] }> {
  try {
    if (!HF_API_KEY || HF_API_KEY === 'hf_your_token_here') {
      return extractEntitiesLocally(text)
    }

    const response = await fetch(
      `${HF_API_URL}/dslim/bert-base-multilingual-cased-ner-hrl`,
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: 'POST',
        body: JSON.stringify({ inputs: text }),
        timeout: 10000
      }
    )

    if (!response.ok) {
      return extractEntitiesLocally(text)
    }

    const data = await response.json()
    return extractEntitiesLocally(text) // Fallback to local for now
  } catch (error) {
    console.error('❌ Entity extraction failed:', error)
    return extractEntitiesLocally(text)
  }
}

/**
 * Local entity extraction (fallback)
 */
function extractEntitiesLocally(text: string): { skills: string[]; interests: string[]; traits: string[] } {
  const lowerText = text.toLowerCase()
  const skills: Set<string> = new Set()
  const interests: Set<string> = new Set()
  const traits: Set<string> = new Set()

  // Common skill keywords
  const skillKeywords = [
    'python',
    'java',
    'javascript',
    'communication',
    'leadership',
    'data analysis',
    'project management',
    'design',
    'seo',
    'marketing'
  ]
  skillKeywords.forEach((skill) => {
    if (lowerText.includes(skill)) {
      skills.add(skill)
    }
  })

  // Common interest keywords
  const interestKeywords = [
    'technology',
    'business',
    'arts',
    'science',
    'sports',
    'music',
    'gaming',
    'writing',
    'photography',
    'entrepreneurship'
  ]
  interestKeywords.forEach((interest) => {
    if (lowerText.includes(interest)) {
      interests.add(interest)
    }
  })

  // Personality traits
  const traitKeywords = [
    'creative',
    'analytical',
    'problem-solver',
    'team player',
    'independent',
    'passionate',
    'ambitious',
    'organized'
  ]
  traitKeywords.forEach((trait) => {
    if (lowerText.includes(trait)) {
      traits.add(trait)
    }
  })

  return {
    skills: Array.from(skills),
    interests: Array.from(interests),
    traits: Array.from(traits)
  }
}

/**
 * Enhanced score calculation using HF semantic similarity
 */
export async function calculateEnhancedScore(
  userProfile: string,
  careerRequirements: string
): Promise<number> {
  try {
    const embeddings = await getEmbeddings([userProfile, careerRequirements])
    const similarity = cosineSimilarity(embeddings[0], embeddings[1])
    return Math.round(similarity * 100)
  } catch (error) {
    console.error('❌ Score calculation failed:', error)
    return 0
  }
}
