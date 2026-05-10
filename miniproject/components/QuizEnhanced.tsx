'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Brain, 
  Target,
  Star,
  BarChart3,
  History,
  Play,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Eye,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import 3D components
const CareerTree3D = dynamic(() => import('@/components/CareerTree3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-black/20 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-slate-600 text-sm">Loading 3D Career Tree...</p>
      </div>
    </div>
  )
})

interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'scale' | 'multi_select'
  options?: string[]
  category: 'interests' | 'skills' | 'preferences' | 'values' | 'goals'
}

interface QuizResult {
  careerPath: string
  score: number
  interests: string[]
  skills: string[]
  description: string
  relatedCareers: string[]
  averageSalary: string
  growthProspect: string
}

interface PastQuizResult {
  id: string
  career_path: string
  score: number
  interests: string[]
  skills: string[]
  created_at: string
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What type of work environment energizes you the most?',
    type: 'multiple_choice',
    category: 'preferences',
    options: ['Highly collaborative team environment with constant interaction', 'Independent remote work with minimal meetings', 'Fast-paced startup with changing priorities', 'Structured corporate with clear processes and hierarchy']
  },
  {
    id: '2',
    question: 'How much do you enjoy solving complex technical or analytical problems?',
    type: 'scale',
    category: 'skills',
    options: undefined
  },
  {
    id: '3',
    question: 'What are your strongest professional abilities? (Select all that apply)',
    type: 'multi_select',
    category: 'skills',
    options: ['Technical/Programming skills', 'Data analysis and interpretation', 'Leadership and team management', 'Creative thinking and innovation', 'Communication and persuasion', 'Strategic planning', 'Problem-solving under pressure', 'Teaching and mentoring others']
  },
  {
    id: '4',
    question: 'Which of these work activities intrigue you most? (Select top 3)',
    type: 'multi_select',
    category: 'interests',
    options: ['Building products and software systems', 'Analyzing data to find insights', 'Managing teams and projects', 'Creating designs and user experiences', 'Researching emerging technologies', 'Business development and sales', 'Teaching and knowledge sharing', 'Healthcare and helping others', 'Financial analysis and planning', 'Marketing and content creation']
  },
  {
    id: '5',
    question: 'What motivates you most in your career?',
    type: 'multiple_choice',
    category: 'values',
    options: ['High income and financial security', 'Job security and stability', 'Making a positive social impact', 'Continuous learning and growth', 'Creative freedom and autonomy', 'Recognition and prestige', 'Helping others directly', 'Flexible lifestyle and work-life balance']
  },
  {
    id: '6',
    question: 'How important is each of these to you? (Rate: 1=Not Important, 10=Very Important) - Work-Life Balance',
    type: 'scale',
    category: 'values',
    options: undefined
  },
  {
    id: '7',
    question: 'How do you prefer to learn new skills?',
    type: 'multiple_choice',
    category: 'preferences',
    options: ['Hands-on projects and doing things', 'Online courses and self-study', 'Mentorship and learning from experts', 'Classroom learning with structured curriculum', 'Combination of theoretical and practical', 'Learning by teaching others']
  },
  {
    id: '8',
    question: 'In a team project, you naturally take the role of:',
    type: 'multiple_choice',
    category: 'preferences',
    options: ['Leader who drives decisions', 'Collaborator who contributes equally', 'Technical expert solving problems', 'Organizer who manages details', 'Supporter helping others succeed', 'Independent contributor']
  },
  {
    id: '9',
    question: 'What industries or domains interest you? (Select all that apply)',
    type: 'multi_select',
    category: 'interests',
    options: ['Technology and Software', 'Artificial Intelligence/Machine Learning', 'Finance and Banking', 'Healthcare and Medicine', 'E-Commerce and Retail', 'Education and Training', 'Energy and Sustainability', 'Manufacturing and Operations', 'Real Estate and Construction', 'Entertainment and Media', 'Government and Public Sector', 'Non-profit and Social Impact']
  },
  {
    id: '10',
    question: 'How important is each factor for your next role? - Earning potential',
    type: 'scale',
    category: 'values',
    options: undefined
  },
  {
    id: '11',
    question: 'Which career growth path appeals to you most?',
    type: 'multiple_choice',
    category: 'goals',
    options: ['Become a specialist/expert in one domain', 'Move into management and leadership', 'Start my own business/entrepreneurship', 'Transition between different domains', 'Achieve work-life balance over titles', 'Continuous learning and skill development']
  },
  {
    id: '12',
    question: 'Rate your comfort level with each: - Working with numbers and data',
    type: 'scale',
    category: 'skills',
    options: undefined
  },
  {
    id: '13',
    question: 'Rate your comfort level with each: - Public speaking and presentations',
    type: 'scale',
    category: 'skills',
    options: undefined
  },
  {
    id: '14',
    question: 'What best describes your preferred work schedule?',
    type: 'multiple_choice',
    category: 'preferences',
    options: ['Traditional 9-5 office schedule', 'Flexible hours with core team time', 'Fully remote with complete flexibility', 'Project-based with varying schedules', 'Results-oriented (no strict hours)']
  },
  {
    id: '15',
    question: 'In terms of salary expectations, which resonates with you?',
    type: 'multiple_choice',
    category: 'values',
    options: ['₹5-10 LPA (Entry-level)', '₹10-20 LPA (Mid-level)', '₹20-40 LPA (Senior)', '₹40-75 LPA (Executive)', '₹75+ LPA (Top tier)', 'Salary is secondary to other factors']
  }
]

