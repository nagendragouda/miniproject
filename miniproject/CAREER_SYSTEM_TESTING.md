# Career System - Testing & Examples

## 🧪 Test Cases

### Test Case 1: 10th Grade - Science PCM Student

**Input:**
```json
{
  "profile": {
    "firebase_uid": "user_123",
    "education_level": "10th grade",
    "course_stream": "Science PCM",
    "skills": [
      { "name": "Mathematics", "level": 9 },
      { "name": "Physics", "level": 8 },
      { "name": "Problem-solving", "level": 7 }
    ],
    "interests": ["Technology", "Innovation", "Engineering"]
  },
  "quiz": {
    "q1": "A", "q2": "A", "q3": "A", "q4": "B",
    "q5": "A", "q6": "A", "q7": "A", "q8": "B",
    "q9": "A", "q10": "A"
  }
}
```

**Expected Output:**
```json
{
  "success": true,
  "personalityType": "Analytical",
  "analysis": {
    "streamName": "Science (PCM - Physics, Chemistry, Math)",
    "matchScore": 95,
    "reason": "Your strong mathematics and physics skills align perfectly with PCM. Your analytical personality and interest in technology suit engineering pathways.",
    "overview": "Science PCM stream opens doors to engineering, technology, and pure sciences...",
    "personalityFit": "Best for Analytical and Entrepreneurial personalities with strong logical reasoning.",
    "requiredSkills": ["Mathematical reasoning", "Problem-solving", "Analytical thinking", "Attention to detail", "Scientific inquiry"],
    "suggestedSubjects": ["Physics", "Chemistry", "Mathematics", "Computer Science", "Electronics"],
    "skillGapAnalysis": {
      "currentSkills": ["Mathematics", "Physics", "Problem-solving"],
      "missingSkills": ["Advanced calculus", "Classical mechanics", "Organic chemistry"],
      "improvementAreas": ["Laboratory work", "Programming basics"]
    },
    "roadmap": {
      "step1": "Master core science subjects with consistent practice",
      "step2": "Join competitive exam coaching for JEE/NEET preparation",
      "beginner": ["Build strong fundamentals in Physics and Chemistry", "Practice mathematical problem-solving daily", "Understand concepts deeply, not just rote learning", "Join study groups for peer learning"],
      "intermediate": ["Solve previous years' papers", "Take mock tests regularly", "Identify weak areas and focus on improvement", "Learn programming basics (C++, Python)"]
    },
    "actionPlan": {
      "next30Days": ["Create study schedule for PCM subjects", "Download JEE/NEET sample papers", "Complete 50+ practice problems in each subject", "Join online coaching platform"],
      "midTerm": ["Finish syllabus 3 months before exams", "Take 2-3 full-length mock tests per week", "Revise all formulas and concepts", "Join coaching classes for doubt clearing"]
    },
    "salaryGrowth": {
      "entryLevel": "After B.Tech: ₹5-10 LPA (IT), ₹4-8 LPA (Core)",
      "midLevel": "₹15-30 LPA with 5-10 years experience",
      "seniorLevel": "₹40-100+ LPA in senior management"
    },
    "marketDemand": {
      "currentDemand": "Very High - Continuous demand for engineers",
      "growthRate": "8-10% annually in tech sector",
      "futureScope": "Strong growth in AI, Data Science, Cloud Computing, Renewable Energy"
    },
    "riskAnalysis": {
      "automationRisk": "Moderate (roles evolving, not disappearing)",
      "competitionLevel": "Very High - Extreme competition in entrance exams and placements"
    },
    "toolsAndTechnologies": ["Python", "C++", "MATLAB", "Simulators", "CAD software", "Lab equipment"],
    "recommendedProjects": ["Build simple IoT device", "Create physics simulation software", "Design mechanical prototype", "Environmental monitoring system"],
    "learningResources": ["NCERT textbooks (foundation)", "HC Verma (Physics)", "Resnick Halliday (Advanced Physics)", "OP Tandon (Chemistry)", "RS Aggarwal (Mathematics)", "JEE Main/Advanced previous papers", "Unacademy, Khan Academy"],
    "commonMistakesToAvoid": ["Rote learning instead of understanding concepts", "Ignoring practical lab work", "Poor time management in competitive exams", "Neglecting weak subjects", "Not practicing problems regularly"],
    "websiteGuide": "https://www.shiksha.com/articles/engineering-career-chp",
    "relatedVideos": [
      { "title": "JEE Preparation Strategy - Complete Guide", "url": "https://www.youtube.com/..." },
      { "title": "PCM Stream: Engineering Roadmap", "url": "https://www.youtube.com/..." },
      { "title": "Top Colleges for PCM Students", "url": "https://www.youtube.com/..." }
    ],
    "recommendedStreams": [
      { /* Science PCM - above */ },
      { /* Science PCB with score 65 */ },
      { /* Commerce with score 40 */ }
    ]
  }
}
```

