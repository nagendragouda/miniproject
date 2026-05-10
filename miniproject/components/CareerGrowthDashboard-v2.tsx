'use client'

/**
 * 📊 Career Growth Dashboard - Production Version
 * Simplified and optimized for reliability
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
} from 'lucide-react'

import type {
  CareerGrowthData,
  CareerMilestone,
} from '@/lib/careerGrowthTracker'

import {
  getOrCreateCareerGrowthData,
  calculateGrowthMetrics,
  getMilestoneTimeline,
  getCareerProgressionPercentage,
  getSkillMasterySummary,
  addMilestone,
  saveCareerGrowthData,
} from '@/lib/careerGrowthTracker'

interface CareerGrowthDashboardProps {
  userId?: string
}

export default function CareerGrowthDashboard({ userId = 'user_default' }: CareerGrowthDashboardProps) {
  const [careerData, setCareerData] = useState<CareerGrowthData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'skills' | 'goals' | 'trends'>('overview')
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    category: 'achievement' as const,
    impact: 'medium' as const,
    status: 'completed' as const,
  })

  // Initialize data on mount
  useEffect(() => {
    try {
      const data = getOrCreateCareerGrowthData(userId)
      if (!data) {
        setError('Failed to initialize career data')
        return
      }
      setCareerData(data)
    } catch (err: any) {
      setError(`Error loading dashboard: ${err.message}`)
      console.error('Dashboard Error:', err)
    }
  }, [userId])

  // Loading state
  if (!careerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        {error ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        )}
      </div>
    )
  }

  // Calculate metrics
  try {
    var metrics = calculateGrowthMetrics(careerData)
    var progression = getCareerProgressionPercentage(careerData)
    var skillSummary = getSkillMasterySummary(careerData)
  } catch (err: any) {
    console.error('Metrics calculation error:', err)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Error</h2>
          <p className="text-gray-700">Failed to calculate metrics: {err.message}</p>
        </div>
      </div>
    )
  }

  // Handle add milestone
  const handleAddMilestone = () => {
    if (!milestoneForm.title.trim()) return

    try {
      const updatedData = addMilestone(careerData, {
        title: milestoneForm.title,
        description: milestoneForm.description,
        category: milestoneForm.category,
        impact: milestoneForm.impact,
        status: milestoneForm.status,
      })
      
      setCareerData(updatedData)
      saveCareerGrowthData(updatedData)

      // Reset form
      setMilestoneForm({
        title: '',
        description: '',
        category: 'achievement',
        impact: 'medium',
        status: 'completed',
      })
      setShowAddMilestone(false)
    } catch (err: any) {
      setError(`Failed to add milestone: ${err.message}`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            📈 Career Growth Tracker
          </h1>
          <p className="text-gray-600 text-lg">Track your professional journey and celebrate milestones</p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded-lg"
          >
            <p className="text-red-800 font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Key Metrics Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Current Role Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Current Role</h3>
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{careerData.currentRole || 'Not Set'}</p>
            <p className="text-sm text-gray-500 mt-2">Started {new Date(careerData.startDate).toLocaleDateString()}</p>
          </div>

          {/* Target Role Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Target Role</h3>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{careerData.targetRole || 'Not Set'}</p>
            <p className="text-sm text-gray-500 mt-2">{progression || 0}% progress</p>
          </div>

          {/* Total Milestones */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Milestones</h3>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{careerData.milestones?.length || 0}</p>
            <p className="text-sm text-gray-500 mt-2">
              {careerData.milestones?.filter((m: any) => m.status === 'completed').length || 0} completed
            </p>
          </div>

          {/* Skills Mastered */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Skills</h3>
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{skillSummary?.total || 0}</p>
            <p className="text-sm text-gray-500 mt-2">{skillSummary?.expert || 0} Expert Level</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Career Progression</h2>
            <span className="text-3xl font-bold text-indigo-600">{progression || 0}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progression || 0}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-600"
            />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Target: {new Date(careerData.targetDate).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-3 bg-white rounded-xl shadow-lg p-4">
            {[
              { id: 'overview' as const, label: '📊 Overview' },
              { id: 'milestones' as const, label: '🏆 Milestones' },
              { id: 'skills' as const, label: '⚡ Skills' },
              { id: 'goals' as const, label: '🎯 Goals' },
              { id: 'trends' as const, label: '📈 Trends' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
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
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Career Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700 font-semibold">Average Satisfaction</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{metrics?.averageSatisfaction || 0}/10</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-700 font-semibold">Skill Growth</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{metrics?.skillGrowth || 0}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-700 font-semibold">Consistency</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{metrics?.consistency || 0}/10</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Milestones</h2>
                <button
                  onClick={() => setShowAddMilestone(!showAddMilestone)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {showAddMilestone && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-indigo-300 space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Description"
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddMilestone}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddMilestone(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {getMilestoneTimeline(careerData)?.map((milestone: any) => (
                  <div key={milestone.id} className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded-r">
                    <p className="font-semibold text-gray-800">{milestone.title}</p>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(milestone.date).toLocaleDateString()}</p>
                  </div>
                ))}
                {!careerData.milestones || careerData.milestones.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No milestones yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
              <div className="space-y-4">
                {careerData.skillProgress?.map((skill: any) => (
                  <div key={skill.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{skill.name}</p>
                      <span className="text-sm font-bold text-indigo-600">Level {skill.currentLevel}/10</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(skill.currentLevel / 10) * 100}%` }}
                        className="h-full bg-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Goals</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-red-600 mb-3">Short Term (3-6 months)</h3>
                  <div className="space-y-2">
                    {careerData.goals?.shortTerm?.map((goal: any, i: number) => (
                      <p key={i} className="bg-red-50 p-3 rounded border-l-4 border-red-600">
                        {goal}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-orange-600 mb-3">Medium Term (6-12 months)</h3>
                  <div className="space-y-2">
                    {careerData.goals?.mediumTerm?.map((goal: any, i: number) => (
                      <p key={i} className="bg-orange-50 p-3 rounded border-l-4 border-orange-600">
                        {goal}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600 mb-3">Long Term (1-5 years)</h3>
                  <div className="space-y-2">
                    {careerData.goals?.longTerm?.map((goal: any, i: number) => (
                      <p key={i} className="bg-indigo-50 p-3 rounded border-l-4 border-indigo-600">
                        {goal}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-4">Projects (Last 6 Periods)</h3>
                  {metrics?.projectsTrend?.map((p: any, i: number) => (
                    <div key={i} className="mb-3">
                      <p className="text-sm text-gray-700">{p.date}</p>
                      <div className="w-full h-2 bg-gray-300 rounded mt-1">
                        <div style={{ width: `${(p.projects / 5) * 100}%` }} className="h-full bg-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 mb-4">Salary Progress</h3>
                  {metrics?.salaryTrend?.map((s: any, i: number) => (
                    <div key={i} className="mb-3">
                      <p className="text-sm text-gray-700">{s.date}: ₹{(s.salary / 100000).toFixed(1)}L</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
