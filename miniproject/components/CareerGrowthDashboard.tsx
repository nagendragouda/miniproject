'use client'

/**
 * 📊 Career Growth Tracking Dashboard
 * Display career progress, milestones, skills, and trends over time
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Flame,
  Users,
  BookOpen
} from 'lucide-react'
import {
  CareerGrowthData,
  getOrCreateCareerGrowthData,
  calculateGrowthMetrics,
  getMilestoneTimeline,
  getCareerProgressionPercentage,
  getSkillMasterySummary,
  addMilestone,
  addCareerEntry,
  updateSkillProgress,
  saveCareerGrowthData
} from '@/lib/careerGrowthTracker'

interface CareerGrowthDashboardProps {
  userId?: string
}

export default function CareerGrowthDashboard({ userId = 'user_default' }: CareerGrowthDashboardProps) {
  const [careerData, setCareerData] = useState<CareerGrowthData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'skills' | 'goals' | 'trends'>('overview')
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    category: 'achievement' as const,
    impact: 'medium' as const,
    status: 'completed' as const
  })

  // Initialize data
  useEffect(() => {
    const data = getOrCreateCareerGrowthData(userId)
    setCareerData(data)
  }, [userId])

  if (!careerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const metrics = calculateGrowthMetrics(careerData)
  const progression = getCareerProgressionPercentage(careerData)
  const skillSummary = getSkillMasterySummary(careerData)

  const handleAddMilestone = () => {
    if (milestoneForm.title.trim()) {
      const updatedData = addMilestone(careerData, milestoneForm)
      setCareerData(updatedData)
      saveCareerGrowthData(updatedData)
      setMilestoneForm({
        title: '',
        description: '',
        category: 'achievement',
        impact: 'medium',
        status: 'completed'
      })
      setShowAddMilestone(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-4 md:p-8 pt-6 md:pt-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12 pt-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3 leading-tight">
            📈 Career Growth Tracker
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">Track your professional journey and celebrate milestones</p>
        </motion.div>

        {/* Key Metrics Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {/* Current Role Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">Current Role</h3>
              <Users className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{careerData.currentRole || 'Not Set'}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Started {new Date(careerData.startDate).toLocaleDateString()}</p>
          </div>

          {/* Target Role Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">Target Role</h3>
              <Target className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{careerData.targetRole || 'Not Set'}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">{progression}% progress</p>
          </div>

          {/* Total Milestones */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">Milestones</h3>
              <Award className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{careerData.milestones.length}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">{careerData.milestones.filter((m) => m.status === 'completed').length} completed</p>
          </div>

          {/* Skills Mastered */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm md:text-base">Skills</h3>
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{skillSummary.total}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">{skillSummary.expert} Expert Level</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Career Progression</h2>
            <span className="text-2xl md:text-3xl font-bold text-indigo-600">{progression}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progression}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-600"
            />
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-4">
            Target: {new Date(careerData.targetDate).toLocaleDateString()} ({Math.round((new Date(careerData.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} months remaining)
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-2 md:gap-3 bg-white rounded-lg shadow-md p-3 md:p-4">
            {[
              { id: 'overview' as const, label: '📊 Overview', icon: TrendingUp },
              { id: 'milestones' as const, label: '🏆 Milestones', icon: Award },
              { id: 'skills' as const, label: '⚡ Skills', icon: Zap },
              { id: 'goals' as const, label: '🎯 Goals', icon: Target },
              { id: 'trends' as const, label: '📈 Trends', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-6 py-2 rounded-lg font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-5 md:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Career Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Stats Grid */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <p className="text-gray-700 font-semibold">Average Satisfaction</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{metrics.averageSatisfaction}/10</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <p className="text-gray-700 font-semibold">Skill Growth</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{metrics.skillGrowth}%</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <p className="text-gray-700 font-semibold">Consistency Score</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{metrics.consistency}/10</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border-l-4 border-indigo-600">
                    <p className="text-gray-700 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                      Projects Completed
                    </p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{careerData.projectsCompleted}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-600">
                    <p className="text-gray-700 font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      Certifications
                    </p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{careerData.certificationsClaimed}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-600">
                    <p className="text-gray-700 font-semibold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      Promotions
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{careerData.promotionsEarned}</p>
                  </div>
                </div>
              </div>

              {/* Latest Entries */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Career Updates</h3>
                <div className="space-y-3">
                  {careerData.entries.slice(-5).map((entry, idx) => (
                    <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded">
                      <p className="font-semibold text-gray-800">{entry.role}</p>
                      <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700 mt-1">Rating: {entry.rating}/10 - {entry.notes}</p>
                    </div>
                  ))}
                  {careerData.entries.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No career entries yet. Start tracking your progress!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Milestones</h2>
                <button
                  onClick={() => setShowAddMilestone(!showAddMilestone)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> Add Milestone
                </button>
              </div>

              {showAddMilestone && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-indigo-300">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                    <textarea
                      placeholder="Description"
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      rows={3}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <select
                        aria-label="Milestone category"
                        value={milestoneForm.category}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, category: e.target.value as any })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      >
                        <option value="skill">Skill</option>
                        <option value="project">Project</option>
                        <option value="achievement">Achievement</option>
                        <option value="certification">Certification</option>
                        <option value="promotion">Promotion</option>
                        <option value="goal">Goal</option>
                      </select>
                      <select
                        aria-label="Milestone status"
                        value={milestoneForm.status}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value as any })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="planned">Planned</option>
                      </select>
                      <select
                        aria-label="Milestone impact level"
                        value={milestoneForm.impact}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, impact: e.target.value as any })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                      >
                        <option value="low">Low Impact</option>
                        <option value="medium">Medium Impact</option>
                        <option value="high">High Impact</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddMilestone}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                      >
                        Save Milestone
                      </button>
                      <button
                        onClick={() => setShowAddMilestone(false)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Milestones List */}
              <div className="space-y-3">
                {getMilestoneTimeline(careerData).map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                      milestone.impact === 'high'
                        ? 'border-red-500 bg-red-50'
                        : milestone.impact === 'medium'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{milestone.title}</p>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(milestone.date).toLocaleDateString()} • {milestone.category}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          milestone.status === 'completed'
                            ? 'bg-green-200 text-green-800'
                            : milestone.status === 'in-progress'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Skill Mastery</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-6 border-l-4 border-red-600">
                  <p className="text-gray-700 font-semibold">Expert Level (8-10)</p>
                  <p className="text-4xl font-bold text-red-600 mt-2">{skillSummary.expert}</p>
                  <p className="text-sm text-gray-600 mt-2">Mastered skills</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
                  <p className="text-gray-700 font-semibold">Intermediate (5-7)</p>
                  <p className="text-4xl font-bold text-orange-600 mt-2">{skillSummary.intermediate}</p>
                  <p className="text-sm text-gray-600 mt-2">Developing skills</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <p className="text-gray-700 font-semibold">Beginner (1-4)</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{skillSummary.beginner}</p>
                  <p className="text-sm text-gray-600 mt-2">Learning skills</p>
                </div>
              </div>

              {/* Skills Progress */}
              <div className="space-y-4">
                {careerData.skillProgress.map((skill) => (
                  <div key={skill.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{skill.name}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${skill.currentLevel >= 8 ? 'bg-red-200 text-red-800' : skill.currentLevel >= 5 ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'}`}>
                        Level {skill.currentLevel}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.currentLevel / 10) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Target: {skill.targetLevel}/10 • {skill.yearsToAchieve} years to mastery
                    </p>
                  </div>
                ))}
                {careerData.skillProgress.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No skills tracked yet. Add milestones to track skills!</p>
                )}
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Goals</h2>

              <div className="space-y-8">
                {/* Short Term */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" />
                    Short Term (3-6 Months)
                  </h3>
                  <div className="space-y-2">
                    {careerData.goals.shortTerm.map((goal, idx) => (
                      <div key={idx} className="bg-red-50 border-l-4 border-red-500 pl-4 py-3 rounded-r">
                        <p className="text-gray-800">{goal}</p>
                      </div>
                    ))}
                    {careerData.goals.shortTerm.length === 0 && (
                      <p className="text-gray-500 text-center py-4  bg-gray-50 rounded">No short-term goals set</p>
                    )}
                  </div>
                </div>

                {/* Medium Term */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Medium Term (6-12 Months)
                  </h3>
                  <div className="space-y-2">
                    {careerData.goals.mediumTerm.map((goal, idx) => (
                      <div key={idx} className="bg-orange-50 border-l-4 border-orange-500 pl-4 py-3 rounded-r">
                        <p className="text-gray-800">{goal}</p>
                      </div>
                    ))}
                    {careerData.goals.mediumTerm.length === 0 && (
                      <p className="text-gray-500 text-center py-4  bg-gray-50 rounded">No medium-term goals set</p>
                    )}
                  </div>
                </div>

                {/* Long Term */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Long Term (1-5 Years)
                  </h3>
                  <div className="space-y-2">
                    {careerData.goals.longTerm.map((goal, idx) => (
                      <div key={idx} className="bg-indigo-50 border-l-4 border-indigo-500 pl-4 py-3 rounded-r">
                        <p className="text-gray-800">{goal}</p>
                      </div>
                    ))}
                    {careerData.goals.longTerm.length === 0 && (
                      <p className="text-gray-500 text-center py-4  bg-gray-50 rounded">No long-term goals set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Trends & Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Projects Trend */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Projects Completed (Last 6 Periods)</h3>
                  <div className="space-y-3">
                    {metrics.projectsTrend.map((trend, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-700">{trend.date}</p>
                          <span className="font-bold text-indigo-600">{trend.projects}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(trend.projects / Math.max(...metrics.projectsTrend.map((t) => t.projects), 1)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-indigo-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Trend */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Salary Progress (Last 6 Updates)</h3>
                  <div className="space-y-3">
                    {metrics.salaryTrend.length > 0 ? (
                      metrics.salaryTrend.map((trend, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-gray-700">{trend.date}</p>
                            <span className="font-bold text-green-600">₹{(trend.salary / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(trend.salary / Math.max(...metrics.salaryTrend.map((t) => t.salary), 1)) * 100}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-green-600"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No salary data available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Key Insights
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>• Your consistency score is {metrics.consistency}/10 - {'Keep logging your progress regularly!'}</p>
                  <p>• At your current pace, you'll reach your target role in approximately {metrics.estimatedTimeToTarget} months</p>
                  <p>• You've improved {metrics.skillGrowth}% in overall skill development</p>
                  <p>• Your satisfaction rating has been stable at {metrics.averageSatisfaction}/10</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
