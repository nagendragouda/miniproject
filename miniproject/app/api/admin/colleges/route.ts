import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      action,
      name,
      location,
      type,
      established,
      rating,
      fees,
      description,
      latitude,
      longitude,
      website
    } = body

    if (action === 'add') {
      // Validate required fields
      if (!name || !location || !type || !rating || !fees || !description) {
        return NextResponse.json(
          { success: false, error: 'All fields are required' },
          { status: 400 }
        )
      }

      const { data, error } = await supabaseAdmin
        .from('colleges')
        .insert([
          {
            name,
            short_name: name,
            location,
            state: location.split(',')[1]?.trim() || '',
            city: location.split(',')[0]?.trim() || '',
            type,
            established: established || new Date().getFullYear(),
            website: website || null,
            rating: parseFloat(rating),
            fees,
            latitude: latitude || null,
            longitude: longitude || null,
            ranking: 999,
            acceptance_rate: null,
            description,
            highlights: [],
            campus_size: 'Medium',
            student_population: 0,
            is_public: type?.toLowerCase() === 'government'
          }
        ])
        .select()

      if (error) {
        console.error('Error adding college:', error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'College added successfully!',
        college: data?.[0]
      })
    }

    if (action === 'delete') {
      const { collegeId } = body

      if (!collegeId) {
        return NextResponse.json(
          { success: false, error: 'College ID is required' },
          { status: 400 }
        )
      }

      const { error } = await supabaseAdmin
        .from('colleges')
        .delete()
        .eq('id', collegeId)

      if (error) {
        console.error('Error deleting college:', error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'College deleted successfully!'
      })
    }

    if (action === 'update') {
      const { id } = body

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'College ID is required' },
          { status: 400 }
        )
      }

      // Validate required fields
      if (!name || !location || !type || !rating || !fees || !description) {
        return NextResponse.json(
          { success: false, error: 'All fields are required' },
          { status: 400 }
        )
      }

      const { data, error } = await supabaseAdmin
        .from('colleges')
        .update({
          name,
          short_name: name,
          location,
          state: location.split(',')[1]?.trim() || '',
          city: location.split(',')[0]?.trim() || '',
          type,
          established: established || new Date().getFullYear(),
          rating: parseFloat(rating),
          fees,
          latitude: latitude || null,
          longitude: longitude || null,
          description,
          website: website || null,
          is_public: type?.toLowerCase() === 'government'
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating college:', error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'College updated successfully!',
        college: data?.[0]
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Unhandled admin colleges error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process college' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('colleges')
      .select('*')
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching colleges:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      colleges: data || []
    })
  } catch (error: any) {
    console.error('Unhandled colleges GET error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch colleges' },
      { status: 500 }
    )
  }
}
