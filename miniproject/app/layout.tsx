import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ChatProvider } from '@/contexts/ChatContext'
import { Toaster } from 'react-hot-toast'
import './globals.css'

// Import global error handler
import '@/lib/global-error-handler'
import '@/lib/fetch-interceptor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'FutureMatrix | Your Personalized Career & College Guide',
  description: 'Discover your path with AI-powered quizzes, 3D career maps & nearby government college suggestions.',
  keywords: 'career guidance, college finder, education advisor, college recommendations',
  authors: [{ name: 'FutureMatrix' }],
  robots: 'index, follow',
  openGraph: {
    title: 'FutureMatrix',
    description: 'Discover your path with AI-powered quizzes, 3D career maps & nearby government college suggestions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FutureMatrix',
    description: 'Discover your path with AI-powered quizzes, 3D career maps & nearby government college suggestions.',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} w-full min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 text-black antialiased overflow-x-hidden`}>
        <FirebaseAuthProvider>
          <AuthProvider>
            <ChatProvider>
              <Toaster position="top-right" />
              {children}
            </ChatProvider>
          </AuthProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}