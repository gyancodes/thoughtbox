import { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../contexts/ClerkAuthContext';
import { useNotes } from '../contexts/NotesContext';
import { NoteGrid, NoteEditor, CreateNoteButton } from './notes';
import SearchBar from './SearchBar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { isLoading } = useClerkAuth();
  const { setSearchTerm } = useNotes();
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your secure workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-lg font-medium text-black">ThoughtBox</h1>
              </div>
              
              <div className="hidden sm:block">
                <SearchBar onSearch={setSearchTerm} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-4">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

// Dashboard Content Component
const DashboardContent = ({  onEditNote }) => {
  const { 
    notes, 
    loading, 
    error, 
    searchTerm,
    filteredNotes,
    stats,
    deleteNote
  } = useNotes();

  const handleDeleteNote = async (note) => {
    toast((t) => (
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <p className="font-medium">Delete note?</p>
          <p className="text-sm text-gray-600">"{note.title || 'Untitled'}" will be permanently deleted.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteNote(note.id).catch(() => {
                // Error handling is done in NotesContext
              });
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        maxWidth: '400px',
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Notes</h3>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center space-x-6">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{stats.total}</span> notes
        </div>

        {searchTerm && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredNotes.length}</span> results for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Create Note Input - Always at top */}
      <CreateNoteButton />

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first note above.</p>
        </div>
      ) : (
        <NoteGrid 
          notes={searchTerm ? filteredNotes : notes}
          onNoteClick={onEditNote}
          onNoteEdit={onEditNote}
          onNoteDelete={handleDeleteNote}
          searchQuery={searchTerm}
        />
      )}
    </div>
  );
};

export default Dashboard;