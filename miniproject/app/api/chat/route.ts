import { NextRequest, NextResponse } from 'next/server'

// Hugging Face API configuration
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY
// Using a faster, more reliable conversational model
const HUGGINGFACE_MODEL = 'microsoft/DialoGPT-medium'
const HF_API_URL = 'https://api-inference.huggingface.co/models/'

// PROJECT KNOWLEDGE BASE - FutureMatrix
const projectKnowledge: Record<string, string> = {
  'futurematrix': `🚀 **Welcome to FutureMatrix** - AI-Powered Career Guidance Platform

FutureMatrix is a revolutionary next-generation web application that helps students discover their ideal career paths using cutting-edge AI technology, immersive 3D visualizations, and comprehensive educational guidance.

**Project Stats:**
- 25,000+ Students Guided
- 750+ Career Paths Analyzed
- 1,500+ Engineering Colleges in Database
- 50+ Curated Learning Resources
- 97% User Satisfaction Rate

**Built with:** Next.js 15, TypeScript 5.6, Tailwind CSS, Three.js, Supabase, and Hugging Face AI

What would you like to know about FutureMatrix?`,

  'features': `✨ **FutureMatrix Core Features:**

🤖 **AI-Powered Intelligence**
- Multi-provider AI integration (OpenAI, Gemini, Claude, Hugging Face)
- Smart career matching algorithm (75+ parameters)
- AI-powered roadmap generation with adaptive learning paths
- Intelligent chat assistant for real-time guidance
- Dynamic adaptive quiz engine

🎯 **Career Discovery**
- 50+ question comprehensive assessment quiz
- Interactive 3D career tree visualization
- Progress analytics & achievement badges
- Skill gap analysis with recommendations
- Real-time career path exploration

🎓 **College Discovery**
- 1,500+ engineering colleges database
- AI-powered smart search & filtering
- Interactive map integration with geolocation
- Save & compare college wishlist
- Government college specialization

📚 **Learning Resources**
- 50+ curated learning resources
- AI-powered content recommendations
- Semantic search across all materials
- Resources for coding, data science, design, emerging tech

💼 **Platform Features**
- User management system
- Educational content curation
- Career guidance tools
- AI-powered recommendations

What feature interests you most?`,

  'pages': `📄 **FutureMatrix Pages & Routes:**

🏠 **Core Pages**
- / - Landing page with hero section
- /quiz - Interactive career assessment
- /colleges - College finder with filters
- /career-tree - Interactive 3D career visualization
- /resume-analyzer - AI-powered resume analyzer & optimization
- /learning-resources - Curated educational materials

📖 **Information Pages**
- /about - About FutureMatrix
- /blog - Career articles & insights
- /guides - Career planning guides
- /help - Help & FAQ
- /materials - Learning materials
- /press - Press releases

🛡️ **User Pages**
- /auth/signin - Login page
- /auth/signup - Registration page
- /profile - User profile & settings
- /saved-colleges - Bookmarked colleges
- /user-details - Personal information

Which page would you like to know more about?`,

  'tech stack': `🔧 **FutureMatrix Technology Stack:**

**Frontend**
- Next.js 15 (App Router + RSC)
- TypeScript 5.6 (Strict Mode)
- Tailwind CSS 4.0 + Custom Design
- Three.js + @react-three/fiber (3D Graphics)
- Custom GLSL Shaders for effects
- Framer Motion for animations
- React Hook Form + Zod validation
- React Leaflet for maps

**Backend & Database**
- PostgreSQL (Production database)
- Prisma ORM (Database management)
- Supabase Auth (Authentication)
- Supabase Storage (File storage)
- Next.js API Routes (Backend)
- RESTful API design

**AI & ML**
- Hugging Face Inference API (Primary AI)
- OpenAI GPT (Alternative provider)
- Google Gemini (Alternative provider)
- Smart matching algorithm (75+ parameters)

**Free Platform**
- No payment processing
- All features accessible
- No subscription limits

**Testing & Deployment**
- Playwright for E2E testing
- Jest for unit testing
- Vercel for deployment
- GitHub for version control

Want more details on any technology?`,

  'architecture': `🏗️ **FutureMatrix System Architecture:**

**Frontend Architecture**
- React Server Components (RSC) for performance
- Client-side components for interactivity
- Context API + Zustand for state management
- Custom React hooks for logic reuse
- Responsive design from 375px - 1440px+

**API Routes** (/app/api/)
- /chat - AI chatbot endpoint
- /auth - Authentication endpoints
- /quiz - Quiz submission handling
- /colleges - College data endpoints
- /user-details - User profile management

**Database Schema**
- Users (Profile & authentication)
- Colleges (1,500+ institutions)
- Quiz Responses (Assessment data)
- Learning Resources (Educational content)


**Key Components**
- ChatBot - AI assistant widget
- Quiz - Interactive assessment engine
- CollegeCard - College display component
- 3D Visualizations - Career tree & animations
- Navbar - Navigation with dropdowns
- Footer - Site footer with links

**Security Features**
- JWT authentication
- Row-level security (RLS) in Supabase
- API route protection
- Environment variable management
- HTTPS/TLS encryption

Want to dive deeper into any part?`,

  'getting started': `🚀 **Getting Started with FutureMatrix:**

**For Users:**
1. Visit the landing page
2. Sign up or sign in with your account
3. Take the career assessment quiz (50 questions)
4. View personalized career recommendations
5. Explore the college finder
6. Generate your AI roadmap
7. Access learning resources
8. Chat with AI assistant anytime

**For Developers:**
1. Clone the repository
2. Install dependencies: npm install
3. Configure environment variables (.env.local)
4. Set up Supabase database
5. Run dev server: npm run dev
6. Access http://localhost:3003

**Key Files to Know**
- /app/layout.tsx - Main layout wrapper
- /components/* - Reusable React components
- /contexts/* - State management
- /app/api/* - Backend API routes
- /lib/* - Utility functions
- /styles/* - Custom stylesheets

**Environment Setup**
- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Public API key
- SUPABASE_SERVICE_ROLE_KEY - Server-side key
- HUGGINGFACE_API_KEY - AI provider API key

Need help with something specific?`,

  'faq': `❓ **Frequently Asked Questions**

**How accurate is the career matching?**
Our algorithm uses 75+ parameters including interests, skills, personality type, academic performance, and market demands. It has 97% user satisfaction rate.

**Can I change my career recommendations?**
Yes! You can retake the quiz anytime or manually update your preferences in the dashboard.

**Are colleges real data?**
Yes, we have 1,500+ verified engineering colleges with real-time data syncing including fees, cutoffs, and placements.

**Is the AI free?**
Yes! All AI features are completely free. No payment required.

**How much does it cost?**
Everything is completely free! All features including AI chat, career predictions, college finder, and resume analyzer tools are available at no cost.

**Can I use FutureMatrix offline?**
Not currently, but you can save resources for offline reading.

**Is my data secure?**
Yes! We use Supabase with row-level security, JWT tokens, and HTTPS encryption. Your data is never shared.

**Can international students use it?**
Yes, but college database focuses on Indian institutions. Career guidance applies globally.

Other questions?`,

  'pricing': `💰 **FutureMatrix Pricing:**

**Free Forever Plan**
- Career personality quiz
- 12 career path predictions
- College finder database
- AI-powered chat support
- Career roadmaps
- Resume analyzer
- Career growth support
- Education guidance
- Saved collections
- Career growth dashboard

No credit card required. All features completely free!

Explore all features at /pricing`,

  'troubleshooting': `🔧 **Troubleshooting Common Issues:**

**Quiz Issues**
- Can't submit quiz? Reload page and try again
- Lost progress? Quiz auto-saves every question
- Wrong recommendations? Retake quiz with more careful answers

**College Finder Issues**
- No colleges showing? Check filters, try "Clear All"
- Map not loading? Check internet connection
- Slow performance? Reduce filters or load fewer results

**AI Chat Issues**
- No response? Check internet connection
- Rate limited? Wait a moment, then retry
- Off-topic answers? Be more specific in your question

**Login Issues**
- Can't sign up? Check email format
- Password reset not working? Check spam folder
- Social login failing? Clear browser cookies

**Performance Issues**
- Page loading slowly? Clear browser cache
- 3D animations stuttering? Reduce visual effects in settings
- High memory usage? Close unused tabs

**Payment Issues**
- Payment failed? Try different card or payment method
- Subscription not activating? Check email for confirmation
- Refund request? Contact support@futurematrix.com

Can't find your issue? Ask in chat!`,

  'roadmap': `🗺️ **FutureMatrix Development Roadmap:**

**Completed (Q1-Q2 2025)**

✅ College finder with 1,500+ colleges
✅ AI chat integration
✅ 3D career tree visualization
✅ Learning resources hub
✅ Subscription system
✅ Authentication system
✅ Mobile responsiveness

**In Progress (Q3 2025)**
🔄 Advanced analytics dashboard
🔄 Internship opportunities board
🔄 Job posting integration
🔄 Mentor matching system
🔄 Interview preparation module
🔄 Resume builder tool

**Planned (Q4 2025 - Q1 2026)**
📋 Mobile app (iOS & Android)
📋 Voice-based guidance
📋 Video interview practice
📋 Industry partnerships
📋 Scholarship tracking
📋 Offline mode support
📋 Multi-language support
📋 Advanced ML models

**Future (2026+)**
🌟 VR career exploration
🌟 AI-powered portfolio builder
🌟 Blockchain credentials
🌟 Global college expansion
🌟 Corporate partnerships
🌟 Certification programs

What feature are you most excited about?`,
}

