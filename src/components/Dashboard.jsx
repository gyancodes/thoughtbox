import { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useClerkAuth } from '../contexts/ClerkAuthContext';
import { useNotes } from '../contexts/NotesContext';
import { useTheme } from '../contexts/ThemeContext';
import { NoteGrid, NoteEditor, CreateNoteButton } from './notes';
import SearchBar from './SearchBar';
import toast from 'react-hot-toast';
import { 
  SunIcon, 
  MoonIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ListBulletIcon,
  CalendarIcon,
  Squares2X2Icon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
  
const Dashboard = () => {
  const { isLoading } = useClerkAuth();
  const { setSearchTerm } = useNotes();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTypeToCreate, setNoteTypeToCreate] = useState('text');

  // Note handling functions
  const handleCreateNote = (type = 'text') => {
    console.log('Creating note of type:', type);
    setNoteTypeToCreate(type);
    setEditingNote(null);
    setIsNoteEditorOpen(true);
  };

  const handleEditNote = (note) => {
    console.log('Editing note:', note);
    if (!note) {
      console.error('No note provided to edit');
      return;
    }
    setEditingNote(note);
    setNoteTypeToCreate(note.type || 'text');
    setIsNoteEditorOpen(true);
  };

  const handleCloseEditor = () => {
    console.log('Closing editor');
    setIsNoteEditorOpen(false);
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading your secure workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Minimal Google Keep-like Header */}
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center flex-1">
              <div className="flex items-center mr-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-lg font-normal text-[var(--text-primary)]">ThoughtBox</h1>
              </div>
              
              <div className="flex-1 max-w-2xl">
                <SearchBar onSearch={setSearchTerm} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Simple Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/20"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              <button
                className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/20 hidden sm:block"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              <div className="ml-2">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobile search – keep things clean and focused */}
          <div className="sm:hidden pb-3">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>
      </header>

      {/* Google Keep-like Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <DashboardContent 
          onCreateNote={handleCreateNote}
          onEditNote={handleEditNote}
        />
      </main>

      {/* Note Editor Modal */}
      {isNoteEditorOpen && (
        <NoteEditor
          isOpen={isNoteEditorOpen}
          note={editingNote}
          initialType={noteTypeToCreate}
          onClose={handleCloseEditor}
        />
      )}




    </div>
  );
};

// Dashboard Content Component - Google Keep Style
const DashboardContent = ({ onCreateNote, onEditNote }) => {
  const { 
    notes, 
    loading, 
    error, 
    searchTerm,
    filteredNotes,
    deleteNote
  } = useNotes();

  const handleDeleteNote = async (note) => {
    if (!note) return;

    toast((t) => (
      <div className="delete-toast-content">
        <div className="delete-toast-text">
          <p className="delete-toast-title">Delete this note?</p>
          <p className="delete-toast-subtitle">
            “{note.title || 'Untitled note'}” will be permanently removed.
          </p>
        </div>
        <div className="delete-toast-buttons">
          <button
            type="button"
            className="delete-toast-cancel-btn"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-toast-delete-btn"
            onClick={() => {
              deleteNote(note.id);
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--text-primary)] mx-auto mb-3"></div>
          <p className="text-sm text-[var(--text-secondary)]">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-tertiary)]/20 rounded-lg p-4 text-center">
        <svg className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Google Keep-like Quick Note Input */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          type="button"
          onClick={() => onCreateNote('text')}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)]/60 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-[var(--border-primary)] transition-all duration-150 flex items-center gap-3 text-left"
        >
          <span className="flex-1 text-sm text-[var(--text-secondary)]">
            Take a note...
          </span>
          <span className="flex items-center gap-2 text-[var(--text-tertiary)]">
            <ListBulletIcon className="w-4 h-4 hidden sm:inline" />
            <PlusIcon className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Notes Masonry Grid */}
      <div>
        {filteredNotes.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-[var(--bg-tertiary)]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] mb-2">Notes you add appear here</p>
            <button 
              onClick={() => onCreateNote('text')}
              className="text-[var(--accent-primary)] text-sm font-medium"
            >
              Create your first note
            </button>
          </div>
        )}

        {filteredNotes.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">No notes match your search</p>
          </div>
        )}

        {filteredNotes.length > 0 && (
          <NoteGrid 
            notes={filteredNotes}
            onNoteClick={onEditNote}
            onNoteEdit={onEditNote}
            onNoteDelete={handleDeleteNote}
            onCreateNote={onCreateNote}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;