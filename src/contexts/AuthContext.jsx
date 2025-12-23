import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  updatePassword,
  updateEmail
} from 'firebase/auth';
import { auth } from '../firebase'; // Import from your firebase.js file

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use auth - put this BEFORE AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. SIGN UP FUNCTION
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      // Send email verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 2. LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 3. LOGOUT FUNCTION
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 4. RESET PASSWORD
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 5. UPDATE USER PROFILE
  const updateUserProfile = async (updates) => {
    try {
      setError('');
      if (!auth.currentUser) throw new Error('No user logged in');
      
      if (updates.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName
        });
      }
      
      if (updates.photoURL) {
        await updateProfile(auth.currentUser, {
          photoURL: updates.photoURL
        });
      }
      
      // Update local state
      setCurrentUser({
        ...currentUser,
        ...updates
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 6. UPDATE EMAIL
  const updateUserEmail = async (newEmail) => {
    try {
      setError('');
      if (!auth.currentUser) throw new Error('No user logged in');
      await updateEmail(auth.currentUser, newEmail);
      
      // Update local state
      setCurrentUser({
        ...currentUser,
        email: newEmail
      });
      
    } catch (error) {
      console.error('Update email error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 7. UPDATE PASSWORD
  const updateUserPassword = async (newPassword) => {
    try {
      setError('');
      if (!auth.currentUser) throw new Error('No user logged in');
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 8. RE-SEND EMAIL VERIFICATION
  const resendEmailVerification = async () => {
    try {
      setError('');
      if (!auth.currentUser) throw new Error('No user logged in');
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.error('Resend verification error:', error);
      setError(error.message);
      throw error;
    }
  };

  // 9. CLEAR ERROR
  const clearError = () => setError('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Value object to be provided by context
  const value = {
    currentUser,           // Current logged in user object
    signup,               // Function to sign up new users
    login,                // Function to log in existing users
    logout,               // Function to log out
    resetPassword,        // Function to reset password
    updateUserProfile,    // Function to update user profile
    updateUserEmail,      // Function to update email
    updateUserPassword,   // Function to update password
    resendEmailVerification, // Function to resend verification email
    error,                // Current error message
    clearError,           // Function to clear error
    loading               // Loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        // Loading screen while checking auth state
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-gray-600">Loading authentication...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Export the context itself (optional, for advanced use cases)
export default AuthContext;