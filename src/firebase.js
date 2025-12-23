// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCr4SybxmMLqNoGtdA2iEJyFArK5wldAdI",
  authDomain: "soft-bank-aafa7.firebaseapp.com",
  projectId: "soft-bank-aafa7",
  storageBucket: "soft-bank-aafa7.firebasestorage.app",
  messagingSenderId: "822418727458",
  appId: "1:822418727458:web:734e7b82a41fe2083a607b",
  measurementId: "G-QKCKP4GYKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-In Provider
const googleProvider = new GoogleAuthProvider();

// Google Sign-In function
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Send verification email function
export const sendVerificationEmail = (user) => {
  return sendEmailVerification(user);
};

// Update profile function
export const updateUserProfile = (user, displayName, photoURL) => {
  return updateProfile(user, { displayName, photoURL });
};

// Export everything
export { auth };
export default app;