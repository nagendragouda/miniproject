'use client'

/**
 * 🎯 Career Prediction Results Display Component (Excel-Based)
 * 
 * Shows career predictions based on Excel education pathways:
 * - Top 3 matching careers
 * - Match percentages (0-100%)
 * - Salary range and job market demand
 * - Career outcomes and progression
 * - Education level-specific recommendations
 */

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Target, TrendingUp, Clock, DollarSign } from 'lucide-react'

interface CareerMatch {
  id: string
  name: string
  category: string
  match_percentage: number
  salary_range: string
  duration: string
  demand_level?: string
  career_outcomes: string
  reasons: string[]
  confidence_level: 'High' | 'Medium' | 'Low'
}

interface CareerPredictionDisplayProps {
  userProfile: {
    name: string
    email?: string
    educationLevel: '10th' | '12th' | 'Diploma' | 'Degree'
    interests: string[]
    skills: string[]
    traits?: {
      logic?: number
      technical?: number
      analytical?: number
      creativity?: number
      communication?: number
      leadership?: number
      business?: number
      helping?: number
      risk?: number
    }
  }
}

export default function CareerPredictionDisplay({ userProfile }: CareerPredictionDisplayProps) {
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCareer, setActiveCareer] = useState(0)

  // Fetch career prediction using Excel-based system
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/career-prediction-new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userProfile)
        })

        const data = await response.json()

        if (!data.success && data.error) {
          throw new Error(data.error)
        }

        setPrediction(data.data)
      } catch (err: any) {
        setError(err.message || 'Failed to generate prediction')
        console.error('Error fetching prediction:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [userProfile])

  if (loading) {
    return (
      <div className="w-full p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
          <p className="text-indigo-900 font-semibold">Analyzing your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900 mb-1">Prediction Error</h3>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!prediction || !prediction.top_3_matches || prediction.top_3_matches.length === 0) {
    return (
      <div className="w-full p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-900">No career matches found for your profile.</p>
      </div>
    )
  }

  const topMatches = prediction.top_3_matches as CareerMatch[]
  const current = topMatches[activeCareer]

  return (
    <div className="w-full space-y-6">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-2">Your Career Predictions</h2>
        <p className="text-blue-100 mb-4">
          Based on your education level: <strong>{prediction.user_education_level}</strong>
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur p-4 rounded">
            <p className="text-blue-200 text-sm font-semibold">Careers Evaluated</p>
            <p className="text-2xl font-bold">{prediction.total_careers_evaluated}</p>
          </div>
          <div className="bg-white/20 backdrop-blur p-4 rounded">
            <p className="text-blue-200 text-sm font-semibold">Top Match</p>
            <p className="text-2xl font-bold">{topMatches[0].match_percentage}%</p>
          </div>
          <div className="bg-white/20 backdrop-blur p-4 rounded">
            <p className="text-blue-200 text-sm font-semibold">Confidence</p>
            <p className="text-2xl font-bold">{topMatches[0].confidence_level}</p>
          </div>
        </div>
      </div>

      {/* Career Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {topMatches.map((match, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCareer(idx)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeCareer === idx
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            <span className="mr-2">{'🥇🥈🥉'[idx]}</span>
            {match.name}
          </button>
        ))}
      </div>

      {/* Career Details */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                {current.name}
              </h3>
              <p className="text-lg text-slate-600">{current.category}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-green-600 mb-1">
                {current.match_percentage}%
              </div>
              <p className="text-sm text-slate-600">Match Score</p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">SALARY RANGE</p>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                {current.salary_range}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">DURATION</p>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                {current.duration}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">JOB MARKET</p>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                {current.demand_level || 'Stable'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">CONFIDENCE</p>
              <p className={`text-lg font-bold flex items-center gap-2 ${
                current.confidence_level === 'High' ? 'text-green-600' :
                current.confidence_level === 'Medium' ? 'text-amber-600' :
                'text-orange-600'
              }`}>
                <CheckCircle className="w-5 h-5" />
                {current.confidence_level}
              </p>
            </div>
          </div>
        </div>

        {/* Career Outcomes */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-slate-900 mb-3 text-lg">Career Outcomes</h4>
          <p className="text-slate-700">{current.career_outcomes}</p>
        </div>

        {/* Why This Career */}
        <div className="mb-8">
          <h4 className="font-bold text-slate-900 mb-3 text-lg">Why This Career Matches You</h4>
          <div className="space-y-2">
            {current.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        {current.skills_required && current.skills_required.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Key Skills Required</h4>
            <div className="flex flex-wrap gap-2">
              {current.skills_required.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-indigo-100 text-indigo-900 rounded-full text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All Three Matches Summary */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="font-bold text-slate-900 mb-4 text-lg">All Three Matches</h3>
        <div className="space-y-3">
          {topMatches.map((match, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-white rounded border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer"
              onClick={() => setActiveCareer(idx)}
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{match.name}</p>
                <p className="text-sm text-slate-600">{match.category}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 mb-1">{match.match_percentage}%</p>
                <p className="text-xs text-slate-600">Match</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
