'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useFirebaseAuth } from './FirebaseAuthContext'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isTyping?: boolean
}

export interface ChatContextType {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
  isTyping: boolean
  unreadCount: number
  aiProvider: 'openai' | 'gemini'
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  sendMessage: (message: string) => Promise<void>
  clearChat: () => void
  markAsRead: () => void
  setAiProvider: (provider: 'openai' | 'gemini') => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: React.ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai')
  const { user } = useFirebaseAuth()
  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const userName = user?.email?.split('@')[0] || 'there'
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: user 
          ? `Hi ${userName}! 👋 I'm your FutureMatrix AI Guide. I'm here to help you with career guidance, educational advice, and answer any questions about your professional journey. What would you like to discuss today?`
          : `Welcome to FutureMatrix! 👋 I'm your AI assistant, ready to help with career guidance, college selection, and skill development. What can I help you with today?`,
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
  }, [user, messages.length])

  const openChat = useCallback(() => {
    setIsOpen(true)
    setUnreadCount(0)
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat()
    } else {
      openChat()
    }
  }, [isOpen, openChat, closeChat])

  const markAsRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    // Re-add welcome message after clearing
    setTimeout(() => {
      const userName = user?.email?.split('@')[0] || 'there'
      const welcomeMessage: ChatMessage = {
        id: 'welcome-new',
        role: 'assistant',
        content: user 
          ? `Hi ${userName}! How can I help you with your career today?`
          : `Hello! I'm here to help with your career questions. What would you like to know?`,
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }, 100)
  }, [user])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setIsTyping(true)

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Prepare context - profile data is not available with Firebase auth
      const context = {
        careerGoals: undefined,
        skills: undefined,
        interests: undefined,
        currentLevel: 'intermediate' as const,
      }

      // Get conversation history (last 10 messages, excluding the current one)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          message: content,
          provider: aiProvider,
          context,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `HTTP ${response.status}: ${response.statusText}` 
        }))
        throw new Error(errorData.message || 'Failed to get response')
      }

      const data = await response.json()

      // Validate response has content
      if (!data.response || typeof data.response !== 'string' || data.response.trim() === '') {
        throw new Error('Empty response from AI service')
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response.trim(),
        timestamp: data.timestamp || new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
      setIsTyping(false)

      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't show error
        return
      }

      console.error('Chat error:', error)
      
      // Provide more specific error messages based on the error type
      let errorContent = 'I apologize, but I encountered an error. Please try again later. If the problem persists, you can explore our other features like the College Finder or Learning Resources.'
      
      if (error instanceof Error) {
        if (error.message.includes('AI service unavailable')) {
          errorContent = 'The AI service is temporarily unavailable. Please try again in a few minutes.'
        } else if (error.message.includes('Network error')) {
          errorContent = 'There seems to be a network issue. Please check your connection and try again.'
        } else if (error.message.includes('Too many requests')) {
          errorContent = 'Too many requests at the moment. Please wait a moment before trying again.'
        } else if (error.message.includes('AI service temporarily unavailable')) {
          errorContent = 'The AI service is experiencing high demand. Please try again shortly.'
        }
      }
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [isLoading, messages, isOpen, aiProvider])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const contextValue: ChatContextType = {
    messages,
    isOpen,
    isLoading,
    isTyping,
    unreadCount,
    aiProvider,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearChat,
    markAsRead,
    setAiProvider,
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}