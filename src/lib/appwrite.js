import { Client, Account, Databases, Query } from 'appwrite';

// Validate required environment variables
const requiredEnvVars = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID
};

// Optional environment variables for database features
const optionalEnvVars = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  notesCollectionId: import.meta.env.VITE_APPWRITE_NOTES_COLLECTION_ID
};

// Check if all required environment variables are present
const missingRequiredVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => `VITE_APPWRITE_${key.toUpperCase()}`);

if (missingRequiredVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingRequiredVars.join(', ')}. ` +
    'Please check your .env file and ensure all Appwrite configuration is set.'
  );
}

export const client = new Client();

client
    .setEndpoint(requiredEnvVars.endpoint)
    .setProject(requiredEnvVars.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// Export configuration for use in other modules
export const appwriteConfig = {
  databaseId: optionalEnvVars.databaseId,
  notesCollectionId: optionalEnvVars.notesCollectionId,
  hasDatabaseConfig: !!(optionalEnvVars.databaseId && optionalEnvVars.notesCollectionId)
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Custom error classes
export class AppwriteServiceError extends Error {
  constructor(message, code, originalError) {
    super(message);
    this.name = 'AppwriteServiceError';
    this.code = code;
    this.originalError = originalError;
  }
}

export class NetworkError extends AppwriteServiceError {
  constructor(message, originalError) {
    super(message, 'NETWORK_ERROR', originalError);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppwriteServiceError {
  constructor(message, originalError) {
    super(message, 'AUTH_ERROR', originalError);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppwriteServiceError {
  constructor(message, originalError) {
    super(message, 'VALIDATION_ERROR', originalError);
    this.name = 'ValidationError';
  }
}

// Utility function for exponential backoff retry
async function withRetry(operation, config = RETRY_CONFIG) {
  let lastError;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication or validation errors
      if (error.code === 401 || error.code === 400) {
        throw new AuthenticationError('Authentication failed', error);
      }
      
      if (error.code === 422) {
        throw new ValidationError('Validation failed', error);
      }
      
      // If this is the last attempt, throw the error
      if (attempt === config.maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt),
        config.maxDelay
      );
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  // If we get here, all retries failed
  throw new NetworkError('Operation failed after retries', lastError);
}

// AppwriteService class for notes management
export class AppwriteService {
  constructor() {
    if (!appwriteConfig.hasDatabaseConfig) {
      console.warn('Database configuration not found. Some features may not work.');
    }
  }

  // Authentication methods
  async authenticate(email, password) {
    try {
      return await withRetry(async () => {
        return await account.createEmailPasswordSession(email, password);
      });
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      throw new AuthenticationError('Failed to authenticate', error);
    }
  }

  async getCurrentUser() {
    try {
      return await withRetry(async () => {
        return await account.get();
      });
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      if (error.code === 401 || error.originalError?.code === 401) {
        throw new AuthenticationError('User not authenticated', error);
      }
      throw new NetworkError('Failed to get current user', error);
    }
  }

  async logout() {
    try {
      return await withRetry(async () => {
        return await account.deleteSession('current');
      });
    } catch (error) {
      // Don't throw on logout errors, just log them
      console.warn('Logout error:', error);
      return null;
    }
  }

  // Notes CRUD operations
  async createNote(noteData) {
    if (!appwriteConfig.hasDatabaseConfig) {
      throw new ValidationError('Database configuration not available');
    }

    // Validate required fields
    if (!noteData.id || !noteData.type || !noteData.content) {
      throw new ValidationError('Missing required note fields: id, type, content');
    }

    try {
      return await withRetry(async () => {
        return await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.notesCollectionId,
          noteData.id,
          {
            type: noteData.type,
            title: noteData.title || '',
            content: noteData.content, // Should be encrypted before calling this method
            createdAt: noteData.createdAt || new Date().toISOString(),
            updatedAt: noteData.updatedAt || new Date().toISOString(),
            syncStatus: noteData.syncStatus || 'synced'
          }
        );
      });
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      throw new NetworkError('Failed to create note', error);
    }
  }

  async updateNote(noteId, noteData) {
    if (!appwriteConfig.hasDatabaseConfig) {
      throw new ValidationError('Database configuration not available');
    }

    if (!noteId) {
      throw new ValidationError('Note ID is required');
    }

    try {
      return await withRetry(async () => {
        const updateData = {
          updatedAt: new Date().toISOString(),
          ...noteData
        };
        
        return await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.notesCollectionId,
          noteId,
          updateData
        );
      });
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      if (error.code === 404) {
        throw new ValidationError('Note not found', error);
      }
      throw new NetworkError('Failed to update note', error);
    }
  }

  async deleteNote(noteId) {
    if (!appwriteConfig.hasDatabaseConfig) {
      throw new ValidationError('Database configuration not available');
    }

    if (!noteId) {
      throw new ValidationError('Note ID is required');
    }

    try {
      return await withRetry(async () => {
        return await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.notesCollectionId,
          noteId
        );
      });
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      if (error.code === 404) {
        throw new ValidationError('Note not found', error);
      }
      throw new NetworkError('Failed to delete note', error);
    }
  }

  async getNote(noteId) {
    if (!appwriteConfig.hasDatabaseConfig) {
      throw new ValidationError('Database configuration not available');
    }

    if (!noteId) {
      throw new ValidationError('Note ID is required');
    }

    try {
      return await withRetry(async () => {
        return await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.notesCollectionId,
          noteId
        );
      });
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      if (error.code === 404) {
        throw new ValidationError('Note not found', error);
      }
      throw new NetworkError('Failed to get note', error);
    }
  }

  async listNotes(userId = null, limit = 100, offset = 0) {
    if (!appwriteConfig.hasDatabaseConfig) {
      throw new ValidationError('Database configuration not available');
    }

    try {
      return await withRetry(async () => {
        const queries = [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('updatedAt')
        ];

        // If userId is provided, filter by user
        if (userId) {
          queries.push(Query.equal('userId', userId));
        }

        return await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.notesCollectionId,
          queries
        );
      });
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      throw new NetworkError('Failed to list notes', error);
    }
  }

  async listUserNotes(limit = 100, offset = 0) {
    try {
      const user = await this.getCurrentUser();
      return await this.listNotes(user.$id, limit, offset);
    } catch (error) {
      if (error instanceof AppwriteServiceError) {
        throw error;
      }
      throw new NetworkError('Failed to list user notes', error);
    }
  }

  // Batch operations for sync
  async batchCreateNotes(notes) {
    if (!Array.isArray(notes)) {
      throw new ValidationError('Notes must be an array');
    }

    const results = [];
    const errors = [];

    for (const note of notes) {
      try {
        const result = await this.createNote(note);
        results.push({ success: true, note: result });
      } catch (error) {
        errors.push({ success: false, noteId: note.id, error });
      }
    }

    return { results, errors };
  }

  async batchUpdateNotes(updates) {
    if (!Array.isArray(updates)) {
      throw new ValidationError('Updates must be an array');
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const result = await this.updateNote(update.id, update.data);
        results.push({ success: true, note: result });
      } catch (error) {
        errors.push({ success: false, noteId: update.id, error });
      }
    }

    return { results, errors };
  }

  // Health check method
  async checkConnection() {
    try {
      await withRetry(async () => {
        return await account.get();
      });
      return { connected: true, authenticated: true };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return { connected: true, authenticated: false };
      }
      return { connected: false, authenticated: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
export const appwriteService = new AppwriteService();

export { ID } from 'appwrite';
