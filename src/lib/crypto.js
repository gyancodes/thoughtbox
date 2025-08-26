import EncryptionService from './encryption';

/**
 * Generates encryption key for Clerk authenticated users
 * @param {string} userId - Clerk user ID
 * @returns {Promise<string>} Encryption key
 */
export const generateEncryptionKey = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required for encryption key generation');
  }
  
  return EncryptionService.generateClerkKey(userId);
};

/**
 * Encrypts data using the provided key
 * @param {any} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {Promise<Object>} Encrypted data
 */
export const encryptData = async (data, key) => {
  return EncryptionService.encrypt(data, key);
};

/**
 * Decrypts data using the provided key
 * @param {Object} encryptedData - Encrypted data object
 * @param {string} key - Encryption key
 * @returns {Promise<any>} Decrypted data
 */
export const decryptData = async (encryptedData, key) => {
  return EncryptionService.decrypt(encryptedData, key);
};

/**
 * Clears all encrypted data from local storage
 */
export const clearEncryptedData = () => {
  try {
    // Clear localStorage items related to encrypted data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('encrypted_') || key.startsWith('notes_') || key.startsWith('sync_'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear encryption service cache
    EncryptionService.clearKeyCache();
    
    console.log('Cleared encrypted data cache');
  } catch (error) {
    console.error('Error clearing encrypted data:', error);
  }
};

/**
 * Validates if an encryption key is valid
 * @param {string} key - Key to validate
 * @returns {boolean} True if key is valid
 */
export const validateEncryptionKey = (key) => {
  return EncryptionService.validateKey(key);
};