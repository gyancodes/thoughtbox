import { useState, useEffect, useRef } from 'react';

const TimetableNote = ({ 
  note, 
  onChange, 
  onSave, 
  onCancel, 
  autoSave = true, 
  className = "" 
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [entries, setEntries] = useState(note?.content?.entries || []);
  const [newEntryTime, setNewEntryTime] = useState('');
  const [newEntryDescription, setNewEntryDescription] = useState('');
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [timeConflictError, setTimeConflictError] = useState('');

  const titleInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Calculate progress
  const completedCount = entries.filter(entry => entry.completed).length;
  const totalCount = entries.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasChanges && !isSaving) {
      const timer = setTimeout(() => {
        handleSave();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, entries, hasChanges, autoSave, isSaving]);

  // Track changes
  useEffect(() => {
    const originalTitle = note?.title || '';
    const originalEntries = note?.content?.entries || [];
    
    const titleChanged = title !== originalTitle;
    const entriesChanged = JSON.stringify(entries) !== JSON.stringify(originalEntries);
    
    setHasChanges(titleChanged || entriesChanged);
  }, [title, entries, note]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const updatedNote = {
        ...note,
        title: title.trim(),
        content: { entries: entries.filter(entry => entry.description.trim()) },
        type: 'timetable'
      };
      
      if (onChange) {
        onChange(updatedNote);
      }
      
      if (onSave) {
        await onSave(updatedNote);
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save timetable note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAddEntry = () => {
    if (!newEntryTime.trim() || !newEntryDescription.trim() || !newEntryDate) {
      return;
    }

    // Check for time conflicts
    const conflictEntry = entries.find(entry => 
      entry.date === newEntryDate && entry.time === newEntryTime
    );

    if (conflictEntry) {
      setTimeConflictError(`Time slot ${newEntryTime} on ${newEntryDate} is already taken`);
      return;
    }

    const newEntry = {
      id: Date.now(),
      time: newEntryTime,
      description: newEntryDescription,
      date: newEntryDate,
      completed: false
    };

    setEntries(prev => [...prev, newEntry].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    }));

    setNewEntryTime('');
    setNewEntryDescription('');
    setTimeConflictError('');
    
    // Focus time input for next entry
    setTimeout(() => timeInputRef.current?.focus(), 100);
  };

  const handleEntryToggle = (id) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, completed: !entry.completed } : entry
    ));
  };

  const handleEntryRemove = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleEntryUpdate = (id, field, value) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Group entries by date
  const entriesByDate = entries.reduce((groups, entry) => {
    const date = entry.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  return (
    <div className={`timetable-note ${className}`}>
      {/* Title Input */}
      <textarea
        ref={titleInputRef}
        value={title}
        onChange={handleTitleChange}
        placeholder="Timetable title..."
        className="w-full text-xl font-semibold text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border-none outline-none bg-transparent resize-none"
        rows={1}
        data-testid="timetable-note-title"
      />

      {/* Progress indicator */}
      {totalCount > 0 && (
        <div className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Progress: {completedCount} of {totalCount} completed
            </span>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-[var(--border-primary)] rounded-full h-2">
            <div 
              className="bg-[var(--accent-primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add new entry form */}
      <div className="mb-6 p-4 bg-[var(--bg-tertiary)] rounded-lg">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Add New Entry</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Date</label>
            <input
              type="date"
              value={newEntryDate}
              onChange={(e) => setNewEntryDate(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-md text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Time</label>
            <input
              ref={timeInputRef}
              type="time"
              value={newEntryTime}
              onChange={(e) => setNewEntryTime(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-md text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Description</label>
            <input
              type="text"
              value={newEntryDescription}
              onChange={(e) => setNewEntryDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
              placeholder="Activity description"
              className="w-full px-3 py-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-md text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>
        </div>
        
        {timeConflictError && (
          <div className="mb-3 text-sm text-[var(--error)]" data-testid="timetable-conflict-error">
            {timeConflictError}
          </div>
        )}

        <button
          onClick={handleAddEntry}
          disabled={!newEntryTime.trim() || !newEntryDescription.trim() || !newEntryDate}
          className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          data-testid="timetable-add-entry-button"
        >
          Add Entry
        </button>
      </div>

      {/* Entries grouped by date */}
      <div className="space-y-4">
        {Object.entries(entriesByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, dateEntries]) => (
            <DateGroup 
              key={date} 
              date={date} 
              entries={dateEntries}
              onEntryToggle={handleEntryToggle}
              onEntryRemove={handleEntryRemove}
              onEntryUpdate={handleEntryUpdate}
            />
          ))}
      </div>

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
            <span className="text-[var(--warning)]">Unsaved changes</span>
          )}
          {!hasChanges && !isSaving && note && (
            <span className="text-[var(--success)]">Saved</span>
          )}
        </div>
        
        <div className="text-xs text-[var(--text-tertiary)]">
          {totalCount} {totalCount === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-[var(--text-tertiary)]">
        <span>Ctrl+S to save</span>
        <span className="ml-4">Enter to add entry</span>
        {onCancel && <span className="ml-4">Esc to cancel</span>}
      </div>
    </div>
  );
};

// Date Group Component
const DateGroup = ({ date, entries, onEntryToggle, onEntryRemove, onEntryUpdate }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="border border-[var(--border-primary)] rounded-lg p-4">
      <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 border-b border-[var(--border-primary)] pb-2">
        {formatDate(date)}
      </h4>
      
      <div className="space-y-2">
        {entries
          .sort((a, b) => a.time.localeCompare(b.time))
          .map(entry => (
            <TimetableEntry
              key={entry.id}
              entry={entry}
              onToggle={() => onEntryToggle(entry.id)}
              onRemove={() => onEntryRemove(entry.id)}
              onUpdate={(field, value) => onEntryUpdate(entry.id, field, value)}
            />
          ))}
      </div>
    </div>
  );
};

// Timetable Entry Component
const TimetableEntry = ({ entry, onToggle, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState(entry.time);
  const [editDescription, setEditDescription] = useState(entry.description);

  const now = new Date();
  const entryDateTime = new Date(`${entry.date}T${entry.time}`);
  const overdue = entryDateTime < now && !entry.completed;

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditTime(entry.time);
    setEditDescription(entry.description);
  };

  const handleSaveEdit = () => {
    onUpdate('time', editTime);
    onUpdate('description', editDescription);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTime(entry.time);
    setEditDescription(entry.description);
    setIsEditing(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
      entry.completed 
        ? 'bg-[var(--bg-tertiary)] border-[var(--success)]' 
        : overdue
        ? 'bg-[var(--bg-tertiary)] border-[var(--error)]'
        : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'
    }`}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          entry.completed 
            ? 'bg-[var(--success)] border-[var(--success)] text-[var(--bg-primary)]' 
            : overdue
            ? 'border-[var(--error)] hover:border-[var(--error)]'
            : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
        }`}
        data-testid={`timetable-entry-checkbox-${entry.id}`}
      >
        {entry.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="px-2 py-1 border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded text-sm text-[var(--text-primary)]"
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="flex-1 px-2 py-1 border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded text-sm text-[var(--text-primary)]"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded text-xs hover:opacity-80"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded text-xs hover:bg-[var(--border-primary)]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div onClick={handleStartEdit} className="cursor-pointer hover:bg-[var(--bg-tertiary)] px-2 py-1 rounded">
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${
                entry.completed 
                  ? 'line-through text-[var(--text-tertiary)]' 
                  : overdue
                  ? 'text-[var(--error)]'
                  : 'text-[var(--accent-primary)]'
              }`} data-testid={`timetable-entry-time-${entry.id}`}>
                {formatTime(entry.time)}
              </span>
              
              <span className={`text-sm ${
                entry.completed 
                  ? 'line-through text-[var(--text-tertiary)]' 
                  : overdue
                  ? 'text-[var(--error)]'
                  : 'text-[var(--text-primary)]'
              }`} data-testid={`timetable-entry-description-${entry.id}`}>
                {entry.description}
              </span>
              
              {overdue && (
                <span className="text-xs text-[var(--error)] font-medium">
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
        className="flex-shrink-0 w-6 h-6 text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
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