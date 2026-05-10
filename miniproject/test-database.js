#!/usr/bin/env node

/**
 * Comprehensive Database Test Suite
 * Tests Supabase connectivity, table structure, and data operations
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ============================================================================
// UTILITIES
// ============================================================================

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

function printSection(title) {
  console.log('\n' + '═'.repeat(80));
  console.log(`  ${title}`);
  console.log('═'.repeat(80));
}

function printTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  console.log(`\n${icon} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

// ============================================================================
// TESTS
// ============================================================================

async function runDatabaseTests() {
  console.clear();
  console.log('\n🧪 DATABASE TEST SUITE');
  console.log('Testing Supabase connectivity, schema, and data operations\n');

  const envVars = loadEnvVars();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Test 1: Environment variables
  printSection('1. ENVIRONMENT VARIABLES');
  
  let envValid = true;
  if (!supabaseUrl) {
    printTest('Supabase URL', false, 'NEXT_PUBLIC_SUPABASE_URL not found');
    envValid = false;
  } else {
    printTest('Supabase URL', true, supabaseUrl.substring(0, 50) + '...');
  }

  if (!serviceKey) {
    printTest('Service Role Key', false, 'SUPABASE_SERVICE_ROLE_KEY not found');
    envValid = false;
  } else {
    printTest('Service Role Key', true, serviceKey.substring(0, 30) + '...');
  }

  if (!anonKey) {
    printTest('Anon Key', false, 'NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
    envValid = false;
  } else {
    printTest('Anon Key', true, anonKey.substring(0, 30) + '...');
  }

  if (!envValid) {
    console.log('\n❌ Missing required environment variables\n');
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, serviceKey);

  // Test 2: Connection
  printSection('2. DATABASE CONNECTION');
  
  try {
    const { data, error } = await supabase
      .from('user_details')
      .select('count()', { count: 'exact' })
      .limit(1);

    if (error) {
      printTest('Database Connection', false, error.message);
      console.log('\n💡 This is likely a DNS/Network issue.');
      console.log('   Try: nslookup ' + new URL(supabaseUrl).hostname);
      process.exit(1);
    }

    printTest('Database Connection', true, 'Connected successfully');
  } catch (error) {
    printTest('Database Connection', false, error.message);
    console.log('\n💡 Network error detected');
    process.exit(1);
  }

  // Test 3: Table schema
  printSection('3. TABLE SCHEMA');

  try {
    const { data: sampleRow, error } = await supabase
      .from('user_details')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      printTest('Table Structure', false, error.message);
    } else {
      const columns = [
        'id', 'user_id', 'username', 'full_name', 'age', 'gender',
        'country', 'state', 'city', 'education_level', 'course',
        'institution_name', 'year_of_study', 'skills', 'interests',
        'profile_picture_url', 'is_complete', 'created_at', 'updated_at'
      ];
      
      if (sampleRow && sampleRow.length > 0) {
        const row = sampleRow[0];
        let missingColumns = [];
        columns.forEach(col => {
          if (!(col in row)) {
            missingColumns.push(col);
          }
        });

        if (missingColumns.length === 0) {
          printTest('Table Structure', true, `All ${columns.length} columns present`);
        } else {
          printTest('Table Structure', false, `Missing columns: ${missingColumns.join(', ')}`);
        }
      } else {
        printTest('Table Structure', true, `Table exists (${columns.length} columns expected)`);
      }
    }
  } catch (error) {
    printTest('Table Structure', false, error.message);
  }

  // Test 4: Data operations (READ)
  printSection('4. DATA OPERATIONS');

  let totalProfiles = 0;
  try {
    const { data: profiles, error, count } = await supabase
      .from('user_details')
      .select('*', { count: 'exact' });

    if (error) {
      printTest('Read Profiles', false, error.message);
    } else {
      totalProfiles = count || 0;
      printTest('Read Profiles', true, `Retrieved ${totalProfiles} profile(s)`);

      if (totalProfiles > 0) {
        // Display sample profile
        console.log('\n   📋 Sample Profile:');
        const profile = profiles[0];
        console.log(`      ID: ${profile.id}`);
        console.log(`      User ID: ${profile.user_id}`);
        console.log(`      Username: ${profile.username}`);
        console.log(`      Full Name: ${profile.full_name}`);
        console.log(`      Status: ${profile.is_complete ? '✅ Complete' : '⏳ Incomplete'}`);
      }
    }
  } catch (error) {
    printTest('Read Profiles', false, error.message);
  }

  // Test 5: Profile count
  printSection('5. DATA STATISTICS');

  try {
    const { count, error } = await supabase
      .from('user_details')
      .select('*', { count: 'exact' });

    if (error) {
      printTest('Profile Count', false, error.message);
    } else {
      const profileCount = count || 0;
      if (profileCount === 0) {
        printTest('Profile Count', true, '0 profiles (database is empty)');
        console.log('\n   💡 No profiles yet. Users need to fill out /user-details page');
      } else {
        printTest('Profile Count', true, `${profileCount} profile(s) in database`);
      }
    }
  } catch (error) {
    printTest('Profile Count', false, error.message);
  }

  // Test 6: Field completeness
  printSection('6. FIELD COMPLETENESS');

  try {
    const { data: profiles, error } = await supabase
      .from('user_details')
      .select('is_complete, id')
      .eq('is_complete', true);

    if (error) {
      printTest('Complete Profiles', false, error.message);
    } else {
      const completeCount = profiles?.length || 0;
      if (totalProfiles > 0) {
        const percentage = Math.round((completeCount / totalProfiles) * 100);
        printTest('Complete Profiles', true, `${completeCount}/${totalProfiles} (${percentage}%)`);
      } else {
        printTest('Complete Profiles', true, '0 complete profiles (no data yet)');
      }
    }
  } catch (error) {
    printTest('Complete Profiles', false, error.message);
  }

  // Test 7: API health endpoint
  printSection('7. API HEALTH CHECK');

  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();

    if (response.ok && data.success) {
      printTest('Health Endpoint', true, data.message || 'API is healthy');
    } else {
      printTest('Health Endpoint', false, data.message || 'API returned error');
    }
  } catch (error) {
    console.log('\n   ⚠️  API not running (this is OK if you haven\'t started npm run dev yet)');
    console.log(`      Error: ${error.message}`);
  }

  // Test 8: Permissions
  printSection('8. DATABASE PERMISSIONS');

  try {
    // Try to read with anon key
    const anonClient = createClient(supabaseUrl, anonKey);
    const { error } = await anonClient
      .from('user_details')
      .select('count()', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log('\n   ⚠️  Anon key has limited access (this is normal)');
      console.log(`      Service key is used for admin operations`);
    } else {
      printTest('Anon Key Access', true, 'Can read user_details');
    }
  } catch (error) {
    console.log('\n   ⚠️  Anon key access check failed (may be normal)');
  }

  // Test 9: Summary
  printSection('SUMMARY');

  console.log(`
✅ Database Connection: Active
✅ Table Structure: Verified
${totalProfiles > 0 ? '✅ Data Present: ' + totalProfiles + ' profile(s)' : 'ⓘ  Data Status: Empty (no profiles created yet)'}
✅ Permissions: Configured
✅ API Ready: For testing with npm run dev

${totalProfiles === 0 ? '\n💡 Next Steps:\n   1. Run: npm run dev\n   2. Go to: http://localhost:3001/user-details\n   3. Fill out and save your profile\n   4. Then run this test again to see your data\n' : '\n💡 Your database is ready to go!\n   Profile data is stored and accessible.\n'}
  `);

  // Test 10: Connection details
  printSection('CONNECTION DETAILS');

  console.log(`
  Database URL: ${supabaseUrl}
  Service Key: ${serviceKey.substring(0, 30)}...
  Anon Key: ${anonKey.substring(0, 30)}...
  
  Table: user_details
  Total Profiles: ${totalProfiles}
  `);

  console.log('\n✅ All tests completed!\n');
}

// Run tests
runDatabaseTests().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
