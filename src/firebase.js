// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCruI-clmlSfEbO8DbL3k_2-9SqHOaZPg",
  authDomain: "soft-bank-d5c1a.firebaseapp.com",
  projectId: "soft-bank-d5c1a",
  storageBucket: "soft-bank-d5c1a.firebasestorage.app",
  messagingSenderId: "47046753820",
  appId: "1:47046753820:web:c7c9d3be9370ac5f80e9d9",
  measurementId: "G-ZDNTBLQZXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);