// MOST IMPORTANT 10 QUESTIONS - Quick Response KB
const topQuestions: Record<string, string> = {
  'college finder': `🎓 **College Finder - Find Your Perfect College**

Explore 1,500+ engineering colleges with advanced filtering!

**Features:**
🔍 Search by: Location, Fees, Cutoff Rank, NIRF Rating, Placement Rate
📍 Interactive Map: Geolocation-based discovery
⭐ Ratings: Real placement data & student reviews
💰 Fee Calculator: Compare costs across colleges
📊 Comparison Tool: Side-by-side college analysis
💾 Save Wishlist: Bookmark favorites for later

**How to Use:**
1. Open /colleges page
2. Filter by location, type, fees, cutoff
3. Browse college cards with key info
4. Click to see detailed profiles
5. Save to wishlist
6. Compare multiple colleges

**What You'll Find:**
- College name & location
- Placement statistics
- Admission cutoff
- Course offerings
- Fee structure
- Campus facilities
- Alumni network info

**Best For:** Government colleges, engineering institutions, placement-focused selection

**Pro Tip:** Filter by "Government College" to find best public options!`,

  'ai roadmap': `🗺️ **AI Roadmap - Your Personalized Learning Path**

Get a custom learning roadmap tailored to YOUR career goals!

**What It Generates:**
📚 Personalized 12-month learning plan
✅ Month-by-month skill development milestones
🎯 Specific courses, projects, and certifications
⏱️ Time estimates for each milestone
🏆 Achievement tracking & progress badges
💡 Industry insider tips and shortcuts

**How to Get Your Roadmap:**
1. Visit the Career Roadmap page
2. Select your target career from our database

**Roadmap Includes:**
🔸 Month 1-3: Foundation skills & basics
🔸 Month 4-6: Intermediate projects & learning
🔸 Month 7-9: Advanced concepts & applications
🔸 Month 10-12: Real-world projects & internships

**Each Milestone Shows:**
- What to learn (specific topics)
- Recommended resources & courses
- Projects to build (portfolio pieces)
- Expected time commitment
- Certifications to pursue
- Checkpoint assessments

**Pro Tip:** Use the roadmap as your personal mentor! Follow it religiously for career success.`,

  'how to login': `🔐 **Login & Registration - Get Started**

Two ways to access FutureMatrix:

**Quick Sign Up (First Time):**
1. Go to /auth/signin
2. Click "Create new account"
3. Enter email & create password
4. Verify email (check inbox)
5. You're in! 🎉

**Social Login (Fastest):**
- Sign up with Google
- Sign up with GitHub
- Sign up with Microsoft
- One-click sign in next time!

**Forgot Password?**
1. Go to login page
2. Click "Forgot Password?"
3. Enter your email
4. Click reset link in email
5. Create new password

**After Login, You Get:**
✅ Personal dashboard
✅ Quiz results history
✅ Saved colleges & wishlist
✅ Learning roadmap access
✅ AI chat unlimited
✅ Profile customization
✅ Subscription management

**Demo Accounts (Testing):**
- Email: demo@example.com
- Password: demo123
Perfect for trying features!

**Pro Tip:** Use social login for fastest access!`,

  'learning resources': `📚 **Learning Resources - Curated Content Hub**

Access 50+ carefully selected learning resources!

**Categories:**
💻 Programming (Python, JavaScript, Java, React, Node.js)
📊 Data Science (ML, AI, Statistics, SQL, Pandas)
🎨 Design (UI/UX, Graphic Design, Web Design)
🚀 Emerging Tech (Blockchain, IoT, Cloud, DevOps)
💼 Business Skills (Leadership, Communication, Management)
🌐 Soft Skills (Problem-solving, Creativity, Collaboration)

**Types of Resources:**
📹 Video courses (YouTube, Udemy, Coursera)
📖 Books & papers
🎓 Online bootcamps
📱 Apps & practice tools
🧑‍💻 Coding platforms (LeetCode, HackerRank)
📝 Blogging platforms
💬 Community forums

**How to Access:**
1. Open /learning-resources page
2. Browse by category or skill
3. Filter by difficulty level
4. Search for specific topics
5. Click to view resource
6. Save favorites to your collection

**Each Resource Shows:**
✅ Type & difficulty level
✅ Time to complete
✅ Free or paid
✅ Skill level required
✅ What you'll learn
✅ Star ratings & reviews
✅ Direct access link

**Pro Tip:** Mix video + hands-on practice for best learning!`,

  'job hunting tips': `🎯 **Resume Analyzer - Optimize Your Profile**

Get your resume scanned by our AI to identify improvements and ATS compatibility!

**How to Use:**
1. Open /resume-analyzer page
2. Upload your PDF resume
3. Get a comprehensive score and skill analysis
4. Follow the AI-generated optimization roadmap

**Key Insights:**
✅ ATS Compatibility Score
✅ Identified & Missing Skills
✅ Format & Impact Analysis
✅ Role-specific Recommendations

**Pro Tip:** Aim for a score above 85% for top-tier companies!`,

  'profile settings': `⚙️ **Profile & Settings - Customize Your Account**

Manage your profile and preferences easily!

**Edit Profile:**
👤 Full name & contact info
📧 Email address & phone
🎂 Date of birth & location
👨‍🎓 Education history
💼 Work experience
🎯 Career interests

**Privacy Settings:**
🔒 Profile visibility
🔒 Data sharing preferences
🔒 Email notifications
🔒 Marketing communications
🔒 Activity privacy

**Preferences:**
🎨 Theme (Light/Dark)
🌐 Language selection
⏰ Timezone
📬 Notification frequency
🔔 Alert preferences

**Account Management:**
📱 Change password
🔐 Two-factor authentication
📱 Connected accounts
🗑️ Download data
❌ Delete account

**How to Access:**
1. Click profile icon (top-right)
2. Select "Settings"
3. Choose section to edit
4. Make changes
5. Click "Save"

**What Happens to Data:**
✅ Used to personalize recommendations
✅ Secure storage in Supabase
✅ Never shared with 3rd parties
✅ You can delete anytime
✅ GDPR compliant

**Pro Tip:** Keep profile updated for better recommendations!`,

  'upgrade subscription': `💳 **Upgrade Subscription - Unlock Premium Features**

Unlock unlimited access to all FutureMatrix features!

**Current Plans:**

🆓 **FREE** - $0/month
- Browse colleges & learning resources

⭐ **BASIC** - ₹299/month ($3.60)
- Unlimited quiz attempts
- Full analysis & AI insights
- 50 AI chat messages/day
- Save 20 colleges
- All learning resources
- Email support

🎯 **PREMIUM** - ₹799/month ($9.60)
- Everything in Basic PLUS
- Unlimited AI chat messages
- Full AI roadmap generation
- College comparison tool
- Personalized skill plans
- Monthly career webinars
- Priority support

👑 **ELITE** - ₹1,999/month ($24)
- Everything in Premium PLUS
- 1-on-1 mentorship (2x/month)
- Dedicated career advisor
- Internship recommendations
- Resume review service
- Interview coaching
- 24/7 priority support

**How to Upgrade:**
1. Click profile icon
2. Go to "Subscription"
3. Choose plan
4. Click "Upgrade"
5. Select payment method
6. Complete payment
7. Access unlocked instantly!

**Payment Methods:**
💳 Credit/Debit card
📱 UPI (India)
🏦 Net Banking (India)
🎫 PayPal (International)

**Can Cancel Anytime:** Full refund within 7 days!

**Pro Tip:** Start with BASIC for best value!`,

  'ai assistant chat': `🤖 **AI Assistant - Your Personal Career Guide**

Chat with FutureMatrix AI anytime, anywhere!

**What the AI Can Help With:**
🎯 Career guidance & path selection
📚 Skill development strategies
🎓 College selection advice
📝 Resume writing tips
🎤 Interview preparation
💼 Job search strategies
📊 Career comparison
🌟 Industry insights
⏰ Work-life balance advice
🚀 Career transitions

**How to Chat:**
1. Click chat bubble (bottom-right)
2. Type your question
3. Get instant response
4. Ask follow-up questions
5. Save important conversations

**Free vs Premium:**
- 🆓 Free: 5 messages/day
- ⭐ Basic: 50 messages/day
- 🎯 Premium: Unlimited messages
- 👑 Elite: Unlimited + priority responses

**Example Questions:**
❓ "What career matches my interests?"
❓ "How do I learn Python?"
❓ "Tell me about data science careers"
❓ "Help me prepare for interviews"
❓ "What skills do I need?"

**Response Time:**
⚡ Under 2 seconds typically
⚡ Sometimes instant for common Q&As
⚡ Always helpful & relevant

**Data Privacy:**
✅ Conversations saved securely
✅ Never shared with others
✅ You can delete anytime
✅ Encrypted end-to-end

**Pro Tip:** Chat regularly for best career guidance!`,


}

