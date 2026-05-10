'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, User, Briefcase, Target } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileFormData {
  educationLevel: '10th' | 'PUC' | 'Graduation' | ''
  skills: string
  interests: string
  strengths: string
  weaknesses: string
}

export default function CareerProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    educationLevel: '',
    skills: '',
    interests: '',
    strengths: '',
    weaknesses: ''
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Validate
    if (!formData.educationLevel) {
      toast.error('Please select your education level')
      return
    }
    if (!formData.skills.trim()) {
      toast.error('Please enter your skills')
      return
    }
    if (!formData.interests.trim()) {
      toast.error('Please enter your interests')
      return
    }

    setIsLoading(true)

    try {
      // Save to localStorage for quiz component
      localStorage.setItem('profileForCareerPrediction', JSON.stringify({
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        interests: formData.interests,
        strengths: formData.strengths,
        weaknesses: formData.weaknesses
      }))

      // Verify it was actually saved
      const savedProfile = JSON.parse(localStorage.getItem('profileForCareerPrediction') || '{}')
      console.log('✅ Profile saved to localStorage:', savedProfile)
      console.log('✅ Education Level saved:', savedProfile.educationLevel)
      console.log('📊 All localStorage keys:', Object.keys(localStorage))
      
      toast.success('Profile saved! Starting quiz...')

      // Navigate to quiz
      setTimeout(() => {
        router.push('/career-personality-quiz')
      }, 800)
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 border border-indigo-200 rounded-full mb-6">
            <User className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Step 1: Your Profile</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tell Us About Yourself
          </h1>

          <p className="text-lg text-gray-600">
            We'll provide personalized career guidance based on your education level and interests
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Education Level */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              <BookOpen className="inline w-5 h-5 mr-2 text-indigo-600" />
              What is your current education level?
            </label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900 font-medium"
            >
              <option value="">-- Select Education Level --</option>
              <option value="10th">10th Standard</option>
              <option value="PUC">PUC (11th-12th)</option>
              <option value="Graduation">Graduation (Bachelor's or Higher)</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              We'll show you what comes after your current level
            </p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              <Target className="inline w-5 h-5 mr-2 text-indigo-600" />
              What are your main skills?
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., Problem-solving, Programming (Python, Java), Mathematics, Communication, Design, etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-2">
              List your technical and soft skills
            </p>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              <Briefcase className="inline w-5 h-5 mr-2 text-indigo-600" />
              What are your interests?
            </label>
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., Technology, AI, Business, Science, Arts, Social Work, Finance, Healthcare, etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-2">
              What topics excite you?
            </p>
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              What are your top 2-3 strengths? (Optional)
            </label>
            <input
              type="text"
              name="strengths"
              value={formData.strengths}
              onChange={handleChange}
              placeholder="e.g., Creative, Quick learner, Logical thinking"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900"
            />
          </div>

          {/* Weaknesses */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              What areas do you want to improve? (Optional)
            </label>
            <input
              type="text"
              name="weaknesses"
              value={formData.weaknesses}
              onChange={handleChange}
              placeholder="e.g., Public speaking, Time management, Technical skills"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                Continue to Quiz
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Info Box */}
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
            <p className="text-sm text-indigo-800">
              <strong>💡 Tip:</strong> Based on your education level, we'll show you the complete pathway from where you are now to your ideal career!
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
