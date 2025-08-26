import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!userLoaded) return;

      if (isSignedIn && user) {
        console.log('User authenticated with Clerk:', user.emailAddresses[0]?.emailAddress);
      } else {
        console.log('User signed out');
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [isSignedIn, user, userLoaded]);

  const logout = async () => {
    try {
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
      avatar: user?.imageUrl,
      getToken: async () => {
        try {
          // Get the session token from Clerk
          return await user?.getToken?.();
        } catch (error) {
          console.error('Failed to get token:', error);
          return null;
        }
      }
    } : null,
    isAuthenticated: isSignedIn,
    isLoading,
    logout
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};