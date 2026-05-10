/**
 * Setup Admin Account in Firebase
 * 
 * This script creates the admin account with:
 * Email: admin@gmail.com
 * Password: admin1234
 * 
 * Run this once to initialize the admin account:
 * node scripts/setup-admin-account.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Make sure you have your Firebase service account JSON file
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:');
  console.error('Make sure firebase-service-account.json exists in your project root');
  console.error('Path:', serviceAccountPath);
  process.exit(1);
}

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

async function setupAdminAccount() {
  try {
    console.log('🔐 Setting up admin account...');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log('');
    
    // Check if user already exists
    let user;
    try {
      user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log('⚠️ Admin account already exists');
      console.log('User UID:', user.uid);
      console.log('Email verified:', user.emailVerified);
      
      // Optionally update password if needed
      // await admin.auth().updateUser(user.uid, { password: ADMIN_PASSWORD });
      // console.log('✅ Password updated');
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new admin user
        user = await admin.auth().createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: 'Admin',
          emailVerified: true,
        });
        
        console.log('✅ Admin account created successfully!');
        console.log('User UID:', user.uid);
        console.log('Email:', user.email);
        console.log('');
      } else {
        throw error;
      }
    }
    
    // Set custom claims for admin role (optional)
    await admin.auth().setCustomUserClaims(user.uid, { 
      admin: true,
      role: 'admin'
    });
    console.log('✅ Admin role assigned');
    console.log('');
    
    console.log('✨ Admin account setup complete!');
    console.log('');
    console.log('You can now sign in with:');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log('');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error setting up admin account:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the setup
setupAdminAccount();
