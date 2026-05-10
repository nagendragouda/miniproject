'use client'

import { useEffect } from 'react'

export default function ExternalChatbot() {
  useEffect(() => {
    // This component is currently disabled to prevent DOM manipulation conflicts
    // Uncomment and update when external chatbot service is ready
    return () => {
      // Cleanup
    }
  }, [])

  return null
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    chatbase: any
  }
}