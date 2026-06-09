import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * FIREBASE SETUP GUIDE:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new "Web" project.
 * 3. Copy your project's config below.
 * 4. Enable "Email/Password" in Auth Settings.
 * 5. Create a "Firestore Database".
 */

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.apiKey !== "";

// Initialize Firebase only if config is provided
let app, auth, db;

if (isConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        const persistence = Platform.OS === 'web' 
            ? browserLocalPersistence 
            : getReactNativePersistence(AsyncStorage);

        auth = initializeAuth(app, { persistence });
        db = initializeFirestore(app, {
            localCache: persistentLocalCache()
        });
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
    }
}

export { auth, db, isConfigured };