// Career guidance knowledge base for fallback responses
const careerGuidanceData: Record<string, string> = {
  'career paths': `Here are some popular career paths you should consider:

**1. Technology & Software Development**
- Software Engineer (Full-stack, Frontend, Backend, Mobile)
- Data Scientist/Analyst
- AI/ML Engineer
- Cloud Architect
- Cybersecurity Specialist
Growth: 22% expected growth through 2032. Average salary: $120k-$180k+

**2. Healthcare & Medical**
- Doctor/Physician
- Nurse/Nursing Practitioner
- Pharmacist
- Physical Therapist
- Medical Researcher
Growth: 16% expected growth. Average salary: $70k-$200k+

**3. Finance & Business**
- Financial Analyst
- Investment Banker
- Management Consultant
- Accountant/CPA
- Business Analyst
Growth: 8-12% expected growth. Average salary: $80k-$150k+

**4. Engineering**
- Civil Engineer
- Mechanical Engineer
- Electrical Engineer
- Chemical Engineer
- Environmental Engineer
Growth: 8% expected growth. Average salary: $100k-$140k+

**5. Creative & Design**
- UX/UI Designer
- Graphic Designer
- Product Designer
- Content Creator
- Video Producer
Growth: High demand in digital economy. Average salary: $60k-$120k+

Which of these interests you most? I can provide more specific guidance!`,

  'skills': `Essential skills for modern careers include:

**Technical Skills:**
- Programming (Python, JavaScript, Java)
- Data Analysis & Visualization
- Cloud Computing (AWS, Azure, GCP)
- AI/Machine Learning basics
- Cybersecurity awareness

**Soft Skills:**
- Communication & Presentation
- Problem-Solving & Critical Thinking
- Leadership & Teamwork
- Project Management
- Emotional Intelligence
- Adaptability & Learning Agility

**Business Skills:**
- Financial Literacy
- Digital Marketing
- Negotiation
- Customer Service
- Sales

Start with 1-2 technical skills and develop soft skills continuously. Most employers value a mix of both!

What specific skill would you like to develop?`,

  'college': `Choosing the right college involves:

**Academic Quality:**
- Check rankings (QS, Times, US News)
- Look at accreditation
- Review detailed course offerings
- Check faculty research and publications

**Career Support:**
- Internship opportunities
- Alumni network strength
- Career services quality
- Industry partnerships
- Placement statistics

**Practical Considerations:**
- Location & cost
- Campus culture fit
- Scholarship availability
- Online vs in-person
- Student support services

**Action Steps:**
1) List 5-10 colleges matching your interests
2) Research placement rates for your field
3) Connect with current students
4) Attend virtual/campus tours
5) Check financial aid options

What field are you interested in studying?`,

  'interview': `Ace your interviews with these tips:

**Before the Interview:**
- Research the company thoroughly (mission, values, recent news)
- Understand the role requirements deeply
- Prepare 3-5 stories using STAR method (Situation, Task, Action, Result)
- Practice common questions (weaknesses, failures, achievements)
- Prepare thoughtful questions for them

**During the Interview:**
- Arrive 15 minutes early
- Strong handshake, eye contact, smile
- Listen carefully before answering
- Use concrete examples, not vague statements
- Ask about next steps and timeline

**Classic Questions to Prepare:**
- Tell me about yourself
- Why do you want this job/role?
- What are your strengths/weaknesses?
- Describe a challenging situation
- Where do you see yourself in 5 years?

**Pro Tips:**
- Let silence work for you - pause thoughtfully
- Follow up within 24 hours
- Quantify your achievements
- Show enthusiasm genuinely

Do you have a specific interview coming up?`,

  'resume': `Build a winning resume:

**Structure:**
- Contact info (name, phone, email, LinkedIn)
- Professional summary (3-4 impactful lines)
- Experience (reverse chronological)
- Education
- Skills (technical & relevant)
- Certifications/Projects (optional but powerful)

**Writing Tips:**
- Use action verbs (Led, Designed, Implemented, Optimized)
- Quantify achievements ("Increased sales by 35%")
- Tailor for each job application
- Keep to 1 page (unless 10+ years experience)
- No grammar/spelling errors
- Use consistent formatting

**For Each Job:**
Position: Job Title | Date Range
Company Name
- Achievement with impact and metrics
- Responsibility highlighting skills
- Problem solved with results

**Keywords:**
- Match job description keywords
- Use industry-specific terms
- ATS (Applicant Tracking System) friendly

Want help crafting your resume summary?`,
}

