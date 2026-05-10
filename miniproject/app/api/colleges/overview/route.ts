import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      city,
      state,
      programs,
      rating,
      type,
      website,
    } = body || {}

    if (!name) {
      return NextResponse.json({ success: false, error: 'College name is required' }, { status: 400 })
    }

    const programList = Array.isArray(programs) ? programs.filter(Boolean).slice(0, 6) : []

    const overview = [
      `${name} is a ${type || 'college'} located in ${city || 'N/A'}, ${state || 'N/A'}.`,
      `Current rating shown in FutureMatrix is ${Number(rating || 0).toFixed(1)} / 5.0.`,
      programList.length > 0
        ? `Popular programs include: ${programList.join(', ')}.`
        : 'Program information is currently limited; check the official website for latest offerings.',
      website ? `Official website: ${website}` : 'Official website link is not available in this record.',
      'Tip: Compare fees, cutoff, location, and available programs before shortlisting.',
    ].join('\n\n')

    return NextResponse.json({ success: true, overview })
  } catch (error: any) {
    console.error('Unhandled colleges overview error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to generate overview' }, { status: 500 })
  }
}
