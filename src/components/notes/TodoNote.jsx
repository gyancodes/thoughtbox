import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { createTodoItem } from '../../types/noteUtils';

const TodoNote = ({ 
  note, 
  onSave, 
  onCancel, 
  autoFocus = false,
  className = ""
}) => {
  const { updateNote } = useNotes();
  
  // Local state for editing
  const [title, setTitle] = useState(note?.title || '');
  const [items, setItems] = useState(note?.content?.items || []);
  const [newItemText, setNewItemText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Refs for auto-focus and debouncing
  const titleRef = useRef(null);
  const newItemRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const initialDataRef = useRef({ 
    title: note?.title || '', 
    items: note?.content?.items || [] 
  });

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && titleRef.current) {
      titleRef.current.focus();
    }
  }, [autoFocus]);

  // Track changes
  useEffect(() => {
    const hasContentChanges = JSON.stringify(items) !== JSON.stringify(initialDataRef.current.items);
    const hasTitleChanges = title !== initialDataRef.current.title;
    setHasChanges(hasContentChanges || hasTitleChanges);
  }, [title, items]);

  // Debounced auto-save function
  const debouncedSave = useCallback(async () => {
    if (!note || !hasChanges) return;

    try {
      setIsSaving(true);
      
      const updatedNote = await updateNote(note.id, {
        title: title.trim(),
        content: { items }
      });

      // Update initial data reference
      initialDataRef.current = { 
        title: title.trim(), 
        items: [...items] 
      };
      
      setHasChanges(false);
      onSave?.(updatedNote);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Note: Error handling is managed by NotesContext
    } finally {
      setIsSaving(false);
    }
  }, [note, title, items, hasChanges, updateNote, onSave]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!hasChanges || !note) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds delay)
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 2000);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasChanges, debouncedSave, note]);

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

  // Handle new item text change
  const handleNewItemTextChange = (e) => {
    setNewItemText(e.target.value);
  };

  // Add new todo item
  const handleAddItem = () => {
    const text = newItemText.trim();
    if (!text) return;

    const newItem = createTodoItem(text);
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemText('');
    
    // Focus back to input for quick adding
    if (newItemRef.current) {
      newItemRef.current.focus();
    }
  };

  // Handle Enter key in new item input
  const handleNewItemKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  // Toggle todo item completion
  const handleToggleItem = (itemId) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // Update todo item text
  const handleUpdateItemText = (itemId, newText) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, text: newText }
          : item
      )
    );
  };

  // Remove todo item
  const handleRemoveItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Calculate completion stats
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`todo-note-editor ${className}`} onKeyDown={handleKeyDown}>
      {/* Title input */}
      <div className="mb-4">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Todo list title..."
          className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none"
          data-testid="todo-note-title"
        />
      </div>

      {/* Progress indicator */}
      {totalCount > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedCount} of {totalCount} completed
            </span>
            <span className="text-sm font-medium text-gray-700">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Todo items list */}
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={() => handleToggleItem(item.id)}
            onUpdateText={(newText) => handleUpdateItemText(item.id, newText)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        ))}
      </div>

      {/* Add new item input */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          ref={newItemRef}
          type="text"
          value={newItemText}
          onChange={handleNewItemTextChange}
          onKeyDown={handleNewItemKeyDown}
          placeholder="Add a new todo item..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="todo-new-item-input"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItemText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="todo-add-item-button"
        >
          Add
        </button>
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
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-gray-400">
        <span>Ctrl+S to save</span>
        <span className="ml-4">Enter to add item</span>
        {onCancel && <span className="ml-4">Esc to cancel</span>}
      </div>
    </div>
  );
};

// Individual todo item component
const TodoItem = ({ item, onToggle, onUpdateText, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const editInputRef = useRef(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditText(item.text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== item.text) {
      onUpdateText(trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-2 rounded-lg border ${
      item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          item.completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        data-testid={`todo-item-checkbox-${item.id}`}
      >
        {item.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Text content */}
      <div className="flex-1">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleSaveEdit}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid={`todo-item-edit-input-${item.id}`}
          />
        ) : (
          <span
            onClick={handleStartEdit}
            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${
              item.completed 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
            }`}
            data-testid={`todo-item-text-${item.id}`}
          >
            {item.text}
          </span>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-6 h-6 text-gray-400 hover:text-red-500 transition-colors"
        data-testid={`todo-item-remove-${item.id}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default TodoNote;