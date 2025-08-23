import { account } from '../lib/appwrite';

export const testAppwriteConnection = async () => {
  try {
    console.log('🔍 Testing Appwrite connection...');
    
    // Test 1: Check if we can connect to Appwrite
    console.log('✅ Appwrite client initialized');
    console.log('📍 Endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT);
    console.log('🆔 Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);
    
    // Test 2: Check current session
    try {
      const user = await account.get();
      console.log('👤 Already logged in as:', user.email);
      return { success: true, user, message: 'Already authenticated' };
    } catch (sessionError) {
      console.log('🔓 Not logged in (this is normal for first time)');
      return { success: true, user: null, message: 'Ready for authentication' };
    }
    
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error);
    return { success: false, error: error.message };
  }
};

export const testCreateAccount = async (email, password, name) => {
  try {
    console.log('🔍 Testing account creation...');
    
    // This will help us understand what's happening
    const result = await account.create('unique()', email, password, name);
    console.log('✅ Account created successfully:', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ Account creation failed:', error);
    return { success: false, error: error.message };
  }
};

export const testLogin = async (email, password) => {
  try {
    console.log('🔍 Testing login...');
    
    const session = await account.createEmailPasswordSession(email, password);
    console.log('✅ Login successful:', session);
    
    const user = await account.get();
    console.log('👤 User details:', user);
    
    return { success: true, user, session };
    
  } catch (error) {
    console.error('❌ Login failed:', error);
    return { success: false, error: error.message };
  }
};