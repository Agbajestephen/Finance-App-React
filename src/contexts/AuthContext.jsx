import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  updatePassword,
  updateEmail,
} from "firebase/auth";

import { auth, db } from "../firebase";
import { createMainAccount } from "../services/createMainAccount";
import { logUserActivity } from "../services/adminService";
import { doc, getDoc } from "firebase/firestore";

// =======================
// PASSWORD VALIDATION
// =======================
const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSymbols
  );
};

// =======================
// CREATE CONTEXT
// =======================
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// =======================
// PROVIDER
// =======================
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================
  // SIGN UP
  // =======================
  const signup = async (email, password, displayName) => {
    try {
      setError("");

      // 🚫 STOP weak passwords before Firebase
      if (!isStrongPassword(password)) {
        throw new Error(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
        );
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      await sendEmailVerification(userCredential.user);

      await createMainAccount(userCredential.user);

      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // =======================
  // LOGIN
  // =======================
  const login = async (email, password) => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Logging is handled in auth state listener
      return userCredential;
    } catch (err) {
      // Log failed login attempt
      await logUserActivity(null, "failed_login", email);
      setError(err.message);
      throw err;
    }
  };

  // =======================
  // LOGOUT
  // =======================
  const logout = async () => {
    if (currentUser) {
      await logUserActivity(currentUser.uid, "logout");
    }
    await signOut(auth);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateUserProfile = async (updates) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, updates);
    setCurrentUser({ ...auth.currentUser });
  };

  const updateUserEmail = async (email) => {
    await updateEmail(auth.currentUser, email);
  };

  const updateUserPassword = async (password) => {
    await updatePassword(auth.currentUser, password);
  };

  const resendEmailVerification = async () => {
    await sendEmailVerification(auth.currentUser);
  };

  const clearError = () => setError("");

  // =======================
  // AUTH STATE LISTENER
  // =======================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user role from Firestore
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserRole(userData.role || "user");
          } else {
            setUserRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user");
        }

        await createMainAccount(user);
        // Log successful login
        await logUserActivity(user.uid, "login");
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);
  // =======================
  // CONTEXT VALUE
  // =======================
  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    resendEmailVerification,
    error,
    clearError,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