export default function QuizEnhanced() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [view, setView] = useState<'landing' | 'quiz' | 'results'>('landing')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [pastQuizzes, setPastQuizzes] = useState<PastQuizResult[]>([])
  const [loadingPast, setLoadingPast] = useState(true)
  const [questions, setQuestions] = useState(defaultQuestions)

  useEffect(() => {
    if (user) {
      loadPastQuizzes()
    } else {
      setLoadingPast(false)
    }
  }, [user])

  const loadPastQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz/past-results')
      if (response.ok) {
        const data = await response.json()
        setPastQuizzes(data.results || [])
      }
    } catch (error) {
      console.error('Failed to load past quizzes:', error)
    } finally {
      setLoadingPast(false)
    }
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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
      // Submit quiz with real AI analysis
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
            question: questions.find(q => q.id === questionId)?.question || '',
            type: questions.find(q => q.id === questionId)?.type || 'unknown'
          })),
          personalInfo: {
            interests: extractInterestsFromAnswers(),
            skills: extractSkillsFromAnswers(),
            experience: 'beginner'
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }
      
      const data = await response.json()
      
      // Transform the response to match our QuizResult interface
      const aiResult: QuizResult = {
        careerPath: data.recommendations.primaryCareer.title,
        score: data.recommendations.primaryCareer.match,
        interests: data.recommendations.primaryCareer.skills || [],
        skills: data.recommendations.primaryCareer.skills || [],
        description: data.recommendations.primaryCareer.description,
        relatedCareers: data.recommendations.alternativeCareers?.map((c: any) => c.title) || [],
        averageSalary: data.recommendations.primaryCareer.salaryRange || 'Competitive',
        growthProspect: data.recommendations.primaryCareer.outlook || 'Positive outlook'
      }
      
      setResult(aiResult)
      setView('results')
      toast.success('Quiz completed with AI analysis!')
      
      // Refresh past quizzes
      if (user) {
        await loadPastQuizzes()
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const extractInterestsFromAnswers = () => {
    const interests: string[] = []
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId)
      if (question?.category === 'interests' && Array.isArray(answer)) {
        interests.push(...answer)
      }
    })
    return interests
  }

  const extractSkillsFromAnswers = () => {
    const skills: string[] = []
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId)
      if (question?.category === 'skills' && Array.isArray(answer)) {
        skills.push(...answer)
      }
    })
    return skills
  }

  const startNewQuiz = () => {
    setView('quiz')
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  const restartQuiz = () => {
    startNewQuiz()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20'
    if (score >= 60) return 'from-yellow-500/20 to-amber-500/20'
    return 'from-orange-500/20 to-red-500/20'
  }

  // Loading state
  if (loading) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white flex items-center justify-center">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
        <FloatingShapes />

        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-white mb-3">Analyzing Your Potential...</h2>
          <p className="text-text-secondary text-lg">Our AI is orchestrating your future career roadmap</p>
        </div>
      </main>
    )
  }

  // Results view
  if (view === 'results' && result) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white py-24">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
        <FloatingShapes />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-warning rounded-full flex items-center justify-center">
                <Target className="w-10 h-10 text-space-dark" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Your Perfect Career Match!
            </h1>
            <div className="flex items-center justify-center space-x-2 text-secondary">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-2xl font-bold">{result.score}% Match</span>
              <Star className="w-6 h-6 fill-current" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Career Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-3xl font-bold text-text-primary mb-4">{result.careerPath}</h2>
              
              <p className="text-text-secondary mb-6 leading-relaxed">
                {result.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium text-text-secondary">Salary Range</span>
                  </div>
                  <p className="text-secondary font-bold">{result.averageSalary}</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-warning" />
                    <span className="text-sm font-medium text-text-secondary">Growth</span>
                  </div>
                  <p className="text-warning font-bold text-sm">{result.growthProspect}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Your Top Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full border border-secondary/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Key Skills to Develop</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-warning/20 text-warning text-sm rounded-full border border-warning/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button
                  onClick={restartQuiz}
                  className="flex-1 py-3 px-4 border border-gray-600 text-text-secondary rounded-lg hover:border-secondary hover:text-secondary transition-all"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-secondary to-warning text-space-dark font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setView('landing')}
              className="text-slate-600 hover:text-text-primary transition-colors"
            >
              ← Back to Quiz Hub
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Quiz view
  if (view === 'quiz') {
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white py-24">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
        <FloatingShapes />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-text-primary mb-4">Career Discovery Quiz</h1>
            <div className="flex items-center justify-center space-x-4 text-slate-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-secondary to-warning h-2 rounded-full"
            />
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl mb-8"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
              {currentQ.question}
            </h2>

            {/* Question Content */}
            {currentQ.type === 'scale' && (
              <ScaleQuestion question={currentQ} questionId={currentQ.id} answers={answers} onAnswer={handleAnswer} />
            )}
            
            {currentQ.type === 'multiple_choice' && (
              <MultipleChoiceQuestion question={currentQ} questionId={currentQ.id} answers={answers} onAnswer={handleAnswer} />
            )}
            
            {currentQ.type === 'multi_select' && (
              <MultiSelectQuestion question={currentQ} questionId={currentQ.id} answers={answers} onAnswer={handleAnswer} />
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-600 text-text-secondary rounded-lg hover:border-secondary hover:text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={!answers[currentQ.id]}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary to-warning text-space-dark font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setView('landing')}
              className="text-slate-600 hover:text-text-primary transition-colors"
            >
              ← Back to Quiz Hub
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Landing page view
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-50">
        <BackButton />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-24 h-24 bg-gradient-to-r from-secondary via-primary to-warning rounded-full mx-auto flex items-center justify-center mb-6 relative overflow-hidden"
          >
            <Brain className="w-12 h-12 text-space-dark relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-secondary via-primary to-warning bg-clip-text text-transparent">
              Career Quiz Hub
            </span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover your perfect career path with AI-powered assessments and track your journey over time
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Start New Quiz */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 255, 255, 0.2)" }}
            className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-secondary/30 p-8 cursor-pointer group"
            onClick={startNewQuiz}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-space-dark" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-secondary transition-colors" />
            </div>
            
            <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-secondary transition-colors">
              Start New Assessment
            </h3>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Take our comprehensive AI-powered career assessment to discover your ideal career path with personalized insights and recommendations.
            </p>
            
            <div className="flex items-center text-secondary">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="font-semibold">Powered by Advanced AI</span>
            </div>
          </motion.div>

          {/* View Past Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)" }}
            className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-primary/30 p-8 cursor-pointer group"
          >
            <Link href="/quiz/past-results" className="block">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <History className="w-8 h-8 text-space-dark" />
                </div>
                <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                View Quiz History
              </h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Track your career assessment progress over time and see how your interests and career matches have evolved.
              </p>
              
              <div className="flex items-center text-primary">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-semibold">{pastQuizzes.length} Quiz{pastQuizzes.length !== 1 ? 'es' : ''} Completed</span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Recent Quiz Results Preview */}
        {!loadingPast && pastQuizzes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-secondary" />
              Recent Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pastQuizzes.slice(0, 3).map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-secondary/50 transition-colors group cursor-pointer"
                >
                  <Link href="/quiz/past-results" className="block">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`bg-gradient-to-r ${getScoreBackground(quiz.score)} px-2 py-1 rounded-lg`}>
                        <span className={`text-xs font-bold ${getScoreColor(quiz.score)}`}>
                          {quiz.score}%
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-secondary transition-colors" />
                    </div>
                    
                    <h4 className="font-semibold text-text-primary mb-2 group-hover:text-secondary transition-colors">
                      {quiz.career_path}
                    </h4>
                    
                    <div className="flex items-center text-slate-600 text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(quiz.created_at)}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Link href="/quiz/past-results">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-secondary hover:text-text-primary transition-colors font-semibold"
                >
                  View All Results →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Statistics */}
        {!loadingPast && pastQuizzes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{pastQuizzes.length}</div>
              <div className="text-slate-600 text-sm">Total Assessments</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.round(pastQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) / pastQuizzes.length)}%
              </div>
              <div className="text-slate-600 text-sm">Average Match</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                {Math.max(...pastQuizzes.map(q => q.score))}%
              </div>
              <div className="text-slate-600 text-sm">Best Score</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {new Set(pastQuizzes.map(q => q.career_path)).size}
              </div>
              <div className="text-slate-600 text-sm">Career Paths</div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}


