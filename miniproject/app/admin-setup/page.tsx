'use client'

import { useState } from 'react'
import { setupAdminAccountInClient, SETUP_INSTRUCTIONS } from '@/lib/admin-setup'
import Link from 'next/link'
import { AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Key, Terminal, Info, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminSetupPage() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [showManualInstructions, setShowManualInstructions] = useState(false)

  const handleAutoSetup = async () => {
    setSetupStatus('loading')
    setMessage('Initializing administrative protocols...')
    
    try {
      const user = await setupAdminAccountInClient()
      setSetupStatus('success')
      setMessage(`System initialized. Admin UID: ${user.uid}`)
    } catch (error: any) {
      setSetupStatus('error')
      setMessage(error.message || 'Initialization failed. Please check network or permissions.')
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white selection:bg-cyan-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />

      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/20 mb-6">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">System Setup</h1>
          <p className="mt-4 text-slate-400 font-medium">Provision the master administrative environment.</p>
        </motion.div>

        {/* Quick Setup Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
          
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            Automated Provisioning
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            This utility will create the default admin account with necessary permissions to access the control center.
          </p>

          {/* Credentials Box */}
          <div className="mb-8 rounded-2xl bg-black/40 border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
              <Key className="h-3 w-3" /> Default Credentials
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between group">
                <span className="text-xs text-slate-500">Identity</span>
                <span className="text-sm font-mono text-cyan-300">admin@gmail.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Secret</span>
                <span className="text-sm font-mono text-fuchsia-300">admin1234</span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-bold ${
                  setupStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  setupStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                }`}
              >
                {setupStatus === 'success' ? <CheckCircle className="h-4 w-4" /> : 
                 setupStatus === 'error' ? <AlertCircle className="h-4 w-4" /> : 
                 <Loader2 className="h-4 w-4 animate-spin" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Setup Button */}
          <button
            onClick={handleAutoSetup}
            disabled={setupStatus === 'loading' || setupStatus === 'success'}
            className={`relative w-full overflow-hidden rounded-2xl py-4 font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              setupStatus === 'success' ? 'bg-emerald-500 text-white' :
              'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {setupStatus === 'loading' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Initialising...
                </>
              ) : setupStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Deployment Complete
                </>
              ) : (
                <>
                  Deploy Admin Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </div>
          </button>

          {/* Success Actions */}
          <AnimatePresence>
            {setupStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-2 gap-3"
              >
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center rounded-xl bg-white/5 py-3 text-xs font-bold transition-colors hover:bg-white/10"
                >
                  Standard Portal
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 py-3 text-xs font-bold transition-opacity hover:opacity-90"
                >
                  Admin Console
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Manual Setup Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 overflow-hidden rounded-[2rem] border border-white/5 bg-white/2"
        >
          <button
            onClick={() => setShowManualInstructions(!showManualInstructions)}
            className="flex w-full items-center justify-between p-6 transition-colors hover:bg-white/5"
          >
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-slate-500" />
              Manual Configuration
            </h2>
            <div className={`h-8 w-8 rounded-full border border-white/10 flex items-center justify-center transition-transform ${showManualInstructions ? 'rotate-180' : ''}`}>
              <ArrowRight className="h-4 w-4 rotate-90 text-slate-500" />
            </div>
          </button>

          <AnimatePresence>
            {showManualInstructions && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <div className="space-y-4 pt-4">
                  {SETUP_INSTRUCTIONS.steps.map((item) => (
                    <div key={item.step} className="group flex gap-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-slate-500 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-400">
                        {item.step}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-300">{item.title}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.action}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 rounded-xl bg-blue-500/5 border border-blue-500/10 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Resource Link</p>
                    <a
                      href={SETUP_INSTRUCTIONS.firebaseConsoleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-blue-300 hover:underline break-all"
                    >
                      {SETUP_INSTRUCTIONS.firebaseConsoleUrl}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex items-start gap-3 rounded-2xl border border-yellow-500/10 bg-yellow-500/5 p-4"
        >
          <Info className="h-5 w-5 text-yellow-500/70 shrink-0" />
          <p className="text-[11px] text-yellow-500/70 leading-relaxed">
            <span className="font-bold">Security Notice:</span> This utility is for environment initialization. Ensure it is disabled or removed in production environments to maintain system integrity.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
