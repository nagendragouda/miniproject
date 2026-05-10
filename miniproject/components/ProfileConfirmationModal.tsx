'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Users, Check, Edit2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export default function ProfileConfirmationModal({
  isOpen,
  onClose,
  user
}: ProfileConfirmationModalProps) {
  const router = useRouter()

  const handleConfirm = () => {
    onClose()
    // Navigate to complete journey or show success message
  }

  const handleEditProfile = () => {
    onClose()
    router.push('/profile')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Confirm Your Profile
              </h2>
              <p className="text-text-secondary">
                Please verify your profile information before we create your bright future path
              </p>
            </div>

            {/* Profile Information Section */}
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-6 mb-8 border border-secondary/10">
              <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4" />
                Your Profile Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-text-secondary mb-1">Email</p>
                  <p className="text-sm text-text-primary">{user?.email || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-xs text-text-secondary mb-1">Account Status</p>
                  <p className="text-sm font-medium text-secondary">Active & Verified</p>
                </div>

                <div>
                  <p className="text-xs text-text-secondary mb-1">Profile Completion</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full w-3/4" />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">75% Complete</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full py-3 px-4 bg-gradient-to-r from-secondary to-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
              >
                <Check className="w-5 h-5" />
                Confirm & Continue
              </button>

              <button
                onClick={handleEditProfile}
                className="w-full py-3 px-4 border-2 border-secondary text-secondary rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-secondary/5 transition-all duration-300"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
