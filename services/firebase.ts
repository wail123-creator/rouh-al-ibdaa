
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSI0Ca6D_oSiGlVGg3OFF4la1rjGXeZFY",
  authDomain: "ruh-al-ibdaa.firebaseapp.com",
  projectId: "ruh-al-ibdaa",
  storageBucket: "ruh-al-ibdaa.firebasestorage.app",
  messagingSenderId: "57541343744",
  appId: "1:57541343744:web:106f2f6a6d1d00f3b876e5",
  measurementId: "G-EYJGC9T3XK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
