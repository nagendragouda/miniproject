/**
 * Safe Error Boundary
 * 
 * Catches React errors silently without displaying error UI
 * Logs errors for debugging only
 */

'use client'

import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class SafeErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[SafeErrorBoundary] Error caught:', error.message)
      console.log('[SafeErrorBoundary] Component Stack:', errorInfo.componentStack)
    }
    
    // In production, silently handle error and render children anyway
    this.setState({ hasError: false })
  }

  render() {
    // Always render children, suppress error UI
    return this.props.children
  }
}

export default SafeErrorBoundary
