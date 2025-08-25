import { useState, useEffect, useCallback, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNotes } from '../../contexts/NotesContext';
import TextNote from './TextNote';
import TodoNote from './TodoNote';
import TimetableNote from './TimetableNote';

const NoteEditor = ({ 
  isOpen, 
  onClose, 
  note = null, 
  initialType = 'text',
  className = "" 
}) => {
  const { createNote } = useNotes();
  
  // Local state
  const [currentNote, setCurrentNote] = useState(note);
  const [noteType, setNoteType] = useState(note?.type || initialType);
  const [isCreating, setIsCreating] = useState(!note);
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs for focus management
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Reset state when modal opens/closes or note changes
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      setCurrentNote(note);
      setNoteType(note?.type || initialType);
      setIsCreating(!note);
      
      // Focus the modal after a short delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, note, initialType]);

  // Separate effect for creating new notes
  useEffect(() => {
    if (isOpen && !note && !currentNote && !isSaving) {
      // Create note immediately when opening modal for new note
      const createInitialNote = async () => {
        try {
          setIsSaving(true);
          
          // Create initial content based on type
          let initialContent;
          switch (initialType) {
            case 'text':
              initialContent = { text: '' };
              break;
            case 'todo':
              initialContent = { items: [] };
              break;
            case 'timetable':
              initialContent = { entries: [] };
              break;
            default:
              initialContent = { text: '' };
          }

          const newNote = await createNote(initialType, initialContent, 'New Note');
          setCurrentNote(newNote);
          setIsCreating(false);
        } catch (error) {
          console.error('Failed to create note:', error);
        } finally {
          setIsSaving(false);
        }
      };

      createInitialNote();
    }
  }, [isOpen, note, currentNote, initialType, createNote, isSaving]);

  // Handle note creation for new notes
  const handleCreateNote = useCallback(async (type) => {
    try {
      setIsSaving(true);
      
      // Create initial content based on type
      let initialContent;
      switch (type) {
        case 'text':
          initialContent = { text: '' };
          break;
        case 'todo':
          initialContent = { items: [] };
          break;
        case 'timetable':
          initialContent = { entries: [] };
          break;
        default:
          initialContent = { text: '' };
      }

      const newNote = await createNote(type, initialContent, 'New Note');
      setCurrentNote(newNote);
      setIsCreating(false);
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [createNote]);

  // Handle note save
  const handleNoteSave = useCallback((updatedNote) => {
    setCurrentNote(updatedNote);
  }, []);

  // Handle note type change (only for new notes)
  const handleTypeChange = useCallback(async (newType) => {
    if (!isCreating) return; // Can't change type of existing notes
    
    setNoteType(newType);
    
    // Reset current note and create a new one with the new type
    setCurrentNote(null);
    try {
      await handleCreateNote(newType);
    } catch (error) {
      console.error('Failed to change note type:', error);
    }
  }, [isCreating, handleCreateNote]);

  // Handle modal close
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Escape to close modal
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
    
    // Ctrl/Cmd + Enter to save and close (for new notes)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isCreating && currentNote) {
        handleClose();
      }
    }
    
    // Ctrl/Cmd + N to create new note (when modal is open)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      if (!isCreating) {
        // Switch to create mode
        setCurrentNote(null);
        setIsCreating(true);
      }
    }
  }, [handleClose, isCreating, currentNote]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Render note editor based on type
  const renderNoteEditor = () => {
    // Don't render editor until we have a note (for new notes) or if we have an existing note
    if (isCreating && !currentNote) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Creating note...</p>
          </div>
        </div>
      );
    }
    
    const noteToEdit = currentNote || { type: noteType, title: '', content: {} };
    
    const commonProps = {
      note: noteToEdit,
      onSave: handleNoteSave,
      onCancel: handleClose,
      autoFocus: true,
      className: "flex-1"
    };

    switch (noteType) {
      case 'text':
        return <TextNote {...commonProps} />;
      case 'todo':
        return <TodoNote {...commonProps} />;
      case 'timetable':
        return <TimetableNote {...commonProps} />;
      default:
        return <TextNote {...commonProps} />;
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${className}`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-editor-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 id="note-editor-title" className="text-xl font-semibold text-gray-900">
              {isCreating ? 'Create Note' : 'Edit Note'}
            </h2>
            
            {/* Note type selector (only for new notes) */}
            {isCreating && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Type:</span>
                <select
                  value={noteType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="note-type-selector"
                >
                  <option value="text">Text Note</option>
                  <option value="todo">Todo List</option>
                  <option value="timetable">Timetable</option>
                </select>
              </div>
            )}
            
            {/* Existing note type indicator */}
            {!isCreating && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md capitalize">
                {noteType}
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="note-editor-close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            {renderNoteEditor()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <div>
                {isCreating ? (
                  <span>Note will be saved automatically as you type</span>
                ) : (
                  <span>Changes are saved automatically</span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                <span>Esc to close</span>
                {isCreating && <span className="ml-4">Ctrl+Enter to save & close</span>}
                <span className="ml-4">Ctrl+N for new note</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                data-testid="note-editor-cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;