import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'
import { localDb } from '@/lib/local-db'

function normalizeText(value: string) {
  return (value || '').trim().replace(/\s+/g, ' ').toLowerCase()
}

function normalizeEmail(value: string) {
  return (value || '').trim().toLowerCase()
}

function normalizePhone(value: string) {
  return (value || '').replace(/\D/g, '')
}

const COUNTRY_STATE_MAP: Record<string, string[]> = {
  India: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'Telangana', 'Kerala', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'],
  'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Washington', 'Massachusetts', 'Pennsylvania', 'Ohio', 'Virginia'],
  Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  Australia: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania']
}

const VALID_COUNTRIES = Object.keys(COUNTRY_STATE_MAP)

function isLikelyGibberish(value: string) {
  const text = (value || '').toLowerCase().trim()
  if (!text) return false
  if (/(asdf|qwer|zxcv|jkl|poi|lkj|jagwdhvhe|12345)/i.test(text)) return true
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(text.replace(/\s+/g, ''))) return true
  return false
}

function hasDuplicateFields(duplicateFields: Record<string, boolean>) {
  return Object.values(duplicateFields).some(Boolean)
}

function getDuplicateErrorPayload(duplicateFields: Record<string, boolean>) {
  return {
    success: false,
    error: 'This value already exists. Please enter a unique value.',
    errorType: 'DUPLICATE',
    duplicateFields
  }
}

function getErrorInfo(error: any) {
  const message = error?.message || String(error)
  const code = error?.code || 'UNKNOWN'

  if (message.includes('fetch') || message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
    return {
      type: 'CONNECTION',
      message: 'Using local storage (Supabase connection failed)',
      details: message,
      isConnectionError: true
    }
  }

  if (code === 'PGRST116') {
    return {
      type: 'NOT_FOUND',
      message: 'Profile not found for this user',
      details: null
    }
  }

  return {
    type: 'UNKNOWN',
    message,
    details: error
  }
}

function isUniqueViolation(error: any) {
  const message = (error?.message || '').toLowerCase()
  return error?.code === '23505' || message.includes('duplicate key') || message.includes('unique constraint')
}

function buildDuplicateMapFromValues(input: {
  username?: string
  institutionName?: string
  email?: string
  phoneNumber?: string
}) {
  return {
    username: !!normalizeText(input.username || ''),
    institutionName: !!normalizeText(input.institutionName || ''),
    email: !!normalizeEmail(input.email || ''),
    phoneNumber: !!normalizePhone(input.phoneNumber || '')
  }
}

async function getAllComparableRowsFromSupabase(excludeUserId: string) {
  return await supabaseAdmin
    .from('user_details')
    .select('user_id,username,institution_name,email,phone_number')
    .neq('user_id', excludeUserId)
}

async function getAllComparableRowsFromLocal(excludeUserId: string) {
  const all = await localDb.selectAll()
  const rows = Object.values(all.data || {}).filter((row: any) => row?.user_id !== excludeUserId)
  return { data: rows, error: all.error }
}

async function checkDuplicateFields(input: {
  userId: string
  username?: string
  institutionName?: string
  email?: string
  phoneNumber?: string
}) {
  const normalizedInput = {
    username: normalizeText(input.username || ''),
    institutionName: normalizeText(input.institutionName || ''),
    email: normalizeEmail(input.email || ''),
    phoneNumber: normalizePhone(input.phoneNumber || '')
  }

  const duplicateFields: Record<string, boolean> = {
    username: false,
    institutionName: false,
    email: false,
    phoneNumber: false
  }

  const supaResult = await getAllComparableRowsFromSupabase(input.userId)

  let rows: any[] = []
  if (supaResult.error) {
    const errorInfo = getErrorInfo(supaResult.error)
    if (errorInfo.isConnectionError) {
      const localResult = await getAllComparableRowsFromLocal(input.userId)
      if (localResult.error) {
        throw localResult.error
      }
      rows = localResult.data || []
    } else {
      throw supaResult.error
    }
  } else {
    rows = supaResult.data || []
  }

  for (const row of rows) {
    const rowUsername = normalizeText(row.username || '')
    const rowInstitution = normalizeText(row.institution_name || '')
    const rowEmail = normalizeEmail(row.email || '')
    const rowPhone = normalizePhone(row.phone_number || '')

    if (normalizedInput.username && rowUsername === normalizedInput.username) duplicateFields.username = true
    if (normalizedInput.institutionName && rowInstitution === normalizedInput.institutionName) duplicateFields.institutionName = true
    if (normalizedInput.email && rowEmail === normalizedInput.email) duplicateFields.email = true
    if (normalizedInput.phoneNumber && rowPhone === normalizedInput.phoneNumber) duplicateFields.phoneNumber = true

    if (hasDuplicateFields(duplicateFields)) {
      const allFound =
        (!normalizedInput.username || duplicateFields.username) &&
        (!normalizedInput.institutionName || duplicateFields.institutionName) &&
        (!normalizedInput.email || duplicateFields.email) &&
        (!normalizedInput.phoneNumber || duplicateFields.phoneNumber)
      if (allFound) break
    }
  }

  return duplicateFields
}

