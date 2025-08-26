import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { generateEncryptionKey, clearEncryptedData } from '../lib/crypto';

const ClerkAuthContext = createContext();

export const useClerkAuth = () => {
  const context = useContext(ClerkAuthContext);
  if (!context) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
};

export const ClerkAuthProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, signOut } = useAuth();
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!userLoaded) return;

      if (isSignedIn && user) {
        // Generate encryption key based on user ID
        const key = await generateEncryptionKey(user.id);
        setEncryptionKey(key);
        console.log('User authenticated with Clerk:', user.emailAddresses[0]?.emailAddress);
      } else {
        // Clear encryption key and local data when signed out
        setEncryptionKey(null);
        clearEncryptedData();
        console.log('User signed out, clearing encrypted data');
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [isSignedIn, user, userLoaded]);

  const logout = async () => {
    try {
      clearEncryptedData();
      setEncryptionKey(null);
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user: isSignedIn ? {
      id: user?.id,
      email: user?.emailAddresses[0]?.emailAddress,
      name: user?.fullName || user?.firstName || 'User',
      avatar: user?.imageUrl
    } : null,
    isAuthenticated: isSignedIn,
    isLoading,
    encryptionKey,
    logout
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};