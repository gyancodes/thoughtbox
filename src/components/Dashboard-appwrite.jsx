import { useState, useEffect } from 'react';
import { appwriteConfig } from '../lib/appwrite';
import { NotesProvider, useNotes } from '../contexts/NotesContext';
import { NoteGrid, NoteEditor, CreateNoteButton } from './notes';
import SearchBar from './SearchBar';
import SyncIndicator from './SyncIndicator';
import OfflineIndicator from './OfflineIndicator';
import ConflictResolutionModal from './ConflictResolutionModal';
import Documentation from './Documentation';

const Dashboard = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTypeToCreate, setNoteTypeToCreate] = useState('text');
  const [showDocumentation, setShowDocumentation] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await onLogout(); // This will call the AuthContext logout method
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Note handling functions
  const handleCreateNote = (type = 'text') => {
    setEditingNote(null);
    setNoteTypeToCreate(type);
    setIsNoteEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteTypeToCreate(note.type);
    setIsNoteEditorOpen(true);
  };

  const handleCloseNoteEditor = () => {
    setIsNoteEditorOpen(false);
    setEditingNote(null);
    setNoteTypeToCreate('text');
  };

  const handleDeleteNote = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title || 'Untitled'}"?`)) {
      // The actual deletion will be handled by the NoteGrid component using NotesContext
      console.log('Delete note confirmed:', note.id);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + N to create new text note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateNote('text');
      }
      
      // Ctrl/Cmd + Shift + T to create todo note
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        handleCreateNote('todo');
      }
      
      // Ctrl/Cmd + Shift + M to create timetable note
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        handleCreateNote('timetable');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NotesProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover-lift">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-lg font-medium text-gray-900">ThoughtBox</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sync and Offline Indicators */}
              <div className="flex items-center space-x-2">
                <SyncIndicator size="sm" />
                <OfflineIndicator size="sm" />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDocumentation(true)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors hover-lift"
                  title="Documentation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </button>
                
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover-lift">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">{user?.name || 'User'}</span>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors hover-lift"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-12 hero-content">
          <h2 className="text-3xl font-light text-gray-900 mb-3 leading-tight text-balance">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-gray-600 text-lg">Ready to capture your thoughts securely?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button 
            onClick={() => handleCreateNote('text')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200 group hover:border-gray-200 card-hover"
          >
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors hover-lift">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-lg mb-1">New Text Note</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Quick thoughts and ideas</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleCreateNote('todo')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200 group hover:border-gray-200 card-hover"
          >
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors hover-lift">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-lg mb-1">Todo List</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Track your tasks</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleCreateNote('timetable')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200 group hover:border-gray-200 card-hover"
          >
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors hover-lift">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-lg mb-1">Timetable</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Schedule your day</p>
              </div>
            </div>
          </button>
        </div>

        {/* Notes Section */}
        <DashboardContent 
          onCreateNote={handleCreateNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />

        {/* Note Editor Modal */}
        <NoteEditor
          isOpen={isNoteEditorOpen}
          onClose={handleCloseNoteEditor}
          note={editingNote}
          initialType={noteTypeToCreate}
        />

        {/* Floating Create Button */}
        <CreateNoteButton 
          onCreateNote={handleCreateNote}
          variant="floating"
        />

        {/* Keyboard shortcuts hint */}
        <div className="fixed bottom-6 left-6 z-30 bg-white rounded-lg shadow-sm border border-gray-200 p-3 text-xs text-gray-500 max-w-xs">
          <div className="font-medium text-gray-700 mb-1">Keyboard Shortcuts</div>
          <div>Ctrl+N - New text note</div>
          <div>Ctrl+Shift+T - New todo</div>
          <div>Ctrl+Shift+M - New timetable</div>
        </div>
      </main>
      </div>
    </NotesProvider>
  );
};

