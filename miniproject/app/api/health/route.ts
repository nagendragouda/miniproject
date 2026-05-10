import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'

/**
 * Health check endpoint to verify database connectivity
 * GET /api/health
 */
export async function GET(request: NextRequest) {
  try {
    // Test database connection with a simple query
    const { data, error } = await supabaseAdmin
      .from('user_details')
      .select('id')
      .limit(1)

    if (error) {
      // Connection failed
      const message = error?.message || 'Unknown database error'
      const isNetworkError = message.includes('fetch') || 
                            message.includes('ENOTFOUND') || 
                            message.includes('ECONNREFUSED') ||
                            message.includes('ETIMEDOUT')
      
      return NextResponse.json({
        success: false,
        status: 'UNHEALTHY',
        reason: isNetworkError ? 'NETWORK_ERROR' : 'DATABASE_ERROR',
        message: isNetworkError 
          ? 'Cannot reach database. Check internet and DNS settings.'
          : 'Database connection error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 503 })
    }

    return NextResponse.json({
      success: true,
      status: 'HEALTHY',
      message: 'Database connection OK',
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error: any) {
    const message = error?.message || String(error)
    const isNetworkError = message.includes('fetch') || 
                          message.includes('ENOTFOUND') || 
                          message.includes('ECONNREFUSED')

    return NextResponse.json({
      success: false,
      status: 'UNHEALTHY',
      reason: isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
      message: isNetworkError 
        ? 'Cannot reach database. Check your internet connection.'
        : 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    }, { status: 503 })
  }
}
