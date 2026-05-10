#!/usr/bin/env node

/**
 * Quick Database Test Runner
 * Simple script to test database in a user-friendly way
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
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

async function quickTest() {
  console.clear();
  console.log('\n📊 QUICK DATABASE TEST\n');

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.log('❌ Missing Supabase credentials\n');
    process.exit(1);
  }

  console.log('🔍 Testing database connection...\n');

  const supabase = createClient(url, key);

  try {
    // Test 1: Connect
    const { data, error } = await supabase
      .from('user_details')
      .select('count()', { count: 'exact' })
      .limit(1);

    if (error) throw error;

    // Test 2: Get profile count
    const { count } = await supabase
      .from('user_details')
      .select('*', { count: 'exact' });

    // Test 3: Get sample data
    const { data: profiles } = await supabase
      .from('user_details')
      .select('id, user_id, username, full_name, is_complete')
      .limit(5);

    console.log('✅ CONNECTION SUCCESSFUL\n');
    console.log(`📋 Total Profiles: ${count || 0}\n`);

    if (profiles && profiles.length > 0) {
      console.log('📌 Sample Profiles:\n');
      profiles.forEach((profile, i) => {
        console.log(`   ${i + 1}. ${profile.full_name || 'Unknown'} (@${profile.username})`);
        console.log(`      Status: ${profile.is_complete ? '✅ Complete' : '⏳ Incomplete'}\n`);
      });
    } else {
      console.log('   No profiles yet. Create one in the web app:\n');
      console.log('   npm run dev → Go to Profile page\n');
    }

    console.log('✅ Database is working!\n');

  } catch (error) {
    console.log('❌ CONNECTION FAILED\n');
    console.log(`Error: ${error.message}\n`);
    console.log('💡 Solutions:\n');
    console.log('   1. Fix DNS: Change to 8.8.8.8\n');
    console.log('   2. Use web app: npm run dev\n');
    console.log('   3. Check Supabase project exists\n');
    process.exit(1);
  }
}

quickTest();
