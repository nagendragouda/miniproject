# 🚀 Dual AI Roadmap Generator - Gemini + OpenRouter

## Overview

The career roadmap generator now uses **dual AI providers** with intelligent fallback:

1. **Primary**: Google Gemini API
2. **Secondary**: OpenRouter AI  
3. **Fallback**: Professional template roadmap

This ensures roadmaps are **always generated**, even if both AI services fail.

## Architecture

```
User clicks "Generate Your Map"
    ↓
[Request to /api/generate-roadmap]
    ↓
├─ Try Gemini API ✓
│  └─ If success → Return AI-generated roadmap (source: "gemini")
│     If fail ↓
├─ Try OpenRouter API ✓
│  └─ If success → Return AI-generated roadmap (source: "openrouter")
│     If fail ↓
└─ Use Template ✓
   └─ Return professional template roadmap (source: "template")
```

## Configuration

### API Keys Required

Add to `.env.local`:

```env
# Google Gemini API
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# OpenRouter AI (your key)
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
```

## API Endpoints

### GET /api/generate-roadmap

**Request** (POST):
```json
{
  "current_education": "High School",
  "predicted_path": "Software Engineering",
  "interests": ["AI", "Web Development"],
  "current_skills": ["JavaScript", "Python"],
  "skill_gaps": ["Advanced AI", "DevOps"],
  "subjects": ["Machine Learning", "System Design"]
}
```

**Response**:
```json
{
  "success": true,
  "roadmap": {
    "title": "Path to Software Engineering",
    "duration": "1-2 years",
    "description": "...",
    "skills_required": [...],
    "current_skills": [...],
    "missing_skills": [...],
    "tasks": [...],
    "resources": [...],
    "timeline": { "short_term": "...", "mid_term": "...", "long_term": "..." },
    "projects": [...],
    "tools": [...],
    "mistakes_to_avoid": [...],
    "outcome": "...",
    "progress": "...",
    "priority": "High",
    "ai_suggestions": [...],
    "extra_skills": [...],
    "notes": [...]
  },
  "generatedAt": "2026-04-27T10:30:00Z",
  "source": "gemini" | "openrouter" | "template"
}
```

## Advanced Features

### 1. **Dual AI Provider Logic**

```typescript
// Try Gemini first
if (geminiKey) {
  roadmapData = await generateWithGemini(body, geminiKey)
  if (roadmapData) source = 'gemini'
}

// Try OpenRouter if Gemini fails
if (!roadmapData && openrouterKey) {
  roadmapData = await generateWithOpenRouter(body, openrouterKey)
  if (roadmapData) source = 'openrouter'
}

// Use template as final fallback
if (!roadmapData) {
  roadmapData = getTemplateRoadmap(body)
}
```

### 2. **Smart Prompting**

Both providers use:
- Temperature: 0.6 (balanced creativity)
- Max tokens: 4096 (comprehensive responses)
- Structured JSON output
- Error-resistant JSON parsing

### 3. **Roadmap Structure**

Each roadmap includes:

| Section | Purpose |
|---------|---------|
| **Tasks** | Step-by-step action items with timelines |
| **Projects** | Real-world projects (Beginner → Advanced) |
| **Skills** | Required, current, and missing skills |
| **Timeline** | Short/mid/long-term milestones |
| **Resources** | Learning materials and courses |
| **Tools** | Recommended software and platforms |
| **Mistakes** | Common pitfalls to avoid |
| **Suggestions** | AI-powered recommendations |
| **Notes** | General guidance and motivation |

## UI Integration

### Toast Messages

The app shows different messages based on source:

```typescript
// Gemini
"🎯 AI Roadmap generated with Gemini! "

// OpenRouter
"🚀 AI Roadmap generated with OpenRouter! "

// Template
"✓ Professional roadmap template loaded! "
```

### Component Display

