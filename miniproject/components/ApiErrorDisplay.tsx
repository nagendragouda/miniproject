'use client'

import React from 'react'
import { parseApiError, isNetworkError } from '@/lib/api-error-handler'

interface ApiErrorDisplayProps {
  error: any
  onRetry?: () => void
  onDismiss?: () => void
  compact?: boolean
}

/**
 * Reusable component to display API errors to users
 */
export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  compact = false
}) => {
  if (!error) return null

  const errorDisplay = parseApiError(error)
  const isNetwork = isNetworkError(error)

  if (compact) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{errorDisplay.icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-red-900">{errorDisplay.title}</p>
            <p className="text-red-800 text-xs mt-1">{errorDisplay.message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-red-500 hover:text-red-700 text-lg"
              aria-label="Close error"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-red-50 border-2 border-red-200 p-6 max-w-md mx-auto my-4">
      {/* Error Icon and Title */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{errorDisplay.icon}</span>
        <h2 className="text-xl font-bold text-red-900">{errorDisplay.title}</h2>
      </div>

      {/* Error Message */}
      <p className="text-red-800 mb-4">{errorDisplay.message}</p>

      {/* Suggestion */}
      <div className="bg-red-100 rounded p-3 mb-4 border-l-4 border-red-400">
        <p className="text-sm text-red-700">
          <strong>💡 Suggestion:</strong> {errorDisplay.suggestion}
        </p>
      </div>

      {/* Network-specific help */}
      {isNetwork && (
        <div className="bg-blue-50 rounded p-3 mb-4 border-l-4 border-blue-400">
          <p className="text-sm text-blue-700">
            <strong>🔧 For Windows users:</strong>
          </p>
          <ul className="text-sm text-blue-700 ml-4 mt-2 list-disc">
            <li>Settings → Network → Change Adapter</li>
            <li>Set DNS to 8.8.8.8 and 8.8.4.4 (Google DNS)</li>
            <li>Then refresh this page</li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            🔄 Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Development Details */}
      {process.env.NODE_ENV === 'development' && error.details && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-32">
          <p className="font-bold mb-1">Dev Details:</p>
          <pre className="text-gray-700">{JSON.stringify(error.details, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
