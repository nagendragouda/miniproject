'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import { TrendingUp, Award, BookOpen, Code2, BrainCircuit, Zap, Users, Briefcase, Target, Clock, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AIRoadmapPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compared, setCompared] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [generatedRoadmaps, setGeneratedRoadmaps] = useState<any[]>([])

  // Check auth
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🔐 User not authenticated, redirecting to signin')
      router.push('/auth/signin?next=/ai-roadmap')
      return
    }
  }, [user, authLoading, router])

  // Fetch user profile and career predictions
  useEffect(() => {
    if (user?.uid) {
      fetchUserProfile()
    }
  }, [user?.uid])

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true)
      console.log('📊 Fetching user profile and career predictions...')

      // Get career predictions from localStorage
      const profileData = localStorage.getItem('profileForCareerPrediction')
      const careerResultsData = localStorage.getItem('careerResultsForRoadmap')
      
      if (profileData) {
        const profile = JSON.parse(profileData)
        setUserProfile(profile)
        console.log('✅ Profile loaded:', profile)
      }

      if (careerResultsData) {
        const results = JSON.parse(careerResultsData)
        console.log('✅ Career results loaded:', results)
        setGeneratedRoadmaps(results.careers || [])
      } else {
        console.log('⚠️ No career predictions found, showing general roadmaps')
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  if (authLoading || loadingProfile) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  const topCareers = [
    {
      id: 1,
      title: 'Data Scientist',
      category: 'AI/ML',
      salary: '₹10-30 LPA',
      growth: '36%',
      description: 'Build AI models and extract insights from data',
      skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
      difficulty: 'Advanced',
      timeToLearn: '12-18 months',
      prerequisites: ['Math', 'Programming', 'Statistics'],
      roadmap: [
        { phase: 'Foundation', duration: '3 months', items: ['Python Basics', 'Statistics', 'Linear Algebra'] },
        { phase: 'Core ML', duration: '4 months', items: ['Supervised Learning', 'Unsupervised Learning', 'Feature Engineering'] },
        { phase: 'Advanced', duration: '3 months', items: ['Deep Learning', 'NLP', 'Computer Vision'] },
        { phase: 'Projects', duration: '2 months', items: ['Build 3+ ML projects', 'Kaggle competitions', 'Portfolio building'] }
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: BrainCircuit
    },
    {
      id: 2,
      title: 'Cloud Architect',
      category: 'Infrastructure',
      salary: '₹15-40 LPA',
      growth: '29%',
      description: 'Design and manage scalable cloud infrastructure',
      skills: ['AWS', 'Azure', 'DevOps', 'Docker', 'Kubernetes'],
      difficulty: 'Advanced',
      timeToLearn: '10-14 months',
      prerequisites: ['Linux', 'Networking', 'System Design'],
      roadmap: [
        { phase: 'Foundation', duration: '2 months', items: ['Cloud Basics', 'Networking', 'Linux Administration'] },
        { phase: 'Core Services', duration: '3 months', items: ['Compute', 'Storage', 'Databases', 'Security'] },
        { phase: 'Advanced', duration: '3 months', items: ['Containerization', 'Microservices', 'IaC'] },
        { phase: 'Certification', duration: '2 months', items: ['AWS Solutions Architect', 'Practice Exams', 'Project'] }
      ],
      color: 'from-orange-500 to-red-500',
      icon: Code2
    },
    {
      id: 3,
      title: 'AI/ML Engineer',
      category: 'AI/ML',
      salary: '₹12-35 LPA',
      growth: '44%',
      description: 'Develop production-ready AI and machine learning systems',
      skills: ['Python', 'MLOps', 'Deep Learning', 'Cloud', 'System Design'],
      difficulty: 'Advanced',
      timeToLearn: '14-16 months',
      prerequisites: ['Programming', 'Math', 'ML Basics'],
      roadmap: [
        { phase: 'Foundation', duration: '3 months', items: ['Python Advanced', 'ML Fundamentals', 'Mathematics'] },
        { phase: 'ML Systems', duration: '4 months', items: ['Model Training', 'Evaluation', 'Optimization', 'Scaling'] },
        { phase: 'Production', duration: '3 months', items: ['MLOps', 'Deployment', 'Monitoring', 'A/B Testing'] },
        { phase: 'Projects', duration: '2 months', items: ['End-to-end projects', 'Paper implementation', 'Research readings'] }
      ],
      color: 'from-purple-500 to-pink-500',
      icon: Zap
    },
    {
      id: 4,
      title: 'Product Manager',
      category: 'Product',
      salary: '₹12-40 LPA',
      growth: '15%',
      description: 'Lead product strategy and drive business impact',
      skills: ['Strategy', 'Analytics', 'Communication', 'Technical', 'Leadership'],
      difficulty: 'Intermediate',
      timeToLearn: '8-12 months',
      prerequisites: ['Domain Knowledge', 'Business Acumen', 'Tech Basics'],
      roadmap: [
        { phase: 'Foundation', duration: '2 months', items: ['PM Fundamentals', 'User Research', 'Market Analysis'] },
        { phase: 'Core Skills', duration: '3 months', items: ['Roadmapping', 'Metrics', 'Prioritization', 'User Stories'] },
        { phase: 'Advanced', duration: '2 months', items: ['Strategy', 'Stakeholder Management', 'Negotiation'] },
        { phase: 'Experience', duration: '3 months', items: ['Mentor shadowing', 'Case studies', 'PM interviews'] }
      ],
      color: 'from-green-500 to-emerald-500',
      icon: Target
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      category: 'Infrastructure',
      salary: '₹10-28 LPA',
      growth: '25%',
      description: 'Automate and optimize software deployment and infrastructure',
      skills: ['CI/CD', 'Docker', 'Kubernetes', 'Scripting', 'Cloud'],
      difficulty: 'Intermediate',
      timeToLearn: '9-12 months',
      prerequisites: ['Linux', 'Programming', 'System Admin'],
      roadmap: [
        { phase: 'Foundation', duration: '2 months', items: ['Linux Mastery', 'Scripting', 'Networking'] },
        { phase: 'Core Tools', duration: '3 months', items: ['Git', 'Docker', 'CI/CD Pipelines', 'Infrastructure'] },
        { phase: 'Advanced', duration: '2 months', items: ['Kubernetes', 'Terraform', 'Monitoring', 'Security'] },
        { phase: 'Hands-on', duration: '3 months', items: ['Build pipelines', 'Automate deployments', 'Optimize systems'] }
      ],
      color: 'from-indigo-500 to-blue-500',
      icon: Code2
    },
    {
      id: 6,
      title: 'UX Designer',
      category: 'Design',
      salary: '₹8-22 LPA',
      growth: '13%',
      description: 'Create intuitive and beautiful user experiences',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Psychology'],
      difficulty: 'Intermediate',
      timeToLearn: '8-10 months',
      prerequisites: ['Design Basics', 'Creativity', 'Technical Awareness'],
      roadmap: [
        { phase: 'Foundation', duration: '2 months', items: ['Design Principles', 'Color Theory', 'Typography', 'User Psychology'] },
        { phase: 'Tools & Methods', duration: '3 months', items: ['Figma', 'Prototyping', 'User Research', 'Testing'] },
        { phase: 'Advanced', duration: '2 months', items: ['Design Systems', 'Accessibility', 'Animation', 'Mobile Design'] },
        { phase: 'Portfolio', duration: '3 months', items: ['Case studies', 'Project portfolio', 'Design critiques'] }
      ],
      color: 'from-pink-500 to-rose-500',
      icon: Award
    },
    {
      id: 7,
      title: 'Business Analyst',
      category: 'Business',
      salary: '₹8-20 LPA',
      growth: '18%',
      description: 'Bridge business needs with technical solutions',
      skills: ['Analysis', 'SQL', 'Excel', 'Communication', 'Documentation'],
      difficulty: 'Beginner',
      timeToLearn: '6-9 months',
      prerequisites: ['Communication', 'Logical Thinking', 'Business Sense'],
      roadmap: [
        { phase: 'Foundation', duration: '2 months', items: ['BA Fundamentals', 'Requirements gathering', 'Documentation'] },
        { phase: 'Technical Skills', duration: '2 months', items: ['SQL Basics', 'Excel Advanced', 'Tools'] },
        { phase: 'Business Skills', duration: '2 months', items: ['Process Mapping', 'Stakeholder Management', 'Testing'] },
        { phase: 'Experience', duration: '2 months', items: ['Real projects', 'Case studies', 'BA interviews'] }
      ],
      color: 'from-teal-500 to-cyan-500',
      icon: Briefcase
    },
    {
      id: 8,
      title: 'Software Engineer',
      category: 'Development',
      salary: '₹8-25 LPA',
      growth: '22%',
      description: 'Build scalable software applications and systems',
      skills: ['Programming', 'System Design', 'Databases', 'APIs', 'Testing'],
      difficulty: 'Intermediate',
      timeToLearn: '12-14 months',
      prerequisites: ['Programming Basics', 'Logic', 'Problem Solving'],
      roadmap: [
        { phase: 'Foundation', duration: '3 months', items: ['Core Programming', 'Data Structures', 'Algorithms'] },
        { phase: 'Web Dev', duration: '3 months', items: ['Frontend', 'Backend', 'Databases', 'APIs'] },
        { phase: 'Advanced', duration: '3 months', items: ['System Design', 'Scalability', 'Testing', 'DevOps'] },
        { phase: 'Projects', duration: '2 months', items: ['Build projects', 'Open source', 'Interview prep'] }
      ],
      color: 'from-yellow-500 to-orange-500',
      icon: Code2
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Back Button */}
      <div className="absolute top-4 right-4 z-50">
        <BackButton />
      </div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <BrainCircuit className="w-16 h-16 mx-auto" />
            <h1 className="text-5xl font-bold">AI-Powered Career Roadmaps</h1>
            <p className="text-xl text-blue-100">
              {userProfile?.educationLevel ? `Based on your ${userProfile.educationLevel} education level` : 'Discover your ideal career path with personalized learning roadmaps'}
            </p>
            {userProfile?.name && (
              <p className="text-lg text-blue-200 font-semibold">Welcome, {userProfile.name}! 👋</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Features Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-md rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              Roadmap Generator Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Feature 1 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 cursor-pointer border border-blue-400/30 hover:border-blue-400/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center group-hover:bg-blue-500/50 transition-colors">
                    <BrainCircuit className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">AI Analysis</h3>
                </div>
                <p className="text-sm text-slate-300">Get personalized career recommendations based on your profile</p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 cursor-pointer border border-purple-400/30 hover:border-purple-400/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center group-hover:bg-purple-500/50 transition-colors">
                    <BookOpen className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-purple-200 transition-colors">Learning Paths</h3>
                </div>
                <p className="text-sm text-slate-300">Structured roadmaps with phases, skills, and resources</p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 cursor-pointer border border-green-400/30 hover:border-green-400/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center group-hover:bg-green-500/50 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-green-200 transition-colors">Career Insights</h3>
                </div>
                <p className="text-sm text-slate-300">Salary trends, growth rates, and market demand analysis</p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 cursor-pointer border border-orange-400/30 hover:border-orange-400/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center group-hover:bg-orange-500/50 transition-colors">
                    <Users className="w-6 h-6 text-orange-300" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-orange-200 transition-colors">Compare Careers</h3>
                </div>
                <p className="text-sm text-slate-300">Side-by-side comparison of multiple career paths</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Career Road Map Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 w-full"
        >
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600/50 shadow-2xl w-full">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Target className="w-7 h-7 text-blue-400" />
              <span>Career Road Map</span>
            </h3>
            
            <div className="w-full">
              <div className="hidden md:flex items-center justify-between gap-2 w-full">
                {/* Step 1 */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                    1
                  </div>
                  <p className="text-sm text-slate-200 text-center font-semibold">Explore</p>
                  <p className="text-xs text-slate-400 text-center">Careers</p>
                </motion.div>

                {/* Connector Line 1 */}
                <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-2 mb-8"></div>

                {/* Step 2 */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                    2
                  </div>
                  <p className="text-sm text-slate-200 text-center font-semibold">Analyze</p>
                  <p className="text-xs text-slate-400 text-center">Profile</p>
                </motion.div>

                {/* Connector Line 2 */}
                <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full mx-2 mb-8"></div>

                {/* Step 3 */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                    3
                  </div>
                  <p className="text-sm text-slate-200 text-center font-semibold">Create</p>
                  <p className="text-xs text-slate-400 text-center">Roadmap</p>
                </motion.div>

                {/* Connector Line 3 */}
                <div className="flex-1 h-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mx-2 mb-8"></div>

                {/* Step 4 */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                    4
                  </div>
                  <p className="text-sm text-slate-200 text-center font-semibold">Track</p>
                  <p className="text-xs text-slate-400 text-center">Progress</p>
                </motion.div>

                {/* Connector Line 4 */}
                <div className="flex-1 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-2 mb-8"></div>

                {/* Step 5 */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                    5
                  </div>
                  <p className="text-sm text-slate-200 text-center font-semibold">Achieve</p>
                  <p className="text-xs text-slate-400 text-center">Goals</p>
                </motion.div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden grid grid-cols-5 gap-3">
                {[
                  { num: '1', label: 'Explore', sub: 'Careers', color: 'from-blue-500 to-cyan-500' },
                  { num: '2', label: 'Analyze', sub: 'Profile', color: 'from-purple-500 to-pink-500' },
                  { num: '3', label: 'Create', sub: 'Roadmap', color: 'from-green-500 to-emerald-500' },
                  { num: '4', label: 'Track', sub: 'Progress', color: 'from-orange-500 to-red-500' },
                  { num: '5', label: 'Achieve', sub: 'Goals', color: 'from-yellow-500 to-amber-500' }
                ].map((step) => (
                  <motion.div
                    key={step.num}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg mb-2`}>
                      {step.num}
                    </div>
                    <p className="text-xs text-slate-200 text-center font-semibold">{step.label}</p>
                    <p className="text-xs text-slate-400 text-center">{step.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter/Mode Toggle */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white">Top Career Paths</h2>
          <button
            onClick={() => {
              setCompareMode(!compareMode)
              setCompared([])
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              compareMode
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            {compareMode ? '✓ Compare Mode' : 'Compare Careers'}
          </button>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {topCareers.map((career) => {
            const IconComponent = career.icon
            const isSelected = selectedCareer === career.id.toString()
            const isCompared = compared.includes(career.id.toString())

            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: career.id * 0.05 }}
                onClick={() => {
                  if (compareMode) {
                    if (isCompared) {
                      setCompared(compared.filter(c => c !== career.id.toString()))
                    } else {
                      setCompared([...compared, career.id.toString()])
                    }
                  } else {
                    setSelectedCareer(isSelected ? null : career.id.toString())
                  }
                }}
                className={`rounded-xl p-6 cursor-pointer transition-all backdrop-blur-sm ${
                  compareMode
                    ? isCompared
                      ? `bg-gradient-to-br ${career.color} text-white shadow-2xl scale-105`
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    : isSelected
                    ? `bg-gradient-to-br ${career.color} text-white shadow-2xl scale-105`
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className="w-8 h-8" />
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-700/50 rounded-full">
                    {career.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{career.title}</h3>
                <p className="text-sm opacity-90 mb-4">{career.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{career.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{career.timeToLearn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>{career.growth} growth</span>
                  </div>
                </div>

                {compareMode && isCompared && (
                  <div className="mt-4 flex items-center gap-2 text-white bg-white/20 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                    <CheckCircle2 className="w-4 h-4" />
                    Selected
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Career Details */}
        {selectedCareer && !compareMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 text-white mb-16 shadow-2xl border border-slate-600"
          >
            {(() => {
              const career = topCareers.find(c => c.id.toString() === selectedCareer)
              if (!career) return null

              return (
                <div>
                  {/* Career Header */}
                  <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-600">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                      <career.icon className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{career.title}</h2>
                      <p className="text-slate-300">{career.description}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Average Salary</p>
                      <p className="text-2xl font-bold text-green-400">{career.salary}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Job Growth</p>
                      <p className="text-2xl font-bold text-blue-400">{career.growth}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Time to Learn</p>
                      <p className="text-2xl font-bold text-purple-400">{career.timeToLearn}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Difficulty</p>
                      <p className="text-2xl font-bold text-orange-400">{career.difficulty}</p>
                    </div>
                  </div>

                  {/* Skills & Prerequisites */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" /> Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 px-3 py-2 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-400" /> Prerequisites
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {career.prerequisites.map((prereq) => (
                          <span
                            key={prereq}
                            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/50 px-3 py-2 rounded-full text-sm font-medium"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Learning Roadmap */}
                  <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-400" /> Learning Roadmap
                    </h3>
                    <div className="space-y-4">
                      {career.roadmap.map((phase, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-400"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-lg">{idx + 1}. {phase.phase}</h4>
                              <p className="text-slate-400 text-sm">{phase.duration}</p>
                            </div>
                            <span className="bg-blue-500/20 px-3 py-1 rounded text-xs font-semibold">Phase {idx + 1}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {phase.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-slate-300">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-10 flex gap-4">
                    <button
                      onClick={() => {
                        // Save career context for roadmap generation
                        localStorage.setItem('selectedCareerForRoadmap', JSON.stringify(career))
                        router.push('/bright-future')
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      Generate My Roadmap
                    </button>
                    <button
                      onClick={() => router.push('/career-personality-quiz')}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}

        {/* Compare Results */}
        {compareMode && compared.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 text-white shadow-2xl border border-slate-600"
          >
            <h3 className="text-2xl font-bold mb-6">Career Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left p-3">Aspect</th>
                    {topCareers
                      .filter(c => compared.includes(c.id.toString()))
                      .map(c => (
                        <th key={c.id} className="text-center p-3">{c.title}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Salary', key: 'salary' },
                    { label: 'Growth Rate', key: 'growth' },
                    { label: 'Time to Learn', key: 'timeToLearn' },
                    { label: 'Difficulty', key: 'difficulty' }
                  ].map((row) => (
                    <tr key={row.key} className="border-b border-slate-600/50">
                      <td className="p-3 font-semibold text-slate-300">{row.label}</td>
                      {topCareers
                        .filter(c => compared.includes(c.id.toString()))
                        .map(c => (
                          <td key={c.id} className="text-center p-3">
                            {c[row.key as keyof typeof c] as string}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* General CTA */}
        {!selectedCareer && !compareMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center shadow-2xl"
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Boost Your Career?</h3>
            <p className="text-lg text-blue-100 mb-8">Take our AI-powered career assessment to get personalized roadmap recommendations.</p>
            <button
              onClick={() => {
                console.log('🎯 Starting career assessment')
                router.push('/career-personality-quiz')
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg font-bold hover:shadow-xl transition-all text-base border-2 border-gradient-to-r from-blue-600 to-purple-600"
            >
              Explore Features →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