// Question Components
const ScaleQuestion = ({ question, questionId, answers, onAnswer }: any) => {
  const value = answers[questionId] || 5
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onAnswer(questionId, parseInt(e.target.value))}
          className="w-full max-w-md h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #00FFFF 0%, #00FFFF ${value * 10}%, #374151 ${value * 10}%, #374151 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-sm text-slate-600 max-w-md mx-auto">
        <span>1 (Low)</span>
        <span className="text-secondary font-bold text-lg">{value}</span>
        <span>10 (High)</span>
      </div>
    </div>
  )
}

const MultipleChoiceQuestion = ({ question, questionId, answers, onAnswer }: any) => {
  const selectedValue = answers[questionId] || ''
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {question.options?.map((option: string, index: number) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(questionId, option)}
          className={`p-4 rounded-lg border text-left transition-all ${
            selectedValue === option
              ? 'border-secondary bg-secondary/10 text-text-primary'
              : 'border-gray-600 bg-black/20 text-text-secondary hover:border-gray-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full border-2 ${
              selectedValue === option
                ? 'border-secondary bg-secondary'
                : 'border-gray-500'
            }`}>
              {selectedValue === option && (
                <CheckCircle className="w-4 h-4 text-space-dark" />
              )}
            </div>
            <span>{option}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

const MultiSelectQuestion = ({ question, questionId, answers, onAnswer }: any) => {
  const selectedValues = answers[questionId] || []
  
  const toggleOption = (option: string) => {
    const newSelected = selectedValues.includes(option)
      ? selectedValues.filter((item: string) => item !== option)
      : [...selectedValues, option]
    onAnswer(questionId, newSelected)
  }
  
  return (
    <div>
      <p className="text-slate-600 text-sm mb-4">Select all that apply:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options?.map((option: string, index: number) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleOption(option)}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedValues.includes(option)
                ? 'border-secondary bg-secondary/10 text-text-primary'
                : 'border-gray-600 bg-black/20 text-text-secondary hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded border-2 ${
                selectedValues.includes(option)
                  ? 'border-secondary bg-secondary'
                  : 'border-gray-500'
              }`}>
                {selectedValues.includes(option) && (
                  <CheckCircle className="w-4 h-4 text-space-dark" />
                )}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}