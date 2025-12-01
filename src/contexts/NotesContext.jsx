import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useClerkAuth } from './ClerkAuthContext';
import toast from 'react-hot-toast';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const { user, isLoading } = useClerkAuth();
  
  // Core state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // API configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  
  // Use localStorage as fallback if API is not available
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Generate unique ID for new notes
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Available note colors (Google Keep style)
  const noteColors = [
    '#ffffff', // Default white
    '#f28b82', // Red
    '#fbbc04', // Yellow
    '#fff475', // Light yellow
    '#ccff90', // Light green
    '#a7ffeb', // Teal
    '#cbf0f8', // Light blue
    '#aecbfa', // Blue
    '#d7aefb', // Purple
    '#fdcfe8', // Pink
    '#e6c9a8', // Brown
    '#e8eaed'  // Gray
  ];

  // Get random color for new notes
  const getRandomColor = () => {
    return noteColors[Math.floor(Math.random() * noteColors.length)];
  };

  // Get localStorage key for user's notes
  const getStorageKey = () => {
    return user ? `thoughtbox_notes_${user.id}` : 'thoughtbox_notes_guest';
  };

  // Load notes from localStorage
  const loadNotesFromStorage = useCallback(() => {
    if (!user) return;

    try {
      const storageKey = getStorageKey();
      const storedNotes = localStorage.getItem(storageKey);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
      setError('Failed to load notes from local storage');
    }
  }, [user]);

  // Save notes to localStorage
  const saveNotesToStorage = useCallback((notesToSave) => {
    if (!user) return;

    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    }
  }, [user]);

  // Check if API is available
  const checkApiHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }, [API_BASE_URL]);

  // Fetch notes from API or localStorage
  const loadNotes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Check if we should use API or localStorage
    if (useLocalStorage) {
      loadNotesFromStorage();
      setLoading(false);
      return;
    }

    try {
      // For development, we'll use a simple fetch without auth token
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fetchedNotes = await response.json();

      // Also load any local notes and merge them in (without duplicates)
      let mergedNotes = fetchedNotes;
      try {
        const storageKey = getStorageKey();
        const storedNotesRaw = localStorage.getItem(storageKey);
        if (storedNotesRaw) {
          const storedNotes = JSON.parse(storedNotesRaw);
          const existingIds = new Set(fetchedNotes.map((n) => n.id));
          const localOnly = storedNotes.filter((n) => !existingIds.has(n.id));
          mergedNotes = [...localOnly, ...fetchedNotes];
        }
      } catch (storageError) {
        console.error('Failed to merge local notes:', storageError);
      }

      setNotes(mergedNotes);
      console.log('✅ Loaded notes from API:', fetchedNotes.length, 'server notes; total after merge:', mergedNotes.length);
    } catch (error) {
      console.error('Failed to load notes from API:', error);
      setError('Failed to load notes from server - using local storage as fallback');
      toast.error('Failed to load notes from server, using local storage');
      setUseLocalStorage(true);
      loadNotesFromStorage();
    } finally {
      setLoading(false);
    }
  }, [user, API_BASE_URL, useLocalStorage, loadNotesFromStorage]);

  // Check API availability on mount
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const apiAvailable = await checkApiHealth();
        setUseLocalStorage(!apiAvailable);
        
        if (apiAvailable) {
          console.log('✅ API is available - using server storage');
        } else {
          console.log('📱 API not available - using local storage');
        }
      } catch (error) {
        console.log('📱 API check failed - using local storage');
        setUseLocalStorage(true);
      }
    };

    initializeStorage();
  }, [checkApiHealth]);

  // Load notes when user authenticates
  useEffect(() => {
    if (user && !isLoading) {
      loadNotes();
    } else if (!user) {
      setNotes([]);
      setError(null);
    }
  }, [user, isLoading, loadNotes]);

  // Auto-save on page visibility change (when user switches tabs or minimizes window)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is now hidden, trigger any pending saves
        window.dispatchEvent(new CustomEvent('force-save-notes'));
      }
    };

    const handleBeforeUnload = () => {
      // Page is about to unload, trigger any pending saves
      window.dispatchEvent(new CustomEvent('force-save-notes'));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Create a new note
  const createNote = async (type, content, title = '') => {
    if (!user) {
      throw new Error('User must be authenticated to create notes');
    }

    const noteId = generateId();
    const now = new Date().toISOString();

    const newNote = {
      id: noteId,
      type,
      title: title || '',
      content,
      color: getRandomColor(),
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Optimistically add to state
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);

      if (useLocalStorage) {
        // Save to localStorage
        saveNotesToStorage(updatedNotes);
        return newNote;
      } else {
        // Save to API
        const response = await fetch(`${API_BASE_URL}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const savedNote = await response.json();
        
        // Update state with server response
        setNotes(prev => prev.map(note => 
          note.id === noteId ? savedNote : note
        ));

        toast.success('Note created successfully');
        return savedNote;
      }
    } catch (error) {
      // Remove from state if save failed
      setNotes(prev => prev.filter(note => note.id !== noteId));
      console.error('Failed to create note:', error);
      toast.error('Failed to create note');
      throw new Error('Failed to create note');
    }
  };

  // Update an existing note
  const updateNote = async (noteId, updates) => {
    if (!user) {
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
    };

    try {
      // Optimistically update state
      const newNotes = [...notes];
      newNotes[noteIndex] = updatedNote;
      setNotes(newNotes);

      if (useLocalStorage) {
        // Save to localStorage
        saveNotesToStorage(newNotes);
        return updatedNote;
      } else {
        // Save to API
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedNote),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const savedNote = await response.json();
        
        // Update state with server response
        setNotes(prev => prev.map(note => 
          note.id === noteId ? savedNote : note
        ));

        toast.success('Note updated successfully');
        return savedNote;
      }
    } catch (error) {
      // Revert optimistic update
      const revertedNotes = [...notes];
      revertedNotes[noteIndex] = notes[noteIndex];
      setNotes(revertedNotes);
      console.error('Failed to update note:', error);
      toast.error('Failed to update note');
      throw new Error('Failed to update note');
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    if (!user) {
      throw new Error('User must be authenticated to delete notes');
    }

    const noteToDelete = notes.find(note => note.id === noteId);
    if (!noteToDelete) {
      throw new Error('Note not found');
    }

    try {
      // Optimistically remove from state
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);

      // Always update localStorage mirror so local notes stay in sync
      saveNotesToStorage(updatedNotes);

      if (!useLocalStorage) {
        // Delete from API when using server storage
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Treat 404 as success for local-only notes that don't exist on the server
        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      toast.success('Note deleted successfully');
    } catch (error) {
      // Restore note if delete failed in a real way
      setNotes(prev => [noteToDelete, ...prev]);
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
      throw new Error('Failed to delete note');
    }
  };

  // Search functionality
  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      (typeof note.content === 'string' && note.content.toLowerCase().includes(searchLower)) ||
      (typeof note.content === 'object' && JSON.stringify(note.content).toLowerCase().includes(searchLower))
    );
  });

  // Statistics
  const stats = {
    total: notes.length,
  };

  // Switch storage mode
  const switchStorageMode = async () => {
    const apiAvailable = await checkApiHealth();
    setUseLocalStorage(!apiAvailable);
    
    if (apiAvailable && useLocalStorage) {
      // Switching from localStorage to API - sync data
      console.log('🔄 Switching to API storage...');
      await loadNotes();
    } else if (!apiAvailable && !useLocalStorage) {
      // API became unavailable - switch to localStorage
      console.log('📱 API unavailable - switching to local storage...');
      setUseLocalStorage(true);
      loadNotesFromStorage();
    }
  };

  const value = {
    // State
    notes,
    loading,
    error,
    searchTerm,
    filteredNotes,
    stats,
    useLocalStorage,
    
    // Actions
    createNote,
    updateNote,
    deleteNote,
    setSearchTerm,
    loadNotes,
    switchStorageMode,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};