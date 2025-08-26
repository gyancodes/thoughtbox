import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { appwriteService, NetworkError, ValidationError } from '../lib/appwrite';
import encryptionService from '../lib/encryption';
import storageService from '../lib/storage';
import { ID } from 'appwrite';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// Sync status constants
export const SYNC_STATUS = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  ERROR: 'error',
  OFFLINE: 'offline'
};

// Note sync status constants
export const NOTE_SYNC_STATUS = {
  SYNCED: 'synced',
  PENDING: 'pending',
  CONFLICT: 'conflict',
  ERROR: 'error'
};

export const NotesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Core state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(SYNC_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Encryption key management
  const [encryptionKey, setEncryptionKey] = useState(null);
  const syncTimeoutRef = useRef(null);
  
  
  // Initialize encryption key when user authenticates
  useEffect(() => {
    if (user && isAuthenticated) {
      // For now, we'll use a simple key derivation
      // In a real app, you'd want to derive this from user password during login
      const userKey = encryptionService.generateUserKey(user.$id, user.email);
      setEncryptionKey(userKey);
    } else {
      setEncryptionKey(null);
      encryptionService.clearKeyCache();
    }
  }, [user, isAuthenticated]);

  // Handle connection restoration with enhanced sync (defined early for use in useEffect)
  const handleConnectionRestored = useCallback(async () => {
    if (!user || !encryptionKey || !isOnline) return;

    try {
      setSyncStatus(SYNC_STATUS.SYNCING);
      
      // Get offline statistics inline to avoid dependency issues
      let stats = { offlineNotes: 0, pendingSync: 0 };
      try {
        const pendingNotes = await storageService.getPendingSyncNotes(user.$id);
        const syncQueue = await storageService.getSyncQueue();
        stats = {
          offlineNotes: pendingNotes.length,
          pendingSync: syncQueue.length,
          lastOfflineActivity: await storageService.getMetadata('lastOfflineActivity')
        };
      } catch (error) {
        console.error('Failed to get offline stats:', error);
      }
      
      if (stats.offlineNotes > 0 || stats.pendingSync > 0) {
        console.log(`Connection restored. Syncing ${stats.offlineNotes} offline notes and ${stats.pendingSync} pending operations.`);
        
        // Trigger sync by setting a flag that will be picked up by other effects
        setTimeout(() => {
          // This will trigger the existing sync mechanisms
          if (isOnline) {
            setSyncStatus(SYNC_STATUS.IDLE); // Reset to allow sync to proceed
          }
        }, 500);
        
        // Clear offline metadata after successful sync
        await storageService.setMetadata('lastOfflineActivity', null);
      }
    } catch (error) {
      console.error('Failed to handle connection restoration:', error);
      setError('Failed to sync offline changes');
    }
  }, [user, encryptionKey, isOnline]);

  // Get offline statistics
  const getOfflineStats = useCallback(async () => {
    if (!user) return { offlineNotes: 0, pendingSync: 0 };

    try {
      const pendingNotes = await storageService.getPendingSyncNotes(user.$id);
      const syncQueue = await storageService.getSyncQueue();
      
      return {
        offlineNotes: pendingNotes.length,
        pendingSync: syncQueue.length,
        lastOfflineActivity: await storageService.getMetadata('lastOfflineActivity')
      };
    } catch (error) {
      console.error('Failed to get offline stats:', error);
      return { offlineNotes: 0, pendingSync: 0 };
    }
  }, [user]);

  // Enhanced network status monitoring with connection testing
  useEffect(() => {
    let connectionTestInterval;
    
    const testConnection = async () => {
      try {
        // Test actual connectivity by making a small request
        const response = await fetch('/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        return response.ok;
      } catch {
        return false;
      }
    };

    const handleOnline = async () => {
      // Verify actual connectivity, not just browser online status
      const isActuallyOnline = await testConnection();
      
      if (isActuallyOnline) {
        setIsOnline(true);
        setSyncStatus(SYNC_STATUS.IDLE);
        
        if (isAuthenticated && encryptionKey) {
          // Use the enhanced connection restoration handler
          setTimeout(() => {
            handleConnectionRestored();
          }, 1000);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(SYNC_STATUS.OFFLINE);
      
      // Store offline activity timestamp
      if (user) {
        storageService.setMetadata('lastOfflineActivity', new Date().toISOString());
      }
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connection testing when browser thinks we're online
    if (navigator.onLine) {
      connectionTestInterval = setInterval(async () => {
        const isActuallyOnline = await testConnection();
        if (isActuallyOnline !== isOnline) {
          if (isActuallyOnline) {
            handleOnline();
          } else {
            handleOffline();
          }
        }
      }, 30000); // Test every 30 seconds
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connectionTestInterval) {
        clearInterval(connectionTestInterval);
      }
    };
  }, [isAuthenticated, encryptionKey, handleConnectionRestored, isOnline, user]);

  // Trigger sync when notes have pending changes (will be set up after debouncedSync is defined)

  // Load notes when user authenticates
  useEffect(() => {
    if (isAuthenticated && user && encryptionKey) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [isAuthenticated, user, encryptionKey]);

  // Utility function to generate note ID
  const generateNoteId = () => ID.unique();

  // Encrypt note content before storage
  const encryptNoteContent = async (content) => {
    if (!encryptionKey) {
      throw new Error('Encryption key not available');
    }
    return await encryptionService.encrypt(content, encryptionKey);
  };

  // Decrypt note content after retrieval
  const decryptNoteContent = async (encryptedContent) => {
    if (!encryptionKey) {
      throw new Error('Encryption key not available');
    }
    return await encryptionService.decrypt(encryptedContent, encryptionKey);
  };

  // Load notes from local storage and sync with cloud
  const loadNotes = useCallback(async () => {
    if (!user || !encryptionKey) return;

    try {
      setLoading(true);
      setError(null);

      // Load from local storage first
      const localNotes = await storageService.getNotes(user.$id);
      
      // Decrypt notes
      const decryptedNotes = await Promise.all(
        localNotes.map(async (note) => {
          try {
            const decryptedContent = await decryptNoteContent(note.content);
            return { ...note, content: decryptedContent };
          } catch (error) {
            console.error(`Failed to decrypt note ${note.id}:`, error);
            return { ...note, content: null, syncStatus: NOTE_SYNC_STATUS.ERROR };
          }
        })
      );

      setNotes(decryptedNotes);

      // Sync with cloud if online
      if (isOnline) {
        syncWithCloud();
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [user, encryptionKey, isOnline]);

  // Create a new note
  const createNote = useCallback(async (type, content, title = '') => {
    console.log('Creating note:', { type, title, isOnline, user: user?.$id });
    
    if (!user || !encryptionKey) {
      throw new Error('User not authenticated or encryption key not available');
    }

    try {
      const noteId = generateNoteId();
      const now = new Date().toISOString();
      
      const note = {
        id: noteId,
        type,
        title,
        content,
        createdAt: now,
        updatedAt: now,
        userId: user.$id,
        syncStatus: NOTE_SYNC_STATUS.PENDING,
        offlineCreated: !isOnline // Flag to track offline creation
      };

      // Encrypt content
      const encryptedContent = await encryptNoteContent(content);
      const encryptedNote = { ...note, content: encryptedContent };

      // Save to local storage
      await storageService.saveNote(encryptedNote);

      // Add to sync queue with appropriate priority
      await storageService.addToSyncQueue({
        type: 'create',
        noteId: noteId,
        data: encryptedNote,
        priority: isOnline ? 1 : 2 // Higher priority for offline changes
      });

      // Store offline metadata for better UX
      if (!isOnline) {
        await storageService.setMetadata(`offline_note_${noteId}`, {
          created: now,
          type: 'create'
        });
      }

      // Update local state with decrypted note
      setNotes(prevNotes => [note, ...prevNotes]);

      // Trigger immediate sync for testing
      if (isOnline) {
        console.log('Triggering immediate sync after note creation');
        setTimeout(() => syncWithCloud(), 100);
      }

      return note;
    } catch (error) {
      console.error('Failed to create note:', error);
      setError(`Failed to create note${!isOnline ? ' (offline)' : ''}`);
      throw error;
    }
  }, [user, encryptionKey, isOnline]);

  // Update an existing note
  const updateNote = useCallback(async (noteId, updates) => {
    if (!user || !encryptionKey) {
      throw new Error('User not authenticated or encryption key not available');
    }

    try {
      const existingNote = notes.find(note => note.id === noteId);
      if (!existingNote) {
        throw new Error('Note not found');
      }

      const now = new Date().toISOString();
      const updatedNote = {
        ...existingNote,
        ...updates,
        updatedAt: now,
        syncStatus: NOTE_SYNC_STATUS.PENDING,
        offlineModified: !isOnline // Flag to track offline modifications
      };

      // Encrypt content if it was updated
      let encryptedNote = updatedNote;
      if (updates.content !== undefined) {
        const encryptedContent = await encryptNoteContent(updates.content);
        encryptedNote = { ...updatedNote, content: encryptedContent };
      } else {
        // Re-encrypt existing content for storage
        const encryptedContent = await encryptNoteContent(existingNote.content);
        encryptedNote = { ...updatedNote, content: encryptedContent };
      }

      // Save to local storage
      await storageService.saveNote(encryptedNote);

      // Add to sync queue with appropriate priority
      await storageService.addToSyncQueue({
        type: 'update',
        noteId: noteId,
        data: encryptedNote,
        priority: isOnline ? 1 : 2 // Higher priority for offline changes
      });

      // Store offline metadata for better UX
      if (!isOnline) {
        await storageService.setMetadata(`offline_note_${noteId}`, {
          modified: now,
          type: 'update'
        });
      }

      // Update local state with decrypted note
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      );

      // Sync will be triggered by useEffect watching for pending notes

      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      setError(`Failed to update note${!isOnline ? ' (offline)' : ''}`);
      throw error;
    }
  }, [user, encryptionKey, notes, isOnline]);

  // Delete a note
  const deleteNote = useCallback(async (noteId) => {
    if (!user || !encryptionKey) {
      throw new Error('User not authenticated or encryption key not available');
    }

    try {
      // Remove from local storage
      await storageService.deleteNote(noteId);

      // Add to sync queue
      await storageService.addToSyncQueue({
        type: 'delete',
        noteId: noteId
      });

      // Update local state
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));

      // Sync will be triggered by useEffect watching for pending notes

      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      setError('Failed to delete note');
      throw error;
    }
  }, [user, encryptionKey, isOnline]);

  // Sync with cloud
  const syncWithCloud = useCallback(async (forceSync = false) => {
    if (!user || !encryptionKey || (!isOnline && !forceSync)) {
      return;
    }

    // Check if database is configured
    if (!appwriteService.hasDatabaseConfig) {
      console.log('Database not configured, skipping sync');
      setSyncStatus(SYNC_STATUS.IDLE);
      return;
    }

    try {
      setSyncStatus(SYNC_STATUS.SYNCING);
      setError(null);

      // Verify authentication before syncing
      try {
        await appwriteService.getCurrentUser();
      } catch (authError) {
        console.error('Authentication check failed:', authError);
        setSyncStatus(SYNC_STATUS.ERROR);
        setError('Authentication expired. Please log in again.');
        return;
      }

      // Get pending sync operations
      const syncQueue = await storageService.getSyncQueue();
      
      console.log(`Sync queue has ${syncQueue.length} operations:`, syncQueue);
      
      if (syncQueue.length === 0) {
        setSyncStatus(SYNC_STATUS.IDLE);
        return;
      }

      // Process sync queue
      for (const operation of syncQueue) {
        try {
          console.log(`Processing sync operation:`, operation);
          
          switch (operation.operation) {
            case 'create':
              console.log('Creating note in cloud:', operation.data);
              // Ensure userId is set for the note
              const noteDataWithUser = {
                ...operation.data,
                userId: user.$id
              };
              const createResult = await appwriteService.createNote(noteDataWithUser);
              console.log('Note created successfully:', createResult);
              break;
            case 'update':
              console.log('Updating note in cloud:', operation.noteId);
              await appwriteService.updateNote(operation.noteId, operation.data);
              break;
            case 'delete':
              console.log('Deleting note from cloud:', operation.noteId);
              await appwriteService.deleteNote(operation.noteId);
              break;
          }

          // Remove successful operation from queue
          await storageService.removeFromSyncQueue(operation.id);
          
          // Update note sync status
          await storageService.updateSyncStatus(operation.noteId, NOTE_SYNC_STATUS.SYNCED);
          
          // Update local state
          setNotes(prevNotes => 
            prevNotes.map(note => 
              note.id === operation.noteId 
                ? { ...note, syncStatus: NOTE_SYNC_STATUS.SYNCED }
                : note
            )
          );
        } catch (error) {
          console.error(`Sync operation failed for ${operation.operation} ${operation.noteId}:`, error);
          
          // Handle different types of errors
          if (error.name === 'AuthenticationError') {
            console.error('Authentication error during sync. User may need to re-login.');
            setSyncStatus(SYNC_STATUS.ERROR);
            setError('Authentication failed. Please try logging out and back in.');
            return; // Stop processing queue
          }
          
          if (error.name === 'ValidationError' && error.message.includes('not found')) {
            // Document doesn't exist, remove from queue
            console.log(`Document ${operation.noteId} not found, removing from sync queue`);
            await storageService.removeFromSyncQueue(operation.id);
            continue;
          }
          
          // Increment retry count or remove if max retries exceeded
          const updatedOperation = await storageService.incrementRetryCount(operation.id);
          
          if (!updatedOperation) {
            // Max retries exceeded, mark note as error
            await storageService.updateSyncStatus(operation.noteId, NOTE_SYNC_STATUS.ERROR);
            setNotes(prevNotes => 
              prevNotes.map(note => 
                note.id === operation.noteId 
                  ? { ...note, syncStatus: NOTE_SYNC_STATUS.ERROR }
                  : note
              )
            );
          }
        }
      }

      setSyncStatus(SYNC_STATUS.IDLE);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(SYNC_STATUS.ERROR);
      setError('Sync failed');
    }
  }, [user, encryptionKey, isOnline]);

  // Debounced sync to avoid too frequent sync calls
  const debouncedSync = useCallback(() => {
    console.log('Debounced sync triggered');
    
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      console.log('Executing debounced sync');
      syncWithCloud();
    }, 2000); // 2 second delay
  }, [syncWithCloud]);

  // Trigger sync when notes have pending changes (now that debouncedSync is defined)
  useEffect(() => {
    if (isOnline && isAuthenticated && encryptionKey) {
      // Check if there are any pending notes that need sync
      const hasPendingNotes = notes.some(note => 
        note.syncStatus === NOTE_SYNC_STATUS.PENDING || 
        note.syncStatus === NOTE_SYNC_STATUS.ERROR
      );
      
      if (hasPendingNotes) {
        console.log('Found pending notes, triggering sync');
        debouncedSync();
      }
    }
  }, [notes, isOnline, isAuthenticated, encryptionKey, debouncedSync]);

  // Handle sync conflicts (simple last-write-wins for now)
  const resolveConflict = useCallback(async (noteId, resolution = 'local') => {
    try {
      const localNote = notes.find(note => note.id === noteId);
      if (!localNote) {
        throw new Error('Local note not found');
      }

      if (resolution === 'local') {
        // Use local version, update cloud
        const encryptedContent = await encryptNoteContent(localNote.content);
        const encryptedNote = { ...localNote, content: encryptedContent };
        
        await appwriteService.updateNote(noteId, encryptedNote);
        await storageService.updateSyncStatus(noteId, NOTE_SYNC_STATUS.SYNCED);
        
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId 
              ? { ...note, syncStatus: NOTE_SYNC_STATUS.SYNCED }
              : note
          )
        );
      } else if (resolution === 'cloud') {
        // Use cloud version, update local
        const cloudNote = await appwriteService.getNote(noteId);
        const decryptedContent = await decryptNoteContent(cloudNote.content);
        const decryptedNote = { ...cloudNote, content: decryptedContent };
        
        await storageService.saveNote(cloudNote);
        
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId ? decryptedNote : note
          )
        );
      }
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      setError('Failed to resolve sync conflict');
    }
  }, [notes, encryptionKey]);

  // Get notes by type
  const getNotesByType = useCallback((type) => {
    return notes.filter(note => note.type === type);
  }, [notes]);

  // Search notes with enhanced functionality
  const searchNotes = useCallback((query) => {
    if (!query.trim()) return { results: notes, query: '' };
    
    const lowercaseQuery = query.toLowerCase().trim();
    const searchTerms = lowercaseQuery.split(/\s+/);
    
    const searchResults = notes.map(note => {
      let score = 0;
      let titleMatches = [];
      let contentMatches = [];
      
      // Search in title
      const title = note.title?.toLowerCase() || '';
      searchTerms.forEach(term => {
        if (title.includes(term)) {
          score += title === term ? 100 : 50; // Exact match gets higher score
          titleMatches.push(term);
        }
      });
      
      // Search in content based on note type
      let searchableContent = '';
      if (note.content) {
        switch (note.type) {
          case 'text':
            searchableContent = note.content.text?.toLowerCase() || '';
            break;
          case 'todo':
            searchableContent = note.content.items?.map(item => item.text).join(' ').toLowerCase() || '';
            break;
          case 'timetable':
            searchableContent = note.content.entries?.map(entry => 
              `${entry.time} ${entry.description}`
            ).join(' ').toLowerCase() || '';
            break;
          default:
            searchableContent = JSON.stringify(note.content).toLowerCase();
        }
      }
      
      searchTerms.forEach(term => {
        if (searchableContent.includes(term)) {
          score += 10;
          contentMatches.push(term);
        }
      });
      
      // Boost score for recent notes (only if there's already a match)
      if (score > 0) {
        const daysSinceUpdate = (Date.now() - new Date(note.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) score += 5;
        if (daysSinceUpdate < 1) score += 10;
      }
      
      return {
        note,
        score,
        titleMatches,
        contentMatches,
        isMatch: score > 0
      };
    })
    .filter(result => result.isMatch)
    .sort((a, b) => b.score - a.score) // Sort by relevance score
    .map(result => ({
      ...result.note,
      searchMeta: {
        score: result.score,
        titleMatches: result.titleMatches,
        contentMatches: result.contentMatches
      }
    }));
    
    return { 
      results: searchResults, 
      query: query.trim(),
      totalResults: searchResults.length 
    };
  }, [notes]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);



  // Clear all notes (for logout)
  const clearNotes = useCallback(async () => {
    if (user) {
      await storageService.clearUserData(user.$id);
    }
    setNotes([]);
    setEncryptionKey(null);
    setSyncStatus(SYNC_STATUS.IDLE);
    setError(null);
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    // State
    notes,
    loading,
    syncStatus,
    error,
    isOnline,
    
    // Actions
    createNote,
    updateNote,
    deleteNote,
    loadNotes,
    syncWithCloud,
    resolveConflict,
    getNotesByType,
    searchNotes,
    clearError,
    clearNotes,
    getOfflineStats,
    handleConnectionRestored,
    
    // Utilities
    generateNoteId,
    
    // Constants
    SYNC_STATUS,
    NOTE_SYNC_STATUS
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};