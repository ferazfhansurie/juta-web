import admin from 'firebase-admin';

// Decode the base64 environment variable to get the service account JSON
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Add your databaseURL if necessary
    // databaseURL: "https://your-database-url.firebaseio.com"
  });
}

export default admin;
