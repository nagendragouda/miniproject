'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Info, ArrowLeft, Zap, Star, BookOpen, TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const CareerTree3D = dynamic(() => import('@/components/CareerTree3D'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center bg-glass-bg rounded-2xl">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading 3D Career Tree...</p>
      </div>
    </div>
  )
})

interface CareerData {
  name: string
  category: string
  description: string
  averageSalary: string
  growthRate: string
  education: string[]
  skills: string[]
  relatedCareers: string[]
  keyActivities: string[]
  workEnvironment: string
}

const careerDatabase: Record<string, CareerData> = {
  'Software Engineer': {
    name: 'Software Engineer',
    category: 'Technology',
    description: 'Design, develop, and maintain software applications and systems using programming languages and development frameworks.',
    averageSalary: '$85,000 - $150,000',
    growthRate: '22%',
    education: ['Computer Science', 'Software Engineering', 'Information Technology'],
    skills: ['Programming', 'Problem Solving', 'Algorithms', 'Database Management', 'Version Control', 'Testing'],
    relatedCareers: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 'Mobile Developer'],
    keyActivities: ['Code Development', 'System Design', 'Bug Fixing', 'Code Review', 'Documentation', 'Testing'],
    workEnvironment: 'Office or Remote, collaborative team environment'
  },
  'Data Scientist': {
    name: 'Data Scientist',
    category: 'Technology',
    description: 'Analyze large datasets to extract insights and build predictive models using statistical methods and machine learning.',
    averageSalary: '$95,000 - $165,000',
    growthRate: '31%',
    education: ['Data Science', 'Statistics', 'Computer Science', 'Mathematics'],
    skills: ['Python/R', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL', 'Research'],
    relatedCareers: ['Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Research Scientist'],
    keyActivities: ['Data Analysis', 'Model Building', 'Research', 'Visualization', 'Reporting', 'Experimentation'],
    workEnvironment: 'Office or Remote, research-focused environment'
  },
  'Digital Marketing Manager': {
    name: 'Digital Marketing Manager',
    category: 'Marketing',
    description: 'Plan and execute digital marketing campaigns across various online platforms to drive brand awareness and sales.',
    averageSalary: '$65,000 - $120,000',
    growthRate: '19%',
    education: ['Marketing', 'Communications', 'Business', 'Digital Media'],
    skills: ['SEO/SEM', 'Social Media', 'Content Strategy', 'Analytics', 'Campaign Management', 'Creativity'],
    relatedCareers: ['Content Marketing Manager', 'Social Media Manager', 'SEO Specialist', 'Brand Manager'],
    keyActivities: ['Campaign Planning', 'Content Creation', 'Analytics Review', 'Strategy Development', 'Team Coordination'],
    workEnvironment: 'Fast-paced office environment, client interaction'
  },
  'UX Designer': {
    name: 'UX Designer',
    category: 'Design',
    description: 'Research user needs and design intuitive, user-friendly interfaces and experiences for digital products.',
    averageSalary: '$70,000 - $130,000',
    growthRate: '13%',
    education: ['Design', 'Psychology', 'Human-Computer Interaction', 'Fine Arts'],
    skills: ['User Research', 'Prototyping', 'Wireframing', 'Design Tools', 'Empathy', 'Visual Communication'],
    relatedCareers: ['UI Designer', 'Product Designer', 'Interaction Designer', 'User Researcher'],
    keyActivities: ['User Research', 'Design Creation', 'Prototyping', 'Testing', 'Collaboration', 'Iteration'],
    workEnvironment: 'Creative studio or office environment, collaborative'
  },
  'Financial Analyst': {
    name: 'Financial Analyst',
    category: 'Finance',
    description: 'Analyze financial data and trends to provide insights for investment decisions and business strategy.',
    averageSalary: '$60,000 - $110,000',
    growthRate: '5%',
    education: ['Finance', 'Economics', 'Accounting', 'Business Administration'],
    skills: ['Financial Modeling', 'Excel', 'Analysis', 'Reporting', 'Attention to Detail', 'Communication'],
    relatedCareers: ['Investment Banker', 'Portfolio Manager', 'Risk Analyst', 'Corporate Finance Analyst'],
    keyActivities: ['Financial Analysis', 'Report Writing', 'Data Interpretation', 'Forecasting', 'Presentations'],
    workEnvironment: 'Corporate office, deadline-driven environment'
  },
  'Product Manager': {
    name: 'Product Manager',
    category: 'Management',
    description: 'Guide product development from conception to launch, coordinating between teams and stakeholders.',
    averageSalary: '$90,000 - $160,000',
    growthRate: '19%',
    education: ['Business', 'Engineering', 'Computer Science', 'MBA'],
    skills: ['Strategic Thinking', 'Leadership', 'Communication', 'Analytics', 'Project Management', 'Market Research'],
    relatedCareers: ['Program Manager', 'Business Analyst', 'Strategy Consultant', 'Marketing Manager'],
    keyActivities: ['Strategy Development', 'Team Coordination', 'Market Research', 'Feature Planning', 'Stakeholder Management'],
    workEnvironment: 'Collaborative office environment, cross-functional teams'
  }
}

