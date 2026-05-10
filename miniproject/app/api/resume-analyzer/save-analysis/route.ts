import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const { userId, fileName, jobDescription, analysisResult, score, detectedRole } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('resume_analyses')
      .insert([
        {
          user_id: userId,
          file_name: fileName,
          job_description: jobDescription,
          analysis_result: analysisResult,
          score: score,
          detected_role: detectedRole
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error: any) {
    console.error('Save Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Fetch Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
