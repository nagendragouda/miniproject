import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Fetch all learning processes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('learning_processes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
      message: 'Learning processes fetched successfully'
    })
  } catch (error: any) {
    console.error('Error fetching learning processes:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch learning processes'
      },
      { status: 500 }
    )
  }
}

// POST - Add new learning process or delete
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...learningProcessData } = body

    if (action === 'add') {
      // Validate required fields
      if (!learningProcessData.title) {
        return NextResponse.json(
          { success: false, message: 'Title is required' },
          { status: 400 }
        )
      }

      const { data, error } = await supabase
        .from('learning_processes')
        .insert([
          {
            title: learningProcessData.title,
            description: learningProcessData.description,
            instructor: learningProcessData.instructor,
            category: learningProcessData.category,
            duration: learningProcessData.duration,
            rating: parseFloat(learningProcessData.rating) || 4.0,
            skills: learningProcessData.skills || [],
            difficulty_level: learningProcessData.difficulty_level || 'Beginner',
            is_paid: learningProcessData.is_paid || false,
            price: learningProcessData.price ? parseFloat(learningProcessData.price) : null,
            access_url: learningProcessData.access_url,
            icon_emoji: learningProcessData.icon_emoji || '📚',
            cover_image_url: learningProcessData.cover_image_url,
            status: 'Active'
          }
        ])
        .select()

      if (error) throw error

      return NextResponse.json({
        success: true,
        data,
        message: 'Learning process added successfully'
      })
    } else if (action === 'update') {
      const { id, ...updateData } = learningProcessData

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'ID is required for update' },
          { status: 400 }
        )
      }

      const { data, error } = await supabase
        .from('learning_processes')
        .update({
          title: updateData.title,
          description: updateData.description,
          instructor: updateData.instructor,
          category: updateData.category,
          duration: updateData.duration,
          rating: parseFloat(updateData.rating) || 4.0,
          skills: updateData.skills || [],
          difficulty_level: updateData.difficulty_level || 'Beginner',
          is_paid: updateData.is_paid || false,
          price: updateData.price ? parseFloat(updateData.price) : null,
          access_url: updateData.access_url
        })
        .eq('id', id)
        .select()

      if (error) throw error

      return NextResponse.json({
        success: true,
        data,
        message: 'Learning process updated successfully'
      })
    } else if (action === 'delete') {
      const { id } = learningProcessData

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'ID is required for deletion' },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from('learning_processes')
        .delete()
        .eq('id', id)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Learning process deleted successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error processing learning process:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to process learning process'
      },
      { status: 500 }
    )
  }
}