const categories = ['All', 'Technology', 'Marketing', 'Design', 'Finance', 'Management']

import BackButton from '@/components/BackButton'
import FloatingShapes from '@/components/FloatingShapes'

export default function CareerTreePage() {
  const [selectedCareer, setSelectedCareer] = useState<string>('Software Engineer')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showInfo, setShowInfo] = useState<boolean>(true)

  const filteredCareers = Object.values(careerDatabase).filter(career => {
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory
    const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const currentCareer = careerDatabase[selectedCareer]

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-end mb-8">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center space-x-2 text-sm font-semibold"
          >
            <Info className="w-4 h-4" />
            <span>{showInfo ? 'Hide' : 'Show'} Info</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
              3D Career Tree
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Explore career paths in an interactive 3D environment. Discover connections between skills, roles, and opportunities.
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search careers or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fm-input pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-text-secondary w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter careers by category"
              title="Filter careers by category"
              className="fm-input w-auto"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-background">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career List */}
          <div className="lg:col-span-1">
            <div className="fm-card p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <Zap className="w-5 h-5 text-secondary mr-2" />
                Career Options ({filteredCareers.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCareers.map((career) => (
                  <button
                    key={career.name}
                    onClick={() => setSelectedCareer(career.name)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCareer === career.name
                        ? 'bg-indigo-50 border border-indigo-200 text-text-primary'
                        : 'bg-slate-50 hover:bg-slate-100 text-text-secondary hover:text-text-primary border border-transparent'
                    }`}
                  >
                    <div className="font-medium">{career.name}</div>
                    <div className="text-sm opacity-75">{career.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <div className="fm-card p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <Star className="w-5 h-5 text-warning mr-2" />
                {currentCareer.name} - Interactive View
              </h3>
              
              <CareerTree3D
                careerPath={currentCareer.name}
                relatedCareers={currentCareer.relatedCareers}
                skills={currentCareer.skills}
              />
            </div>
          </div>
        </div>

        {/* Career Details */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 glass-card p-6"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <BookOpen className="w-6 h-6 text-secondary mr-3" />
                {currentCareer.name} Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overview */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary mb-2">Overview</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{currentCareer.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-warning mb-2">Work Environment</h4>
                    <p className="text-text-secondary text-sm">{currentCareer.workEnvironment}</p>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Salary Range
                    </h4>
                    <p className="text-text-primary font-medium">{currentCareer.averageSalary}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-warning mb-2">Growth Rate</h4>
                    <p className="text-text-primary font-medium">{currentCareer.growthRate} (Above average)</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Education</h4>
                    <div className="space-y-1">
                      {currentCareer.education.map((edu, index) => (
                        <span key={index} className="inline-block bg-slate-100/50 px-2 py-1 rounded text-sm text-text-secondary mr-2 mb-2">
                          {edu}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills & Activities */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary mb-2">Key Skills</h4>
                    <div className="space-y-1">
                      {currentCareer.skills.map((skill, index) => (
                        <span key={index} className="inline-block bg-secondary/20 px-2 py-1 rounded text-sm text-secondary mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-warning mb-2">Key Activities</h4>
                    <div className="space-y-1">
                      {currentCareer.keyActivities.map((activity, index) => (
                        <div key={index} className="text-text-secondary text-sm">• {activity}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Ready to Explore Your Learning Path?</h3>
            <p className="text-text-secondary mb-6">Create a personalized learning roadmap tailored to your goals and interests.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/career-roadmap"
                className="px-6 py-3 bg-gradient-to-r from-secondary to-warning rounded-lg text-space-dark font-bold hover:shadow-lg hover:shadow-secondary/25 transition-all"
              >
                View Roadmap
              </Link>
              <Link
                href="/roadmap"
                className="px-6 py-3 bg-glass-bg border border-secondary/30 rounded-lg text-secondary hover:bg-secondary/10 transition-all"
              >
                Create Learning Path
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}