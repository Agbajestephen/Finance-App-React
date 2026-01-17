// Firebase core
import { initializeApp } from "firebase/app";

// Firebase Auth
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

// Firebase Firestore
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr4SybxmMLqNoGtdA2iEJyFArK5wldAdI",
  authDomain: "soft-bank-aafa7.firebaseapp.com",
  projectId: "soft-bank-aafa7",
  storageBucket: "soft-bank-aafa7.firebasestorage.app",
  messagingSenderId: "822418727458",
  appId: "1:822418727458:web:734e7b82a41fe2083a607b",
  measurementId: "G-QKCKP4GYKZ",
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();

// Auth helpers
export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const sendVerificationEmail = (user) =>
  sendEmailVerification(user);

export const updateUserProfile = (user, displayName, photoURL) =>
  updateProfile(user, { displayName, photoURL });

// Default export
export default app;
