import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { motion } from 'motion/react';

const TextNote = ({ 
  note, 
  onSave, 
  onCancel, 
  autoFocus = false,
  className = ""
}) => {
  const { updateNote, createNote } = useNotes();
  
  // Local state for editing
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content?.text || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [noteId, setNoteId] = useState(note?.id || null);
  
  // Refs for auto-focus and debouncing
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const initialDataRef = useRef({ title: note?.title || '', content: note?.content?.text || '' });

  // Keep local noteId in sync when parent provides a saved note
  useEffect(() => {
    if (note?.id && note?.id !== noteId) {
      setNoteId(note.id);
      initialDataRef.current = {
        title: note.title || '',
        content: note.content?.text || '',
      };
    }
  }, [note, noteId]);

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && titleRef.current) {
      titleRef.current.focus();
    }
  }, [autoFocus]);

  // Track changes
  useEffect(() => {
    const hasContentChanges = content !== initialDataRef.current.content;
    const hasTitleChanges = title !== initialDataRef.current.title;
    setHasChanges(hasContentChanges || hasTitleChanges);
  }, [title, content]);

  // Debounced auto-save function
  const debouncedSave = useCallback(async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);

      let savedNote;

      if (!noteId) {
        // Create a new note the first time user types
        savedNote = await createNote('text', { text: content }, title.trim());
        setNoteId(savedNote.id);
      } else {
        // Update existing note
        savedNote = await updateNote(noteId, {
          title: title.trim(),
          content: { text: content },
        });
      }

      // Update initial data reference
      initialDataRef.current = { 
        title: title.trim(), 
        content: content 
      };
      
      setHasChanges(false);
      onSave?.(savedNote);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Note: Error handling is managed by NotesContext
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, title, content, noteId, createNote, updateNote, onSave]);

  // Auto-save with debouncing - reduced delay for instant sync
  useEffect(() => {
    if (!hasChanges) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (500ms delay for instant feel)
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 500);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasChanges, debouncedSave, note]);

  // Auto-save on blur/focus loss for instant sync
  const handleBlur = useCallback(() => {
    if (hasChanges) {
      // Clear timeout and save immediately
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      debouncedSave();
    }
  }, [hasChanges, note, debouncedSave]);

  // Manual save function
  const handleSave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await debouncedSave();
  }, [debouncedSave]);

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle content change
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    
    // Escape to cancel (if onCancel is provided)
    if (e.key === 'Escape' && onCancel) {
      e.preventDefault();
      onCancel();
    }
  };

  // Auto-resize textarea
  const handleTextareaResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  // Handle content textarea ref and auto-resize
  const contentRefCallback = useCallback((node) => {
    contentRef.current = node;
    if (node) {
      handleTextareaResize(node);
    }
  }, []);

  // Auto-resize on content change
  useEffect(() => {
    if (contentRef.current) {
      handleTextareaResize(contentRef.current);
    }
  }, [content]);

  // Listen for force save events (page visibility change, etc.)
  useEffect(() => {
    const handleForceSave = () => {
          if (hasChanges) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        debouncedSave();
      }
    };

    window.addEventListener('force-save-notes', handleForceSave);
    
    return () => {
      window.removeEventListener('force-save-notes', handleForceSave);
    };
  }, [hasChanges, note, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`text-note-editor ${className}`} 
      onKeyDown={handleKeyDown}
    >
      {/* Title input */}
      <motion.div 
        className="mb-6 relative"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          placeholder="Note title..."
          className="w-full text-xl font-semibold text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border border-[var(--border-primary)] outline-none bg-[var(--bg-tertiary)] resize-none p-3 rounded-lg focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
          data-testid="text-note-title"
        />
      </motion.div>

      {/* Content textarea */}
      <motion.div 
        className="flex-1 relative"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <textarea
          ref={contentRefCallback}
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          placeholder="Start writing your note..."
          className="w-full text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border border-[var(--border-primary)] outline-none bg-[var(--bg-tertiary)] resize-none min-h-[200px] leading-relaxed p-4 rounded-lg focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
          data-testid="text-note-content"
        />
      </motion.div>

      {/* Status indicator */}
      <div className="flex items-center justify-between mt-4 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center space-x-2">
          {isSaving && (
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 border border-[var(--border-primary)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
              <span>Saving...</span>
            </span>
          )}
          {hasChanges && !isSaving && (
            <span className="text-[var(--warning)]">
              Unsaved changes
            </span>
          )}
          {!hasChanges && !isSaving && noteId && (
            <span className="text-[var(--success)]">
              Saved
            </span>
          )}
        </div>
        
        <div className="text-xs text-[var(--text-tertiary)]">
          {content.length} characters
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-[var(--text-tertiary)]">
        <span>Ctrl+S to save</span>
        {onCancel && <span className="ml-4">Esc to cancel</span>}
      </div>
    </motion.div>
  );
};

export default TextNote;