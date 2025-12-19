import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { 
  saveCredentials, 
  getSavedCredentials, 
  clearCredentials,
  saveSession,
  getSession,
  clearSession 
} from '../utils/storage';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize from saved session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedSession = getSession();
        if (savedSession && savedSession.user && savedSession.expiresAt > Date.now()) {
          setUser(savedSession.user);
        } else if (savedSession && savedSession.expiresAt <= Date.now()) {
          clearSession();
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Session timeout functionality (15 minutes)
  const { resetTimeout, clearTimeout: clearSessionTimeout } = useSessionTimeout(
    15 * 60 * 1000, // 15 minutes in milliseconds
    () => {
      handleLogout('Your session has expired due to inactivity');
    }
  );

  // Activity tracking for auto-logout
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const resetActivityTimer = () => {
      if (user) resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, resetActivityTimer);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetActivityTimer);
      });
    };
  }, [user, resetTimeout]);

  // Mock login function (Replace with Firebase)
  const mockLogin = async (email, password, rememberMe = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API call
        if (email && password) {
          const mockUser = {
            id: 'user_123',
            email: email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=1e40af&color=fff`
          };
          
          if (rememberMe) {
            saveCredentials(email, password);
          }
          
          resolve({ success: true, user: mockUser });
        } else {
          reject({ success: false, error: 'Invalid credentials' });
        }
      }, 1500); // Simulate network delay
    });
  };

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    setLoginLoading(true);
    setError('');
    
    try {
      // Validation
      const validationErrors = validateLoginForm(email, password);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoginLoading(false);
        return { success: false };
      }

      // Mock login (REPLACE WITH FIREBASE)
      const result = await mockLogin(email, password, rememberMe);
      
      if (result.success) {
        setUser(result.user);
        
        // Save session
        const sessionData = {
          user: result.user,
          expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
        };
        saveSession(sessionData);
        
        // Reset session timeout
        resetTimeout();
        
        // Redirect to intended page or dashboard
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      }
      
      return result;
    } catch (err) {
      setError(err.error || 'Login failed. Please try again.');
      return { success: false, error: err.error };
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const logout = useCallback((message = '') => {
    setUser(null);
    clearSession();
    clearCredentials();
    clearSessionTimeout();
    
    if (message) {
      // Store logout message to display on login page
      sessionStorage.setItem('logoutMessage', message);
    }
    
    navigate('/login', { 
      state: { 
        from: location.pathname,
        logoutMessage: message 
      } 
    });
  }, [navigate, location.pathname, clearSessionTimeout]);

  // Forgot password handler
  const forgotPassword = async (email) => {
    setError('');
    
    // Validation
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return { success: false };
    }
    
    // Mock reset (REPLACE WITH FIREBASE)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Password reset instructions sent to your email' 
        });
      }, 1000);
    });
  };

  // Auto-login from saved credentials
  const autoLogin = async () => {
    const credentials = getSavedCredentials();
    if (credentials) {
      const result = await login(credentials.email, credentials.password, true);
      return result;
    }
    return { success: false };
  };

  // Validate login form
  const validateLoginForm = (email, password) => {
    const errors = [];
    
    if (!email) errors.push('Email is required');
    else if (!validateEmail(email)) errors.push('Invalid email format');
    
    if (!password) errors.push('Password is required');
    else if (password.length < 6) errors.push('Password must be at least 6 characters');
    
    return errors;
  };

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const value = {
    user,
    loading,
    error,
    loginLoading,
    login,
    logout,
    forgotPassword,
    autoLogin,
    resetSessionTimeout: resetTimeout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};