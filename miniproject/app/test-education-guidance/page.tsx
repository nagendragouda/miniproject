'use client'

import { useState } from 'react'
import { useEducationGuidance } from '@/hooks/useEducationGuidance'

export default function TestEducationGuidance() {
  const { getGuidance, loading, result, error, formattedOutput } = useEducationGuidance()
  const [educationLevel, setEducationLevel] = useState<'10th' | 'PUC' | 'Graduation'>('10th')
  const [skills, setSkills] = useState('Problem-solving, Coding basics, Mathematics')
  const [interests, setInterests] = useState('Technology, AI, Innovation')

  const handleTest = async (level: '10th' | 'PUC' | 'Graduation') => {
    setEducationLevel(level)

    // Default quiz responses
    const quizResponses = {
      timestamp: new Date().toISOString(),
      answers: [
        {
          questionId: 0,
          question: 'How do you solve problems?',
          answer: 'Break into smaller parts',
          customAnswer: 'I like systematic approaches'
        },
        {
          questionId: 1,
          question: 'What drives your passion?',
          answer: 'Innovation and learning',
          customAnswer: 'I want to build AI systems'
        },
        {
          questionId: 2,
          question: 'How do you make decisions?',
          answer: 'Logically',
          customAnswer: 'Data-driven'
        },
        {
          questionId: 3,
          question: 'What challenges excite you?',
          answer: 'Technical',
          customAnswer: 'Complex problems'
        },
        {
          questionId: 4,
          question: 'How do you handle failure?',
          answer: 'Learn from it',
          customAnswer: 'Analyze and improve'
        },
        {
          questionId: 5,
          question: 'Your biggest goal?',
          answer: 'Create innovative technology',
          customAnswer: 'Build impactful products'
        },
        {
          questionId: 6,
          question: 'Preferred work environment?',
          answer: 'Structured and collaborative',
          customAnswer: 'Dynamic team'
        },
        {
          questionId: 7,
          question: 'Career path preference?',
          answer: 'Tech specialization',
          customAnswer: 'Deep expertise'
        },
        {
          questionId: 8,
          question: 'Risk tolerance?',
          answer: 'Moderate risk',
          customAnswer: 'Calculate risks'
        },
        {
          questionId: 9,
          question: 'Long-term vision?',
          answer: 'Lead innovation',
          customAnswer: 'Technical leadership'
        }
      ]
    }

    await getGuidance(level, { skills, interests }, quizResponses)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎓 Education Level Career Guidance
          </h1>
          <p className="text-xl text-gray-600">
            Test the system with different education levels
          </p>
        </div>

        {/* Rules Box */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-indigo-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 System Rules</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-bold text-lg mb-2">10th Grade</p>
              <p className="text-sm text-gray-600">
                Stream suggestions ONLY
                <br />
                ✓ Recommended stream
                <br />✗ NO direct careers
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-bold text-lg mb-2">PUC (11-12)</p>
              <p className="text-sm text-gray-600">
                Degree recommendations
                <br />
                ✓ Recommended degree
                <br />✓ Then career options
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-bold text-lg mb-2">Graduation</p>
              <p className="text-sm text-gray-600">
                Direct career guidance
                <br />
                ✓ Top 3 career options
                <br />✓ With roadmaps
              </p>
            </div>
          </div>
        </div>

        {/* Test Inputs */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">⚙️ Test Configuration</h2>

          <div className="space-y-6">
            {/* Skills Input */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                📚 Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter skills (comma-separated)"
              />
            </div>

            {/* Interests Input */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                ⭐ Interests
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter interests (comma-separated)"
              />
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleTest('10th')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
          >
            {loading && educationLevel === '10th' ? '⏳ Testing...' : '🎓 Test 10th Grade'}
          </button>

          <button
            onClick={() => handleTest('PUC')}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
          >
            {loading && educationLevel === 'PUC' ? '⏳ Testing...' : '📖 Test PUC (11-12)'}
          </button>

          <button
            onClick={() => handleTest('Graduation')}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
          >
            {loading && educationLevel === 'Graduation' ? '⏳ Testing...' : '🎯 Test Graduation'}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-6 rounded-lg mb-8">
            <p className="font-bold text-lg mb-2">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {result?.data && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">✅ Result</h2>

              {/* Metadata */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Education Level</p>
                  <p className="text-xl font-bold text-gray-800">{result.data.educationLevel}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Guidance Type</p>
                  <p className="text-xl font-bold text-gray-800">{result.data.guidanceType}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-600">Applied Rule</p>
                  <p className="text-sm font-bold text-indigo-700">{result.data.appliedRule}</p>
                </div>
              </div>

              {/* Guidance Details */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-xl font-bold mb-4 text-gray-800">📌 Guidance Details</h3>
                {result.data.guidance.type === 'STREAM_GUIDANCE' && (
                  <div>
                    <p className="font-bold text-lg">
                      Recommended Stream: {result.data.guidance.recommendedStream}
                    </p>
                    <p className="text-gray-700 mt-2">{result.data.guidance.whyThisStream}</p>
                  </div>
                )}
                {result.data.guidance.type === 'DEGREE_GUIDANCE' && (
                  <div>
                    <p className="font-bold text-lg">
                      Recommended Degree: {result.data.guidance.recommendedDegree}
                    </p>
                    <p className="text-gray-700 mt-2">{result.data.guidance.reasonForDegree}</p>
                  </div>
                )}
                {result.data.guidance.type === 'CAREER_GUIDANCE' && (
                  <div>
                    <p className="font-bold text-lg mb-4">Top Career Recommendations:</p>
                    <div className="space-y-2">
                      {result.data.guidance.careers?.map((c: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                          <span>{c.careerName}</span>
                          <span className="font-bold text-indigo-600">{c.matchPercentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Formatted Output */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">📋 Formatted Output</h3>
                <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-auto max-h-96 font-mono text-sm">
                  <pre>{formattedOutput}</pre>
                </div>
              </div>

              {/* User Score (if available) */}
              {result.data.userScore && (
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">📊 User Score Analysis</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(result.data.userScore).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">{key}</p>
                        <div className="mt-2 bg-gray-300 rounded-full h-2 w-full">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(value / 10) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-right text-sm font-bold text-gray-800 mt-1">{value}/10</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-gray-800">ℹ️ How to Use</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✓ Modify skills and interests in the input fields above</li>
            <li>✓ Click one of the three test buttons to test that education level</li>
            <li>✓ See formatted guidance in the results section</li>
            <li>✓ Verify that the rules are being enforced (check Applied Rule)</li>
            <li>✓ 10th should show STREAM only, PUC should show DEGREE, Graduation should show CAREERS</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
