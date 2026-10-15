import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAWjEaga0BkWoFCSiSHeWwtTmmAIWos2qY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ptemarkstracking.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://ptemarkstracking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ptemarkstracking",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ptemarkstracking.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "651634483350",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:651634483350:web:487c35818c7cdb0dbba2b7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-230XBRNKCG"
};

// Initialize Firebase modular app
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
