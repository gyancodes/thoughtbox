// Simple test to verify authentication flow
// This can be run in the browser console to test the auth system

import { appwriteService } from './lib/appwrite.js';

export async function testAuthFlow() {
  console.log('🔍 Testing Authentication Flow...');
  
  try {
    // Test 1: Check initial state (should be unauthenticated)
    console.log('1. Testing initial unauthenticated state...');
    try {
      await appwriteService.getCurrentUser();
      console.log('❌ Expected to be unauthenticated, but got user');
    } catch (error) {
      console.log('✅ Correctly unauthenticated:', error.message);
    }
    
    // Test 2: Test connection health
    console.log('2. Testing Appwrite connection...');
    const health = await appwriteService.checkConnection();
    console.log('✅ Connection status:', health);
    
    // Test 3: Test error handling
    console.log('3. Testing error handling...');
    try {
      await appwriteService.authenticate('invalid@email.com', 'wrongpassword');
      console.log('❌ Expected authentication to fail');
    } catch (error) {
      console.log('✅ Authentication correctly failed:', error.message);
    }
    
    console.log('🎉 Authentication flow test completed successfully!');
    console.log('💡 To test login, use the UI with valid Appwrite credentials');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.testAuthFlow = testAuthFlow;
  console.log('🔧 Run testAuthFlow() in console to test authentication');
}