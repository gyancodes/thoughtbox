/**
 * Example usage of the EncryptionService
 * This file demonstrates how to use the encryption service in your application
 */

import EncryptionService from '../encryption.js';

// Example usage function
async function demonstrateEncryption() {
  console.log('=== Encryption Service Demo ===\n');

  // 1. Generate a user key from credentials
  const userId = 'user123';
  const password = 'mySecurePassword123';
  
  console.log('1. Generating encryption key...');
  const userKey = EncryptionService.generateUserKey(userId, password);
  console.log(`Generated key: ${userKey.substring(0, 16)}...`);
  console.log(`Key is valid: ${EncryptionService.validateKey(userKey)}\n`);

  // 2. Encrypt some note data
  const noteData = {
    id: 'note-123',
    title: 'My Secret Note',
    content: 'This contains sensitive information like passwords: admin123',
    type: 'text',
    tags: ['personal', 'passwords'],
    createdAt: new Date().toISOString()
  };

  console.log('2. Original note data:');
  console.log(JSON.stringify(noteData, null, 2));

  console.log('\n3. Encrypting note...');
  const encrypted = await EncryptionService.encrypt(noteData, userKey);
  console.log('Encrypted data:');
  console.log({
    algorithm: encrypted.algorithm,
    ciphertext: encrypted.ciphertext.substring(0, 32) + '...',
    iv: encrypted.iv,
    hmac: encrypted.hmac.substring(0, 16) + '...'
  });

  // 3. Decrypt the data
  console.log('\n4. Decrypting note...');
  const decrypted = await EncryptionService.decrypt(encrypted, userKey);
  console.log('Decrypted data:');
  console.log(JSON.stringify(decrypted, null, 2));

  // 4. Verify data integrity
  console.log('\n5. Verifying data integrity...');
  const isIdentical = JSON.stringify(noteData) === JSON.stringify(decrypted);
  console.log(`Data integrity check: ${isIdentical ? 'PASSED' : 'FAILED'}`);

  // 5. Demonstrate key caching
  console.log('\n6. Demonstrating key caching...');
  const startTime = Date.now();
  const cachedKey = EncryptionService.generateUserKey(userId, password);
  const cacheTime = Date.now() - startTime;
  console.log(`Cached key generation time: ${cacheTime}ms`);
  console.log(`Keys match: ${userKey === cachedKey}`);

  // 6. Clear cache
  console.log('\n7. Clearing key cache...');
  EncryptionService.clearKeyCache();
  console.log('Cache cleared successfully');

  console.log('\n=== Demo Complete ===');
}

// Example error handling
async function demonstrateErrorHandling() {
  console.log('\n=== Error Handling Demo ===\n');

  try {
    // Try to encrypt with invalid key
    await EncryptionService.encrypt('test', null);
  } catch (error) {
    console.log(`Expected error: ${error.message}`);
  }

  try {
    // Try to decrypt with wrong key
    const userKey1 = EncryptionService.generateUserKey('user1', 'password1');
    const userKey2 = EncryptionService.generateUserKey('user2', 'password2');
    
    const encrypted = await EncryptionService.encrypt('secret data', userKey1);
    await EncryptionService.decrypt(encrypted, userKey2);
  } catch (error) {
    console.log(`Expected error: ${error.message}`);
  }

  try {
    // Try to decrypt corrupted data
    const userKey = EncryptionService.generateUserKey('user', 'password');
    const encrypted = await EncryptionService.encrypt('test', userKey);
    encrypted.ciphertext = 'corrupted';
    
    await EncryptionService.decrypt(encrypted, userKey);
  } catch (error) {
    console.log(`Expected error: ${error.message}`);
  }

  console.log('\n=== Error Handling Demo Complete ===');
}

// Run demos if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateEncryption()
    .then(() => demonstrateErrorHandling())
    .catch(console.error);
}

export { demonstrateEncryption, demonstrateErrorHandling };