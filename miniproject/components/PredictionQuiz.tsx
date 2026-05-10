'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Briefcase,
  TrendingUp,
  DollarSign,
  Target,
  Star,
  BarChart3,
  Sparkles,
  Clock,
  Award,
  Loader
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import BackButton from '@/components/BackButton'

interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'scale' | 'multi_select'
  options?: string[]
  category: string
}

interface CareerPrediction {
  title: string
  matchScore: number
  salaryRange: string
  growthRate: string
  demand: string
  reasoning: string
  skills: string[]
  timeToLearn: string
  description: string
  // Complete Overview
  completeOverview?: string
  // Market & Industry Information
  marketAnalysis?: {
    currentMarket: string
    jobOpenings: string
    competitionLevel: string
    marketTrend: string
  }
  industryOverview?: {
    industry: string
    majorPlayers: string[]
    marketSize: string
    innovations: string[]
  }
  careerMilestones?: Array<{
    year: number
    milestone: string
    salary: string
  }>
  opportunities?: string[]
  requiredQualifications?: string[]
  topCompanies?: string[]
  // Skills Gap Analysis
  skillsGap?: {
    currentSkills: string[]
    needToLearn: string[]
    timeToGainSkills: string
  }
  // Risk Assessment
  riskAssessment?: {
    automationRisk: string
    marketVolatility: string
    salaryRisk: string
    recommendations: string[]
  }
  // Smart Tips
  smartTips?: string[]
  // AI Insights
  aiInsights?: {
    personalizedRecommendation: string
    strengthAreas: string[]
    developmentAreas: string[]
    successFactors: string[]
  }
}

const predictionQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What type of work environment energizes you the most?',
    type: 'multiple_choice',
    category: 'environment',
    options: ['Collaborative team setting', 'Independent remote work', 'Fast-paced startup', 'Structured corporate']
  },
  {
    id: '2',
    question: 'How much do you enjoy solving complex technical or analytical problems?',
    type: 'scale',
    category: 'technical_aptitude',
    options: ['1 - Not at all', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Very much']
  },
  {
    id: '3',
    question: 'Which activities interest you most? (Select top 3)',
    type: 'multi_select',
    category: 'interests',
    options: ['Building software/products', 'Analyzing data', 'Managing teams', 'Creative design', 'Research & innovation', 'Sales & business', 'Teaching & mentoring', 'Financial planning']
  },
  {
    id: '4',
    question: 'What is your comfort level with technology and programming?',
    type: 'scale',
    category: 'tech_comfort',
    options: ['1 - Beginner', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Expert']
  },
  {
    id: '5',
    question: 'What motivates you most in a career?',
    type: 'multiple_choice',
    category: 'motivation',
    options: ['High salary', 'Job security', 'Social impact', 'Learning & growth', 'Creative freedom', 'Leadership opportunities']
  },
  {
    id: '6',
    question: 'How important is work-life balance for you?',
    type: 'scale',
    category: 'work_life_balance',
    options: ['1 - Not important', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Very important']
  },
  {
    id: '7',
    question: 'Which industries interest you most? (Select all that apply)',
    type: 'multi_select',
    category: 'industries',
    options: ['Technology/Software', 'AI & Machine Learning', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Manufacturing', 'Startup ecosystem']
  },
  {
    id: '8',
    question: 'Your preferred career growth path is:',
    type: 'multiple_choice',
    category: 'growth_path',
    options: ['Deep specialization in one domain', 'Move into management/leadership', 'Entrepreneurship', 'Continuous learning across domains']
  },
  {
    id: '9',
    question: 'How comfortable are you with continuous learning and upskilling?',
    type: 'scale',
    category: 'learning_agility',
    options: ['1 - Prefer stable knowledge', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Love learning new things']
  },
  {
    id: '10',
    question: 'What salary range are you targeting in the next 5 years?',
    type: 'multiple_choice',
    category: 'salary_expectation',
    options: ['₹5-10 LPA', '₹10-20 LPA', '₹20-40 LPA', '₹40-75 LPA', '₹75+ LPA']
  }
]

export default function PredictionQuiz() {
  const router = useRouter()
  const { user } = useAuth()
  const [view, setView] = useState<'quiz' | 'results'>('quiz')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [predictions, setPredictions] = useState<CareerPrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [selectedCareerIndex, setSelectedCareerIndex] = useState(0)

  useEffect(() => {
    // Load profile data from localStorage
    const storedProfile = localStorage.getItem('profileForCareerPrediction')
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile))
    }
  }, [])

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [predictionQuizQuestions[currentQuestion].id]: answer
    }))
  }

  const nextQuestion = () => {
    const currentQ = predictionQuizQuestions[currentQuestion]
    if (!answers[currentQ.id]) {
      toast.error('Please answer the question before proceeding')
      return
    }

    if (currentQuestion < predictionQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = async () => {
    setLoading(true)
    
    try {
      // Prepare data for analysis
      const quizData = {
        uid: user?.uid,
        email: user?.email,
        profile: profileData,
        answers: answers,
        questions: predictionQuizQuestions.map(q => ({
          id: q.id,
          question: q.question,
          answer: answers[q.id],
          category: q.category
        }))
      }

      // Call backend API to generate predictions
      const response = await fetch('/api/predict-career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
      })

      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions || generatePredictionsLocal())
      } else {
        // Fallback to local prediction if API fails
        const localPredictions = generatePredictionsLocal()
        setPredictions(localPredictions)
      }

      setView('results')
      toast.success('Career predictions generated!')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      // Fallback to local prediction
      const localPredictions = generatePredictionsLocal()
      setPredictions(localPredictions)
      setView('results')
    } finally {
      setLoading(false)
    }
  }

  const generatePredictionsLocal = (): CareerPrediction[] => {
    const techComfort = Number(answers['4']) || 5
    const problemSolving = Number(answers['2']) || 5
    const motivation = answers['5'] || 'Learning & growth'
    const interests = Array.isArray(answers['3']) ? answers['3'] : []
    const industries = Array.isArray(answers['7']) ? answers['7'] : []

    const predictions: CareerPrediction[] = []

    // AI/ML Engineer prediction
    if (techComfort >= 7 && problemSolving >= 7) {
      predictions.push({
        title: 'AI/ML Engineer',
        matchScore: Math.min(95, Math.round(65 + (techComfort * 3) + (problemSolving * 2))),
        salaryRange: '₹15-40 LPA',
        growthRate: '45% YoY',
        demand: 'Very High',
        reasoning: 'Your strong technical aptitude and problem-solving skills make you ideal for AI/ML roles',
        skills: ['Python', 'TensorFlow', 'Deep Learning', 'Data Analysis', 'SQL'],
        timeToLearn: '6-12 months',
        description: 'Build intelligent systems and machine learning models that solve complex problems'
      })
    }

    // Full-Stack Developer prediction
    if (techComfort >= 6 && interests.includes('Building software/products')) {
      predictions.push({
        title: 'Full-Stack Developer',
        matchScore: Math.min(92, Math.round(60 + (techComfort * 3) + problemSolving)),
        salaryRange: '₹12-30 LPA',
        growthRate: '30% YoY',
        demand: 'High',
        reasoning: 'Your technical interest and problem-solving abilities align well with full-stack development',
        skills: ['React/Vue', 'Node.js', 'TypeScript', 'Databases', 'DevOps'],
        timeToLearn: '4-8 months',
        description: 'Create complete web applications from frontend to backend'
      })
    }

    // Data Scientist prediction
    if (interests.includes('Analyzing data') && problemSolving >= 7) {
      predictions.push({
        title: 'Data Scientist',
        matchScore: Math.min(90, Math.round(60 + (problemSolving * 3) + (techComfort * 2))),
        salaryRange: '₹14-35 LPA',
        growthRate: '40% YoY',
        demand: 'Very High',
        reasoning: 'Your analytical skills and data interest position you perfectly for data science',
        skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Visualization'],
        timeToLearn: '5-10 months',
        description: 'Extract insights from data and drive business decisions'
      })
    }

    // Product Manager prediction
    if (interests.includes('Building software/products') && motivation === 'Leadership opportunities') {
      predictions.push({
        title: 'Product Manager',
        matchScore: Math.min(88, Math.round(60 + (problemSolving * 2) + techComfort)),
        salaryRange: '₹16-35 LPA',
        growthRate: '35% YoY',
        demand: 'High',
        reasoning: 'Your interest in building products and leadership aspirations suit product management',
        skills: ['Product Strategy', 'User Research', 'Analytics', 'Communication', 'Technical Basics'],
        timeToLearn: '3-6 months',
        description: 'Lead product vision and strategy while working cross-functionally'
      })
    }

    // Tech Lead/Architect prediction
    if (techComfort >= 8 && answers['8'] === 'Deep specialization in one domain') {
      predictions.push({
        title: 'Tech Lead / Solution Architect',
        matchScore: Math.min(92, Math.round(70 + (techComfort * 2) + problemSolving)),
        salaryRange: '₹18-42 LPA',
        growthRate: '38% YoY',
        demand: 'Very High',
        reasoning: 'Your deep technical expertise and specialization focus lead to architecture roles',
        skills: ['System Design', 'Architecture Patterns', 'Code Review', 'Mentoring', 'DevOps'],
        timeToLearn: '8-15 months',
        description: 'Design scalable systems and guide technical teams'
      })
    }

    // Data Analyst prediction
    if (interests.includes('Analyzing data') && techComfort >= 5) {
      predictions.push({
        title: 'Data Analyst',
        matchScore: Math.min(85, Math.round(55 + (problemSolving * 2) + (techComfort * 2))),
        salaryRange: '₹8-20 LPA',
        growthRate: '28% YoY',
        demand: 'High',
        reasoning: 'Strong interest in data analysis with technical competence makes this path suitable',
        skills: ['SQL', 'Excel', 'Python', 'Tableau/Power BI', 'Statistics'],
        timeToLearn: '3-6 months',
        description: 'Turn data into actionable insights for business decisions'
      })
    }

    // Default predictions if not enough matches
    if (predictions.length === 0) {
      predictions.push({
        title: 'Software Developer',
        matchScore: 75,
        salaryRange: '₹10-25 LPA',
        growthRate: '25% YoY',
        demand: 'High',
        reasoning: 'Based on your interests and skills, software development is a solid career path',
        skills: ['Programming', 'Problem Solving', 'Databases', 'Web Development', 'Version Control'],
        timeToLearn: '4-6 months',
        description: 'Build software solutions that impact users worldwide'
      })
    }

    return predictions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4)
  }

  const handleNewQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setPredictions([])
    setView('quiz')
  }

  const handleGoDashboard = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Responses...</h2>
          <p className="text-gray-400">Combining your profile and quiz answers to find perfect careers</p>
        </div>
      </div>
    )
  }

  // Results view
  if (view === 'results') {
    const selectedCareer = predictions[selectedCareerIndex] || predictions[0]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden">
        {/* Background effects */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl opacity-40 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <Target className="w-10 h-10 text-slate-900" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Your Perfect Career Matches! 🎯
            </h1>
            <p className="text-xl text-gray-300">
              Select a career below to explore detailed insights
            </p>
          </motion.div>

          {/* Main Layout - Sidebar + Content */}
          <div className="flex gap-6 lg:gap-8">
            {/* Sidebar - Career List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-80 flex-shrink-0"
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-600/30 rounded-2xl p-6 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  Career Options
                </h2>
                <div className="space-y-3">
                  {predictions.map((career, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedCareerIndex(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                        selectedCareerIndex === index
                          ? 'bg-gradient-to-r from-amber-600/40 to-amber-500/20 border-2 border-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-black/20 border border-amber-600/20 hover:bg-black/40 hover:border-amber-600/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold ${selectedCareerIndex === index ? 'text-amber-300' : 'text-white'}`}>
                          {career.title}
                        </h3>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          selectedCareerIndex === index
                            ? 'bg-amber-500/40 text-amber-200'
                            : 'bg-slate-700/40 text-gray-300'
                        }`}>
                          {career.matchScore}%
                        </div>
                      </div>
                      <p className={`text-sm ${selectedCareerIndex === index ? 'text-amber-100' : 'text-gray-400'}`}>
                        {career.demand} demand
                      </p>
                      {selectedCareerIndex === index && (
                        <motion.div
                          layoutId="activeCareer"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-l-xl"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content - Selected Career Details */}
            <motion.div
              key={selectedCareerIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-w-0"
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-600/30 rounded-2xl overflow-hidden">
                {/* Career Header Section */}
                <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 p-8 border-b border-amber-600/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedCareer.title}</h2>
                      <p className="text-gray-300 text-lg">{selectedCareer.reasoning}</p>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full w-32 h-32 flex items-center justify-center flex-shrink-0 ml-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-slate-900">{selectedCareer.matchScore}%</div>
                        <div className="text-xs font-semibold text-slate-900">Match Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Career Highlights - Expanded (outside compact boxes) */}
                  <div className="mt-6 border-t border-amber-500/20 pt-5">
                    <h3 className="text-lg font-bold text-amber-200 mb-4">Career Highlights</h3>
                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
                      <div>
                        <p className="text-xs text-amber-400 uppercase tracking-wide">Salary Range</p>
                        <p className="text-base font-semibold text-white mt-1">{selectedCareer.salaryRange}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-400 uppercase tracking-wide">Growth Rate</p>
                        <p className="text-base font-semibold text-green-300 mt-1">{selectedCareer.growthRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-400 uppercase tracking-wide">Market Demand</p>
                        <p className="text-base font-semibold text-blue-300 mt-1">{selectedCareer.demand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-400 uppercase tracking-wide">Time To Learn</p>
                        <p className="text-base font-semibold text-purple-300 mt-1">{selectedCareer.timeToLearn}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-6 max-h-[calc(100vh-600px)] overflow-y-auto">
                  {/* Complete Overview */}
                  {selectedCareer.completeOverview && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 rounded-3xl border-2 border-amber-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Complete Overview</h3>
                          <p className="text-amber-300/60 text-xs font-medium">Comprehensive Career Information</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-amber-900/10 via-orange-900/5 to-amber-900/10 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
                        <p className="text-slate-100 leading-8 text-sm font-medium">
                          {selectedCareer.completeOverview}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  {selectedCareer.aiInsights && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-violet-900/30 rounded-3xl border-2 border-purple-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/40 to-violet-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">AI Insights & Recommendations</h3>
                          <p className="text-purple-300/60 text-xs font-medium">Personalized Analysis</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-violet-900/10 to-purple-900/5 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                        <div className="space-y-4">
                          {typeof selectedCareer.aiInsights === 'string' ? (
                            <p className="text-gray-300 leading-relaxed text-sm">{selectedCareer.aiInsights}</p>
                          ) : (
                            <>
                              <div>
                                <p className="text-purple-300 font-semibold mb-2 text-sm">🎯 Personalized Recommendation:</p>
                                <p className="text-gray-300 text-sm">{(selectedCareer.aiInsights as any).personalizedRecommendation}</p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-green-400 font-semibold mb-2 text-sm">✅ Your Strength Areas:</p>
                                  <ul className="space-y-1">
                                    {(selectedCareer.aiInsights as any).strengthAreas?.map((area: string, idx: number) => (
                                      <li key={idx} className="text-xs text-gray-300">• {area}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-orange-400 font-semibold mb-2 text-sm">🎓 Development Areas:</p>
                                  <ul className="space-y-1">
                                    {(selectedCareer.aiInsights as any).developmentAreas?.map((area: string, idx: number) => (
                                      <li key={idx} className="text-xs text-gray-300">• {area}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div>
                                <p className="text-blue-400 font-semibold mb-2 text-sm">🔑 Success Factors:</p>
                                <ul className="space-y-1">
                                  {(selectedCareer.aiInsights as any).successFactors?.map((factor: string, idx: number) => (
                                    <li key={idx} className="text-xs text-gray-300">✨ {factor}</li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills Gap Analysis */}
                  {selectedCareer.skillsGap && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-cyan-900/30 rounded-3xl border-2 border-cyan-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Skills Gap Analysis</h3>
                          <p className="text-cyan-300/60 text-xs font-medium">Track your skill development</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-cyan-900/10 to-blue-900/5 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
                        <div className="space-y-3">
                          {Array.isArray(selectedCareer.skillsGap) ? (
                            selectedCareer.skillsGap.map((item: any, idx: number) => (
                              <div key={idx} className="p-3 bg-black/30 rounded-lg border border-cyan-600/20">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-cyan-300 text-sm">{item.skill}</span>
                                  <span className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-300 rounded">Gap: {item.gap}</span>
                                </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-400">Current</p>
                                  <p className="text-green-400 font-semibold">{item.currentLevel}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Required</p>
                                  <p className="text-orange-400 font-semibold">{item.requiredLevel}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-400">Time</p>
                                  <p className="text-blue-400 font-semibold text-xs">{item.gap.split('-')[0]}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div>
                              <p className="text-cyan-300 font-semibold mb-2 text-sm">✅ Current Skills:</p>
                              <div className="flex flex-wrap gap-2">
                                {(selectedCareer.skillsGap as any).currentSkills?.map((skill: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-green-600/20 text-green-300 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-orange-400 font-semibold mb-2 text-sm">🎯 Skills to Learn:</p>
                              <div className="flex flex-wrap gap-2">
                                {(selectedCareer.skillsGap as any).needToLearn?.map((skill: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-orange-600/20 text-orange-300 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  )}
                  {selectedCareer.smartTips && selectedCareer.smartTips.length > 0 && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-900/30 rounded-3xl border-2 border-green-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Smart Tips for Success</h3>
                          <p className="text-green-300/60 text-xs font-medium">Proven strategies for success</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-2xl border border-green-500/30 backdrop-blur-sm">
                        <ul className="space-y-2">
                          {selectedCareer.smartTips.map((tip, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-gray-300">
                              <span className="text-green-400 font-bold flex-shrink-0">💭</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Risk Assessment & Mitigation */}
                  {selectedCareer.riskAssessment && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-red-900/30 rounded-3xl border-2 border-red-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500/40 to-orange-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">Risk Assessment & Mitigation</h3>
                          <p className="text-red-300/60 text-xs font-medium">Understanding potential challenges</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-red-900/20 to-orange-900/10 rounded-2xl border border-red-500/30 backdrop-blur-sm">
                        <div className="space-y-4">
                          {(selectedCareer.riskAssessment as any).riskFactors ? (
                            <>
                              <div>
                                <p className="text-red-300 font-semibold mb-2 text-sm">🚨 Risk Factors:</p>
                                <ul className="space-y-2">
                                  {(selectedCareer.riskAssessment as any).riskFactors.map((risk: string, idx: number) => (
                                    <li key={idx} className="text-xs text-gray-300 flex gap-2">
                                      <span className="text-red-400">⚠️</span>
                                      <span>{risk}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-green-400 font-semibold mb-2 text-sm">✅ Mitigation Strategies:</p>
                                <ul className="space-y-2">
                                  {(selectedCareer.riskAssessment as any).mitigationStrategies.map((strategy: string, idx: number) => (
                                    <li key={idx} className="text-xs text-gray-300 flex gap-2">
                                      <span className="text-green-400">→</span>
                                      <span>{strategy}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-red-300 font-semibold text-sm">🤖 Automation Risk:</p>
                                <p className="text-xs text-gray-300 mt-1">{(selectedCareer.riskAssessment as any).automationRisk}</p>
                              </div>
                              <div>
                                <p className="text-yellow-400 font-semibold text-sm">📉 Market Volatility:</p>
                                <p className="text-xs text-gray-300 mt-1">{(selectedCareer.riskAssessment as any).marketVolatility}</p>
                              </div>
                              <div>
                                <p className="text-orange-400 font-semibold text-sm">💰 Salary Risk:</p>
                                <p className="text-xs text-gray-300 mt-1">{(selectedCareer.riskAssessment as any).salaryRisk}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Market Analysis - Accordion */}
                  {selectedCareer.marketAnalysis && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-blue-900/30 rounded-3xl border-2 border-blue-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Market Analysis</h3>
                          <p className="text-blue-300/60 text-xs font-medium">Industry insights & trends</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
                        <div className="space-y-2 text-xs text-gray-300">
                          <p><span className="text-blue-300 font-semibold">📍 Current Market:</span> {selectedCareer.marketAnalysis.currentMarket}</p>
                          <p><span className="text-blue-300 font-semibold">📈 Job Openings:</span> {selectedCareer.marketAnalysis.jobOpenings}</p>
                          <p><span className="text-blue-300 font-semibold">🏆 Competition:</span> {selectedCareer.marketAnalysis.competitionLevel}</p>
                          <p><span className="text-blue-300 font-semibold">🔮 Trend:</span> {selectedCareer.marketAnalysis.marketTrend}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Industry Overview - Accordion */}
                  {selectedCareer.industryOverview && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-900/30 via-teal-900/20 to-green-900/30 rounded-3xl border-2 border-green-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/40 to-teal-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">🏢</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent">Industry Overview</h3>
                          <p className="text-green-300/60 text-xs font-medium">Market structure & key players</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-900/20 to-teal-900/10 rounded-2xl border border-green-500/30 backdrop-blur-sm">
                        <div className="space-y-2 text-xs text-gray-300">
                          <p><span className="text-green-300 font-semibold">Industry:</span> {selectedCareer.industryOverview.industry}</p>
                          <p><span className="text-green-300 font-semibold">Market Size:</span> {selectedCareer.industryOverview.marketSize}</p>
                          <p><span className="text-green-300 font-semibold">Key Players:</span> {selectedCareer.industryOverview.majorPlayers.join(', ')}</p>
                          <p><span className="text-green-300 font-semibold">Innovations:</span> {selectedCareer.industryOverview.innovations.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Career Milestones - Accordion */}
                  {selectedCareer.careerMilestones && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-amber-900/30 rounded-3xl border-2 border-yellow-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/40 to-amber-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">Career Milestones & Progression</h3>
                          <p className="text-yellow-300/60 text-xs font-medium">Your Growth Timeline</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-amber-900/20 via-yellow-900/10 to-amber-900/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
                        <div className="space-y-3">
                          {selectedCareer.careerMilestones.map((milestone, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-600/15 to-amber-600/15 rounded-2xl border-l-4 border-yellow-400"
                            >
                              <div className="bg-gradient-to-br from-yellow-500 to-amber-500 px-3 py-1 rounded-lg flex-shrink-0 shadow-lg">
                                <span className="font-bold text-gray-900 text-sm">Yr {milestone.year}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-100 text-sm font-semibold">{milestone.milestone}</p>
                                <p className="text-yellow-200/80 text-xs font-medium">Expected Salary: <span className="text-yellow-300 font-bold">{milestone.salary}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Opportunities - Accordion */}
                  {selectedCareer.opportunities && (
                    <div>
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 rounded-3xl border-2 border-purple-500/50 backdrop-blur-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Top Opportunities</h3>
                          <p className="text-purple-300/60 text-xs font-medium">Career advancement paths</p>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
                        <div className="grid grid-cols-1 gap-2">
                          {selectedCareer.opportunities.map((opp, idx) => (
                            <div key={idx} className="flex gap-2 p-2 text-xs">
                              <span className="text-purple-400 flex-shrink-0">→</span>
                              <p className="text-gray-300">{opp}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Skills to Develop */}
                  <div>
                    <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-900/30 rounded-3xl border-2 border-amber-500/50 backdrop-blur-xl mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">🔧</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Key Skills to Develop</h3>
                        <p className="text-amber-300/60 text-xs font-medium">Essential technical skills</p>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-amber-900/20 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skills.map((skill, idx) => (
                          <span key={idx} className="px-4 py-2 bg-amber-600/20 text-amber-300 font-semibold rounded-full border border-amber-600/30 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push(`/career-roadmap?career=${encodeURIComponent(selectedCareer.title)}`)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-amber-500/50"
                  >
                    View Detailed Roadmap & Learning Resources →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <button
              onClick={handleNewQuiz}
              className="px-8 py-3 border-2 border-amber-500 text-amber-300 font-semibold rounded-lg hover:bg-amber-600/10 transition"
            >
              Retake Assessment
            </button>
            <button
              onClick={handleGoDashboard}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
            >
              Go to Dashboard →
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Quiz view (default)
  const currentQ = predictionQuizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / predictionQuizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl opacity-40 pointer-events-none"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <div className="absolute top-4 right-4">
          <BackButton />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Career Assessment Quiz</h1>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <span>Question {currentQuestion + 1} of {predictionQuizQuestions.length}</span>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 rounded-full h-2 mb-10">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
          />
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 border border-amber-600/30 rounded-2xl p-8 mb-8 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-8">{currentQ.question}</h2>

          {/* Question Answers */}
          {currentQ.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentQ.options?.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${
                    answers[currentQ.id] === option
                      ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                      : 'border-gray-600 bg-slate-700/30 text-gray-300 hover:border-amber-400'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}

          {currentQ.type === 'scale' && (
            <div className="flex justify-between items-center gap-2">
              {currentQ.options?.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(idx + 1)}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold transition ${
                    answers[currentQ.id] === idx + 1
                      ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                      : 'border-gray-600 bg-slate-700/30 text-gray-300 hover:border-amber-400'
                  }`}
                >
                  {idx + 1}
                </motion.button>
              ))}
            </div>
          )}

          {currentQ.type === 'multi_select' && (
            <div className="space-y-3">
              {currentQ.options?.map((option) => {
                const isSelected = Array.isArray(answers[currentQ.id]) && answers[currentQ.id].includes(option)
                return (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const current = answers[currentQ.id] || []
                      if (isSelected) {
                        handleAnswer(current.filter((a: string) => a !== option))
                      } else {
                        handleAnswer([...current, option])
                      }
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold flex items-center gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                        : 'border-gray-600 bg-slate-700/30 text-gray-300 hover:border-amber-400'
                    }`}
                  >
                    <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                      isSelected ? 'border-amber-500 bg-amber-600' : 'border-gray-600'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4" />}
                    </div>
                    {option}
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: currentQuestion === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentQuestion === 0 ? 1 : 0.95 }}
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-amber-400 hover:text-amber-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextQuestion}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
          >
            {currentQuestion === predictionQuizQuestions.length - 1 ? (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Predictions
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