// Dashboard content component that uses the NotesProvider
const DashboardContent = ({ onCreateNote, onEditNote, onDeleteNote }) => {
  const { 
    notes, 
    loading, 
    error, 
    deleteNote, 
    searchNotes, 
    getCloudNote, 
    forceSyncAll, 
    retryFailedSync,
    NOTE_SYNC_STATUS 
  } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ results: [], query: '', totalResults: 0 });
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictNote, setConflictNote] = useState(null);
  const [cloudNote, setCloudNote] = useState(null);

  const handleDeleteNote = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title || 'Untitled'}"?`)) {
      try {
        await deleteNote(note.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = searchNotes(query);
    setSearchResults(results);
  };

  // Handle conflict resolution
  const handleConflictResolution = async (note) => {
    try {
      setConflictNote(note);
      setCloudNote(null);
      setConflictModalOpen(true);
      
      // Fetch cloud version
      const cloudVersion = await getCloudNote(note.id);
      setCloudNote(cloudVersion);
    } catch (error) {
      console.error('Failed to fetch cloud note for conflict resolution:', error);
    }
  };

  const handleCloseConflictModal = () => {
    setConflictModalOpen(false);
    setConflictNote(null);
    setCloudNote(null);
  };

  // Handle sync actions
  const handleForceSyncAll = async () => {
    try {
      await forceSyncAll();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  const handleRetryFailedSync = async () => {
    try {
      await retryFailedSync();
    } catch (error) {
      console.error('Retry failed sync error:', error);
    }
  };

  // Get notes to display (search results or all notes)
  const displayNotes = searchQuery ? searchResults.results : notes;
  const isSearching = searchQuery.length > 0;

  // Count notes by sync status for action buttons
  const syncStats = notes.reduce((acc, note) => {
    acc[note.syncStatus] = (acc[note.syncStatus] || 0) + 1;
    return acc;
  }, {});

  const hasConflicts = syncStats[NOTE_SYNC_STATUS.CONFLICT] > 0;
  const hasErrors = syncStats[NOTE_SYNC_STATUS.ERROR] > 0;
  const hasPending = syncStats[NOTE_SYNC_STATUS.PENDING] > 0;

  if (!appwriteConfig.hasDatabaseConfig) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 card-hover">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-medium text-gray-900">Your Notes</h3>
        </div>

        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 hover-lift">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h4 className="text-xl font-medium text-gray-900 mb-3">Database not configured</h4>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-lg mx-auto text-balance">
            To store notes, you need to set up a database in Appwrite.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left max-w-lg mx-auto card-hover">
            <h5 className="font-medium text-blue-900 mb-3 text-lg">Quick Setup:</h5>
            <ol className="text-sm text-blue-800 space-y-2 leading-relaxed">
              <li className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium flex-shrink-0">1</span>
                <span>Create a database in your Appwrite console</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium flex-shrink-0">2</span>
                <span>Create a "notes" collection</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium flex-shrink-0">3</span>
                <span>Add the IDs to your .env file</span>
              </li>
            </ol>
            <p className="text-xs text-blue-600 mt-4 font-medium">
              See SETUP.md for detailed instructions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-medium text-gray-900">Your Notes</h3>
          <div className="flex items-center space-x-2">
            <SyncIndicator size="md" />
            <OfflineIndicator size="md" />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Sync Action Buttons */}
          {hasConflicts && (
            <button
              onClick={() => {
                const conflictNote = notes.find(note => note.syncStatus === NOTE_SYNC_STATUS.CONFLICT);
                if (conflictNote) handleConflictResolution(conflictNote);
              }}
              className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Resolve Conflicts ({syncStats[NOTE_SYNC_STATUS.CONFLICT]})</span>
            </button>
          )}
          
          {hasErrors && (
            <button
              onClick={handleRetryFailedSync}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retry Failed ({syncStats[NOTE_SYNC_STATUS.ERROR]})</span>
            </button>
          )}
          
          {(hasPending || hasErrors) && (
            <button
              onClick={handleForceSyncAll}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Force Sync All</span>
            </button>
          )}
          
          <CreateNoteButton 
            onCreateNote={onCreateNote}
            variant="inline"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search your notes..."
          className="w-full"
          showResultsCount={true}
          resultsCount={searchResults.totalResults}
          totalNotes={notes.length}
          isSearching={loading && searchQuery.length > 0}
        />
      </div>

      {/* Search Results Info */}
      {isSearching && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {searchResults.totalResults === 0 
              ? `No results found for "${searchQuery}"`
              : `${searchResults.totalResults} result${searchResults.totalResults !== 1 ? 's' : ''} found for "${searchQuery}"`
            }
          </p>
          {searchResults.totalResults > 0 && (
            <button
              onClick={() => handleSearch('')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <NoteGrid
        notes={displayNotes}
        loading={loading}
        onNoteClick={onEditNote}
        onNoteEdit={onEditNote}
        onNoteDelete={handleDeleteNote}
        onConflictResolve={handleConflictResolution}
        searchQuery={searchQuery}
        emptyMessage={
          isSearching 
            ? `No notes found matching "${searchQuery}". Try a different search term.`
            : "No notes yet. Create your first encrypted note to get started with secure note-taking!"
        }
      />

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={conflictModalOpen}
        onClose={handleCloseConflictModal}
        conflictNote={conflictNote}
        cloudNote={cloudNote}
      />
    </div>
  );
};

export default Dashboard;