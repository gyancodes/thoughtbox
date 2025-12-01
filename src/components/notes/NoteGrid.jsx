import { useState } from 'react';
import NoteCard from './NoteCard';
import { motion } from 'framer-motion';

const NoteGrid = ({ 
  notes = [], 
  loading = false, 
  onNoteClick, 
  onNoteEdit, 
  onNoteDelete,
  onConflictResolve,
  emptyMessage = "No notes yet. Create your first note to get started!",
  className = "",
  searchQuery = "",
  onCreateNote
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index}
          className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border border-[var(--border-primary)] p-4 animate-pulse"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded flex-1"></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-3/4"></div>
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-16"></div>
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = ({ onCreateNote }) => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">No notes yet</h3>
      <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
        Start organizing your thoughts by creating your first note. You can create text notes, todo lists, or timetables.
      </p>
      <button
        onClick={() => onCreateNote('text')}
        className="inline-flex items-center space-x-2 bg-[var(--accent-primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Note</span>
      </button>
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
        <EmptyState onCreateNote={onCreateNote} />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Google Keep style responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-min">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="break-inside-avoid"
          >
            <NoteCard
              note={note}
              onClick={() => onNoteClick && onNoteClick(note)}
              onEdit={() => onNoteEdit && onNoteEdit(note)}
              onDelete={() => onNoteDelete && onNoteDelete(note)}
              onConflictResolve={onConflictResolve}
              isSelected={selectedNotes.has(note.id)}
              onSelect={() => handleNoteSelect(note.id)}
              searchQuery={searchQuery}
            />
          </motion.div>
        ))}
      </div>

      {/* Fixed selection info box */}
      {selectedNotes.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-lg px-6 py-3 flex items-center space-x-4">
            <span className="text-sm text-[var(--text-primary)]">
              {selectedNotes.size} note{selectedNotes.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedNotes(new Set())}
                className="px-3 py-1 bg-[var(--accent-primary)] text-white text-sm rounded-md hover:bg-opacity-90 transition-opacity"
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedNotes(new Set())}
                className="px-3 py-1 bg-[var(--error)] text-white text-sm rounded-md hover:bg-opacity-90 transition-opacity"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedNotes(new Set())}
                className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm rounded-md hover:bg-[var(--border-primary)] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NoteGrid;