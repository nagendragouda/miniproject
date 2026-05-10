'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  RotateCcw,
  Sparkles,
  Zap,
  Brain,
  Settings
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useChatContext } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'

interface TypingIndicatorProps {
  isVisible: boolean
}

function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center space-x-2 text-slate-600 text-sm px-4 py-2"
    >
      <Bot className="w-4 h-4 text-secondary" />
      <span>AI is thinking</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-secondary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }
}

function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth()
  const isUser = message.role === 'user'
  const [displayTime, setDisplayTime] = useState('')

  // Format timestamp only on client to avoid hydration mismatch
  useEffect(() => {
    setDisplayTime(
      new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    )
  }, [message.timestamp])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''} mb-4`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-warning to-primary' 
          : 'bg-gradient-to-r from-secondary to-blue-500'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-text-primary" />
        ) : (
          <Brain className="w-4 h-4 text-text-primary" />
        )}
      </div>
      
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-r from-warning/20 to-primary/20 border border-warning/30 text-text-primary' 
            : 'bg-slate-100/60 border border-slate-300 text-text-primary'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>
        <div className={`text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {displayTime || 'now'}
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatBot() {
  const pathname = usePathname()
  
  const [inputMessage, setInputMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Hide the internal chatbot on dashboard page
  const shouldShowChatbot = pathname !== '/dashboard'
  
  const {
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
  } = useChatContext()

  const { user } = useAuth()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Mark as read when chat is open
  useEffect(() => {
    if (isOpen) {
      markAsRead()
    }
  }, [isOpen, markAsRead])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    const messageToSend = inputMessage
    setInputMessage('')
    await sendMessage(messageToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    {
      text: "Tell me about career paths",
      icon: Sparkles,
      action: () => sendMessage("What are some popular career paths I should consider?")
    },
    {
      text: "Help with skills",
      icon: Zap,
      action: () => sendMessage("What skills should I develop for my career?")
    },
    {
      text: "College advice",
      icon: Brain,
      action: () => sendMessage("How do I choose the right college for my career goals?")
    }
  ]

  return shouldShowChatbot ? (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-gradient-to-r from-secondary to-blue-500 rounded-full shadow-lg shadow-secondary/25 flex items-center justify-center group hover:shadow-xl hover:shadow-secondary/40 transition-all duration-300"
        aria-label="Open AI Career Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 90, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-text-primary" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-warning rounded-full flex items-center justify-center text-text-primary text-xs font-bold"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-blue-500"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 600 
            }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 z-[60] w-96 bg-background/95 backdrop-blur-lg border border-secondary/20 rounded-2xl shadow-2xl shadow-secondary/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-300/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-secondary to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-text-primary" />
                </div>
                <div>
                  <h3 className="text-text-primary font-semibold text-sm">FutureMatrix AI</h3>
                  <p className="text-slate-600 text-xs">Powered by AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 hover:text-text-primary hover:bg-slate-200/50 rounded-lg transition-colors ${
                    showSettings ? 'text-secondary bg-slate-200/50' : 'text-slate-600'
                  }`}
                  title="AI Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-1.5 text-slate-600 hover:text-text-primary hover:bg-slate-200/50 rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-600 hover:text-text-primary hover:bg-slate-200/50 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 text-slate-600 hover:text-text-primary hover:bg-slate-200/50 rounded-lg transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* AI Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-slate-300/50 p-4 bg-slate-100/30"
                    >
                      <h4 className="text-text-primary font-medium text-sm mb-3">AI Assistant Settings</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-text-secondary text-sm font-medium mb-2 block">AI Provider</label>
                          <div className="flex space-x-2">
                            {[
                              { id: 'openai', name: 'OpenAI GPT', description: 'ChatGPT-3.5' },
                              { id: 'gemini', name: 'Google Gemini', description: 'Gemini Pro' }
                            ].map((provider) => (
                              <button
                                key={provider.id}
                                onClick={() => setAiProvider(provider.id as 'openai' | 'gemini')}
                                className={`flex-1 p-3 rounded-lg border transition-all text-left ${
                                  aiProvider === provider.id
                                    ? 'border-secondary bg-secondary/10 text-text-primary'
                                    : 'border-gray-600 bg-slate-100/40 text-text-secondary hover:border-gray-500'
                                }`}
                              >
                                <div className="font-medium text-sm">{provider.name}</div>
                                <div className="text-xs opacity-75">{provider.description}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600">
                          <p>💡 <strong>OpenAI GPT:</strong> Great for detailed explanations and code help</p>
                          <p className="mt-1">🚀 <strong>Google Gemini:</strong> Excellent for creative career advice</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  <TypingIndicator isVisible={isTyping} />
                  
                  {/* Quick Actions (show only if no messages yet or just welcome) */}
                  {messages.length <= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <p className="text-slate-600 text-sm mb-3">Quick actions to get started:</p>
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.text}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          onClick={action.action}
                          disabled={isLoading}
                          className="flex items-center space-x-2 w-full p-3 text-left text-sm bg-slate-100/40 hover:bg-slate-200/50 border border-slate-300/50 hover:border-secondary/30 rounded-lg transition-all duration-200 disabled:opacity-50 group"
                        >
                          <action.icon className="w-4 h-4 text-secondary group-hover:text-text-primary transition-colors" />
                          <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                            {action.text}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-300/50">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about your career..."
                        disabled={isLoading}
                        className="w-full p-3 pr-12 bg-slate-100/60 border border-gray-600 rounded-xl text-text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <motion.div
                          animate={isLoading ? { rotate: 360 } : {}}
                          transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                          ) : null}
                        </motion.div>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-r from-secondary to-blue-500 text-text-primary rounded-xl hover:shadow-lg hover:shadow-secondary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  {!user && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-slate-600 mt-2 text-center"
                    >
                      <a href="/auth/signin" className="text-secondary hover:text-text-primary transition-colors">
                        Sign in
                      </a> for personalized advice based on your profile
                    </motion.p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  ) : null
}