#!/usr/bin/env node

// Check all profile data - Direct Supabase query
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnvVars() {
  const envVars = {};
  const files = ['.env.local', '.env'];
  
  for (const file of files) {
    const envPath = path.join(__dirname, file);
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            if (value) envVars[key.trim()] = value;
          }
        }
      });
      if (Object.keys(envVars).length > 0) break;
    } catch (error) {
      // Try next file
    }
  }
  
  return envVars;
}

async function checkProfileData() {
  console.log('📊 Checking All Profile Data in Database...\n');

  const envVars = loadEnvVars();

  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in environment variables');
    process.exit(1);
  }

  if (!serviceRoleKey && !anonKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  // Use service role key for full access
  const apiKey = serviceRoleKey || anonKey;
  const supabase = createClient(supabaseUrl, apiKey);

  console.log('✅ Supabase connected');
  console.log(`   URL: ${supabaseUrl.substring(0, 50)}...\n`);

  try {
    console.log('🔍 Querying user_details table...\n');
    
    // Query all profiles
    const { data: profiles, error, count } = await supabase
      .from('user_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database query error:', error.message);
      console.error('   Code:', error.code);
      process.exit(1);
    }

    if (!profiles || profiles.length === 0) {
      console.log('⚠️  No profile data found in the user_details table');
      console.log('\nTo add profile data:');
      console.log('  1. Start the app: npm run dev');
      console.log('  2. Go to Profile page');
      console.log('  3. Fill out and save your profile\n');
      return;
    }

    console.log(`✅ Found ${profiles.length} profile(s)\n`);
    console.log('═'.repeat(100));

    profiles.forEach((profile, index) => {
      console.log(`\n📌 PROFILE ${index + 1} ────────────────────────────────────────────────────────────`);
      
      // Basic Info
      console.log(`\n  🔑 Basic Information:`);
      console.log(`     ID: ${profile.id}`);
      console.log(`     User ID: ${profile.user_id}`);
      console.log(`     Username: ${profile.username}`);
      console.log(`     Full Name: ${profile.full_name}`);
      console.log(`     Picture: ${profile.profile_picture_url ? '✅ Uploaded' : '❌ Not set'}`);
      
      // Personal Demographics
      console.log(`\n  👤 Personal:`);
      console.log(`     Age: ${profile.age}`);
      console.log(`     Gender: ${profile.gender}`);
      console.log(`     Location: ${profile.city || 'N/A'}, ${profile.state || 'N/A'}, ${profile.country}`);
      
      // Education
      console.log(`\n  🎓 Education:`);
      console.log(`     Level: ${profile.education_level}`);
      console.log(`     Course: ${profile.course}`);
      console.log(`     Institution: ${profile.institution_name}`);
      console.log(`     Year: ${profile.year_of_study}`);
      
      // Skills & Interests
      const skills = Array.isArray(profile.skills) ? profile.skills : JSON.parse(profile.skills || '[]');
      const interests = Array.isArray(profile.interests) ? profile.interests : JSON.parse(profile.interests || '[]');
      
      console.log(`\n  💡 Skills & Interests:`);
      console.log(`     Skills: ${skills.length > 0 ? skills.join(', ') : 'Not specified'}`);
      console.log(`     Interests: ${interests.length > 0 ? interests.join(', ') : 'Not specified'}`);
      
      // Personality
      console.log(`\n  🎯 Personality:`);
      console.log(`     Activity: ${profile.activity_preference || 'Not specified'}`);
      console.log(`     Work Style: ${profile.work_style || 'Not specified'}`);
      
      // Career Goals
      console.log(`\n  🚀 Career Goals:`);
      console.log(`     Desired Field: ${profile.desired_career_field || 'Not specified'}`);
      console.log(`     Dream Job: ${profile.dream_job_role || 'Not specified'}`);
      console.log(`     Expected Salary: ${profile.expected_salary || 'Not specified'}`);
      console.log(`     Work Preference: ${profile.work_preference || 'Not specified'}`);
      
      // Learning
      console.log(`\n  📚 Learning:`);
      console.log(`     Method: ${profile.learning_method || 'Not specified'}`);
      console.log(`     Availability: ${profile.weekly_time_availability || 'Not specified'}`);
      console.log(`     Career Clarity: ${profile.career_clarity || 'Not specified'}`);
      
      // Status
      console.log(`\n  ✓ Status:`);
      console.log(`     Complete: ${profile.is_complete ? '✅ Yes' : '⏳ Incomplete'}`);
      console.log(`     Created: ${new Date(profile.created_at).toLocaleString()}`);
      console.log(`     Updated: ${new Date(profile.updated_at).toLocaleString()}`);
    });

    console.log('\n' + '═'.repeat(100));
    console.log(`\n✅ Summary: ${profiles.length} profile(s) found in database\n`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
    process.exit(1);
  }
}

checkProfileData().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
