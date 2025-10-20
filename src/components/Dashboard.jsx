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

          {/* Mobile Search - Google Keep has search in header on mobile too */}
          <div className="sm:hidden pb-2">
            <div className="flex justify-center">
              <button
                className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/20"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm">Documentation</span>
              </a>
              <a
                href="https://github.com/your-username/thoughtbox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
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
    toast((t) => (
      <div className="flex items-center justify-between p-3">
        <p className="text-sm">Delete note?</p>
        <div className="flex space-x-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-sm text-[var(--accent-primary)]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteNote(note.id);
            }}
            className="text-sm text-[var(--accent-primary)]"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
      },
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
      <div className="max-w-xl mx-auto mb-8">
        <div 
          onClick={() => onCreateNote('text')}
          className="bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)]/30 rounded-lg p-3 cursor-pointer shadow-sm transition-all duration-200"
        >
          <div className="flex items-center text-[var(--text-secondary)]">
            <input 
              type="text" 
              placeholder="Take a note..." 
              className="bg-transparent border-none outline-none w-full text-[var(--text-primary)]"
              onClick={(e) => {
                e.preventDefault();
                onCreateNote('text');
              }}
              readOnly
            />
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-[var(--bg-tertiary)]/20" title="New list">
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-[var(--bg-tertiary)]/20" title="New note with image">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-max">
            <NoteGrid 
              notes={filteredNotes} 
              onEditNote={onEditNote} 
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;