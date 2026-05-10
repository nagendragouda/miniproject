'use client'

/**
 * 🔍 Career Growth Dashboard - Test/Debug Page
 * Simplified version to verify dashboard works
 */

import { useState, useEffect } from 'react'
import { getOrCreateCareerGrowthData, calculateGrowthMetrics } from '@/lib/careerGrowthTracker'

export default function CareerGrowthTestPage() {
  const [status, setStatus] = useState('Loading...')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      setStatus('Initializing data...')
      const careerData = getOrCreateCareerGrowthData('test_user')
      setData(careerData)
      setStatus('✅ Data loaded successfully!')

      // Try to calculate metrics
      const metrics = calculateGrowthMetrics(careerData)
      console.log('Metrics calculated:', metrics)
      setStatus(`✅ Data loaded! Metrics: ${JSON.stringify(metrics)}`)
    } catch (err: any) {
      setError(`❌ Error: ${err.message}`)
      setStatus('Failed')
      console.error('Error:', err)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <h1 className="text-4xl font-bold mb-8">🔍 Career Growth Dashboard - Debug</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Status</h2>
          <p className="text-lg font-semibold text-indigo-600">{status}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-4 rounded">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Career Data</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-bold">User ID:</span> {data.userId}
                </p>
                <p>
                  <span className="font-bold">Current Role:</span> {data.currentRole || 'Not Set'}
                </p>
                <p>
                  <span className="font-bold">Target Role:</span> {data.targetRole || 'Not Set'}
                </p>
                <p>
                  <span className="font-bold">Milestones:</span> {data.milestones?.length || 0}
                </p>
                <p>
                  <span className="font-bold">Skills:</span> {data.skillProgress?.length || 0}
                </p>
                <p>
                  <span className="font-bold">Projects Completed:</span> {data.projectsCompleted || 0}
                </p>
                <p>
                  <span className="font-bold">Certifications:</span> {data.certificationsClaimed || 0}
                </p>
                <p>
                  <span className="font-bold">Promotions:</span> {data.promotionsEarned || 0}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Raw Data (JSON)</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </>
        )}

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-4">If you see this page correctly, the dashboard system is working!</p>
          <a
            href="/career-growth"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Go to Full Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
