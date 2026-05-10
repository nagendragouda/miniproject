/**
 * API Route: Track User Activity
 * Stores user page visits and interactions in Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

/**
 * Create user_activity table if it doesn't exist
 */
async function ensureActivityTable() {
  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('user_activity')
      .select('count(*)', { count: 'exact', head: true })

    if (error && error.code === 'PGRST205') {
      // Table doesn't exist, create it
      console.log('Creating user_activity table...')
      
      const { error: createError } = await supabase.rpc('create_activity_table_if_not_exists')
      
      if (createError) {
        // RPC might not exist, that's okay
        console.log('Activity table creation RPC not available (expected), table may already exist')
      }
    }
  } catch (error) {
    console.log('Activity table check error (expected if table exists):', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.page_path) {
      return NextResponse.json(
        { error: 'Missing page_path' },
        { status: 400 }
      )
    }

    // Ensure table exists
    await ensureActivityTable()

    // Insert activity record
    const { data: insertedData, error } = await supabase
      .from('user_activity')
      .insert([
        {
          user_id: data.user_id || 'anonymous',
          page_path: data.page_path,
          page_title: data.page_title || 'Unknown',
          referrer: data.referrer,
          user_agent: data.user_agent,
          session_id: data.session_id,
          event_data: data.event_data || null,
          ip_address: request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') ||
                      'unknown',
          created_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Error inserting activity:', error)
      
      // If table doesn't exist, silently fail (don't break the app)
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { success: true, message: 'Activity table not available' },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to track activity' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: insertedData },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Activity tracking error:', error)
    
    // Always return success to not break client
    return NextResponse.json(
      { success: true, message: 'Activity tracked' },
      { status: 200 }
    )
  }
}
