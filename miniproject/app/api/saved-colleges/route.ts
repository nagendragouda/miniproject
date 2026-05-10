import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required', savedColleges: [] },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('saved_colleges')
      .select('id, user_id, college_id, college_name, college_location, college_type, saved_at, college_rating, college_fees, college_established, college_website, college_description')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (error) {
      if (error.message.includes('relation "saved_colleges" does not exist')) {
        return NextResponse.json({ success: true, savedColleges: [], warning: 'Table not initialized' })
      }
      if (error.message.includes('permission denied')) {
        return NextResponse.json({ success: true, savedColleges: [], warning: 'Permission error' })
      }
      return NextResponse.json(
        { success: false, error: error.message, savedColleges: [] },
        { status: 500 }
      )
    }

    const savedColleges = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      collegeId: row.college_id,
      collegeName: row.college_name,
      collegeLocation: row.college_location,
      collegeType: row.college_type,
      savedAt: row.saved_at,
      rating: row.college_rating,
      fees: row.college_fees,
      established: row.college_established,
      website: row.college_website,
      description: row.college_description
    }))

    return NextResponse.json({ success: true, savedColleges, count: savedColleges.length })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch saved colleges', savedColleges: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      collegeId,
      collegeName,
      collegeLocation,
      collegeType,
      rating,
      fees,
      latitude,
      longitude,
      collegeDescription,
      collegeWebsite
    } = body

    if (!userId || !collegeId) {
      return NextResponse.json(
        { success: false, error: 'userId and collegeId are required' },
        { status: 400 }
      )
    }

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from('saved_colleges')
      .select('id')
      .eq('user_id', userId)
      .eq('college_id', collegeId)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already saved' })
    }

    const { error } = await supabaseAdmin
      .from('saved_colleges')
      .insert({
        user_id: userId,
        college_id: collegeId,
        college_name: collegeName || 'Unknown',
        college_location: collegeLocation || '',
        college_type: collegeType || 'University',
        college_rating: rating || 0,
        college_fees: fees || '',
        college_description: collegeDescription || '',
        college_website: collegeWebsite || '',
        saved_at: new Date().toISOString()
      })

    if (error) {
      console.error('POST saved-colleges error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'College saved successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save college' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const collegeId = request.nextUrl.searchParams.get('collegeId')

    if (!userId || !collegeId) {
      return NextResponse.json(
        { success: false, error: 'userId and collegeId are required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('saved_colleges')
      .delete()
      .eq('user_id', userId)
      .eq('college_id', collegeId)

    if (error) {
      console.error('DELETE saved-colleges error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'College removed successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to remove college' },
      { status: 500 }
    )
  }
}
