// app/api/user-details/route-sql.ts
// SQL Database Version (MySQL/PostgreSQL)
// To use this instead of Firebase: Replace the import in route.ts or use a database library

import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'career_advisor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(request: NextRequest) {
  const connection = await pool.getConnection()
  
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get main user details
    const [userDetails] = await connection.execute(
      'SELECT * FROM user_details WHERE user_id = ?',
      [userId]
    )

    if (!userDetails || userDetails.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        isComplete: false
      })
    }

    const user = userDetails[0]

    // Get skills
    const [skills] = await connection.execute(
      'SELECT skill FROM user_skills WHERE user_id = ?',
      [userId]
    )

    // Get interests
    const [interests] = await connection.execute(
      'SELECT interest FROM user_interests WHERE user_id = ?',
      [userId]
    )

    // Get experience
    const [experience] = await connection.execute(
      'SELECT type, title, description, duration FROM user_experience WHERE user_id = ?',
      [userId]
    )

    // Get social links
    const [socialLinks] = await connection.execute(
      'SELECT platform, url FROM user_social_links WHERE user_id = ?',
      [userId]
    )

    const data = {
      profilePicture: user.profile_picture,
      username: user.username,
      fullName: user.full_name,
      email: user.email || '',
      phoneNumber: user.phone_number || '',
      age: user.age,
      gender: user.gender,
      country: user.country,
      state: user.state,
      city: user.city,
      educationLevel: user.education_level,
      course: user.course,
      institutionName: user.institution_name,
      yearOfStudy: user.year_of_study,
      skills: skills.map(s => s.skill),
      interests: interests.map(i => i.interest),
      activityPreference: user.activity_preference,
      workStyle: user.work_style,
      desiredCareerField: user.desired_career_field,
      dreamJobRole: user.dream_job_role,
      expectedSalary: user.expected_salary,
      workPreference: user.work_preference,
      learningMethod: user.learning_method,
      weeklyTimeAvailability: user.weekly_time_availability,
      experience: experience,
      socialLinks: socialLinks,
      careerClarity: user.career_clarity
    }

    return NextResponse.json({
      success: true,
      data: data,
      isComplete: user.is_complete
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

export async function POST(request: NextRequest) {
  const connection = await pool.getConnection()
  
  try {
    const body = await request.json()
    const { userId, data } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Start transaction
    await connection.beginTransaction()

    // Insert main user details
    await connection.execute(
      `INSERT INTO user_details (
        user_id, profile_picture, username, full_name, email, phone_number, age, gender, country, state, city,
        education_level, course, institution_name, year_of_study, activity_preference,
        work_style, desired_career_field, dream_job_role, expected_salary, work_preference,
        learning_method, weekly_time_availability, career_clarity, is_complete
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        userId,
        data.profilePicture,
        data.username,
        data.fullName,
        (data.email || '').trim().toLowerCase(),
        (data.phoneNumber || '').trim(),
        data.age,
        data.gender,
        data.country,
        data.state || null,
        data.city || null,
        data.educationLevel,
        data.course,
        data.institutionName,
        data.yearOfStudy,
        data.activityPreference || null,
        data.workStyle || null,
        data.desiredCareerField || null,
        data.dreamJobRole || null,
        data.expectedSalary || null,
        data.workPreference || null,
        data.learningMethod || null,
        data.weeklyTimeAvailability || null,
        data.careerClarity || null
      ]
    )

    // Insert skills
    if (data.skills && data.skills.length > 0) {
      for (const skill of data.skills) {
        await connection.execute(
          'INSERT INTO user_skills (user_id, skill) VALUES (?, ?)',
          [userId, skill]
        )
      }
    }

    // Insert interests
    if (data.interests && data.interests.length > 0) {
      for (const interest of data.interests) {
        await connection.execute(
          'INSERT INTO user_interests (user_id, interest) VALUES (?, ?)',
          [userId, interest]
        )
      }
    }

    // Insert experience
    if (data.experience && data.experience.length > 0) {
      for (const exp of data.experience) {
        await connection.execute(
          'INSERT INTO user_experience (user_id, type, title, description, duration) VALUES (?, ?, ?, ?, ?)',
          [userId, exp.type, exp.title, exp.description, exp.duration || null]
        )
      }
    }

    // Insert social links
    if (data.socialLinks && data.socialLinks.length > 0) {
      for (const link of data.socialLinks) {
        await connection.execute(
          'INSERT INTO user_social_links (user_id, platform, url) VALUES (?, ?, ?)',
          [userId, link.platform, link.url]
        )
      }
    }

    await connection.commit()

    return NextResponse.json({
      success: true,
      message: 'User details saved successfully'
    })
  } catch (error) {
    await connection.rollback()
    console.error('Error saving user details:', error)
    return NextResponse.json(
      { error: 'Failed to save user details' },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

export async function PUT(request: NextRequest) {
  const connection = await pool.getConnection()
  
  try {
    const body = await request.json()
    const { userId, data } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Start transaction
    await connection.beginTransaction()

    // Update main user details
    await connection.execute(
      `UPDATE user_details SET
        profile_picture = ?, username = ?, full_name = ?, email = ?, phone_number = ?, age = ?, gender = ?, country = ?,
        state = ?, city = ?, education_level = ?, course = ?, institution_name = ?,
        year_of_study = ?, activity_preference = ?, work_style = ?, desired_career_field = ?,
        dream_job_role = ?, expected_salary = ?, work_preference = ?, learning_method = ?,
        weekly_time_availability = ?, career_clarity = ?, is_complete = TRUE, updated_at = NOW()
      WHERE user_id = ?`,
      [
        data.profilePicture,
        data.username,
        data.fullName,
        (data.email || '').trim().toLowerCase(),
        (data.phoneNumber || '').trim(),
        data.age,
        data.gender,
        data.country,
        data.state || null,
        data.city || null,
        data.educationLevel,
        data.course,
        data.institutionName,
        data.yearOfStudy,
        data.activityPreference || null,
        data.workStyle || null,
        data.desiredCareerField || null,
        data.dreamJobRole || null,
        data.expectedSalary || null,
        data.workPreference || null,
        data.learningMethod || null,
        data.weeklyTimeAvailability || null,
        data.careerClarity || null,
        userId
      ]
    )

    // Clear and reinsert skills
    await connection.execute('DELETE FROM user_skills WHERE user_id = ?', [userId])
    if (data.skills && data.skills.length > 0) {
      for (const skill of data.skills) {
        await connection.execute(
          'INSERT INTO user_skills (user_id, skill) VALUES (?, ?)',
          [userId, skill]
        )
      }
    }

    // Clear and reinsert interests
    await connection.execute('DELETE FROM user_interests WHERE user_id = ?', [userId])
    if (data.interests && data.interests.length > 0) {
      for (const interest of data.interests) {
        await connection.execute(
          'INSERT INTO user_interests (user_id, interest) VALUES (?, ?)',
          [userId, interest]
        )
      }
    }

    // Clear and reinsert experience
    await connection.execute('DELETE FROM user_experience WHERE user_id = ?', [userId])
    if (data.experience && data.experience.length > 0) {
      for (const exp of data.experience) {
        await connection.execute(
          'INSERT INTO user_experience (user_id, type, title, description, duration) VALUES (?, ?, ?, ?, ?)',
          [userId, exp.type, exp.title, exp.description, exp.duration || null]
        )
      }
    }

    // Clear and reinsert social links
    await connection.execute('DELETE FROM user_social_links WHERE user_id = ?', [userId])
    if (data.socialLinks && data.socialLinks.length > 0) {
      for (const link of data.socialLinks) {
        await connection.execute(
          'INSERT INTO user_social_links (user_id, platform, url) VALUES (?, ?, ?)',
          [userId, link.platform, link.url]
        )
      }
    }

    await connection.commit()

    return NextResponse.json({
      success: true,
      message: 'User details updated successfully'
    })
  } catch (error) {
    await connection.rollback()
    console.error('Error updating user details:', error)
    return NextResponse.json(
      { error: 'Failed to update user details' },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}
