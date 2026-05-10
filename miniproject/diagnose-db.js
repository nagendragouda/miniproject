#!/usr/bin/env node

// Diagnostic script for database connection issues
const fs = require('fs');
const path = require('path');
const https = require('https');

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

console.log('🔍 DATABASE CONNECTION DIAGNOSTIC\n');
console.log('═'.repeat(70));

const envVars = loadEnvVars();

console.log('\n✅ ENVIRONMENT VARIABLES LOADED:\n');

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log(`📍 Supabase URL: ${supabaseUrl || 'NOT SET'}`);
console.log(`🔑 Anon Key: ${anonKey ? '✅ Present (' + anonKey.substring(0, 20) + '...)' : '❌ Missing'}`);
console.log(`🔐 Service Key: ${serviceKey ? '✅ Present (' + serviceKey.substring(0, 20) + '...)' : '❌ Missing'}`);

if (!supabaseUrl || !anonKey) {
  console.log('\n❌ MISSING REQUIRED CREDENTIALS');
  process.exit(1);
}

console.log('\n' + '═'.repeat(70));
console.log('\n🌐 TESTING CONNECTION...\n');

// Extract hostname from URL
const url = new URL(supabaseUrl);
const hostname = url.hostname;

console.log(`Testing hostname: ${hostname}\n`);

// Test HTTPS connection with timeout
function testHttpsConnection() {
  return new Promise((resolve) => {
    const timeoutHandle = setTimeout(() => {
      console.log('⏱️  Request timed out after 5 seconds');
      console.log('   This usually means:');
      console.log('   - DNS cannot resolve the domain');
      console.log('   - Firewall is blocking the connection');
      console.log('   - Network connectivity issue\n');
      
      console.log('🛠️  TROUBLESHOOTING STEPS:\n');
      console.log('1. Try changing your DNS server:');
      console.log('   - Windows: Settings > Network > Change Adapter > DNS Settings');
      console.log('   - Try Google DNS: 8.8.8.8 and 8.8.4.4\n');
      
      console.log('2. Try using a VPN if available\n');
      
      console.log('3. Check your firewall settings\n');
      
      console.log('4. Alternative: Use the web app to view profiles:');
      console.log('   npm run dev');
      console.log('   Then go to the Profile page in your browser\n');
      
      console.log('5. Check if Supabase project exists:');
      console.log(`   Visit: ${supabaseUrl}\n`);
      
      resolve(false);
    }, 5000);

    const req = https.request(
      {
        hostname: hostname,
        port: 443,
        path: '/rest/v1/user_details',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      },
      (res) => {
        clearTimeout(timeoutHandle);
        console.log(`✅ HTTPS Connection: Successful (Status: ${res.statusCode})\n`);
        
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          resolve(true);
        });
      }
    );

    req.on('error', (error) => {
      clearTimeout(timeoutHandle);
      console.log(`❌ Connection Error: ${error.code}`);
      console.log(`   Message: ${error.message}\n`);
      resolve(false);
    });

    req.on('timeout', () => {
      clearTimeout(timeoutHandle);
      req.destroy();
      console.log('❌ Request timeout\n');
      resolve(false);
    });

    req.end();
  });
}

testHttpsConnection().then((success) => {
  if (!success) {
    console.log('═'.repeat(70));
    console.log('\n💡 RECOMMENDATION:\n');
    console.log('Since you cannot reach the database directly, use the web app:\n');
    console.log('   npm run dev\n');
    console.log('Then navigate to your profile page to view/edit profile data.\n');
    console.log('═'.repeat(70) + '\n');
    process.exit(1);
  } else {
    console.log('✅ Database connection successful!');
    console.log('You can now run: node check-profile-data.js\n');
  }
});
