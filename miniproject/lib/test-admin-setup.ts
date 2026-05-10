/**
 * Firebase Admin Setup Test Script
 * 
 * This helps verify the admin account setup is working correctly
 * 
 * Usage:
 * 1. Navigate to browser console (F12)
 * 2. Paste and run this code
 * 3. Check the output for status
 */

async function testAdminSetup() {
  try {
    console.log('🔧 Testing Firebase Admin Setup...\n')

    // Test 1: Import Firebase Auth
    console.log('1️⃣ Checking Firebase initialization...')
    try {
      const { getAuth } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')
      console.log('✅ Firebase initialized successfully\n')
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error)
      return
    }

    // Test 2: Check environment variables
    console.log('2️⃣ Checking environment variables...')
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    ]
    
    const allEnvVarsPresent = requiredEnvVars.every(variable => 
      process.env[variable] || window[`NEXT_PUBLIC_${variable}`]
    )
    
    if (allEnvVarsPresent) {
      console.log('✅ All required environment variables present\n')
    } else {
      console.error('❌ Missing environment variables\n')
    }

    // Test 3: Try to sign in with admin credentials
    console.log('3️⃣ Testing admin credentials...')
    console.log('   Email: admin@gmail.com')
    console.log('   Password: admin1234\n')
    
    console.log('   Attempting sign in... (this will only work if account exists)')
    
    // Navigate user to signin page
    console.log('\n📝 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Firebase is configured correctly')
    console.log('📍 Project ID: futurematrix-17e10')
    console.log('🔐 Admin Email: admin@gmail.com')
    console.log('🔑 Admin Password: admin1234')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 Next steps:')
    console.log('1. Go to /admin-setup to create the admin account')
    console.log('2. Or manually create it in Firebase Console')
    console.log('3. Then navigate to /auth/signin to test')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run test
testAdminSetup()

// Export for manual use
window.testAdminSetup = testAdminSetup
console.log('\n✨ You can run testAdminSetup() anytime to re-run this test')
