import { useState } from 'react';
import { 
  DocumentTextIcon, 
  ListBulletIcon, 
  ClockIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import SearchHighlight from '../SearchHighlight';
import { motion, AnimatePresence } from 'motion/react';

const NoteCard = ({ note, onClick, onEdit, onDelete, onConflictResolve, searchQuery = "" }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get note type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'text':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'todo':
        return <ListBulletIcon className="w-5 h-5" />;
      case 'timetable':
        return <ClockIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  // Get sync status indicator with enhanced styling
  const getSyncStatusIndicator = (syncStatus) => {
    switch (syncStatus) {
      case 'synced':
        return (
          <div className="flex items-center space-x-1" title="Synced">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center space-x-1" title="Syncing...">
            <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
        );
      case 'conflict':
        return (
          <div className="flex items-center space-x-1" title="Sync conflict - click to resolve">
            <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-1" title="Sync failed">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          </div>
        );
      default:
        return null;
    }
  };

  // Generate preview content based on note type
  const getPreviewContent = (note) => {
    if (!note.content) return 'No content';

    switch (note.type) {
      case 'text':
        return note.content.text?.substring(0, 150) || 'Empty note';
      
      case 'todo':
        const items = note.content.items || [];
        const completedCount = items.filter(item => item.completed).length;
        const totalCount = items.length;
        
        if (totalCount === 0) return 'No items';
        
        const firstItems = items.slice(0, 3).map(item => 
          `${item.completed ? '✓' : '○'} ${item.text}`
        ).join('\n');
        
        const remaining = totalCount > 3 ? `\n... and ${totalCount - 3} more` : '';
        return `${completedCount}/${totalCount} completed\n${firstItems}${remaining}`;
      
      case 'timetable':
        const entries = note.content.entries || [];
        if (entries.length === 0) return 'No entries';
        
        const sortedEntries = entries
          .sort((a, b) => a.time.localeCompare(b.time))
          .slice(0, 3);
        
        const entryList = sortedEntries.map(entry => 
          `${entry.time} - ${entry.description}`
        ).join('\n');
        
        const remainingEntries = entries.length > 3 ? `\n... and ${entries.length - 3} more` : '';
        return `${entryList}${remainingEntries}`;
      
      default:
        return 'Unknown note type';
    }
  };

  // Get search relevance indicator
  const getSearchRelevance = (note) => {
    if (!searchQuery || !note.searchMeta) return null;
    
    const score = note.searchMeta.score;
    if (score >= 100) return { level: 'high', label: 'Exact match' };
    if (score >= 50) return { level: 'medium', label: 'Good match' };
    return { level: 'low', label: 'Partial match' };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) {
      // If no date provided, show current date
      return 'Just now';
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      // Handle future dates
      if (diffTime < 0) {
        return date.toLocaleDateString();
      }

      // Less than 1 minute ago
      if (diffMinutes < 1) return 'Just now';
      
      // Less than 1 hour ago
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      
      // Less than 24 hours ago
      if (diffHours < 24) return `${diffHours}h ago`;
      
      // Today
      if (diffDays === 0) return 'Today';
      
      // Yesterday
      if (diffDays === 1) return 'Yesterday';
      
      // Within a week
      if (diffDays <= 7) return `${diffDays} days ago`;
      
      // Older than a week
      return date.toLocaleDateString();
    } catch (error) {
      return 'Just now';
    }
  };

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on menu button
    if (e.target.closest('.note-menu')) return;
    onClick?.(note);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(note);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.(note);
  };

  const handleConflictResolve = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onConflictResolve?.(note);
  };

  const previewContent = getPreviewContent(note);

  return (
    <div 
      className={`
        bg-[var(--bg-secondary)] 
        rounded-lg 
        border border-[var(--border-primary)] 
        p-3 
        hover:shadow-sm 
        transition-all 
        cursor-pointer
        relative
        ${note.syncStatus === 'conflict' ? 'border-orange-500 border-opacity-50' : ''}
        ${note.syncStatus === 'error' ? 'border-red-500 border-opacity-50' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Card Content - Google Keep style puts content before title */}
      <div className="text-sm text-[var(--text-secondary)] mb-2 whitespace-pre-line line-clamp-6">
        {note.type === 'todo' ? (
          <div className="space-y-1">
            {note.content?.items && note.content.items.slice(0, 3).map((todo, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full border ${
                  todo.completed 
                    ? 'bg-[var(--text-primary)] border-[var(--text-primary)]' 
                    : 'border-[var(--border-secondary)]'
                }`}></div>
                <span className={`text-xs ${
                  todo.completed 
                    ? 'text-[var(--text-tertiary)] line-through' 
                    : 'text-[var(--text-primary)]'
                }`}>
                  {todo.text}
                </span>
              </div>
            ))}
            {note.content?.items && note.content.items.length > 3 && (
              <p className="text-xs text-[var(--text-tertiary)]">
                +{note.content.items.length - 3} more
              </p>
            )}
          </div>
        ) : note.type === 'timetable' ? (
          <div className="space-y-1">
            {note.content?.entries && note.content.entries.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <span className="text-[var(--text-primary)] font-medium">
                  {item.time}
                </span>
                <span className="text-[var(--text-secondary)]">
                  {item.description}
                </span>
              </div>
            ))}
            {note.content?.entries && note.content.entries.length > 3 && (
              <p className="text-xs text-[var(--text-tertiary)]">
                +{note.content.entries.length - 3} more
              </p>
            )}
          </div>
        ) : (
          <p className="text-[var(--text-primary)] text-xs leading-relaxed">
            {note.content?.text ? (
              note.content.text.length > 100 
                ? `${note.content.text.substring(0, 100)}...` 
                : note.content.text
            ) : (
              'No content'
            )}
          </p>
        )}
      </div>

      {/* Card Header - Minimal style with smaller title */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
          {note.title || 'Untitled'}
        </h3>
        
        <div className="flex items-center space-x-1">
          {/* Sync Status Indicator */}
          {getSyncStatusIndicator(note.syncStatus)}
          
          {/* Menu Button */}
          <button 
            className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            onClick={handleMenuClick}
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Footer - Minimal with just date */}
      <div className="flex justify-between items-center text-xs text-[var(--text-tertiary)] mt-2">
        <div>
          {note.updatedAt ? (
            <span>Updated {formatDate(note.updatedAt)}</span>
          ) : (
            <span>Created {formatDate(note.createdAt)}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleEdit}
            className="p-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            title="Edit note"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-0.5 text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
            title="Delete note"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            className="absolute right-0 top-8 mt-1 w-40 rounded-md shadow-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                onClick={handleEdit}
              >
                Edit
              </button>
              
              {note.syncStatus === 'conflict' && (
                <button
                  className="w-full text-left px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  onClick={handleConflictResolve}
                >
                  Resolve Conflict
                </button>
              )}
              
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-[var(--bg-secondary)]"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteCard;