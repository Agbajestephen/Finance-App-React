// Import the functions you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // ✅ use Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCruI-clmlSfEbO8DbL3k_2-9SqHOaZPg",
  authDomain: "soft-bank-d5c1a.firebaseapp.com",
  databaseURL: "https://soft-bank-d5c1a-default-rtdb.firebaseio.com", // ✅ add this line
  projectId: "soft-bank-d5c1a",
  storageBucket: "soft-bank-d5c1a.appspot.com", // ✅ fix domain (should end with .appspot.com)
  messagingSenderId: "47046753820",
  appId: "1:47046753820:web:c7c9d3be9370ac5f80e9d9",
  measurementId: "G-ZDNTBLQZXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Realtime Database
const db = getDatabase(app);

// Export db so you can use it in Dashboard.jsx
export { db };