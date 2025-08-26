import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../contexts/ClerkAuthContext';
import { useNotes } from '../contexts/NotesContext';
import { NoteGrid, NoteEditor, CreateNoteButton } from './notes';
import SearchBar from './SearchBar';
import SyncIndicator from './SyncIndicator';
import OfflineIndicator from './OfflineIndicator';
import ConflictResolutionModal from './ConflictResolutionModal';
import Documentation from './Documentation';

const Dashboard = () => {
  const { user } = useUser();
  const { isLoading } = useClerkAuth();
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTypeToCreate, setNoteTypeToCreate] = useState('text');
  const [showDocumentation, setShowDocumentation] = useState(false);

  // Note handling functions
  const handleCreateNote = (type = 'text') => {
    setNoteTypeToCreate(type);
    setEditingNote(null);
    setIsNoteEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsNoteEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsNoteEditorOpen(false);
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your secure workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">ThoughtBox</h1>
              </div>
              
              <div className="hidden sm:block">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <OfflineIndicator />
              <SyncIndicator />
              
              <Link
                to="/docs"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Docs
              </Link>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
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

          {/* Mobile Search */}
          <div className="sm:hidden pb-4">
            <SearchBar />
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
          note={editingNote}
          noteType={noteTypeToCreate}
          onClose={handleCloseEditor}
        />
      )}

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal />

      {/* Documentation Modal */}
      {showDocumentation && (
        <Documentation onClose={() => setShowDocumentation(false)} />
      )}
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ onCreateNote, onEditNote }) => {
  const { 
    notes, 
    loading, 
    error, 
    searchTerm, 
    filteredNotes,
    stats 
  } = useNotes();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Notes</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{stats.total}</span> notes
          </div>
          {stats.offline > 0 && (
            <div className="text-sm text-orange-600">
              <span className="font-medium">{stats.offline}</span> pending sync
            </div>
          )}
          {searchTerm && (
            <div className="text-sm text-blue-600">
              <span className="font-medium">{filteredNotes.length}</span> results for "{searchTerm}"
            </div>
          )}
        </div>
        
        <CreateNoteButton onCreateNote={onCreateNote} />
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-6">Create your first encrypted note to get started.</p>
          <CreateNoteButton onCreateNote={onCreateNote} />
        </div>
      ) : (
        <NoteGrid 
          notes={searchTerm ? filteredNotes : notes}
          onEditNote={onEditNote}
        />
      )}
    </div>
  );
};

export default Dashboard;