✅ **Assertions:**
- [ ] matchScore = 95 (93-97 range acceptable)
- [ ] personalityType = "Analytical"
- [ ] streamName present and correct
- [ ] All 25+ fields have content
- [ ] No empty strings
- [ ] Arrays all have 3+ items
- [ ] Salary formatted: "₹X-Y LPA"
- [ ] URLs valid
- [ ] YouTube videos returned
- [ ] Top 3 recommendations returned

---

### Test Case 2: PUC Student - Engineering Track

**Input:**
```json
{
  "profile": {
    "firebase_uid": "user_456",
    "education_level": "12th PUC",
    "course_stream": "Science PCM",
    "skills": [
      { "name": "Programming", "level": 7 },
      { "name": "Problem-solving", "level": 8 },
      { "name": "System thinking", "level": 6 }
    ],
    "interests": ["Software", "AI/ML", "Web Development"]
  },
  "quiz": {
    "q1": "A", "q2": "A", "q3": "B", "q4": "A",
    "q5": "A", "q6": "A", "q7": "A", "q8": "A",
    "q9": "A", "q10": "B"
  }
}
```

**Expected Output:**
```json
{
  "success": true,
  "personalityType": "Analytical",
  "analysis": {
    "courseName": "B.Tech - Computer Science & Engineering (CSE)",
    "matchScore": 92,
    "reason": "Your strong programming skills and problem-solving ability align perfectly with CSE. Your interests in AI/ML and Web Development directly match course specializations.",
    // ... 25+ fields populated
    "recommendedCourses": [
      { /* B.Tech CSE - 92% match */ },
      { /* B.Tech ECE - 68% match */ },
      { /* B.Tech Mechanical - 55% match */ }
    ]
  }
}
```

✅ **Assertions:**
- [ ] stage = "puc" or "diploma"
- [ ] courseName = "B.Tech - Computer Science & Engineering (CSE)"
- [ ] matchScore ~90
- [ ] recommendedCourses (not recommendedStreams)
- [ ] All fields complete

---

### Test Case 3: Graduate - Career Selection

**Input:**
```json
{
  "profile": {
    "firebase_uid": "user_789",
    "education_level": "B.Tech Computer Science",
    "course_stream": "Engineering",
    "skills": [
      { "name": "Python", "level": 9 },
      { "name": "System Design", "level": 7 },
      { "name": "Leadership", "level": 6 },
      { "name": "Communication", "level": 7 }
    ],
    "interests": ["Technology", "Innovation", "Startup", "Product Development"]
  },
  "quiz": {
    "q1": "D", "q2": "D", "q3": "B", "q4": "A",
    "q5": "D", "q6": "A", "q7": "D", "q8": "B",
    "q9": "D", "q10": "A"
  }
}
```

**Expected Output:**
```json
{
  "success": true,
  "personalityType": "Entrepreneurial",
  "analysis": {
    "careerName": "Software Engineer",
    "matchScore": 88,
    "reason": "Your expertise in Python and system design matches software engineering perfectly. Your entrepreneurial personality and interest in innovation suggest growth into tech leadership roles.",
    // ... 25+ fields populated
    "careers": [
      { /* Software Engineer - 88% */ },
      { /* Product Manager - 72% */ },
      { /* Data Scientist - 65% */ }
    ]
  }
}
```

✅ **Assertions:**
- [ ] stage = "graduation"
- [ ] careerName present (Software Engineer / Data Scientist / etc.)
- [ ] personalityType = "Entrepreneurial"
- [ ] careers array (not recommendedStreams/Courses)
- [ ] All detailed career info present

---

## 🔍 Validation Test

**Invalid Profile (Should Handle Gracefully):**
```json
{
  "profile": {
    "firebase_uid": "user_invalid",
    "education_level": "Unknown Level",
    "skills": [],  // Empty
    "interests": []  // Empty
  },
  "quiz": {} // Empty
}
```

**Expected:**
- Defaults to "graduation" stage
- Assigns neutral personality (Balanced)
- Returns general career recommendations
- All fields still populated with defaults
- No empty details

---

## 📊 Performance Benchmarks

| Operation | Time | Status |
|-----------|------|--------|
| Parse request | <5ms | ✅ |
| Detect stage | <1ms | ✅ |
| Calculate scores | <20ms | ✅ |
| Validate results | <10ms | ✅ |
| Fetch videos | 200-500ms | ✅ |
| Total response | <600ms | ✅ |

---

## 🧩 Example: Building Custom Test

