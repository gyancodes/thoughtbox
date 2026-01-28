import { account, databases } from './appwrite';
import { ID, Query } from 'appwrite';

// Appwrite Database Configuration from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const NOTES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTES_COLLECTION_ID;

// Note type matching your Appwrite schema
export interface Note {
  $id: string;
  noteId: number;
  userId: number; // Integer type as defined in Appwrite
  title: string;
  content: string;
  createdDate: string;
  modifiedDate: string | null;
  $createdAt: string;
  $updatedAt: string;
}

// Simplified Note type for UI (maps Appwrite fields)
export interface NoteUI {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Convert Appwrite Note to UI Note
function toNoteUI(doc: Note): NoteUI {
  return {
    id: doc.$id,
    userId: String(doc.userId),
    title: doc.title,
    content: doc.content,
    tags: [], // Your schema doesn't have tags, add if needed
    createdAt: new Date(doc.createdDate || doc.$createdAt),
    updatedAt: new Date(doc.modifiedDate || doc.$updatedAt),
  };
}

export const api = {
  // ==================== AUTH ====================
  
  async signup(email: string, password: string, name?: string) {
    // Create user account
    const user = await account.create(ID.unique(), email, password, name);
    // Auto-login after signup
    await account.createEmailPasswordSession(email, password);
    return user;
  },

  async login(email: string, password: string) {
    return await account.createEmailPasswordSession(email, password);
  },

  async logout() {
    return await account.deleteSession('current');
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  // ==================== NOTES ====================

  async getNotes(search?: string): Promise<NoteUI[]> {
    try {
      const user = await account.get();
      console.log('Current user:', user); // Debug log
      
      // Extract numeric portion from user ID or use a hash
      // Appwrite user IDs are like "6979df0c001c7bf99c21" - we need just the numeric part
      const numericUserId = parseInt(user.$id.substring(0, 8), 16); // Convert first 8 hex chars to number
      console.log('Numeric userId:', numericUserId);
      
      const queries = [
        Query.equal('userId', numericUserId),
        Query.orderDesc('$updatedAt'),
      ];

      if (search) {
        queries.push(Query.search('title', search));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        queries
      );

      console.log('Notes response:', response); // Debug log
      return response.documents.map((doc) => toNoteUI(doc as unknown as Note));
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  },

  async createNote(data: { title: string; content: string; tags?: string[] }): Promise<NoteUI> {
    const user = await account.get();
    const now = new Date().toISOString();
    
    // Extract numeric portion from user ID (same logic as getNotes)
    const numericUserId = parseInt(user.$id.substring(0, 8), 16);

    const response = await databases.createDocument(
      DATABASE_ID,
      NOTES_COLLECTION_ID,
      ID.unique(),
      {
        noteId: Date.now(), // Use timestamp as noteId
        userId: numericUserId, // Store as integer to match database schema
        title: data.title,
        content: data.content,
        createdDate: now,
        modifiedDate: now,
      }
    );

    return toNoteUI(response as unknown as Note);
  },

  async updateNote(noteId: string, data: { title?: string; content?: string; tags?: string[] }): Promise<NoteUI> {
    const updateData: Record<string, unknown> = {
      modifiedDate: new Date().toISOString(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;

    const response = await databases.updateDocument(
      DATABASE_ID,
      NOTES_COLLECTION_ID,
      noteId,
      updateData
    );

    return toNoteUI(response as unknown as Note);
  },

  async deleteNote(noteId: string): Promise<void> {
    await databases.deleteDocument(
      DATABASE_ID,
      NOTES_COLLECTION_ID,
      noteId
    );
  },
};
