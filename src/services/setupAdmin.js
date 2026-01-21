import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr4SybxmMLqNoGtdA2iEJyFArK5wldAdI",
  authDomain: "soft-bank-aafa7.firebaseapp.com",
  projectId: "soft-bank-aafa7",
  storageBucket: "soft-bank-aafa7.firebasestorage.app",
  messagingSenderId: "822418727458",
  appId: "1:822418727458:web:734e7b82a41fe2083a607b",
  measurementId: "G-QKCKP4GYKZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  try {
    const email = "admin@financeapp.com";
    const password = "Admin123!"; // Stronger password

    let user;

    try {
      // Try to create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user = userCredential.user;
      console.log("Admin user created successfully:", user.email);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // User already exists, sign in to get the user
        console.log("Admin user already exists, signing in...");
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        user = userCredential.user;
      } else {
        throw error;
      }
    }

    // Ensure the user document exists with admin role
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: "admin",
        createdAt: new Date(),
      });
      console.log("Admin role set for user:", user.email);
    } else {
      // Update the role to admin if it's not already
      const userData = userSnap.data();
      if (userData.role !== "admin") {
        await setDoc(userRef, {
          ...userData,
          role: "admin",
        });
        console.log("Admin role updated for user:", user.email);
      } else {
        console.log("Admin user document already exists with correct role.");
      }
    }
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }
}

setupAdmin();
