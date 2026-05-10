import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required', savedResources: [] },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('saved_resources')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (error) {
      if (error.message.includes('relation "saved_resources" does not exist')) {
        return NextResponse.json({ success: true, savedResources: [], warning: 'Table not initialized' })
      }
      return NextResponse.json(
        { success: false, error: error.message, savedResources: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, savedResources: data || [], count: (data || []).length })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch saved resources', savedResources: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      resource
    } = body

    if (!userId || !resource || (!resource.course_title && !resource.title)) {
      return NextResponse.json(
        { success: false, error: 'userId and valid resource object are required' },
        { status: 400 }
      )
    }

    const titleToSave = resource.course_title || resource.title

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from('saved_resources')
      .select('id')
      .eq('user_id', userId)
      .eq('course_title', titleToSave)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already saved' })
    }

    const { error } = await supabaseAdmin
      .from('saved_resources')
      .insert({
        user_id: userId,
        resource_id: resource.id || `res_${Math.random().toString(36).substr(2, 9)}`,
        course_title: resource.course_title || resource.title,
        instructor: resource.instructor || resource.author,
        access_url: resource.access_url || resource.link || resource.url,
        difficulty: resource.difficulty,
        duration: resource.duration,
        is_paid: resource.is_paid || resource.free === false,
        description: resource.description,
        topics: resource.topics,
        learning_process: resource.learning_process,
        learners_count: resource.learners_count,
        accuracy_score: resource.accuracy_score
      })

    if (error) {
      console.error('Supabase Insert Error:', error)
      return NextResponse.json(
        { success: false, error: 'Database insert failed: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Resource saved successfully' })
  } catch (error: any) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, resourceId, courseTitle } = body

    if (!userId || (!resourceId && !courseTitle)) {
      return NextResponse.json({ success: false, error: 'userId and resource identifier are required' }, { status: 400 })
    }

    let query = supabaseAdmin.from('saved_resources').delete().eq('user_id', userId)
    
    if (resourceId) {
      query = query.eq('id', resourceId) // Assuming UUID primary key is passed as resourceId
    } else if (courseTitle) {
      query = query.eq('course_title', courseTitle)
    }

    const { error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Removed from saved' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
