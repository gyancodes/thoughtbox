import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Get encryption key from environment or generate a default one for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!';
const ALGORITHM = 'aes-256-cbc';

// Ensure the key is exactly 32 bytes
const getKey = () => {
  if (ENCRYPTION_KEY.length === 32) {
    return Buffer.from(ENCRYPTION_KEY, 'utf8');
  }
  // Hash the key to ensure it's 32 bytes
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
};

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted data with IV
 */
export const encrypt = (text) => {
  if (!text) return text;
  
  try {
    const key = getKey();
    const iv = crypto.randomBytes(16); // 128-bit IV
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data with IV
 * @returns {string} - Decrypted text
 */
export const decrypt = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') return encryptedData;
  
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      // Data might not be encrypted (backward compatibility)
      return encryptedData;
    }
    
    const key = getKey();
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Return original data if decryption fails (backward compatibility)
    return encryptedData;
  }
};

/**
 * Encrypt note content and title
 * @param {Object} note - Note object
 * @returns {Object} - Note with encrypted sensitive fields
 */
export const encryptNote = (note) => {
  if (!note) return note;
  
  return {
    ...note,
    title: encrypt(note.title),
    content: encrypt(JSON.stringify(note.content))
  };
};

/**
 * Decrypt note content and title
 * @param {Object} encryptedNote - Encrypted note object
 * @returns {Object} - Note with decrypted sensitive fields
 */
export const decryptNote = (encryptedNote) => {
  if (!encryptedNote) return encryptedNote;
  
  try {
    const decryptedTitle = decrypt(encryptedNote.title);
    const decryptedContentStr = decrypt(encryptedNote.content);
    
    let decryptedContent;
    try {
      decryptedContent = JSON.parse(decryptedContentStr);
    } catch {
      // If parsing fails, treat as plain text (backward compatibility)
      decryptedContent = decryptedContentStr;
    }
    
    return {
      ...encryptedNote,
      title: decryptedTitle,
      content: decryptedContent
    };
  } catch (error) {
    console.error('Note decryption error:', error);
    return encryptedNote;
  }
};

/**
 * Encrypt an array of notes
 * @param {Array} notes - Array of note objects
 * @returns {Array} - Array of encrypted notes
 */
export const encryptNotes = (notes) => {
  if (!Array.isArray(notes)) return notes;
  return notes.map(encryptNote);
};

/**
 * Decrypt an array of notes
 * @param {Array} encryptedNotes - Array of encrypted note objects
 * @returns {Array} - Array of decrypted notes
 */
export const decryptNotes = (encryptedNotes) => {
  if (!Array.isArray(encryptedNotes)) return encryptedNotes;
  return encryptedNotes.map(decryptNote);
};