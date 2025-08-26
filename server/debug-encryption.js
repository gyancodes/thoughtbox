import { encrypt, decrypt, encryptNote, decryptNote } from './utils/encryption.js';

console.log('🔍 Debugging encryption...');

// Test 1: Basic encryption
try {
  const testText = 'Hello World';
  console.log('Original:', testText);
  
  const encrypted = encrypt(testText);
  console.log('Encrypted:', encrypted);
  
  const decrypted = decrypt(encrypted);
  console.log('Decrypted:', decrypted);
  
  console.log('✅ Basic test:', testText === decrypted ? 'PASS' : 'FAIL');
} catch (error) {
  console.error('❌ Basic encryption failed:', error);
}

// Test 2: Note encryption
try {
  const testNote = {
    title: 'Test Note',
    content: { text: 'This is a test' }
  };
  
  console.log('\nOriginal note:', testNote);
  
  const encrypted = encryptNote(testNote);
  console.log('Encrypted note:', encrypted);
  
  const decrypted = decryptNote(encrypted);
  console.log('Decrypted note:', decrypted);
  
  console.log('✅ Note test:', 
    testNote.title === decrypted.title && 
    JSON.stringify(testNote.content) === JSON.stringify(decrypted.content) ? 'PASS' : 'FAIL');
} catch (error) {
  console.error('❌ Note encryption failed:', error);
}

console.log('\n🎯 Debug complete');