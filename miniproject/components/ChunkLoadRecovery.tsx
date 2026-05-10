'use client'

import { useEffect } from 'react'

const RELOAD_FLAG = 'fm_chunk_reloaded_once'

function isChunkLoadFailure(reason: unknown): boolean {
  const text =
    typeof reason === 'string'
      ? reason
      : reason instanceof Error
      ? `${reason.name} ${reason.message}`
      : JSON.stringify(reason)

  const normalized = text.toLowerCase()
  return normalized.includes('chunkloaderror') || normalized.includes('loading chunk')
}

export default function ChunkLoadRecovery() {
  useEffect(() => {
    // All sessionStorage access MUST be inside useEffect to avoid hydration errors
    const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1'
    
    if (!alreadyReloaded) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
    }

    // Clear the flag on mount
    const clearFlag = () => {
      sessionStorage.removeItem(RELOAD_FLAG)
    }

    // Setup error handlers
    const onError = (event: ErrorEvent) => {
      if (!isChunkLoadFailure(event.error || event.message)) return
      
      const hasReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1'
      if (!hasReloaded) {
        sessionStorage.setItem(RELOAD_FLAG, '1')
        window.location.reload()
      }
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isChunkLoadFailure(event.reason)) return
      
      const hasReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1'
      if (!hasReloaded) {
        sessionStorage.setItem(RELOAD_FLAG, '1')
        window.location.reload()
      }
    }

    // Clean up previous flag
    clearFlag()

    // Add event listeners
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  return null
}