The `RoadmapDisplay` component renders:
- Animated cards with Framer Motion
- Color-coded sections (Cyan, Amber, Fuchsia, Emerald, Rose)
- Priority badges
- Difficulty indicators
- Timeline visualization

## Error Handling

### Error Recovery Layers

1. **API Key Check** → Use template if no keys
2. **API Failure** → Try next provider
3. **JSON Parse Error** → Try template
4. **Network Error** → Template fallback
5. **Unknown Error** → Always return template

### Logging

Errors logged to console:
```
Trying Gemini API...
✓ Generated with Gemini
```

Or:
```
Trying Gemini API...
Trying OpenRouter API...
✓ Generated with OpenRouter
```

Or:
```
Trying Gemini API...
Trying OpenRouter API...
Using template roadmap
```

## Usage

### From Career Result Page
```typescript
const response = await fetch('/api/generate-roadmap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(roadmapRequest),
})

const data = await response.json()
if (data.success) {
  setRoadmap(data.roadmap)
  // Show source in UI
  console.log('Generated with:', data.source)
}
```

### From Career Roadmap Page
```typescript
const generateRoadmap = useCallback(async () => {
  const roadmapRequest = {
    current_education: profileData.education_level,
    predicted_path: 'Next Academic Milestone',
    interests: profileData.interests || [],
    current_skills: profileData.skills || [],
    skill_gaps: profileData.gap?.missingSkills || [],
    subjects: profileData.gap?.improvementAreas || [],
  }

  const response = await fetch('/api/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roadmapRequest),
  })

  const data = await response.json()
  if (data.success && data.roadmap) {
    setRoadmap(data.roadmap)
    toast.success(`Generated with ${data.source}!`)
  }
}, [profileData])
```

## Testing

### Quick Test

```bash
curl -X POST http://localhost:3001/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "current_education": "High School",
    "predicted_path": "Software Engineering",
    "interests": ["AI"],
    "current_skills": ["Python"],
    "skill_gaps": ["DevOps"],
    "subjects": ["System Design"]
  }'
```

### Expected Response

```json
{
  "success": true,
  "source": "gemini",
  "roadmap": { ... },
  "generatedAt": "2026-04-27T10:30:00Z"
}
```

## Performance

- **Gemini**: ~2-5 seconds
- **OpenRouter**: ~3-8 seconds
- **Template**: <100ms (instant)

## Customization

### Add More Providers

```typescript
// In /api/generate-roadmap/route.ts
async function generateWithCustomProvider(body, apiKey) {
  // Implement custom logic
  return roadmapData
}

// In POST handler
if (!roadmapData && customKey) {
  roadmapData = await generateWithCustomProvider(body, customKey)
  source = 'custom'
}
```

### Modify Template

Edit `getTemplateRoadmap()` function to customize:
- Task titles and descriptions
- Project ideas
- Resource links
- Timeline durations
- Skills lists
- Suggestions

## Troubleshooting

### No API Key Provided
```
→ Uses professional template (not an error)
```

### Gemini API Fails
```
→ Automatically tries OpenRouter
→ If OpenRouter fails → Uses template
```

### Both APIs Fail
```
→ Uses professional template roadmap
→ User still gets complete, structured roadmap
```

### JSON Parse Error
```
→ Catches markdown formatting
→ Automatically cleans response
→ Falls back to template if still fails
```

## Files Modified

- `app/api/generate-roadmap/route.ts` - Dual provider logic
- `app/career-roadmap/page.tsx` - Updated toast messages
- `.env.local` - Added OpenRouter API key

## Next Steps

✅ Generate career roadmaps with both Gemini and OpenRouter  
✅ Fallback to template if both fail  
✅ Always provide complete roadmap to user  
✅ Show which provider generated the roadmap  

### Optional Enhancements
- Save roadmaps to database
- Compare Gemini vs OpenRouter outputs
- Create roadmap sharing feature
- Add progress tracking
- Integrate O*NET API for job data
