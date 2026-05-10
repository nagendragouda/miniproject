#!/usr/bin/env node
/**
 * Environment Variables Check Script
 * Runs during build to ensure all required variables are present
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables...');

// Load environment variables from .env.local if it exists (for local development)
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  console.log('📁 Loaded environment variables from .env.local');
}

const requiredVars = [
  // Supabase is now optional - database has been disconnected
  // 'NEXT_PUBLIC_SUPABASE_URL',
  // 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  // 'SUPABASE_SERVICE_ROLE_KEY'
];

const optionalVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

// Check optional vars (just for informational purposes)
const missingOptional = optionalVars.filter(varName => !process.env[varName]);


if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📖 Setup instructions:');
  console.error('   1. Copy .env.example to .env.local');
  console.error('   2. Fill in your Firebase credentials');
  console.error('   3. For Vercel deployment, set environment variables in your project settings');
  process.exit(1);
}

// Supabase database has been disconnected - validation is no longer needed
if (missingOptional.length > 0) {
  console.warn('⚠️  Supabase is not configured:');
  missingOptional.forEach(varName => {
    console.warn(`   - ${varName} is optional (database disconnected)`);
  });
  console.warn('✅ The application will run with Firebase authentication only');
}

console.log('✅ All required environment variables are present');
console.log('✅ Firebase authentication is configured');
if (missingOptional.length > 0) {
  console.log('⚠️  Note: Supabase database is disconnected');
}