import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { appwriteService, AuthenticationError, NetworkError } from '../lib/appwrite';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [error, setError] = useState(null);

  // Clear sensitive data from memory and local storage
  const clearSensitiveData = useCallback(() => {
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiry(null);
    
    // Clear any cached encryption keys or sensitive data from memory
    if (window.encryptionKey) {
      delete window.encryptionKey;
    }
    
    // Clear any sensitive data from localStorage/sessionStorage
    const sensitiveKeys = ['encryptionKey', 'userKey', 'noteCache'];
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Clear IndexedDB cache if needed
    if ('indexedDB' in window) {
      try {
        // This will be handled by the storage service when implemented
        console.log('Clearing local encrypted data cache');
      } catch (error) {
        console.warn('Failed to clear IndexedDB cache:', error);
      }
    }
  }, []);

  // Check authentication status and handle session management
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = await appwriteService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Set session expiry (Appwrite sessions typically last 15 minutes by default)
        const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
        setSessionExpiry(expiryTime);
        
        return currentUser;
      } else {
        clearSensitiveData();
        return null;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      if (error instanceof AuthenticationError) {
        // User is not authenticated or session expired
        clearSensitiveData();
        setError('Session expired. Please log in again.');
      } else if (error instanceof NetworkError) {
        // Network error - don't clear data, user might be offline
        setError('Network error. Please check your connection.');
      } else {
        // Other errors
        clearSensitiveData();
        setError('Authentication error. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearSensitiveData]);

  // Login with enhanced error handling and session management
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Authenticate with Appwrite
      const session = await appwriteService.authenticate(email, password);
      
      // Get user details
      const currentUser = await appwriteService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Set session expiry
        const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
        setSessionExpiry(expiryTime);
        
        return { user: currentUser, session };
      } else {
        throw new Error('Failed to get user details after login');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof AuthenticationError) {
        errorMessage = 'Invalid email or password.';
      } else if (error instanceof NetworkError) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      clearSensitiveData();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [clearSensitiveData]);

  // Secure logout with comprehensive data cleanup
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Attempt to delete session from Appwrite
      await appwriteService.logout();
    } catch (error) {
      // Log the error but don't throw - we still want to clear local data
      console.warn('Logout error (continuing with local cleanup):', error);
    } finally {
      // Always clear sensitive data regardless of logout success
      clearSensitiveData();
      setLoading(false);
    }
  }, [clearSensitiveData]);

  // Session refresh functionality
  const refreshSession = useCallback(async () => {
    if (!isAuthenticated) return false;
    
    try {
      const currentUser = await appwriteService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
        setSessionExpiry(expiryTime);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      if (error instanceof AuthenticationError) {
        clearSensitiveData();
      }
      return false;
    }
  }, [isAuthenticated, clearSensitiveData]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize authentication check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up session monitoring
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;

    // Check if session is close to expiry (5 minutes before)
    const checkInterval = setInterval(() => {
      const now = new Date();
      const timeUntilExpiry = sessionExpiry.getTime() - now.getTime();
      
      // If session expires in less than 5 minutes, try to refresh
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        refreshSession();
      } else if (timeUntilExpiry <= 0) {
        // Session has expired
        clearSensitiveData();
        setError('Session expired. Please log in again.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isAuthenticated, sessionExpiry, refreshSession, clearSensitiveData]);

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    sessionExpiry,
    error,
    
    // Actions
    login,
    logout,
    checkAuth,
    refreshSession,
    clearError,
    clearSensitiveData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};