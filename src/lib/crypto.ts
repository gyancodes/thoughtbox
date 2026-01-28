/**
 * Comprehensive End-to-End Encryption Service
 * Implements zero-knowledge architecture with client-side AES-256-GCM encryption
 * Keys are derived from user passwords using PBKDF2
 * Server only stores encrypted blobs without access to decryption keys
 */

// Encryption constants
const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 32;
const PBKDF2_ITERATIONS = 600000; // High iteration count for security
const PBKDF2_HASH = "SHA-256";

// Types
export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  version: number;
}

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export interface VaultKey {
  key: CryptoKey;
  salt: Uint8Array;
  createdAt: number;
}

/**
 * Derive encryption key from password using PBKDF2
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive AES-GCM key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );

  return key;
}

/**
 * Generate a random salt for key derivation
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a random initialization vector
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Encrypt plaintext data using AES-256-GCM
 */
export async function encryptData(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const plaintextBuffer = encoder.encode(plaintext);
  const iv = generateIV();

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    plaintextBuffer
  );

  return {
    ciphertext: new Uint8Array(ciphertext),
    iv: iv,
  };
}

/**
 * Decrypt ciphertext using AES-256-GCM
 */
export async function decryptData(
  ciphertext: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    ciphertext.buffer as ArrayBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Encrypt a note with password-derived key
 */
export async function encryptNote(
  content: string,
  password: string
): Promise<EncryptedData> {
  const salt = generateSalt();
  const key = await deriveKeyFromPassword(password, salt);
  const { ciphertext, iv } = await encryptData(content, key);

  // Convert to base64 for storage
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
    version: 1,
  };
}

/**
 * Decrypt a note with password-derived key
 */
export async function decryptNote(
  encryptedData: EncryptedData,
  password: string
): Promise<string> {
  const salt = base64ToUint8Array(encryptedData.salt);
  const iv = base64ToUint8Array(encryptedData.iv);
  const ciphertext = base64ToUint8Array(encryptedData.ciphertext);

  const key = await deriveKeyFromPassword(password, salt);
  return decryptData(ciphertext, key, iv);
}

/**
 * Generate a recovery key for account recovery
 */
export function generateRecoveryKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  // Format as 8 groups of 4 characters
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.match(/.{1,4}/g)!.join("-").toUpperCase();
}

/**
 * Generate a device key pair for secure device authentication
 */
export async function generateDeviceKeyPair(): Promise<KeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  ) as KeyPair;
}

/**
 * Securely hash a password for verification (not for encryption)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return arrayBufferToBase64(new Uint8Array(hashBuffer));
}

/**
 * Verify if a password matches the stored hash
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === storedHash;
}

/**
 * Encrypt the vault key with a recovery key
 */
export async function encryptVaultKeyWithRecovery(
  vaultKey: CryptoKey,
  recoveryKey: string
): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const recoveryKeyBuffer = encoder.encode(recoveryKey);

  // Derive key from recovery key
  const salt = generateSalt();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    recoveryKeyBuffer,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt"]
  );

  // Export the vault key
  const exportedVaultKey = await crypto.subtle.exportKey("raw", vaultKey);
  const { ciphertext, iv } = await encryptData(
    arrayBufferToBase64(new Uint8Array(exportedVaultKey)),
    key
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
    version: 1,
  };
}

/**
 * Secure key storage in memory (not localStorage for security)
 */
class SecureKeyStore {
  private keys: Map<string, CryptoKey> = new Map();
  private timestamps: Map<string, number> = new Map();
  private readonly KEY_LIFETIME = 30 * 60 * 1000; // 30 minutes

  set(key: string, value: CryptoKey): void {
    this.keys.set(key, value);
    this.timestamps.set(key, Date.now());
    this.scheduleCleanup();
  }

  get(key: string): CryptoKey | undefined {
    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() - timestamp > this.KEY_LIFETIME) {
      this.delete(key);
      return undefined;
    }
    return this.keys.get(key);
  }

  delete(key: string): void {
    this.keys.delete(key);
    this.timestamps.delete(key);
  }

  clear(): void {
    this.keys.clear();
    this.timestamps.clear();
  }

  private scheduleCleanup(): void {
    // Cleanup old keys periodically
    setTimeout(() => {
      const now = Date.now();
      for (const [key, timestamp] of this.timestamps.entries()) {
        if (now - timestamp > this.KEY_LIFETIME) {
          this.delete(key);
        }
      }
    }, this.KEY_LIFETIME);
  }
}

export const secureKeyStore = new SecureKeyStore();

/**
 * Utility: Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  const binary = String.fromCharCode(...buffer);
  return btoa(binary);
}

/**
 * Utility: Convert Base64 string to Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Audit log for security events
 */
export interface SecurityEvent {
  type: "login" | "logout" | "key_rotation" | "decryption_failed" | "encryption_enabled";
  timestamp: number;
  deviceId?: string;
  success: boolean;
  details?: string;
}

class AuditLogger {
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  log(event: SecurityEvent): void {
    this.events.push(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.shift();
    }
    // In production, send to secure server
    console.log("[Security Audit]", event);
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

export const auditLogger = new AuditLogger();

/**
 * Check if Web Crypto API is available
 */
export function isCryptoSupported(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

/**
 * Get encryption status for UI display
 */
export interface EncryptionStatus {
  enabled: boolean;
  algorithm: string;
  keyLength: number;
  kdf: string;
  iterations: number;
}

export function getEncryptionStatus(): EncryptionStatus {
  return {
    enabled: true,
    algorithm: ALGORITHM,
    keyLength: KEY_LENGTH,
    kdf: "PBKDF2",
    iterations: PBKDF2_ITERATIONS,
  };
}
