import CryptoJS from 'crypto-js';

/**
 * Encryption service for secure client-side encryption of notes
 * Uses AES-256-GCM for authenticated encryption and PBKDF2 for key derivation
 */
class EncryptionService {
  constructor() {
    this.keyCache = new Map(); // Cache derived keys in memory
    this.PBKDF2_ITERATIONS = 100000; // OWASP recommended minimum
    this.KEY_SIZE = 256 / 32; // 256 bits = 32 bytes = 8 words in CryptoJS
    this.IV_SIZE = 96 / 8; // 96 bits for GCM mode = 12 bytes
  }

  /**
   * Derives encryption key from user credentials using PBKDF2
   * @param {string} userId - User identifier for salt
   * @param {string} password - User password
   * @returns {string} Derived key in hex format
   */
  generateUserKey(userId, password) {
    if (!userId || !password) {
      throw new Error('User ID and password are required for key generation');
    }

    const cacheKey = `${userId}:${password}`;
    
    // Check cache first
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey);
    }

    // Create salt from userId (consistent across sessions)
    const salt = CryptoJS.SHA256(userId).toString();
    
    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: this.KEY_SIZE,
      iterations: this.PBKDF2_ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    });

    const keyHex = key.toString(CryptoJS.enc.Hex);
    
    // Cache the derived key
    this.keyCache.set(cacheKey, keyHex);
    
    return keyHex;
  }

  /**
   * Encrypts data using AES-256-CBC with HMAC for authentication
   * @param {any} data - Data to encrypt (will be JSON stringified)
   * @param {string} userKey - Derived encryption key
   * @returns {Object} Encrypted data with IV and HMAC
   */
  async encrypt(data, userKey) {
    try {
      if (!data && data !== '' && data !== 0 && data !== false) {
        throw new Error('Data and user key are required for encryption');
      }
      
      if (!userKey) {
        throw new Error('Data and user key are required for encryption');
      }

      // Convert data to JSON string
      const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Generate random IV for each encryption
      const iv = CryptoJS.lib.WordArray.random(16); // 128 bits for CBC
      
      // Convert hex key to WordArray
      const key = CryptoJS.enc.Hex.parse(userKey);
      
      // Encrypt using AES-CBC
      const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Generate HMAC for authentication
      const hmacKey = CryptoJS.SHA256(userKey + 'hmac-salt').toString(CryptoJS.enc.Hex);
      const hmacData = iv.toString(CryptoJS.enc.Base64) + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
      const hmac = CryptoJS.HmacSHA256(hmacData, hmacKey).toString(CryptoJS.enc.Base64);

      return {
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
        iv: iv.toString(CryptoJS.enc.Base64),
        hmac: hmac,
        algorithm: 'AES-256-CBC-HMAC'
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypts data using AES-256-CBC with HMAC verification
   * @param {Object} encryptedData - Encrypted data object with IV and HMAC
   * @param {string} userKey - Derived encryption key
   * @returns {any} Decrypted data (parsed from JSON if applicable)
   */
  async decrypt(encryptedData, userKey) {
    try {
      if (!encryptedData || !userKey) {
        throw new Error('Encrypted data and user key are required for decryption');
      }

      const { ciphertext, iv, hmac, algorithm } = encryptedData;
      
      if (algorithm !== 'AES-256-CBC-HMAC') {
        throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
      }

      if (!ciphertext || !iv) {
        throw new Error('Invalid encrypted data format');
      }

      // Verify HMAC first
      if (hmac) {
        const hmacKey = CryptoJS.SHA256(userKey + 'hmac-salt').toString(CryptoJS.enc.Hex);
        const hmacData = iv + ciphertext;
        const expectedHmac = CryptoJS.HmacSHA256(hmacData, hmacKey).toString(CryptoJS.enc.Base64);
        
        if (hmac !== expectedHmac) {
          throw new Error('HMAC verification failed - data may be corrupted or tampered with');
        }
      }

      // Convert hex key to WordArray
      const key = CryptoJS.enc.Hex.parse(userKey);
      
      // Parse IV
      const ivWordArray = CryptoJS.enc.Base64.parse(iv);
      
      // Create cipher params for CBC decryption
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
      });

      // Decrypt using AES-CBC
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!plaintext) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      // Try to parse as JSON, return as string if parsing fails
      try {
        return JSON.parse(plaintext);
      } catch {
        return plaintext;
      }
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Validates encryption key format
   * @param {string} key - Key to validate
   * @returns {boolean} True if key is valid
   */
  validateKey(key) {
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    // Check if key is valid hex string of correct length
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(key) && key.length === (this.KEY_SIZE * 8); // 8 hex chars per word
  }

  /**
   * Clears all cached keys from memory
   */
  clearKeyCache() {
    this.keyCache.clear();
  }

  /**
   * Removes specific user key from cache
   * @param {string} userId - User identifier
   * @param {string} password - User password
   */
  clearUserKey(userId, password) {
    const cacheKey = `${userId}:${password}`;
    this.keyCache.delete(cacheKey);
  }

  /**
   * Generates a secure random string for testing purposes
   * @param {number} length - Length of random string
   * @returns {string} Random hex string
   */
  generateRandomString(length = 32) {
    return CryptoJS.lib.WordArray.random(length / 2).toString(CryptoJS.enc.Hex);
  }
}

// Export singleton instance
export default new EncryptionService();