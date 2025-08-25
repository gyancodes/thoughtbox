import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { createTimetableEntry } from '../../types/noteUtils';

const TimetableNote = ({ 
  note, 
  onSave, 
  onCancel, 
  autoFocus = false,
  className = ""
}) => {
  const { updateNote } = useNotes();
  
  // Local state for editing
  const [title, setTitle] = useState(note?.title || '');
  const [entries, setEntries] = useState(note?.content?.entries || []);
  const [newEntryTime, setNewEntryTime] = useState('');
  const [newEntryDescription, setNewEntryDescription] = useState('');
  const [newEntryDate, setNewEntryDate] = useState(getTodayDate());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [timeConflictError, setTimeConflictError] = useState('');
  
  // Refs for auto-focus and debouncing
  const titleRef = useRef(null);
  const timeInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const initialDataRef = useRef({ 
    title: note?.title || '', 
    entries: note?.content?.entries || [] 
  });

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && titleRef.current) {
      titleRef.current.focus();
    }
  }, [autoFocus]);

  // Track changes
  useEffect(() => {
    const hasContentChanges = JSON.stringify(entries) !== JSON.stringify(initialDataRef.current.entries);
    const hasTitleChanges = title !== initialDataRef.current.title;
    setHasChanges(hasContentChanges || hasTitleChanges);
  }, [title, entries]);

  // Debounced auto-save function
  const debouncedSave = useCallback(async () => {
    if (!note || !hasChanges) return;

    try {
      setIsSaving(true);
      
      const updatedNote = await updateNote(note.id, {
        title: title.trim(),
        content: { entries: sortEntriesChronologically(entries) }
      });

      // Update initial data reference
      initialDataRef.current = { 
        title: title.trim(), 
        entries: [...entries] 
      };
      
      setHasChanges(false);
      onSave?.(updatedNote);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Note: Error handling is managed by NotesContext
    } finally {
      setIsSaving(false);
    }
  }, [note, title, entries, hasChanges, updateNote, onSave]);

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

  // Handle new entry field changes
  const handleNewEntryTimeChange = (e) => {
    setNewEntryTime(e.target.value);
    setTimeConflictError('');
  };

  const handleNewEntryDescriptionChange = (e) => {
    setNewEntryDescription(e.target.value);
  };

  const handleNewEntryDateChange = (e) => {
    setNewEntryDate(e.target.value);
    setTimeConflictError('');
  };

  // Validate time slot for conflicts
  const validateTimeSlot = (time, date, excludeEntryId = null) => {
    const conflictingEntry = entries.find(entry => 
      entry.id !== excludeEntryId &&
      entry.time === time && 
      entry.date === date
    );
    
    return conflictingEntry ? `Time slot ${time} on ${date} is already occupied` : '';
  };

  // Add new timetable entry
  const handleAddEntry = () => {
    const time = newEntryTime.trim();
    const description = newEntryDescription.trim();
    const date = newEntryDate;
    
    if (!time || !description || !date) return;

    // Validate time format
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setTimeConflictError('Please enter time in HH:MM format (e.g., 09:30)');
      return;
    }

    // Check for time conflicts
    const conflictError = validateTimeSlot(time, date);
    if (conflictError) {
      setTimeConflictError(conflictError);
      return;
    }

    const newEntry = createTimetableEntry(time, description, date);
    const newEntries = [...entries, newEntry];
    
    setEntries(sortEntriesChronologically(newEntries));
    setNewEntryTime('');
    setNewEntryDescription('');
    setTimeConflictError('');
    
    // Focus back to time input for quick adding
    if (timeInputRef.current) {
      timeInputRef.current.focus();
    }
  };

  // Handle Enter key in new entry inputs
  const handleNewEntryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEntry();
    }
  };

  // Toggle timetable entry completion
  const handleToggleEntry = (entryId) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === entryId 
          ? { ...entry, completed: !entry.completed }
          : entry
      )
    );
  };

  // Update timetable entry
  const handleUpdateEntry = (entryId, updates) => {
    // If updating time or date, validate for conflicts
    if (updates.time !== undefined || updates.date !== undefined) {
      const entry = entries.find(e => e.id === entryId);
      const newTime = updates.time !== undefined ? updates.time : entry.time;
      const newDate = updates.date !== undefined ? updates.date : entry.date;
      
      const conflictError = validateTimeSlot(newTime, newDate, entryId);
      if (conflictError) {
        setTimeConflictError(conflictError);
        return false;
      }
    }

    setEntries(prevEntries => {
      const updatedEntries = prevEntries.map(entry => 
        entry.id === entryId 
          ? { ...entry, ...updates }
          : entry
      );
      return sortEntriesChronologically(updatedEntries);
    });
    
    setTimeConflictError('');
    return true;
  };

  // Remove timetable entry
  const handleRemoveEntry = (entryId) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
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
  const completedCount = entries.filter(entry => entry.completed).length;
  const totalCount = entries.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group entries by date for better organization
  const entriesByDate = groupEntriesByDate(entries);

  return (
    <div className={`timetable-note-editor ${className}`} onKeyDown={handleKeyDown}>
      {/* Title input */}
      <div className="mb-4">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Timetable title..."
          className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none"
          data-testid="timetable-note-title"
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
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add new entry form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Entry</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={newEntryDate}
              onChange={handleNewEntryDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              data-testid="timetable-new-entry-date"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
            <input
              ref={timeInputRef}
              type="time"
              value={newEntryTime}
              onChange={handleNewEntryTimeChange}
              onKeyDown={handleNewEntryKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              data-testid="timetable-new-entry-time"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={newEntryDescription}
              onChange={handleNewEntryDescriptionChange}
              onKeyDown={handleNewEntryKeyDown}
              placeholder="Enter activity description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              data-testid="timetable-new-entry-description"
            />
          </div>
        </div>
        
        {timeConflictError && (
          <div className="mb-3 text-sm text-red-600" data-testid="timetable-conflict-error">
            {timeConflictError}
          </div>
        )}
        
        <button
          onClick={handleAddEntry}
          disabled={!newEntryTime.trim() || !newEntryDescription.trim() || !newEntryDate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          data-testid="timetable-add-entry-button"
        >
          Add Entry
        </button>
      </div>

      {/* Timetable entries grouped by date */}
      <div className="space-y-4 mb-4">
        {Object.entries(entriesByDate).map(([date, dateEntries]) => (
          <TimetableDateGroup
            key={date}
            date={date}
            entries={dateEntries}
            onToggleEntry={handleToggleEntry}
            onUpdateEntry={handleUpdateEntry}
            onRemoveEntry={handleRemoveEntry}
          />
        ))}
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
          {totalCount} {totalCount === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-gray-400">
        <span>Ctrl+S to save</span>
        <span className="ml-4">Enter to add entry</span>
        {onCancel && <span className="ml-4">Esc to cancel</span>}
      </div>
    </div>
  );
};

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Helper function to sort entries chronologically
function sortEntriesChronologically(entries) {
  return [...entries].sort((a, b) => {
    // First sort by date, then by time
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.time.localeCompare(b.time);
  });
}

// Helper function to group entries by date
function groupEntriesByDate(entries) {
  const grouped = {};
  
  entries.forEach(entry => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  });
  
  // Sort dates
  const sortedDates = Object.keys(grouped).sort();
  const sortedGrouped = {};
  
  sortedDates.forEach(date => {
    sortedGrouped[date] = grouped[date];
  });
  
  return sortedGrouped;
}

// Component for displaying entries grouped by date
const TimetableDateGroup = ({ date, entries, onToggleEntry, onUpdateEntry, onRemoveEntry }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-800 mb-3 border-b border-gray-100 pb-2">
        {formatDate(date)}
      </h4>
      
      <div className="space-y-2">
        {entries.map((entry) => (
          <TimetableEntry
            key={entry.id}
            entry={entry}
            onToggle={() => onToggleEntry(entry.id)}
            onUpdate={(updates) => onUpdateEntry(entry.id, updates)}
            onRemove={() => onRemoveEntry(entry.id)}
          />
        ))}
      </div>
    </div>
  );
};
// Individual timetable entry component
const TimetableEntry = ({ entry, onToggle, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState(entry.time);
  const [editDescription, setEditDescription] = useState(entry.description);
  const [editDate, setEditDate] = useState(entry.date);
  const editTimeRef = useRef(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && editTimeRef.current) {
      editTimeRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTime(entry.time);
    setEditDescription(entry.description);
    setEditDate(entry.date);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmedDescription = editDescription.trim();
    
    if (!editTime || !trimmedDescription || !editDate) {
      handleCancelEdit();
      return;
    }

    // Validate time format
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editTime)) {
      handleCancelEdit();
      return;
    }

    const updates = {};
    if (editTime !== entry.time) updates.time = editTime;
    if (trimmedDescription !== entry.description) updates.description = trimmedDescription;
    if (editDate !== entry.date) updates.date = editDate;

    if (Object.keys(updates).length > 0) {
      const success = onUpdate(updates);
      if (!success) {
        // Conflict detected, revert changes
        handleCancelEdit();
        return;
      }
    }
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTime(entry.time);
    setEditDescription(entry.description);
    setEditDate(entry.date);
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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isOverdue = () => {
    const now = new Date();
    const entryDateTime = new Date(`${entry.date}T${entry.time}:00`);
    return entryDateTime < now && !entry.completed;
  };

  const overdue = isOverdue();

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
      entry.completed 
        ? 'bg-green-50 border-green-200' 
        : overdue
        ? 'bg-red-50 border-red-200'
        : 'bg-white border-gray-200'
    }`}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          entry.completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : overdue
            ? 'border-red-400 hover:border-red-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        data-testid={`timetable-entry-checkbox-${entry.id}`}
      >
        {entry.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Time and content */}
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                ref={editTimeRef}
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                data-testid={`timetable-entry-edit-time-${entry.id}`}
              />
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                data-testid={`timetable-entry-edit-date-${entry.id}`}
              />
            </div>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleSaveEdit}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              data-testid={`timetable-entry-edit-description-${entry.id}`}
            />
          </div>
        ) : (
          <div onClick={handleStartEdit} className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${
                entry.completed 
                  ? 'line-through text-gray-500' 
                  : overdue
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`} data-testid={`timetable-entry-time-${entry.id}`}>
                {formatTime(entry.time)}
              </span>
              
              <span className={`text-sm ${
                entry.completed 
                  ? 'line-through text-gray-500' 
                  : overdue
                  ? 'text-red-800'
                  : 'text-gray-900'
              }`} data-testid={`timetable-entry-description-${entry.id}`}>
                {entry.description}
              </span>
              
              {overdue && (
                <span className="text-xs text-red-500 font-medium">
                  Overdue
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-6 h-6 text-gray-400 hover:text-red-500 transition-colors"
        data-testid={`timetable-entry-remove-${entry.id}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default TimetableNote;