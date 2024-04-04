import admin from 'firebase-admin';
const firebaseConfig = {
  apiKey: "AIzaSyDOijfOd2G2SnKcOejWPJt2qyzDYe8gYYM",
  authDomain: "tatapies.firebaseapp.com",
  projectId: "tatapies",
  storageBucket: "tatapies.appspot.com",
  messagingSenderId: "153923200089",
  appId: "1:153923200089:web:e394f993c09c8c20d9bd48",
  measurementId: "G-5BGBRYHGLQ"
  };
// Check if we haven't initialized it yet
admin.initializeApp({
    firebaseConfig
    });

export default admin;
