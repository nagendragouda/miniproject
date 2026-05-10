// Firebase Authentication Utilities
// All authentication is handled by Firebase - no local hashing/tokens needed

export const authConfig = {
  providers: ['email', 'google'],
  isFirebaseOnly: true,
}

// Helper function to check if user is authenticated
export function isAuthenticated(user: any): boolean {
  return user !== null && user !== undefined
}

// Helper to get user display name
export function getUserDisplayName(user: any): string {
  if (!user) return 'Guest'
  return user.displayName || user.email || 'User'
}

// Helper to check if email is verified
export function isEmailVerified(user: any): boolean {
  return user?.emailVerified || false
}