import { describe, it, expect, beforeEach, afterEach } from "vitest";
import EncryptionService from "../encryption.js";

describe("EncryptionService", () => {
  const testUserId = "test-user-123";
  const testPassword = "secure-password-123";
  const testData = { message: "Hello, World!", number: 42, array: [1, 2, 3] };

  beforeEach(() => {
    // Clear cache before each test
    EncryptionService.clearKeyCache();
  });

  afterEach(() => {
    // Clean up after each test
    EncryptionService.clearKeyCache();
  });

  describe("generateUserKey", () => {
    it("should generate a valid encryption key from user credentials", () => {
      const key = EncryptionService.generateUserKey(testUserId, testPassword);

      expect(key).toBeDefined();
      expect(typeof key).toBe("string");
      expect(key.length).toBe(64); // 256 bits = 64 hex characters
      expect(EncryptionService.validateKey(key)).toBe(true);
    });

    it("should generate consistent keys for same credentials", () => {
      const key1 = EncryptionService.generateUserKey(testUserId, testPassword);
      const key2 = EncryptionService.generateUserKey(testUserId, testPassword);

      expect(key1).toBe(key2);
    });

    it("should generate different keys for different users", () => {
      const key1 = EncryptionService.generateUserKey("user1", testPassword);
      const key2 = EncryptionService.generateUserKey("user2", testPassword);

      expect(key1).not.toBe(key2);
    });

    it("should generate different keys for different passwords", () => {
      const key1 = EncryptionService.generateUserKey(testUserId, "password1");
      const key2 = EncryptionService.generateUserKey(testUserId, "password2");

      expect(key1).not.toBe(key2);
    });

    it("should throw error for missing userId", () => {
      expect(() => {
        EncryptionService.generateUserKey("", testPassword);
      }).toThrow("User ID and password are required for key generation");
    });

    it("should throw error for missing password", () => {
      expect(() => {
        EncryptionService.generateUserKey(testUserId, "");
      }).toThrow("User ID and password are required for key generation");
    });

    it("should cache generated keys", () => {
      const key1 = EncryptionService.generateUserKey(testUserId, testPassword);

      // Generate again - should use cache
      const key2 = EncryptionService.generateUserKey(testUserId, testPassword);

      expect(key1).toBe(key2);
    });
  });

  describe("encrypt", () => {
    let userKey;

    beforeEach(() => {
      userKey = EncryptionService.generateUserKey(testUserId, testPassword);
    });

    it("should encrypt data successfully", async () => {
      const encrypted = await EncryptionService.encrypt(testData, userKey);

      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.algorithm).toBe("AES-256-CBC-HMAC");
      expect(typeof encrypted.ciphertext).toBe("string");
      expect(typeof encrypted.iv).toBe("string");
    });

    it("should encrypt string data", async () => {
      const testString = "Hello, World!";
      const encrypted = await EncryptionService.encrypt(testString, userKey);

      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext).toBeDefined();
      expect(encrypted.iv).toBeDefined();
    });

    it("should generate different ciphertext for same data (due to random IV)", async () => {
      const encrypted1 = await EncryptionService.encrypt(testData, userKey);
      const encrypted2 = await EncryptionService.encrypt(testData, userKey);

      expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
    });

    it("should throw error for missing data", async () => {
      await expect(EncryptionService.encrypt(null, userKey)).rejects.toThrow(
        "Data and user key are required for encryption"
      );
    });

    it("should throw error for missing key", async () => {
      await expect(EncryptionService.encrypt(testData, null)).rejects.toThrow(
        "Data and user key are required for encryption"
      );
    });

    it("should handle empty object", async () => {
      const encrypted = await EncryptionService.encrypt({}, userKey);
      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext).toBeDefined();
    });

    it("should handle empty string", async () => {
      const encrypted = await EncryptionService.encrypt("", userKey);
      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext).toBeDefined();
    });
  });

  describe("decrypt", () => {
    let userKey;

    beforeEach(() => {
      userKey = EncryptionService.generateUserKey(testUserId, testPassword);
    });

    it("should decrypt data successfully", async () => {
      const encrypted = await EncryptionService.encrypt(testData, userKey);
      const decrypted = await EncryptionService.decrypt(encrypted, userKey);

      expect(decrypted).toEqual(testData);
    });

    it("should decrypt string data", async () => {
      const testString = "Hello, World!";
      const encrypted = await EncryptionService.encrypt(testString, userKey);
      const decrypted = await EncryptionService.decrypt(encrypted, userKey);

      expect(decrypted).toBe(testString);
    });

    it("should handle complex nested objects", async () => {
      const complexData = {
        user: {
          id: 123,
          name: "John Doe",
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
        notes: [
          { id: 1, content: "Note 1" },
          { id: 2, content: "Note 2" },
        ],
      };

      const encrypted = await EncryptionService.encrypt(complexData, userKey);
      const decrypted = await EncryptionService.decrypt(encrypted, userKey);

      expect(decrypted).toEqual(complexData);
    });

    it("should throw error for wrong key", async () => {
      const encrypted = await EncryptionService.encrypt(testData, userKey);
      const wrongKey = EncryptionService.generateUserKey(
        "wrong-user",
        "wrong-password"
      );

      await expect(
        EncryptionService.decrypt(encrypted, wrongKey)
      ).rejects.toThrow("Decryption failed");
    });

    it("should throw error for missing encrypted data", async () => {
      await expect(EncryptionService.decrypt(null, userKey)).rejects.toThrow(
        "Encrypted data and user key are required for decryption"
      );
    });

    it("should throw error for missing key", async () => {
      const encrypted = await EncryptionService.encrypt(testData, userKey);

      await expect(EncryptionService.decrypt(encrypted, null)).rejects.toThrow(
        "Encrypted data and user key are required for decryption"
      );
    });

    it("should throw error for invalid encrypted data format", async () => {
      const invalidData = {
        ciphertext: "invalid",
        algorithm: "AES-256-CBC-HMAC",
      };

      await expect(
        EncryptionService.decrypt(invalidData, userKey)
      ).rejects.toThrow("Invalid encrypted data format");
    });

    it("should throw error for unsupported algorithm", async () => {
      const encrypted = await EncryptionService.encrypt(testData, userKey);
      encrypted.algorithm = "UNSUPPORTED";

      await expect(
        EncryptionService.decrypt(encrypted, userKey)
      ).rejects.toThrow("Unsupported encryption algorithm");
    });

    it("should handle corrupted ciphertext", async () => {
      const encrypted = await EncryptionService.encrypt(testData, userKey);
      encrypted.ciphertext = "corrupted-data";

      await expect(
        EncryptionService.decrypt(encrypted, userKey)
      ).rejects.toThrow("Decryption failed");
    });
  });

  describe("validateKey", () => {
    it("should validate correct key format", () => {
      const key = EncryptionService.generateUserKey(testUserId, testPassword);
      expect(EncryptionService.validateKey(key)).toBe(true);
    });

    it("should reject invalid key formats", () => {
      expect(EncryptionService.validateKey("")).toBe(false);
      expect(EncryptionService.validateKey(null)).toBe(false);
      expect(EncryptionService.validateKey(undefined)).toBe(false);
      expect(EncryptionService.validateKey(123)).toBe(false);
      expect(EncryptionService.validateKey("invalid-key")).toBe(false);
      expect(EncryptionService.validateKey("abc123")).toBe(false); // Too short
    });

    it("should reject keys with invalid characters", () => {
      const invalidKey = "g".repeat(64); // 'g' is not a valid hex character
      expect(EncryptionService.validateKey(invalidKey)).toBe(false);
    });
  });

  describe("key management", () => {
    it("should clear all cached keys", () => {
      const key1 = EncryptionService.generateUserKey("user1", "password1");
      const key2 = EncryptionService.generateUserKey("user2", "password2");

      expect(key1).toBeDefined();
      expect(key2).toBeDefined();

      EncryptionService.clearKeyCache();

      // Keys should be regenerated (not from cache)
      const newKey1 = EncryptionService.generateUserKey("user1", "password1");
      const newKey2 = EncryptionService.generateUserKey("user2", "password2");

      expect(newKey1).toBe(key1); // Same credentials = same key
      expect(newKey2).toBe(key2); // Same credentials = same key
    });

    it("should clear specific user key", () => {
      const key = EncryptionService.generateUserKey(testUserId, testPassword);
      expect(key).toBeDefined();

      EncryptionService.clearUserKey(testUserId, testPassword);

      // Key should be regenerated
      const newKey = EncryptionService.generateUserKey(
        testUserId,
        testPassword
      );
      expect(newKey).toBe(key); // Same credentials = same key
    });
  });

  describe("utility functions", () => {
    it("should generate random strings", () => {
      const random1 = EncryptionService.generateRandomString();
      const random2 = EncryptionService.generateRandomString();

      expect(random1).toBeDefined();
      expect(random2).toBeDefined();
      expect(random1).not.toBe(random2);
      expect(random1.length).toBe(32);
      expect(random2.length).toBe(32);
    });

    it("should generate random strings of specified length", () => {
      const random = EncryptionService.generateRandomString(16);
      expect(random.length).toBe(16);
    });
  });

  describe("end-to-end encryption/decryption", () => {
    it("should handle multiple encrypt/decrypt cycles", async () => {
      const userKey = EncryptionService.generateUserKey(
        testUserId,
        testPassword
      );
      let data = testData;

      // Encrypt and decrypt multiple times
      for (let i = 0; i < 5; i++) {
        const encrypted = await EncryptionService.encrypt(data, userKey);
        data = await EncryptionService.decrypt(encrypted, userKey);
      }

      expect(data).toEqual(testData);
    });

    it("should handle large data objects", async () => {
      const largeData = {
        notes: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          title: `Note ${i}`,
          content: `This is the content of note ${i}`.repeat(10),
          tags: [`tag${i}`, `category${i % 10}`],
          metadata: {
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            size: Math.random() * 1000,
          },
        })),
      };

      const userKey = EncryptionService.generateUserKey(
        testUserId,
        testPassword
      );
      const encrypted = await EncryptionService.encrypt(largeData, userKey);
      const decrypted = await EncryptionService.decrypt(encrypted, userKey);

      expect(decrypted).toEqual(largeData);
    });
  });
});
