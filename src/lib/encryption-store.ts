/**
 * Encrypted Notes Store
 * Handles encryption/decryption of notes before storage/after retrieval
 * Implements zero-knowledge architecture
 */

import {
  encryptNote,
  decryptNote,
  secureKeyStore,
  auditLogger,
  generateRecoveryKey,
  type EncryptedData,
} from "./crypto";
import { databases, account } from "./appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ENCRYPTED_NOTES_COLLECTION_ID = "encrypted_notes";
const USER_KEYS_COLLECTION_ID = "user_keys";

export interface EncryptedNote {
  $id: string;
  userId: string;
  encryptedData: EncryptedData;
  title: string; // Encrypted title (for search indexing)
  createdAt: string;
  updatedAt: string;
}

export interface DecryptedNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Initialize encryption for a user
 * Should be called after user registration/login
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initializeEncryption(_password: string): Promise<{
  recoveryKey: string;
  success: boolean;
}> {
  try {
    const user = await account.get();
    const recoveryKey = generateRecoveryKey();

    // Store encryption metadata in Appwrite
    await databases.createDocument(
      DATABASE_ID,
      USER_KEYS_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        encryptionEnabled: true,
        recoveryKeyHash: await hashRecoveryKey(recoveryKey),
        createdAt: new Date().toISOString(),
      }
    );

    // Log encryption enablement
    auditLogger.log({
      type: "encryption_enabled",
      timestamp: Date.now(),
      deviceId: getDeviceId(),
      success: true,
      details: "Encryption initialized for user",
    });

    return { recoveryKey, success: true };
  } catch (error) {
    auditLogger.log({
      type: "encryption_enabled",
      timestamp: Date.now(),
      deviceId: getDeviceId(),
      success: false,
      details: `Failed to initialize encryption: ${error}`,
    });
    throw error;
  }
}

/**
 * Create an encrypted note
 */
export async function createEncryptedNote(
  title: string,
  content: string,
  password: string
): Promise<DecryptedNote> {
  const user = await account.get();

  // Encrypt title and content separately
  const encryptedTitle = await encryptNote(title, password);
  const encryptedContent = await encryptNote(content, password);

  // Store in Appwrite
  const response = await databases.createDocument(
    DATABASE_ID,
    ENCRYPTED_NOTES_COLLECTION_ID,
    ID.unique(),
    {
      userId: user.$id,
      encryptedTitle: JSON.stringify(encryptedTitle),
      encryptedContent: JSON.stringify(encryptedContent),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  return {
    id: response.$id,
    title,
    content,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Get all encrypted notes for the current user
 */
export async function getEncryptedNotes(
  password: string
): Promise<DecryptedNote[]> {
  const user = await account.get();

  const response = await databases.listDocuments(
    DATABASE_ID,
    ENCRYPTED_NOTES_COLLECTION_ID,
    [Query.equal("userId", user.$id), Query.orderDesc("$updatedAt")]
  );

  const decryptedNotes: DecryptedNote[] = [];

  for (const doc of response.documents) {
    try {
      const encryptedTitle: EncryptedData = JSON.parse(doc.encryptedTitle);
      const encryptedContent: EncryptedData = JSON.parse(doc.encryptedContent);

      const title = await decryptNote(encryptedTitle, password);
      const content = await decryptNote(encryptedContent, password);

      decryptedNotes.push({
        id: doc.$id,
        title,
        content,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      });
    } catch (error) {
      // Log decryption failure but don't expose to user
      auditLogger.log({
        type: "decryption_failed",
        timestamp: Date.now(),
        deviceId: getDeviceId(),
        success: false,
        details: `Failed to decrypt note ${doc.$id}: ${error}`,
      });
    }
  }

  return decryptedNotes;
}

/**
 * Update an encrypted note
 */
export async function updateEncryptedNote(
  noteId: string,
  title: string,
  content: string,
  password: string
): Promise<DecryptedNote> {
  // Encrypt new content
  const encryptedTitle = await encryptNote(title, password);
  const encryptedContent = await encryptNote(content, password);

  // Update in Appwrite
  const response = await databases.updateDocument(
    DATABASE_ID,
    ENCRYPTED_NOTES_COLLECTION_ID,
    noteId,
    {
      encryptedTitle: JSON.stringify(encryptedTitle),
      encryptedContent: JSON.stringify(encryptedContent),
      updatedAt: new Date().toISOString(),
    }
  );

  return {
    id: response.$id,
    title,
    content,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Delete an encrypted note
 */
export async function deleteEncryptedNote(noteId: string): Promise<void> {
  await databases.deleteDocument(
    DATABASE_ID,
    ENCRYPTED_NOTES_COLLECTION_ID,
    noteId
  );
}

/**
 * Verify encryption password
 */
export async function verifyEncryptionPassword(password: string): Promise<boolean> {
  try {
    const user = await account.get();
    
    // Try to get one note to verify password works
    const response = await databases.listDocuments(
      DATABASE_ID,
      ENCRYPTED_NOTES_COLLECTION_ID,
      [Query.equal("userId", user.$id), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return true; // No notes yet, password is valid
    }

    const doc = response.documents[0];
    const encryptedTitle: EncryptedData = JSON.parse(doc.encryptedTitle);
    
    // Try to decrypt
    await decryptNote(encryptedTitle, password);
    return true;
  } catch {
    return false;
  }
}

/**
 * Hash recovery key for storage (not the actual key)
 */
async function hashRecoveryKey(recoveryKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(recoveryKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

/**
 * Get or generate device ID
 */
function getDeviceId(): string {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
}

/**
 * Secure session management
 */
class SecureSession {
  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private timeoutId: number | null = null;
  private lastActivity: number = Date.now();

  start(): void {
    this.resetTimeout();
    this.setupActivityListeners();
  }

  stop(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.removeActivityListeners();
    secureKeyStore.clear();
  }

  private resetTimeout(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.handleTimeout();
    }, this.sessionTimeout);
  }

  private handleTimeout(): void {
    // Clear all sensitive data
    secureKeyStore.clear();
    auditLogger.log({
      type: "logout",
      timestamp: Date.now(),
      deviceId: getDeviceId(),
      success: true,
      details: "Session timed out",
    });
    // Redirect to login
    window.location.href = "/login";
  }

  private setupActivityListeners(): void {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      document.addEventListener(event, this.onActivity.bind(this));
    });
  }

  private removeActivityListeners(): void {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      document.removeEventListener(event, this.onActivity.bind(this));
    });
  }

  private onActivity(): void {
    this.lastActivity = Date.now();
    this.resetTimeout();
  }
}

export const secureSession = new SecureSession();

/**
 * Export encrypted notes for backup
 */
export async function exportEncryptedNotes(): Promise<string> {
  const user = await account.get();
  
  const response = await databases.listDocuments(
    DATABASE_ID,
    ENCRYPTED_NOTES_COLLECTION_ID,
    [Query.equal("userId", user.$id)]
  );

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    userId: user.$id,
    notes: response.documents.map((doc) => ({
      id: doc.$id,
      encryptedTitle: doc.encryptedTitle,
      encryptedContent: doc.encryptedContent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import encrypted notes from backup
 */
export async function importEncryptedNotes(backupJson: string): Promise<number> {
  const backup = JSON.parse(backupJson);
  const user = await account.get();
  
  let importedCount = 0;

  for (const note of backup.notes) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        ENCRYPTED_NOTES_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          encryptedTitle: note.encryptedTitle,
          encryptedContent: note.encryptedContent,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        }
      );
      importedCount++;
    } catch (error) {
      console.error("Failed to import note:", error);
    }
  }

  return importedCount;
}
