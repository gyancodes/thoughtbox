import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useClerkAuth } from './ClerkAuthContext';
import { appwriteService } from '../lib/appwrite';
import storageService from '../lib/storage';
import { encryptData, decryptData } from '../lib/crypto';
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
  const { user, isAuthenticated, encryptionKey } = useClerkAuth();
  
  // Core state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(SYNC_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Refs for managing sync operations
  const syncTimeoutRef = useRef(null);
  
  
  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus(SYNC_STATUS.IDLE);
      // Trigger sync when coming back online
      if (isAuthenticated && encryptionKey) {
        debouncedSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(SYNC_STATUS.OFFLINE);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, encryptionKey]);

  // Load notes when user authenticates
  useEffect(() => {
    if (isAuthenticated && user && encryptionKey) {
      loadNotes();
    } else {
      setNotes([]);
      setError(null);
    }
  }, [isAuthenticated, user, encryptionKey, loadNotes]);

  // Sync notes with Appwrite database
  const syncNotes = async () => {
    if (!isOnline || !isAuthenticated || !encryptionKey) return;

    setSyncStatus(SYNC_STATUS.SYNCING);

    try {
      // Get notes that need syncing
      const notesToSync = notes.filter(note => 
        note.syncStatus === NOTE_SYNC_STATUS.PENDING || 
        !note.syncStatus
      );

      console.log(`Syncing ${notesToSync.length} notes...`);

      // Sync each note to Appwrite
      for (const note of notesToSync) {
        try {
          // Encrypt content before sending to Appwrite
          const encryptedContent = await encryptData(note.content, encryptionKey);
          
          const noteData = {
            type: note.type,
            title: note.title,
            content: JSON.stringify(encryptedContent), // Store encrypted content as string
            userId: user.id,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            syncStatus: NOTE_SYNC_STATUS.SYNCED
          };

          // Check if note exists in Appwrite
          try {
            await appwriteService.getDocument(note.id);
            // Note exists, update it
            await appwriteService.updateDocument(note.id, noteData);
          } catch (error) {
            if (error.code === 404) {
              // Note doesn't exist, create it
              await appwriteService.createDocument(note.id, noteData);
            } else {
              throw error;
            }
          }

          // Update local note status
          await storageService.saveNote(user.id, {
            ...note,
            content: encryptedContent,
            syncStatus: NOTE_SYNC_STATUS.SYNCED
          });

        } catch (noteError) {
          console.error(`Failed to sync note ${note.id}:`, noteError);
          // Mark note as error but continue with others
          await storageService.saveNote(user.id, {
            ...note,
            syncStatus: NOTE_SYNC_STATUS.ERROR
          });
        }
      }

      // Update state to reflect synced status
      const updatedNotes = notes.map(note => {
        if (notesToSync.find(n => n.id === note.id)) {
          return { ...note, syncStatus: NOTE_SYNC_STATUS.SYNCED };
        }
        return note;
      });

      setNotes(updatedNotes);
      setSyncStatus(SYNC_STATUS.IDLE);

      // Also fetch any new notes from server
      await fetchNotesFromServer();

    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(SYNC_STATUS.ERROR);
    }
  };

  // Debounced sync function
  const debouncedSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      if (isOnline && isAuthenticated && encryptionKey) {
        syncNotes();
      }
    }, 1000);
  }, [isOnline, isAuthenticated, encryptionKey, syncNotes]);

  // Load notes from local storage and sync with Appwrite
  const loadNotes = async () => {
    if (!user || !encryptionKey) return;

    setLoading(true);
    setError(null);

    try {
      // First load from local storage for immediate display
      const localNotes = await storageService.getAllNotes(user.id);
      const decryptedNotes = [];

      for (const note of localNotes) {
        try {
          if (note.content && typeof note.content === 'object') {
            // Note is encrypted
            const decryptedContent = await decryptData(note.content, encryptionKey);
            decryptedNotes.push({
              ...note,
              content: decryptedContent
            });
          } else {
            // Note is not encrypted (legacy or error case)
            decryptedNotes.push(note);
          }
        } catch (decryptError) {
          console.error('Failed to decrypt note:', note.id, decryptError);
          // Skip corrupted notes
        }
      }

      setNotes(decryptedNotes);
      
      // If online, fetch from server and sync
      if (isOnline) {
        try {
          await fetchNotesFromServer();
          debouncedSync();
        } catch (syncError) {
          console.error('Failed to sync with server on load:', syncError);
          // Don't show error to user, local notes are still available
        }
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      setError('Failed to load notes from local storage');
    } finally {
      setLoading(false);
    }
  };



  // Fetch notes from Appwrite server
  const fetchNotesFromServer = async () => {
    if (!user || !encryptionKey) return;

    try {
      const serverNotes = await appwriteService.listDocuments(user.id);
      
      for (const serverNote of serverNotes) {
        try {
          // Check if we already have this note locally
          const localNote = notes.find(n => n.id === serverNote.$id);
          
          if (!localNote || new Date(serverNote.updatedAt) > new Date(localNote.updatedAt)) {
            // Decrypt the content
            const encryptedContent = JSON.parse(serverNote.content);
            const decryptedContent = await decryptData(encryptedContent, encryptionKey);
            
            const note = {
              id: serverNote.$id,
              type: serverNote.type,
              title: serverNote.title,
              content: decryptedContent,
              userId: serverNote.userId,
              createdAt: serverNote.createdAt,
              updatedAt: serverNote.updatedAt,
              syncStatus: NOTE_SYNC_STATUS.SYNCED
            };

            // Save to local storage
            await storageService.saveNote(user.id, {
              ...note,
              content: encryptedContent
            });

            // Update state
            setNotes(prev => {
              const filtered = prev.filter(n => n.id !== note.id);
              return [note, ...filtered].sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
              );
            });
          }
        } catch (decryptError) {
          console.error('Failed to decrypt server note:', serverNote.$id, decryptError);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notes from server:', error);
    }
  };

  // Create a new note
  const createNote = async (type, content, title = '') => {
    if (!user || !encryptionKey) {
      throw new Error('User must be authenticated to create notes');
    }

    const noteId = ID.unique();
    const now = new Date().toISOString();

    const newNote = {
      id: noteId,
      type,
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Note`,
      content,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
      syncStatus: isOnline ? NOTE_SYNC_STATUS.PENDING : NOTE_SYNC_STATUS.PENDING
    };

    try {
      // Encrypt content
      const encryptedContent = await encryptData(content, encryptionKey);
      
      // Save to local storage first
      const encryptedNote = {
        ...newNote,
        content: encryptedContent
      };
      await storageService.saveNote(user.id, encryptedNote);

      // Add to state
      setNotes(prev => [newNote, ...prev]);

      // If online, try to sync immediately to Appwrite
      if (isOnline) {
        try {
          const noteData = {
            type: newNote.type,
            title: newNote.title,
            content: JSON.stringify(encryptedContent),
            userId: user.id,
            createdAt: now,
            updatedAt: now,
            syncStatus: NOTE_SYNC_STATUS.SYNCED
          };

          await appwriteService.createDocument(noteId, noteData);
          
          // Update local note as synced
          const syncedNote = { ...newNote, syncStatus: NOTE_SYNC_STATUS.SYNCED };
          await storageService.saveNote(user.id, {
            ...syncedNote,
            content: encryptedContent
          });
          
          // Update state
          setNotes(prev => prev.map(note => 
            note.id === noteId ? syncedNote : note
          ));

        } catch (syncError) {
          console.error('Failed to sync new note immediately:', syncError);
          // Note will remain as pending and sync later
          debouncedSync();
        }
      } else {
        // Offline - will sync when online
        console.log('Created note offline, will sync when online');
      }

      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw new Error('Failed to create note');
    }
  };

  // Update an existing note
  const updateNote = async (noteId, updates) => {
    if (!user || !encryptionKey) {
      throw new Error('User must be authenticated to update notes');
    }

    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: NOTE_SYNC_STATUS.PENDING
    };

    try {
      // Encrypt content
      const encryptedContent = await encryptData(updatedNote.content, encryptionKey);
      
      // Save to local storage first
      const encryptedNote = {
        ...updatedNote,
        content: encryptedContent
      };
      await storageService.saveNote(user.id, encryptedNote);

      // Update state
      setNotes(prev => {
        const newNotes = [...prev];
        newNotes[noteIndex] = updatedNote;
        return newNotes;
      });

      // If online, try to sync immediately to Appwrite
      if (isOnline) {
        try {
          const noteData = {
            type: updatedNote.type,
            title: updatedNote.title,
            content: JSON.stringify(encryptedContent),
            userId: user.id,
            createdAt: updatedNote.createdAt,
            updatedAt: updatedNote.updatedAt,
            syncStatus: NOTE_SYNC_STATUS.SYNCED
          };

          await appwriteService.updateDocument(noteId, noteData);
          
          // Update local note as synced
          const syncedNote = { ...updatedNote, syncStatus: NOTE_SYNC_STATUS.SYNCED };
          await storageService.saveNote(user.id, {
            ...syncedNote,
            content: encryptedContent
          });
          
          // Update state
          setNotes(prev => prev.map(note => 
            note.id === noteId ? syncedNote : note
          ));

        } catch (syncError) {
          console.error('Failed to sync updated note immediately:', syncError);
          // Note will remain as pending and sync later
          debouncedSync();
        }
      } else {
        // Offline - will sync when online
        console.log('Updated note offline, will sync when online');
      }

      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw new Error('Failed to update note');
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    if (!user) {
      throw new Error('User must be authenticated to delete notes');
    }

    try {
      // Remove from local storage
      await storageService.deleteNote(user.id, noteId);

      // Remove from state
      setNotes(prev => prev.filter(note => note.id !== noteId));

      // If online, delete from Appwrite immediately
      if (isOnline) {
        try {
          await appwriteService.deleteDocument(noteId);
          console.log('Note deleted from server');
        } catch (syncError) {
          console.error('Failed to delete note from server:', syncError);
          // Note is already deleted locally, so this is not critical
        }
      } else {
        console.log('Note deleted offline, will sync deletion when online');
        // Note: You might want to implement a deletion queue for offline deletions
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw new Error('Failed to delete note');
    }
  };

  // Search functionality
  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      (typeof note.content === 'string' && note.content.toLowerCase().includes(searchLower))
    );
  });

  // Statistics
  const stats = {
    total: notes.length,
    offline: notes.filter(note => note.syncStatus === NOTE_SYNC_STATUS.PENDING).length,
    synced: notes.filter(note => note.syncStatus === NOTE_SYNC_STATUS.SYNCED).length
  };

  const value = {
    // State
    notes,
    loading,
    error,
    syncStatus,
    isOnline,
    searchTerm,
    filteredNotes,
    stats,
    
    // Constants
    SYNC_STATUS,
    NOTE_SYNC_STATUS,
    
    // Actions
    createNote,
    updateNote,
    deleteNote,
    setSearchTerm,
    loadNotes,
    syncNotes: debouncedSync
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};