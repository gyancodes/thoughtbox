import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useClerkAuth } from './ClerkAuthContext';

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

  // API base URL - you'll need to set this up
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Generate unique ID for new notes
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Fetch notes from Postgres/Neon database
  const loadNotes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const fetchedNotes = await response.json();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [user, API_BASE_URL]);

  // Load notes when user authenticates
  useEffect(() => {
    if (user && !isLoading) {
      loadNotes();
    } else if (!user) {
      setNotes([]);
      setError(null);
    }
  }, [user, isLoading, loadNotes]);

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
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Note`,
      content,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Optimistically add to state
      setNotes(prev => [newNote, ...prev]);

      // Save to database
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const savedNote = await response.json();
      
      // Update state with server response
      setNotes(prev => prev.map(note => 
        note.id === noteId ? savedNote : note
      ));

      return savedNote;
    } catch (error) {
      // Remove from state if save failed
      setNotes(prev => prev.filter(note => note.id !== noteId));
      console.error('Failed to create note:', error);
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
      setNotes(prev => {
        const newNotes = [...prev];
        newNotes[noteIndex] = updatedNote;
        return newNotes;
      });

      // Save to database
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const savedNote = await response.json();
      
      // Update state with server response
      setNotes(prev => prev.map(note => 
        note.id === noteId ? savedNote : note
      ));

      return savedNote;
    } catch (error) {
      // Revert optimistic update
      setNotes(prev => {
        const newNotes = [...prev];
        newNotes[noteIndex] = notes[noteIndex];
        return newNotes;
      });
      console.error('Failed to update note:', error);
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
      setNotes(prev => prev.filter(note => note.id !== noteId));

      // Delete from database
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      // Restore note if delete failed
      setNotes(prev => [noteToDelete, ...prev]);
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
      (typeof note.content === 'string' && note.content.toLowerCase().includes(searchLower)) ||
      (typeof note.content === 'object' && JSON.stringify(note.content).toLowerCase().includes(searchLower))
    );
  });

  // Statistics
  const stats = {
    total: notes.length,
  };

  const value = {
    // State
    notes,
    loading,
    error,
    searchTerm,
    filteredNotes,
    stats,
    
    // Actions
    createNote,
    updateNote,
    deleteNote,
    setSearchTerm,
    loadNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};