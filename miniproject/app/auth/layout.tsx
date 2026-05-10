/**
 * DEPRECATED: This layout is no longer used.
 * Auth routes have been moved to /(auth) route group.
 * This file is kept for backward compatibility only.
 * New route: /(auth)/signin, /(auth)/signup, etc.
 */

import { Toaster } from 'react-hot-toast'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="w-full min-h-screen">
        {children}
      </main>
      <Toaster position="top-right" />
    </>
  )
}