// Function to find best matching response
function findBestMatch(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  
  // PRIORITY 1: Check TOP 10 MOST IMPORTANT questions first (FASTEST)
  for (const [key, response] of Object.entries(topQuestions)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }
  
  // PRIORITY 2: Check other project knowledge
  for (const [key, response] of Object.entries(projectKnowledge)) {
    if (lowerMessage.includes(key) || 
        lowerMessage.includes(key.split(' ')[0]) ||
        (key === 'features' && (lowerMessage.includes('feature') || lowerMessage.includes('what can')))) {
      return response
    }
  }
  
  // PRIORITY 3: Check career guidance
  for (const [key, response] of Object.entries(careerGuidanceData)) {
    if (lowerMessage.includes(key) || lowerMessage.includes(key.split(' ')[0])) {
      return response
    }
  }
  
  // Check for generic project-related questions
  if (lowerMessage.includes('about') && !lowerMessage.includes('career')) {
    return projectKnowledge['futurematrix']
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return projectKnowledge['troubleshooting']
  }
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('plan')) {
    return projectKnowledge['subscription']
  }
  
  if (lowerMessage.includes('how') && lowerMessage.includes('start')) {
    return projectKnowledge['getting started']
  }
  
  if (lowerMessage.includes('future') || lowerMessage.includes('coming')) {
    return projectKnowledge['roadmap']
  }
  
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    if (!HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI service not configured',
          response: 'The AI service is temporarily unavailable. Please check configuration.' 
        },
        { status: 503 }
      )
    }

    // Try knowledge base first for common career questions
    const knowledgeBaseResponse = findBestMatch(message)
    if (knowledgeBaseResponse) {
      return NextResponse.json({
        response: knowledgeBaseResponse,
        timestamp: new Date().toISOString(),
        provider: 'huggingface-kb',
      })
    }

    // System prompt for career guidance and project support
    const systemPrompt = `You are FutureMatrix AI, a helpful assistant for both career guidance and FutureMatrix platform support. 

**Your Dual Role:**
1. Career Guidance: Answer questions about career paths, skills, colleges, interviews, job search, and career development
2. Platform Support: Answer questions about FutureMatrix features, how to use the platform, technical details, subscriptions, troubleshooting

**FutureMatrix Context:**
FutureMatrix is an AI-powered career guidance platform with 1,500+ colleges, interactive 3D visualizations, personalized roadmaps, and a learning resource hub. It helps students discover their ideal career paths using advanced AI technology.

**Tone:** Be helpful, specific, encouraging, and actionable. Keep responses to 2-3 paragraphs. Use formatting for clarity. Include emojis for engagement.`

    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      // Call Hugging Face Inference API with improved parameters
      const hfResponse = await fetch(`${HF_API_URL}${HUGGINGFACE_MODEL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: [systemPrompt],
            generated_responses: ['Hello! I\'m FutureMatrix AI, your career guidance assistant.'],
            text: message,
          },
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text()
        console.error('Hugging Face API error:', hfResponse.status, errorText)
        
        // If API fails, use smart fallback
        return generateSmartFallback(message)
      }

      const data = await hfResponse.json() as any
      
      // Parse response from Hugging Face
      let response = ''
      if (data.generated_text) {
        response = data.generated_text
      } else if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        response = data[0].generated_text
      }
      
      // Clean up response
      response = response.trim()
      
      // If response is too short or seems invalid, use fallback
      if (!response || response.length < 20) {
        return generateSmartFallback(message)
      }

      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
        provider: 'huggingface',
      })

    } catch (error: any) {
      console.error('Chat API error:', error.message)
      
      // Network error or timeout - use smart fallback
      return generateSmartFallback(message)
    }

  } catch (error) {
    console.error('Request parsing error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// Smart fallback generator for when API fails
function generateSmartFallback(message: string): NextResponse {
  const lowerMessage = message.toLowerCase()
  
  let response = ''
  
  // PRIORITY 1: Check TOP 10 QUESTIONS first
  if (lowerMessage.includes('college') && lowerMessage.includes('find')) {
    response = topQuestions['college finder']
  } else if (lowerMessage.includes('roadmap') || lowerMessage.includes('ai roadmap')) {
    response = topQuestions['ai roadmap']
  } else if (lowerMessage.includes('login') || lowerMessage.includes('sign up') || lowerMessage.includes('register')) {
    response = topQuestions['how to login']
  } else if (lowerMessage.includes('resource') || lowerMessage.includes('learning')) {
    response = topQuestions['learning resources']
  } else if (lowerMessage.includes('job') && lowerMessage.includes('hunt')) {
    response = topQuestions['job hunting tips']
  } else if (lowerMessage.includes('profile') && lowerMessage.includes('setting')) {
    response = topQuestions['profile settings']
  } else if (lowerMessage.includes('upgrade') || lowerMessage.includes('subscription')) {
    response = topQuestions['upgrade subscription']
  } else if (lowerMessage.includes('chat') || lowerMessage.includes('assistant')) {
    response = topQuestions['ai assistant chat']
  }
  
  // PRIORITY 2: Project-related questions
  if (!response) {
    if (lowerMessage.includes('futurematrix') || lowerMessage.includes('this project') || lowerMessage.includes('platform')) {
      response = projectKnowledge['futurematrix']
    } else if (lowerMessage.includes('feature')) {
      response = projectKnowledge['features']
    } else if (lowerMessage.includes('page') || lowerMessage.includes('route') || lowerMessage.includes('navigate')) {
      response = projectKnowledge['pages']
    } else if (lowerMessage.includes('tech') || lowerMessage.includes('build') || lowerMessage.includes('develop')) {
      response = projectKnowledge['tech stack']
    } else if (lowerMessage.includes('architecture') || lowerMessage.includes('system')) {
      response = projectKnowledge['architecture']
    } else if (lowerMessage.includes('start') || lowerMessage.includes('setup') || lowerMessage.includes('install')) {
      response = projectKnowledge['getting started']
    } else if (lowerMessage.includes('faq') || lowerMessage.includes('question')) {
      response = projectKnowledge['faq']
    } else if (lowerMessage.includes('subscription') || lowerMessage.includes('price') || lowerMessage.includes('plan') || lowerMessage.includes('cost')) {
      response = projectKnowledge['subscription']
    } else if (lowerMessage.includes('admin')) {
      response = projectKnowledge['admin']
    } else if (lowerMessage.includes('problem') || lowerMessage.includes('error') || lowerMessage.includes('issue') || lowerMessage.includes('bug')) {
      response = projectKnowledge['troubleshooting']
    } else if (lowerMessage.includes('roadmap') || lowerMessage.includes('future') || lowerMessage.includes('coming')) {
      response = projectKnowledge['roadmap']
    }
  }
  
  // PRIORITY 3: Career guidance questions (if no project match found)
  if (!response) {
    if (lowerMessage.includes('path') || lowerMessage.includes('career')) {
      response = `Great question! There are many exciting career paths you can explore. Here are some popular options:

**Growing Fields:** Software Development, Data Science, Cloud Engineering, UX Design, Healthcare Tech, Renewable Energy, Sales Engineering, Product Management.

**Evergreen Careers:** Medicine, Law, Finance, Engineering, Education, Consulting, Real Estate, Accounting.

**Creative Fields:** Design, Marketing, Content Creation, Entertainment, Journalism, Photography, Music Production.

To find your best fit, consider:
1) Your interests and passions
2) Your natural strengths
3) Required education/skills
4) Job market demand and salary
5) Work-life balance preferences

