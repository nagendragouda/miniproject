// lib/supabase-client.ts
// Supabase client configuration for frontend and server-side usage

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Client for browser/client-side operations (public)
// Guard: only create when keys are available to avoid throwing on SSR/edge
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)

// Server admin client — created lazily so it never runs in the browser bundle.
// Use only inside API routes or server actions.
let _supabaseAdmin: ReturnType<typeof createClient> | null = null
export function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase admin env vars')
  _supabaseAdmin = createClient(supabaseUrl, serviceKey)
  return _supabaseAdmin
}

// Legacy named export kept for backward-compat in API routes — do NOT import in client components
export const supabaseAdmin = typeof window === 'undefined'
  ? (() => { try { return getSupabaseAdmin() } catch { return null as any } })()
  : (null as any)

// Type definitions for user_details table
export interface UserDetails {
  id: number
  user_id: string
  profile_picture_url?: string
  username: string
  full_name: string
  age: number
  gender: string
  country: string
  state?: string
  city?: string
  education_level: string
  course: string
  institution_name: string
  year_of_study: string
  skills?: string[]
  interests?: string[]
  activity_preference?: string
  work_style?: string
  desired_career_field?: string
  dream_job_role?: string
  expected_salary?: string
  work_preference?: string
  learning_method?: string
  weekly_time_availability?: string
  career_clarity?: string
  experience?: Array<{
    type: 'internship' | 'project' | 'certification' | 'activity'
    title: string
    description: string
    duration?: string
  }>
  social_links?: Array<{
    platform: 'linkedin' | 'github' | 'portfolio'
    url: string
  }>
  is_complete: boolean
  created_at: string
  updated_at: string
}

// Type definitions for user_auth_details table
export interface UserAuthDetails {
  id?: string
  user_id: string
  email: string
  display_name?: string
  photo_url?: string
  phone_number?: string
  email_verified: boolean
  provider_id?: string
  firebase_created_at?: string
  firebase_last_login?: string
  last_sync?: string
  created_at?: string
  updated_at?: string
}

/**
 * Synchronizes a Firebase User object with the Supabase 'user_auth_details' table.
 * This ensures that every Firebase auth event is reflected in our Supabase database.
 */
export async function syncUserToSupabase(firebaseUser: any) {
  if (!firebaseUser) {
    console.log('ℹ️ [Sync] No Firebase user provided, skipping sync')
    return null
  }

  if (!supabase) {
    console.error('❌ [Sync] Supabase client not initialized. Check your environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).')
    return null
  }

  console.group('🔄 [Sync] Syncing Firebase User to Supabase')
  console.log('👤 Firebase UID:', firebaseUser.uid)
  console.log('📧 Email:', firebaseUser.email)

  try {
    const userData: UserAuthDetails = {
      user_id: firebaseUser.uid,
      email: firebaseUser.email || '',
      display_name: firebaseUser.displayName || '',
      photo_url: firebaseUser.photoURL || '',
      phone_number: firebaseUser.phoneNumber || '',
      email_verified: firebaseUser.emailVerified || false,
      provider_id: firebaseUser.providerData?.[0]?.providerId || 'password',
      firebase_created_at: firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime).toISOString() : undefined,
      firebase_last_login: firebaseUser.metadata?.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime).toISOString() : undefined,
      last_sync: new Date().toISOString(),
    }

    console.log('📤 Payload:', userData)

    // Upsert the user data into the user_auth_details table
    const { data, error } = await supabase
      .from('user_auth_details')
      .upsert(userData, { onConflict: 'user_id' })
      .select()

    if (error) {
      console.error('❌ [Sync] Supabase Error:', error.message)
      console.error('Details:', error)
      console.groupEnd()
      return null
    }

    console.log('✅ [Sync] Successfully synced to user_auth_details table')
    console.log('💾 Result:', data)
    console.groupEnd()
    return data
  } catch (err) {
    console.error('❌ [Sync] Unexpected Error:', err)
    console.groupEnd()
    return null
  }
}