function sanitizeIncomingData(data: any) {
  return {
    profilePicture: data?.profilePicture || null,
    username: normalizeText(data?.username || ''),
    fullName: (data?.fullName || '').trim().replace(/\s+/g, ' '),
    email: normalizeEmail(data?.email || ''),
    phoneNumber: normalizePhone(data?.phoneNumber || ''),
    age: parseInt(data?.age, 10) || 0,
    gender: (data?.gender || '').trim(),
    country: (data?.country || '').trim(),
    state: (data?.state || '').trim(),
    educationLevel: (data?.educationLevel || '').trim(),
    course: (data?.course || '').trim().replace(/\s+/g, ' '),
    institutionName: (data?.institutionName || '').trim().replace(/\s+/g, ' '),
    yearOfStudy: (data?.yearOfStudy || '').trim(),
    skills: Array.isArray(data?.skills) ? data.skills : [],
    interests: Array.isArray(data?.interests) ? data.interests : [],
    activityPreference: (data?.activityPreference || '').trim(),
    workStyle: (data?.workStyle || '').trim(),
    desiredCareerField: (data?.desiredCareerField || '').trim(),
    dreamJobRole: (data?.dreamJobRole || '').trim(),
    expectedSalary: (data?.expectedSalary || '').trim(),
    workPreference: (data?.workPreference || '').trim(),
    learningMethod: (data?.learningMethod || '').trim(),
    weeklyTimeAvailability: (data?.weeklyTimeAvailability || '').trim(),
    careerClarity: (data?.careerClarity || '').trim(),
    experience: Array.isArray(data?.experience) ? data.experience : [],
    socialLinks: Array.isArray(data?.socialLinks) ? data.socialLinks : []
  }
}

function validatePayload(data: any) {
  if (!data.username) return 'Username is required'
  if (!data.fullName) return 'Full name is required'
  if (!data.email) return 'Email is required'
  if (!data.phoneNumber) return 'Phone number is required'
  if (!data.educationLevel) return 'Education level is required'
  if (!data.course) return 'Course is required'
  if (!data.institutionName) return 'Institution name is required'
  if (!data.gender) return 'Gender is required'
  if (!data.country) return 'Country is required'
  if (!data.state) return 'State is required'
  if (!data.age || data.age < 13 || data.age > 100) return 'Valid age is required'

  if (!/^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/.test(data.username)) return 'Please enter a valid value.'
  if (!/^[A-Za-z ]+$/.test(data.fullName) || data.fullName.trim().length < 3 || isLikelyGibberish(data.fullName)) return 'Please enter a valid value.'
  if (!/^[A-Za-z0-9&.,()\-\s]{3,255}$/.test(data.institutionName) || isLikelyGibberish(data.institutionName)) return 'Please enter a valid value.'

  if (!VALID_COUNTRIES.includes(data.country)) return 'Please enter a valid value.'
  if (!(COUNTRY_STATE_MAP[data.country] || []).includes(data.state)) return 'Please enter a valid value.'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Please enter a valid email address'

  const phoneDigits = normalizePhone(data.phoneNumber)
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return 'Please enter a valid phone number'
  }

  return null
}