Which field interests you most? I can provide specific guidance!`
    } else if (lowerMessage.includes('skill')) {
      response = careerGuidanceData['skills']
    } else if (lowerMessage.includes('college')) {
      response = careerGuidanceData['college']
    } else if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      response = careerGuidanceData['interview']
    } else if (lowerMessage.includes('resume')) {
      response = careerGuidanceData['resume']
    }
  }
  
  // Default response showing TOP 10 QUESTIONS
  if (!response) {
    response = `Welcome to FutureMatrix! 👋 I'm your AI assistant for career guidance and platform support.

**🔥 TOP 10 MOST ASKED QUESTIONS:**

1️⃣ College Finder - "How to find colleges?"
2️⃣ AI Roadmap - "What is AI roadmap?"
3️⃣ How to Login - "Help me login or signup"
4️⃣ Learning Resources - "Where are resources?"
5️⃣ Job Hunting - "Job hunting tips"
6️⃣ Profile Settings - "How to edit profile?"
7️⃣ Upgrade Subscr - "How to upgrade?"
8️⃣ AI Chat - "How to use chat?"

**Quick Ask:**
- "College finder guide"
- "Loading roadmap"
- "Getting started"

What would you like to know?`
  }
  
  return NextResponse.json({
    response: response.trim(),
    timestamp: new Date().toISOString(),
    provider: 'huggingface-fallback',
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
