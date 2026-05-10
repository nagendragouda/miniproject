/**
 * Quick Admin Account Creator
 * 
 * Run this in your browser console on any page:
 * 1. Open DevTools (F12)
 * 2. Go to Console tab
 * 3. Copy-paste the code below
 * 4. Press Enter
 * 
 * Or use: node create-admin.js (in terminal)
 */

// Firebase Admin SDK setup (for Node.js)
const admin = require('firebase-admin');

// Use your credentials file or environment variables
const serviceAccount = {
  type: "service_account",
  project_id: "futurematrix-17e10",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'futurematrix-17e10'
  });
}

const auth = admin.auth();

async function createAdminAccount() {
  try {
    console.log('🔐 Creating admin account...');
    
    const user = await auth.createUser({
      email: 'admin@gmail.com',
      password: 'admin1234',
      displayName: 'Admin User',
      emailVerified: true
    });
    
    console.log('✅ Admin account created successfully!');
    console.log('User UID:', user.uid);
    console.log('Email:', user.email);
    console.log('Display Name:', user.displayName);
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️ Admin account already exists');
      try {
        const user = await auth.getUserByEmail('admin@gmail.com');
        console.log('✅ Existing admin account found:');
        console.log('User UID:', user.uid);
        console.log('Email:', user.email);
        return user;
      } catch (e) {
        console.error('❌ Error fetching existing account:', e.message);
        throw e;
      }
    } else {
      console.error('❌ Error creating admin account:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      throw error;
    }
  }
}

createAdminAccount().then(user => {
  console.log('✅ Done! You can now sign in with:');
  console.log('Email: admin@gmail.com');
  console.log('Password: admin1234');
}).catch(error => {
  console.error('❌ Failed:', error);
});
