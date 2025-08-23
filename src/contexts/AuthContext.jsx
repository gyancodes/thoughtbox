import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../lib/appwrite';

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
    return currentUser;
  };

  const signup = async (email, password, name) => {
    await account.create('unique()', email, password, name);
    return await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};