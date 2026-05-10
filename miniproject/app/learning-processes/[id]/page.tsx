'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  BookOpen,
  User,
  Tag,
  Award,
  ExternalLink,
  AlertCircle
} from 'lucide-react'

interface LearningProcess {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  duration: string
  rating: number
  skills: string[]
  difficulty_level: string
  is_paid: boolean
  price?: number
  access_url?: string
  icon_emoji?: string
  highlights?: string[]
  cover_image_url?: string
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<LearningProcess | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/learning-processes')
        const result = await response.json()

        if (result.success && result.data) {
          const foundCourse = result.data.find((c: LearningProcess) => c.id === courseId)
          if (foundCourse) {
            setCourse(foundCourse)
          } else {
            setError('Course not found')
          }
        } else {
          setError('Failed to load course')
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-300 text-lg font-semibold">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 max-w-md text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-lg font-semibold mb-6">{error || 'Course not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'advanced':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'expert':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-cyan-400 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          
          {course.access_url && (
            <motion.a
              href={course.access_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              <span>Access Course</span>
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Course Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-500/30 rounded-3xl p-8 mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-5xl">{course.icon_emoji || '📚'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-white">{course.title}</h1>
                  {course.is_paid && (
                    <span className="px-4 py-1 rounded-full text-sm font-bold bg-orange-500/20 text-orange-400 border border-orange-500/50">
                      Paid
                    </span>
                  )}
                </div>
                <p className="text-blue-300 text-lg mb-4">by {course.instructor}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-lg">{course.rating}/5</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getDifficultyColor(course.difficulty_level)}`}>
                    <Award className="w-4 h-4" />
                    <span className="font-bold text-sm">{course.difficulty_level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price if paid */}
            {course.is_paid && course.price && (
              <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-4">
                <p className="text-orange-300 text-sm mb-1">Course Price</p>
                <p className="text-3xl font-bold text-orange-300">${course.price.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">About this course</h2>
            <p className="text-slate-300 text-lg leading-relaxed">{course.description}</p>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="w-6 h-6 text-blue-400" />
                <h3 className="text-slate-200 font-bold">Category</h3>
              </div>
              <p className="text-blue-300 text-lg font-semibold">{course.category}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-cyan-400" />
                <h3 className="text-slate-200 font-bold">Duration</h3>
              </div>
              <p className="text-cyan-300 text-lg font-semibold">{course.duration}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-slate-200 font-bold">Rating</h3>
              </div>
              <p className="text-yellow-300 text-lg font-semibold">{course.rating} / 5.0</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              Skills You'll Learn
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {course.skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-4 py-3 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/50 rounded-lg text-blue-300 font-semibold text-center hover:border-blue-400 transition-all"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Highlights Section */}
          {course.highlights && course.highlights.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">What You'll Get</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.highlights.map((highlight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-slate-300">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          {course.access_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.a
                href={course.access_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
              >
                <span>Start Learning Now</span>
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