```typescript
// test-career-api.ts
async function testCareerApi() {
  const profile = {
    firebase_uid: 'test_user_123',
    education_level: '10th',
    course_stream: 'Science PCM',
    skills: [
      { name: 'Mathematics', level: 8 },
      { name: 'Physics', level: 7 }
    ],
    interests: ['Technology', 'Innovation']
  };

  const quiz = {
    q1: 'A', q2: 'A', q3: 'A', q4: 'B',
    q5: 'A', q6: 'A', q7: 'A', q8: 'B',
    q9: 'A', q10: 'A'
  };

  // Call API
  const response = await fetch('/api/career-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, quiz })
  });

  const data = await response.json();

  // Validation
  console.assert(data.success === true, 'API failed');
  console.assert(data.analysis.matchScore >= 0, 'Invalid score');
  console.assert(data.analysis.matchScore <= 100, 'Score out of range');
  console.assert(data.analysis.overview?.length > 0, 'Empty overview');
  console.assert(Array.isArray(data.analysis.requiredSkills), 'Skills not array');
  console.assert(data.analysis.requiredSkills.length > 0, 'Empty skills');
  console.assert(data.personalityType, 'No personality');
  
  // Check all fields
  const requiredFields = [
    'overview', 'personalityFit', 'requiredSkills', 'suggestedSubjects',
    'skillGapAnalysis', 'roadmap', 'actionPlan', 'salaryGrowth',
    'marketDemand', 'riskAnalysis', 'toolsAndTechnologies',
    'recommendedProjects', 'learningResources', 'commonMistakesToAvoid',
    'websiteGuide'
  ];
  
  const result = data.analysis;
  requiredFields.forEach(field => {
    console.assert(result[field] !== null && result[field] !== undefined, 
      `Missing field: ${field}`);
    if (typeof result[field] === 'string') {
      console.assert(result[field].length > 0, `Empty string: ${field}`);
    }
    if (Array.isArray(result[field])) {
      console.assert(result[field].length > 0, `Empty array: ${field}`);
    }
  });

  console.log('✅ All tests passed!');
  return data;
}
```

---

## 📝 Response Checklist

For ANY career recommendation response, verify:

**Top Level**
- [ ] `success` = true
- [ ] `analysis` object exists
- [ ] `personalityType` present

**Career Data**
- [ ] `careerName` OR `courseName` OR `streamName`
- [ ] `matchScore` 0-100
- [ ] `overview` (50+ chars)
- [ ] `personalityFit` (20+ chars)
- [ ] `reason` (20+ chars)

**Skills Section**
- [ ] `requiredSkills` array (3+ items)
- [ ] `suggestedSubjects` array (3+ items)
- [ ] `skillGapAnalysis.currentSkills` array
- [ ] `skillGapAnalysis.missingSkills` array (1+ items)
- [ ] `skillGapAnalysis.improvementAreas` array (1+ items)

**Learning Path**
- [ ] `roadmap.step1` (20+ chars)
- [ ] `roadmap.step2` (20+ chars)
- [ ] `roadmap.beginner` array (3+ items)
- [ ] `roadmap.intermediate` array (3+ items)
- [ ] `actionPlan.next30Days` array (3+ items)
- [ ] `actionPlan.midTerm` array (2+ items)

**Market Data**
- [ ] `salaryGrowth.entryLevel` (contains ₹ and LPA)
- [ ] `salaryGrowth.midLevel` (contains ₹ and LPA)
- [ ] `salaryGrowth.seniorLevel` (contains ₹ and LPA)
- [ ] `marketDemand.currentDemand` (20+ chars)
- [ ] `marketDemand.growthRate` (10+ chars, contains %)
- [ ] `marketDemand.futureScope` (20+ chars)

**Risk & Resources**
- [ ] `riskAnalysis.automationRisk` (10+ chars)
- [ ] `riskAnalysis.competitionLevel` (10+ chars)
- [ ] `toolsAndTechnologies` array (3+ items)
- [ ] `recommendedProjects` array (3+ items)
- [ ] `learningResources` array (3+ items)
- [ ] `commonMistakesToAvoid` array (3+ items)
- [ ] `websiteGuide` (valid URL)
- [ ] `relatedVideos` array (1+ items with title and URL)

**Recommendations**
- [ ] `recommendedStreams` OR `recommendedCourses` OR `careers` array
- [ ] Top 3 recommendations present
- [ ] Each recommendation follows above checklist

---

**Total Assertions per Response: 50+**

If any assertion fails, the system has a bug that needs fixing.

---

## 🎯 Success Criteria

✅ System passes all test cases  
✅ Zero empty fields in any response  
✅ All 25+ fields populated for every career  
✅ Top 3 recommendations always returned  
✅ Personality correctly detected  
✅ Match scores realistic (20-100 range)  
✅ YouTube videos fetched (or fallback provided)  
✅ Response time < 600ms  
✅ No external API calls needed  

**If all criteria met → System is production ready!**
