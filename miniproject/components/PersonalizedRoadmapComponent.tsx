'use client'

import { motion } from 'framer-motion'
import { BookOpen, Target, Zap, Clock, CheckCircle, AlertCircle, TrendingUp, Award } from 'lucide-react'
import { useEffect, useState } from 'react'

// TypeScript Interfaces for Roadmap Data Structure
interface RoadmapStep {
  step: number
  title: string
  duration: string
  details: string
  details_expanded?: string
  stream?: string | string[]
  recommendedDegrees?: string[]
  focus?: string | string[]
  courses?: {
    beginner?: string[]
    intermediate?: string[]
    advanced?: string[]
  }
  timeline?: string
  salaryRange?: string
}

interface RoadmapSkills {
  technical?: string[]
  soft?: string[]
  domain?: string[]
}

interface RoadmapCourses {
  beginner?: string[]
  intermediate?: string[]
  advanced?: string[]
}

interface RoadmapData {
  career: string
  educationLevel: 'Graduation' | 'PUC' | '10th'
  overview: string
  roadmapSteps: RoadmapStep[]
  skillsToFocus?: RoadmapSkills
  courses?: RoadmapCourses
  finalGoal: string
  appliedRule?: string
  timeline?: {
    fastTrack?: string
    phases?: { duration: string }[]
  }
}

interface RoadmapComponentProps {
  roadmap: RoadmapData
  loading?: boolean
}

export default function PersonalizedRoadmapComponent({ roadmap, loading = false }: RoadmapComponentProps) {
  const [expandedStep, setExpandedStep] = useState(0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!roadmap) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-secondary to-primary text-white rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎯 Your Personalized Roadmap</h1>
            <p className="text-lg opacity-90">{roadmap.overview}</p>
          </div>
          <div className="text-5xl">📚</div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm opacity-75">Education Level</p>
            <p className="font-bold text-lg">{roadmap.educationLevel}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm opacity-75">Target Career</p>
            <p className="font-bold text-lg">{roadmap.career}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm opacity-75">Timeline</p>
            <p className="font-bold text-lg">{roadmap.timeline?.fastTrack || roadmap.timeline?.phases?.[0]?.duration}</p>
          </div>
        </div>
      </motion.div>

      {/* Step-by-Step Roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <Target className="w-8 h-8 text-secondary" /> Step-by-Step Roadmap
        </h2>
        
        <div className="space-y-4">
          {roadmap.roadmapSteps?.map((step: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <button
                onClick={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
                className="w-full text-left"
              >
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-secondary/20 hover:border-secondary/50 rounded-xl p-6 transition-all cursor-pointer group-hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-secondary to-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-text-primary mb-1">{step.title}</h3>
                        <p className="text-text-secondary">{step.details}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-secondary font-semibold">
                          <Clock className="w-4 h-4" />
                          {step.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {expandedStep === idx ? '▼' : '▶'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedStep === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 ml-4 border-l-4 border-secondary pl-4"
                >
                  {/* Additional Details */}
                  {step.details_expanded && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                      <p className="text-text-secondary font-semibold">{step.details_expanded}</p>
                    </div>
                  )}

                  {/* Stream/Degree Info */}
                  {step.stream && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
                      <p className="text-sm text-text-secondary mb-1">Recommended Stream:</p>
                      <p className="font-bold text-text-primary">{step.stream}</p>
                    </div>
                  )}

                  {step.recommendedDegrees && (
                    <div className="bg-indigo-50 p-4 rounded-lg mb-4 border border-indigo-200">
                      <p className="text-sm text-text-secondary mb-2">Recommended Degrees:</p>
                      <ul className="space-y-1">
                        {step.recommendedDegrees.map((deg: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 font-semibold text-text-primary">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                            {deg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Focus Skills */}
                  {step.focus && (
                    <div className="bg-amber-50 p-4 rounded-lg mb-4 border border-amber-200">
                      <p className="text-sm text-text-secondary font-semibold mb-2">Focus On:</p>
                      <div className="flex flex-wrap gap-2">
                        {(typeof step.focus === 'string' ? [step.focus] : step.focus).map((item: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-semibold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div>
                    <p className="font-bold text-text-primary mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" /> Action Items:
                    </p>
                    <ul className="space-y-2">
                      {step.actions?.map((action: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-text-secondary">
                          <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skills to Focus */}
      {roadmap.skillsToFocus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-green-600" /> Skills to Focus
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmap.skillsToFocus.technical && (
              <div>
                <h3 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span> Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skillsToFocus.technical.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {roadmap.skillsToFocus.soft && (
              <div>
                <h3 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-600 rounded-full"></span> Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skillsToFocus.soft.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {roadmap.skillsToFocus.domain && (
              <div>
                <h3 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-600 rounded-full"></span> Domain Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skillsToFocus.domain.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Courses */}
      {roadmap.courses && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" /> Optional Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmap.courses.beginner && (
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-4 bg-blue-100 px-3 py-1 rounded-lg inline-block">
                  Beginner Courses
                </h3>
                <ul className="space-y-2">
                  {roadmap.courses.beginner.map((course: string, i: number) => (
                    <li key={i} className="text-text-secondary text-sm">• {course}</li>
                  ))}
                </ul>
              </div>
            )}

            {roadmap.courses.intermediate && typeof roadmap.courses.intermediate === 'object' && (
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-4 bg-blue-100 px-3 py-1 rounded-lg inline-block">
                  Intermediate Courses
                </h3>
                <ul className="space-y-2">
                  {roadmap.courses.intermediate.map((course: string, i: number) => (
                    <li key={i} className="text-text-secondary text-sm">• {course}</li>
                  ))}
                </ul>
              </div>
            )}

            {roadmap.courses.advanced && (
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-4 bg-blue-100 px-3 py-1 rounded-lg inline-block">
                  Advanced Courses
                </h3>
                <ul className="space-y-2">
                  {roadmap.courses.advanced.map((course: string, i: number) => (
                    <li key={i} className="text-text-secondary text-sm">• {course}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Final Goal */}
      {roadmap.finalGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-8 border-2 border-secondary/30"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-secondary" /> Final Goal
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">{roadmap.finalGoal}</p>
        </motion.div>
      )}

      {/* Applied Rule */}
      {roadmap.appliedRule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-400"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <p className="text-green-900 font-semibold text-lg">{roadmap.appliedRule}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