function toInsertData(userId: string, data: any) {
  const fieldLimits = {
    username: 100,
    full_name: 255,
    email: 255,
    phone_number: 30,
    course: 255,
    institution_name: 255,
    desired_career_field: 255,
    dream_job_role: 255,
    career_clarity: 255,
    gender: 50,
    country: 100,
    state: 100,
    education_level: 100,
    year_of_study: 50,
    activity_preference: 100,
    work_style: 100,
    expected_salary: 100,
    work_preference: 100,
    learning_method: 100,
    weekly_time_availability: 100
  }

  return {
    user_id: userId,
    profile_picture_url: data.profilePicture || null,
    username: data.username.substring(0, fieldLimits.username),
    full_name: data.fullName.substring(0, fieldLimits.full_name),
    email: data.email.substring(0, fieldLimits.email),
    phone_number: data.phoneNumber.substring(0, fieldLimits.phone_number),
    age: data.age,
    gender: data.gender.substring(0, fieldLimits.gender),
    country: data.country.substring(0, fieldLimits.country),
    state: (data.state || null)?.substring(0, fieldLimits.state) || null,
    education_level: data.educationLevel.substring(0, fieldLimits.education_level),
    course: data.course.substring(0, fieldLimits.course),
    institution_name: data.institutionName.substring(0, fieldLimits.institution_name),
    year_of_study: data.yearOfStudy.substring(0, fieldLimits.year_of_study),
    skills: data.skills,
    interests: data.interests,
    activity_preference: (data.activityPreference || null)?.substring(0, fieldLimits.activity_preference) || null,
    work_style: (data.workStyle || null)?.substring(0, fieldLimits.work_style) || null,
    desired_career_field: (data.desiredCareerField || null)?.substring(0, fieldLimits.desired_career_field) || null,
    dream_job_role: (data.dreamJobRole || null)?.substring(0, fieldLimits.dream_job_role) || null,
    expected_salary: (data.expectedSalary || null)?.substring(0, fieldLimits.expected_salary) || null,
    work_preference: (data.workPreference || null)?.substring(0, fieldLimits.work_preference) || null,
    learning_method: (data.learningMethod || null)?.substring(0, fieldLimits.learning_method) || null,
    weekly_time_availability: (data.weeklyTimeAvailability || null)?.substring(0, fieldLimits.weekly_time_availability) || null,
    career_clarity: (data.careerClarity || null)?.substring(0, fieldLimits.career_clarity) || null,
    experience: data.experience,
    social_links: data.socialLinks,
    is_complete: true
  }
}

