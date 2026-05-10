import dynamic from 'next/dynamic'
import { ProfessionalBackground } from '@/components/ProfessionalBackground'
import '../globals.css'

// Dynamically import client components to avoid RSC hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => <div className="h-20 bg-white" />
})

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => null
})

const ChatBot = dynamic(() => import('@/components/ChatBot'), {
  ssr: false,
  loading: () => null
})

const ErrorInitializer = dynamic(() => import('@/components/ErrorInitializer'), {
  ssr: false,
  loading: () => null
})

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Professional animated background - fixed behind all content */}
      <div className="fixed inset-0 w-full h-full z-0">
        <ProfessionalBackground />
      </div>

      {/* Content with proper z-indexing */}
      <div className="relative z-40 w-full min-h-screen flex flex-col">
        <ErrorInitializer />
        <Navbar />
        <main className="w-full relative z-20 flex-1">
          {children}
        </main>
        <Footer />
        <ChatBot />
      </div>
    </>
  )
}
