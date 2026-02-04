// Import the functions you need from the SDKs you need
// Firebase initialization (modular SDK)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB66yY8jQDFBva-jSbkg17S2v3PEfI0PRs",
  authDomain: "mobileapp2568.firebaseapp.com",
  projectId: "mobileapp2568",
  storageBucket: "mobileapp2568.firebasestorage.app",
  messagingSenderId: "355454548268",
  appId: "1:355454548268:web:30b1875d3c299394885489",
  measurementId: "G-NNT35XR3SJ",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore
export const db = getFirestore(app);

// Helpful debug log to confirm initialization in browser console
// (will appear when `firebase.ts` is imported)
console.log('Firebase initialized for project:', firebaseConfig.projectId);