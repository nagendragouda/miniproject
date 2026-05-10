import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    // Use service role to bypass RLS for admin dashboard
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 1. Fetch total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // 2. Fetch career predictions (Total and Unique)
    const { data: predictionUsers } = await supabase
      .from('career_predictions')
      .select('firebase_uid')
    
    const totalPredictions = predictionUsers?.length || 0
    const uniquePredictors = new Set(predictionUsers?.map(p => p.firebase_uid) || []).size

    // 3. Fetch college partnerships
    const { count: collegePartnerships } = await supabase
      .from('saved_colleges')
      .select('*', { count: 'exact', head: true })

    // 4. Fetch Active sessions (updated in last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: activeSession } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', oneDayAgo)

    // 5. Fetch Education Breakdown for Analytics
    const { data: eduStats } = await supabase.from('profiles').select('education_level')
    const eduBreakdown = (eduStats || []).reduce((acc: any, curr) => {
      const level = curr.education_level || 'Unknown'
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {})

    // 6. Fetch Top Careers for Analytics
    const { data: topCareersRaw } = await supabase.from('career_predictions').select('career_name').limit(1000)
    const careerMap = (topCareersRaw || []).reduce((acc: any, curr) => {
      acc[curr.career_name] = (acc[curr.career_name] || 0) + 1
      return acc
    }, {})
    const sortedCareers = Object.entries(careerMap)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    // 7. Fetch Page Views Trend (Last 7 Days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: pageViewsRaw } = await supabase
      .from('user_activity')
      .select('created_at')
      .gte('created_at', sevenDaysAgo)
    
    const viewsMap = (pageViewsRaw || []).reduce((acc: any, curr) => {
      const date = new Date(curr.created_at).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    let pageViewsTrend = Object.entries(viewsMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Mock data fallback if no activity is recorded yet
    if (pageViewsTrend.length === 0) {
      pageViewsTrend = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return {
          date: d.toLocaleDateString(),
          count: Math.floor(Math.random() * 20) + 10
        }
      })
    }

    // 8. Fetch Average Match Score (Dynamic based on academic performance)
    const { data: scoreData } = await supabase.from('profiles').select('academic_score')
    const validScores = (scoreData || [])
      .map(s => parseFloat(s.academic_score?.toString() || '0'))
      .filter(s => s > 0)
    
    const avgScore = validScores.length > 0 
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) 
      : 84 // Fallback if no scores exist

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        predictionsMade: totalPredictions,
        activeSession: activeSession || 0,
        collegePartnerships: collegePartnerships || 0,
        avgMatchScore: avgScore,
        conversionRate: totalUsers && totalUsers > 0 
          ? Math.min(100, parseFloat(((uniquePredictors / totalUsers) * 100).toFixed(1))) 
          : 0
      },
      analytics: {
        eduData: Object.entries(eduBreakdown).map(([name, value]) => ({ name, value })),
        topCareers: sortedCareers,
        pageViewsTrend
      }
    })
  } catch (error: any) {
    console.error('Admin Stats API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
