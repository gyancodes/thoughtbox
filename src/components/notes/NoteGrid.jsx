import { useState } from 'react';
import NoteCard from './NoteCard';

const NoteGrid = ({ 
  notes = [], 
  loading = false, 
  onNoteClick, 
  onNoteEdit, 
  onNoteDelete,
  emptyMessage = "No notes yet. Create your first note to get started!",
  className = ""
}) => {
  const [selectedNotes, setSelectedNotes] = useState(new Set());

  // Handle note selection (for future bulk operations)
  const handleNoteSelect = (noteId) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId);
    } else {
      newSelected.add(noteId);
    }
    setSelectedNotes(newSelected);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded flex-1"></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg 
          className="w-12 h-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
      <p className="text-gray-500 text-center max-w-md">
        {emptyMessage}
      </p>
    </div>
  );

  // Show loading skeleton
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
      </div>
    );
  }

  // Show empty state
  if (!notes || notes.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Grid container with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={onNoteClick}
            onEdit={onNoteEdit}
            onDelete={onNoteDelete}
            isSelected={selectedNotes.has(note.id)}
            onSelect={() => handleNoteSelect(note.id)}
          />
        ))}
      </div>

      {/* Selection info (for future bulk operations) */}
      {selectedNotes.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm">
            {selectedNotes.size} note{selectedNotes.size !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setSelectedNotes(new Set())}
            className="ml-3 text-xs text-gray-300 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteGrid;