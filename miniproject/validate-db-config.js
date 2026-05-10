#!/usr/bin/env node

/**
 * Database Configuration Validator & Diagnostic Tool
 * Checks which Supabase projects are configured and validates setup
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function loadEnvFile(filename) {
  const envPath = path.join(__dirname, filename);
  const envVars = {};
  
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
  } catch (error) {
    return null;
  }
  
  return envVars;
}

function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function testDNS(hostname) {
  return new Promise((resolve) => {
    const dns = require('dns');
    dns.lookup(hostname, (err, address) => {
      if (err) {
        resolve({
          success: false,
          error: err.code || err.message,
          address: null
        });
      } else {
        resolve({
          success: true,
          error: null,
          address: address
        });
      }
    });
  });
}

function testHttpsConnection(hostname) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        success: false,
        error: 'TIMEOUT',
        statusCode: null
      });
    }, 5000);

    const req = https.request(
      {
        hostname: hostname,
        port: 443,
        method: 'GET',
        timeout: 5000
      },
      (res) => {
        clearTimeout(timeout);
        res.on('data', () => {});
        res.on('end', () => {
          resolve({
            success: true,
            error: null,
            statusCode: res.statusCode
          });
        });
      }
    );

    req.on('error', (error) => {
      clearTimeout(timeout);
      resolve({
        success: false,
        error: error.code || error.message,
        statusCode: null
      });
    });

    req.on('timeout', () => {
      clearTimeout(timeout);
      req.destroy();
      resolve({
        success: false,
        error: 'TIMEOUT',
        statusCode: null
      });
    });

    req.end();
  });
}

async function runDiagnostics() {
  console.clear();
  console.log('\n🔍 DATABASE CONFIGURATION VALIDATOR\n');
  console.log('═'.repeat(80));

  // Load environment files
  console.log('\n📁 LOADING ENVIRONMENT FILES\n');

  const envLocal = loadEnvFile('.env.local');
  const env = loadEnvFile('.env');

  console.log(`✓ .env.local: ${envLocal ? '✅ Found' : '❌ Not found'}`);
  console.log(`✓ .env:       ${env ? '✅ Found' : '❌ Not found'}`);

  if (!env && !envLocal) {
    console.log('\n❌ No environment files found!\n');
    process.exit(1);
  }

  // Use .env.local if available, otherwise .env
  const activeEnv = envLocal || env;
  const envSource = envLocal ? '.env.local' : '.env';

  console.log(`\n🎯 Using: ${envSource}\n`);

  const supabaseUrl = activeEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = activeEnv.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = activeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.log('❌ Missing NEXT_PUBLIC_SUPABASE_URL\n');
    process.exit(1);
  }

  console.log('═'.repeat(80));
  console.log('\n📋 SUPABASE CONFIGURATION\n');

  console.log(`URL:           ${supabaseUrl}`);
  console.log(`Service Key:   ${serviceKey ? '✅ Present' : '❌ Missing'}`);
  console.log(`Anon Key:      ${anonKey ? '✅ Present' : '❌ Missing'}`);

  const hostname = extractHostname(supabaseUrl);
  console.log(`\nHostname:      ${hostname}\n`);

  // Test DNS
  console.log('═'.repeat(80));
  console.log('\n🌐 CONNECTIVITY TESTS\n');

  console.log('1️⃣  DNS Resolution Test...');
  const dnsResult = await testDNS(hostname);

  if (dnsResult.success) {
    console.log(`   ✅ Domain resolves to: ${dnsResult.address}`);
  } else {
    console.log(`   ❌ DNS Failed: ${dnsResult.error}`);
    console.log('\n   🔧 SOLUTION:');
    console.log('      1. Check Windows DNS Settings');
    console.log('      2. Try Google DNS: 8.8.8.8 and 8.8.4.4');
    console.log('      3. Run: ipconfig /flushdns');
  }

  console.log('\n2️⃣  HTTPS Connection Test...');
  const httpsResult = await testHttpsConnection(hostname);

  if (httpsResult.success) {
    console.log(`   ✅ Connection successful (Status: ${httpsResult.statusCode})`);
  } else {
    console.log(`   ❌ Connection failed: ${httpsResult.error}`);
    console.log('\n   Reason: Cannot reach the Supabase server');
    console.log('   This could mean:');
    console.log('   - Invalid Supabase project');
    console.log('   - Firewall blocking connection');
    console.log('   - Network connectivity issue');
  }

  // Check configuration consistency
  console.log('\n═'.repeat(80));
  console.log('\n⚙️  CONFIGURATION CONSISTENCY\n');

  const env1 = loadEnvFile('.env');
  const env2 = loadEnvFile('.env.local');

  if (env1 && env2) {
    const url1 = env1.NEXT_PUBLIC_SUPABASE_URL;
    const url2 = env2.NEXT_PUBLIC_SUPABASE_URL;

    console.log(`📄 .env:       ${url1}`);
    console.log(`📄 .env.local: ${url2}`);

    if (url1 === url2) {
      console.log('\n✅ Both files use the same Supabase project');
    } else {
      console.log('\n⚠️  Different projects configured!');
      console.log('    .env.local takes priority when running locally');
      console.log(`    Active: ${url2}`);
    }
  }

  // Show what to do next
  console.log('\n═'.repeat(80));
  console.log('\n📋 SUMMARY & NEXT STEPS\n');

  if (!dnsResult.success && !httpsResult.success) {
    console.log('❌ DATABASE IS NOT REACHABLE\n');
    console.log('Possible Issues:');
    console.log('1. Supabase project does not exist');
    console.log('2. Invalid project credentials');
    console.log('3. Network/DNS configuration issue');
    console.log('4. Firewall blocking connection\n');

    console.log('🔧 To Fix:');
    console.log('\nOption A: Use the web app (no database script needed)');
    console.log('  npm run dev');
    console.log('  Go to: http://localhost:3001\n');

    console.log('Option B: Fix your network/DNS');
    console.log('  1. Windows Settings → Network');
    console.log('  2. Change DNS to 8.8.8.8 and 8.8.4.4');
    console.log('  3. Restart your computer');
    console.log('  4. Run this test again\n');

    console.log('Option C: Verify Supabase credentials');
    console.log('  1. Log in to supabase.com');
    console.log('  2. Check if projects exist:');
    if (env1) {
      const h1 = extractHostname(env1.NEXT_PUBLIC_SUPABASE_URL);
      console.log(`     - ${h1}`);
    }
    if (env2) {
      const h2 = extractHostname(env2.NEXT_PUBLIC_SUPABASE_URL);
      console.log(`     - ${h2}`);
    }
    console.log('  3. If projects deleted, create new ones and update .env.local\n');

  } else if (dnsResult.success && httpsResult.success) {
    console.log('✅ DATABASE IS REACHABLE\n');
    console.log('You can now run the full test:');
    console.log('  node test-database.js\n');

    console.log('Or start the app:');
    console.log('  npm run dev\n');

  } else {
    console.log('⚠️  PARTIAL CONNECTIVITY\n');
    console.log(`DNS: ${dnsResult.success ? '✅' : '❌'}`);
    console.log(`HTTPS: ${httpsResult.success ? '✅' : '❌'}\n`);
    console.log('Some tests passed but others failed. This is unusual.');
    console.log('Try restarting your computer or checking firewall settings.\n');
  }

  console.log('═'.repeat(80));
  console.log('\n');
}

runDiagnostics().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
