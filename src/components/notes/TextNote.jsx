import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes } from '../../contexts/NotesContext';

const TextNote = ({ 
  note, 
  onSave, 
  onCancel, 
  autoFocus = false,
  className = ""
}) => {
  const { updateNote } = useNotes();
  
  // Local state for editing
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content?.text || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Refs for auto-focus and debouncing
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const initialDataRef = useRef({ title: note?.title || '', content: note?.content?.text || '' });

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
    if (!note || !hasChanges) return;

    try {
      setIsSaving(true);
      
      const updatedNote = await updateNote(note.id, {
        title: title.trim(),
        content: { text: content }
      });

      // Update initial data reference
      initialDataRef.current = { 
        title: title.trim(), 
        content: content 
      };
      
      setHasChanges(false);
      onSave?.(updatedNote);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Note: Error handling is managed by NotesContext
    } finally {
      setIsSaving(false);
    }
  }, [note, title, content, hasChanges, updateNote, onSave]);

  // Auto-save with debouncing - reduced delay for instant sync
  useEffect(() => {
    if (!hasChanges || !note) return;

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
    if (hasChanges && note) {
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
      if (hasChanges && note) {
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
    <div className={`text-note-editor ${className}`} onKeyDown={handleKeyDown}>
      {/* Title input */}
      <div className="mb-4">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          placeholder="Note title..."
          className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none"
          data-testid="text-note-title"
        />
      </div>

      {/* Content textarea */}
      <div className="flex-1">
        <textarea
          ref={contentRefCallback}
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          placeholder="Start writing your note..."
          className="w-full text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent resize-none min-h-[200px] leading-relaxed"
          data-testid="text-note-content"
        />
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          {isSaving && (
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Saving...</span>
            </span>
          )}
          {hasChanges && !isSaving && (
            <span className="text-yellow-600">Unsaved changes</span>
          )}
          {!hasChanges && !isSaving && note && (
            <span className="text-green-600">Saved</span>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          {content.length} characters
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-gray-400">
        <span>Ctrl+S to save</span>
        {onCancel && <span className="ml-4">Esc to cancel</span>}
      </div>
    </div>
  );
};

export default TextNote;