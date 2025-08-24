/**
 * Local storage service using IndexedDB for encrypted note persistence
 * Handles offline queue management and sync operations
 */
class StorageService {
  constructor() {
    this.dbName = 'ThoughtBoxDB';
    this.dbVersion = 1;
    this.db = null;
    this.isInitialized = false;
    
    // Store names
    this.stores = {
      notes: 'notes',
      syncQueue: 'syncQueue',
      metadata: 'metadata'
    };
  }

  /**
   * Initialize IndexedDB database
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isInitialized && this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create notes store
        if (!db.objectStoreNames.contains(this.stores.notes)) {
          const notesStore = db.createObjectStore(this.stores.notes, { keyPath: 'id' });
          notesStore.createIndex('userId', 'userId', { unique: false });
          notesStore.createIndex('type', 'type', { unique: false });
          notesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          notesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        // Create sync queue store
        if (!db.objectStoreNames.contains(this.stores.syncQueue)) {
          const syncStore = db.createObjectStore(this.stores.syncQueue, { keyPath: 'id' });
          syncStore.createIndex('operation', 'operation', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('priority', 'priority', { unique: false });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains(this.stores.metadata)) {
          db.createObjectStore(this.stores.metadata, { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Ensure database is initialized before operations
   * @private
   */
  async _ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Save a note to local storage
   * @param {Object} note - Note object to save
   * @returns {Promise<Object>} Saved note with updated metadata
   */
  async saveNote(note) {
    await this._ensureInitialized();

    if (!note || !note.id) {
      throw new Error('Note must have an id');
    }

    const noteToSave = {
      ...note,
      updatedAt: new Date().toISOString(),
      syncStatus: note.syncStatus || 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readwrite');
      const store = transaction.objectStore(this.stores.notes);
      const request = store.put(noteToSave);

      request.onsuccess = () => {
        resolve(noteToSave);
      };

      request.onerror = () => {
        reject(new Error(`Failed to save note: ${request.error}`));
      };
    });
  }

  /**
   * Get all notes for a user
   * @param {string} userId - User identifier
   * @returns {Promise<Array>} Array of notes
   */
  async getNotes(userId) {
    await this._ensureInitialized();

    if (!userId) {
      throw new Error('User ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readonly');
      const store = transaction.objectStore(this.stores.notes);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const notes = request.result || [];
        // Sort by updatedAt descending
        notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        resolve(notes);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get notes: ${request.error}`));
      };
    });
  }

  /**
   * Get a specific note by ID
   * @param {string} noteId - Note identifier
   * @returns {Promise<Object|null>} Note object or null if not found
   */
  async getNote(noteId) {
    await this._ensureInitialized();

    if (!noteId) {
      throw new Error('Note ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readonly');
      const store = transaction.objectStore(this.stores.notes);
      const request = store.get(noteId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get note: ${request.error}`));
      };
    });
  }

  /**
   * Delete a note from local storage
   * @param {string} noteId - Note identifier
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deleteNote(noteId) {
    await this._ensureInitialized();

    if (!noteId) {
      throw new Error('Note ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readwrite');
      const store = transaction.objectStore(this.stores.notes);
      const request = store.delete(noteId);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete note: ${request.error}`));
      };
    });
  }  
/**
   * Add operation to sync queue
   * @param {Object} operation - Sync operation details
   * @returns {Promise<Object>} Queued operation
   */
  async addToSyncQueue(operation) {
    await this._ensureInitialized();

    if (!operation || !operation.type || !operation.noteId) {
      throw new Error('Operation must have type and noteId');
    }

    const queueItem = {
      id: `${operation.type}_${operation.noteId}_${Date.now()}`,
      operation: operation.type, // 'create', 'update', 'delete'
      noteId: operation.noteId,
      data: operation.data || null,
      timestamp: new Date().toISOString(),
      priority: operation.priority || 1, // Higher number = higher priority
      retryCount: 0,
      maxRetries: operation.maxRetries || 3
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.put(queueItem);

      request.onsuccess = () => {
        resolve(queueItem);
      };

      request.onerror = () => {
        reject(new Error(`Failed to add to sync queue: ${request.error}`));
      };
    });
  }

  /**
   * Get all pending sync operations
   * @returns {Promise<Array>} Array of pending sync operations
   */
  async getSyncQueue() {
    await this._ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.syncQueue], 'readonly');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.getAll();

      request.onsuccess = () => {
        const operations = request.result || [];
        // Sort by priority (descending) then timestamp (ascending)
        operations.sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
        resolve(operations);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get sync queue: ${request.error}`));
      };
    });
  }

  /**
   * Remove operation from sync queue
   * @param {string} operationId - Operation identifier
   * @returns {Promise<boolean>} True if removed successfully
   */
  async removeFromSyncQueue(operationId) {
    await this._ensureInitialized();

    if (!operationId) {
      throw new Error('Operation ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.delete(operationId);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Failed to remove from sync queue: ${request.error}`));
      };
    });
  }

  /**
   * Update sync operation retry count
   * @param {string} operationId - Operation identifier
   * @returns {Promise<Object|null>} Updated operation or null if max retries exceeded
   */
  async incrementRetryCount(operationId) {
    await this._ensureInitialized();

    if (!operationId) {
      throw new Error('Operation ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const getRequest = store.get(operationId);

      getRequest.onsuccess = () => {
        const operation = getRequest.result;
        if (!operation) {
          resolve(null);
          return;
        }

        operation.retryCount = (operation.retryCount || 0) + 1;

        if (operation.retryCount > operation.maxRetries) {
          // Remove operation if max retries exceeded
          const deleteRequest = store.delete(operationId);
          deleteRequest.onsuccess = () => resolve(null);
          deleteRequest.onerror = () => reject(new Error(`Failed to remove failed operation: ${deleteRequest.error}`));
        } else {
          // Update retry count
          const putRequest = store.put(operation);
          putRequest.onsuccess = () => resolve(operation);
          putRequest.onerror = () => reject(new Error(`Failed to update retry count: ${putRequest.error}`));
        }
      };

      getRequest.onerror = () => {
        reject(new Error(`Failed to get operation for retry: ${getRequest.error}`));
      };
    });
  }

  /**
   * Clear all sync queue operations
   * @returns {Promise<boolean>} True if cleared successfully
   */
  async clearSyncQueue() {
    await this._ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.clear();

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Failed to clear sync queue: ${request.error}`));
      };
    });
  }

  /**
   * Update note sync status
   * @param {string} noteId - Note identifier
   * @param {string} status - Sync status ('synced', 'pending', 'conflict', 'error')
   * @returns {Promise<Object|null>} Updated note or null if not found
   */
  async updateSyncStatus(noteId, status) {
    await this._ensureInitialized();

    if (!noteId || !status) {
      throw new Error('Note ID and status are required');
    }

    const validStatuses = ['synced', 'pending', 'conflict', 'error'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid sync status: ${status}`);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readwrite');
      const store = transaction.objectStore(this.stores.notes);
      const getRequest = store.get(noteId);

      getRequest.onsuccess = () => {
        const note = getRequest.result;
        if (!note) {
          resolve(null);
          return;
        }

        note.syncStatus = status;
        note.updatedAt = new Date().toISOString();

        const putRequest = store.put(note);
        putRequest.onsuccess = () => resolve(note);
        putRequest.onerror = () => reject(new Error(`Failed to update sync status: ${putRequest.error}`));
      };

      getRequest.onerror = () => {
        reject(new Error(`Failed to get note for sync status update: ${getRequest.error}`));
      };
    });
  }  /**
 
  * Store metadata (like last sync timestamp, user preferences, etc.)
   * @param {string} key - Metadata key
   * @param {any} value - Metadata value
   * @returns {Promise<Object>} Stored metadata object
   */
  async setMetadata(key, value) {
    await this._ensureInitialized();

    if (!key) {
      throw new Error('Metadata key is required');
    }

    const metadata = {
      key,
      value,
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.metadata], 'readwrite');
      const store = transaction.objectStore(this.stores.metadata);
      const request = store.put(metadata);

      request.onsuccess = () => {
        resolve(metadata);
      };

      request.onerror = () => {
        reject(new Error(`Failed to set metadata: ${request.error}`));
      };
    });
  }

  /**
   * Get metadata by key
   * @param {string} key - Metadata key
   * @returns {Promise<any|null>} Metadata value or null if not found
   */
  async getMetadata(key) {
    await this._ensureInitialized();

    if (!key) {
      throw new Error('Metadata key is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.metadata], 'readonly');
      const store = transaction.objectStore(this.stores.metadata);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get metadata: ${request.error}`));
      };
    });
  }

  /**
   * Get notes by type
   * @param {string} userId - User identifier
   * @param {string} type - Note type ('text', 'todo', 'timetable')
   * @returns {Promise<Array>} Array of notes of specified type
   */
  async getNotesByType(userId, type) {
    await this._ensureInitialized();

    if (!userId || !type) {
      throw new Error('User ID and type are required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readonly');
      const store = transaction.objectStore(this.stores.notes);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const allNotes = request.result || [];
        const filteredNotes = allNotes.filter(note => note.type === type);
        // Sort by updatedAt descending
        filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        resolve(filteredNotes);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get notes by type: ${request.error}`));
      };
    });
  }

  /**
   * Get notes with pending sync status
   * @param {string} userId - User identifier
   * @returns {Promise<Array>} Array of notes with pending sync
   */
  async getPendingSyncNotes(userId) {
    await this._ensureInitialized();

    if (!userId) {
      throw new Error('User ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes], 'readonly');
      const store = transaction.objectStore(this.stores.notes);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const allNotes = request.result || [];
        const pendingNotes = allNotes.filter(note => 
          note.syncStatus === 'pending' || note.syncStatus === 'error'
        );
        resolve(pendingNotes);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get pending sync notes: ${request.error}`));
      };
    });
  }

  /**
   * Clear all data for a user (used during logout)
   * @param {string} userId - User identifier
   * @returns {Promise<boolean>} True if cleared successfully
   */
  async clearUserData(userId) {
    await this._ensureInitialized();

    if (!userId) {
      throw new Error('User ID is required');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes, this.stores.syncQueue], 'readwrite');
      
      // Clear notes for user
      const notesStore = transaction.objectStore(this.stores.notes);
      const notesIndex = notesStore.index('userId');
      const notesRequest = notesIndex.getAll(userId);

      notesRequest.onsuccess = () => {
        const userNotes = notesRequest.result || [];
        const deletePromises = userNotes.map(note => {
          return new Promise((resolveDelete, rejectDelete) => {
            const deleteRequest = notesStore.delete(note.id);
            deleteRequest.onsuccess = () => resolveDelete();
            deleteRequest.onerror = () => rejectDelete(deleteRequest.error);
          });
        });

        Promise.all(deletePromises)
          .then(() => {
            // Clear sync queue (all operations, as they're user-specific)
            const syncStore = transaction.objectStore(this.stores.syncQueue);
            const clearRequest = syncStore.clear();
            clearRequest.onsuccess = () => resolve(true);
            clearRequest.onerror = () => reject(new Error(`Failed to clear sync queue: ${clearRequest.error}`));
          })
          .catch(error => reject(new Error(`Failed to clear user notes: ${error}`)));
      };

      notesRequest.onerror = () => {
        reject(new Error(`Failed to get user notes for clearing: ${notesRequest.error}`));
      };
    });
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database statistics
   */
  async getStats() {
    await this._ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.stores.notes, this.stores.syncQueue], 'readonly');
      
      const notesStore = transaction.objectStore(this.stores.notes);
      const syncStore = transaction.objectStore(this.stores.syncQueue);
      
      const notesCountRequest = notesStore.count();
      const syncCountRequest = syncStore.count();

      let notesCount = 0;
      let syncCount = 0;
      let completed = 0;

      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          resolve({
            totalNotes: notesCount,
            pendingSyncOperations: syncCount,
            lastUpdated: new Date().toISOString()
          });
        }
      };

      notesCountRequest.onsuccess = () => {
        notesCount = notesCountRequest.result;
        checkComplete();
      };

      syncCountRequest.onsuccess = () => {
        syncCount = syncCountRequest.result;
        checkComplete();
      };

      notesCountRequest.onerror = syncCountRequest.onerror = () => {
        reject(new Error('Failed to get database statistics'));
      };
    });
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export default new StorageService();