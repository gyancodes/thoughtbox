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
        <motion.input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          placeholder="Note title..."
          className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none transition-all duration-300 focus:placeholder-gray-300 p-2 rounded-lg"
          data-testid="text-note-title"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          whileFocus={{ 
            scale: 1.02,
            background: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>

      {/* Content textarea */}
      <motion.div 
        className="flex-1 relative"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.textarea
          ref={contentRefCallback}
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          placeholder="Start writing your note..."
          className="w-full text-gray-700 placeholder-gray-400 border-none outline-none resize-none min-h-[200px] leading-relaxed transition-all duration-300 focus:placeholder-gray-300 p-4 rounded-xl"
          data-testid="text-note-content"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          whileFocus={{ 
            scale: 1.01,
            background: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>

      {/* Status indicator */}
      <motion.div 
        className="flex items-center justify-between mt-4 text-sm text-gray-500"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          {isSaving && (
            <motion.span 
              className="flex items-center space-x-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Saving...</span>
            </motion.span>
          )}
          {hasChanges && !isSaving && (
            <motion.span 
              className="text-yellow-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Unsaved changes
            </motion.span>
          )}
          {!hasChanges && !isSaving && note && (
            <motion.span 
              className="text-green-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Saved
            </motion.span>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          {content.length} characters
        </div>
      </motion.div>

      {/* Keyboard shortcuts hint */}
      <motion.div 
        className="mt-2 text-xs text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <span>Ctrl+S to save</span>
        {onCancel && <span className="ml-4">Esc to cancel</span>}
      </motion.div>
    </motion.div>
  );
};

export default TextNote;