export async function GET(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get('mode')
    const userId = request.nextUrl.searchParams.get('userId') || ''

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    if (mode === 'unique-check') {
      const duplicateFields = await checkDuplicateFields({
        userId,
        username: request.nextUrl.searchParams.get('username') || '',
        institutionName: request.nextUrl.searchParams.get('institutionName') || '',
        email: request.nextUrl.searchParams.get('email') || '',
        phoneNumber: request.nextUrl.searchParams.get('phoneNumber') || ''
      })

      return NextResponse.json({
        success: true,
        duplicateFields
      })
    }

    let data: any = null
    let dbError: any = null
    let usingLocalDb = false

    const supaResult = await supabaseAdmin.from('user_details').select('*').eq('user_id', userId)

    if (supaResult.error) {
      const errorInfo = getErrorInfo(supaResult.error)
      if (errorInfo.isConnectionError) {
        const localResult = await localDb.select(userId)
        data = localResult.data
        dbError = localResult.error
        usingLocalDb = true
      } else {
        dbError = supaResult.error
      }
    } else {
      // Handle array response from select() instead of .single()
      data = supaResult.data && supaResult.data.length > 0 ? supaResult.data[0] : null
    }

    if (dbError) {
      const errorInfo = getErrorInfo(dbError)
      return NextResponse.json(
        {
          success: false,
          error: errorInfo.message,
          errorType: errorInfo.type,
          details: process.env.NODE_ENV === 'development' ? errorInfo.details : undefined
        },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({
        success: true,
        data: null,
        isComplete: false,
        message: 'No profile found. Please create one.',
        source: usingLocalDb ? 'local' : 'supabase'
      })
    }

    const mappedData = {
      profilePicture: data?.profile_picture_url || '',
      username: data?.username || '',
      fullName: data?.full_name || '',
      email: data?.email || '',
      phoneNumber: data?.phone_number || '',
      age: data?.age || 0,
      gender: data?.gender || '',
      country: data?.country || '',
      state: data?.state || '',
      educationLevel: data?.education_level || '',
      course: data?.course || '',
      institutionName: data?.institution_name || '',
      yearOfStudy: data?.year_of_study || '',
      skills: Array.isArray(data?.skills) ? data.skills : [],
      interests: Array.isArray(data?.interests) ? data.interests : [],
      activityPreference: data?.activity_preference || '',
      workStyle: data?.work_style || '',
      desiredCareerField: data?.desired_career_field || '',
      dreamJobRole: data?.dream_job_role || '',
      expectedSalary: data?.expected_salary || '',
      workPreference: data?.work_preference || '',
      learningMethod: data?.learning_method || '',
      weeklyTimeAvailability: data?.weekly_time_availability || '',
      experience: Array.isArray(data?.experience) ? data.experience : [],
      socialLinks: Array.isArray(data?.social_links) ? data.social_links : [],
      careerClarity: data?.career_clarity || ''
    }

    return NextResponse.json({
      success: true,
      data: mappedData,
      isComplete: data?.is_complete || false,
      source: usingLocalDb ? 'local' : 'supabase'
    })
  } catch (error: any) {
    const errorInfo = getErrorInfo(error)
    return NextResponse.json(
      {
        success: false,
        error: errorInfo.message || 'Failed to fetch user details',
        errorType: errorInfo.type,
        details: process.env.NODE_ENV === 'development' ? errorInfo.details : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, data } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data is required',
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    const sanitizedData = sanitizeIncomingData(data)
    const validationError = validatePayload(sanitizedData)
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    const duplicateFields = await checkDuplicateFields({
      userId,
      username: sanitizedData.username,
      institutionName: sanitizedData.institutionName,
      email: sanitizedData.email,
      phoneNumber: sanitizedData.phoneNumber
    })

    if (hasDuplicateFields(duplicateFields)) {
      return NextResponse.json(getDuplicateErrorPayload(duplicateFields), { status: 409 })
    }

    const insertData = toInsertData(userId, sanitizedData)

    let insertedData: any = null
    let dbError: any = null
    let usingLocalDb = false

    const supaResult = await supabaseAdmin.from('user_details').insert([insertData]).select()

    if (supaResult.error) {
      const errorInfo = getErrorInfo(supaResult.error)
      if (errorInfo.isConnectionError) {
        const localResult = await localDb.insert(insertData)
        insertedData = localResult.data
        dbError = localResult.error
        usingLocalDb = true
      } else {
        dbError = supaResult.error
      }
    } else {
      insertedData = supaResult.data
    }

    if (dbError) {
      if (isUniqueViolation(dbError)) {
        const uniqueDuplicateFields = buildDuplicateMapFromValues({
          username: sanitizedData.username,
          institutionName: sanitizedData.institutionName,
          email: sanitizedData.email,
          phoneNumber: sanitizedData.phoneNumber
        })
        return NextResponse.json(getDuplicateErrorPayload(uniqueDuplicateFields), { status: 409 })
      }

      const errorInfo = getErrorInfo(dbError)
      return NextResponse.json(
        {
          success: false,
          error: errorInfo.message || 'Database error occurred',
          errorType: errorInfo.type,
          details: process.env.NODE_ENV === 'development' ? errorInfo.details : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `User details saved successfully (${usingLocalDb ? 'local storage' : 'Supabase'})`,
      data: insertedData,
      source: usingLocalDb ? 'local' : 'supabase'
    })
  } catch (error: any) {
    const errorInfo = getErrorInfo(error)
    return NextResponse.json(
      {
        success: false,
        error: errorInfo.message || 'Failed to save user details',
        errorType: errorInfo.type,
        details: process.env.NODE_ENV === 'development' ? errorInfo.details : undefined
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, data } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data is required',
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    const sanitizedData = sanitizeIncomingData(data)
    const validationError = validatePayload(sanitizedData)
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
          errorType: 'VALIDATION'
        },
        { status: 400 }
      )
    }

    const duplicateFields = await checkDuplicateFields({
      userId,
      username: sanitizedData.username,
      institutionName: sanitizedData.institutionName,
      email: sanitizedData.email,
      phoneNumber: sanitizedData.phoneNumber
    })

    if (hasDuplicateFields(duplicateFields)) {
      return NextResponse.json(getDuplicateErrorPayload(duplicateFields), { status: 409 })
    }

    const updateData = {
      ...toInsertData(userId, sanitizedData),
      updated_at: new Date().toISOString()
    }

    let dbError: any = null
    let usingLocalDb = false

    const supaResult = await supabaseAdmin.from('user_details').update(updateData).eq('user_id', userId)

    if (supaResult.error) {
      const errorInfo = getErrorInfo(supaResult.error)
      if (errorInfo.isConnectionError) {
        const localResult = await localDb.update(userId, updateData)
        dbError = localResult.error
        usingLocalDb = true
      } else {
        dbError = supaResult.error
      }
    }

    if (dbError) {
      if (isUniqueViolation(dbError)) {
        const uniqueDuplicateFields = buildDuplicateMapFromValues({
          username: sanitizedData.username,
          institutionName: sanitizedData.institutionName,
          email: sanitizedData.email,
          phoneNumber: sanitizedData.phoneNumber
        })
        return NextResponse.json(getDuplicateErrorPayload(uniqueDuplicateFields), { status: 409 })
      }

      const errorInfo = getErrorInfo(dbError)
      return NextResponse.json(
        {
          success: false,
          error: errorInfo.message || 'Database error occurred',
          errorType: errorInfo.type,
          details: process.env.NODE_ENV === 'development' ? errorInfo.details : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `User details updated successfully (${usingLocalDb ? 'local storage' : 'Supabase'})`,
      source: usingLocalDb ? 'local' : 'supabase'
    })
  } catch (error: any) {
    const errorInfo = getErrorInfo(error)
    return NextResponse.json(
      {
        success: false,
        error: errorInfo.message || 'Failed to update user details',
        errorType: errorInfo.type,
        details: process.env.NODE_ENV === 'development' ? errorInfo.details : undefined
      },
      { status: 500 }
    )
  }
}
