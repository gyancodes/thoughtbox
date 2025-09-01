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
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ 
        y: -2,
        boxShadow: 'var(--shadow-lg)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.2 
      }}
      className="note-card rounded-lg border border-[var(--border-primary)] p-4 cursor-pointer relative group bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      onClick={handleCardClick}
    >
      {/* Note Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate mb-1">
            {note.title || 'Untitled'}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
            <span className="capitalize">{note.type}</span>
            {note.updatedAt && (
              <>
                <span>•</span>
                <span>{formatDate(note.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Note Type Icon */}
        <div className="flex-shrink-0 ml-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {note.type === 'todo' ? (
              <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ) : note.type === 'timetable' ? (
              <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Note Content Preview */}
      <div className="mb-4">
        {note.type === 'todo' ? (
          <div className="space-y-2">
            {note.content?.items && note.content.items.slice(0, 3).map((todo, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full border ${
                  todo.completed 
                    ? 'bg-[var(--text-primary)] border-[var(--text-primary)]' 
                    : 'border-[var(--border-secondary)]'
                }`}></div>
                <span className={`text-sm ${
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
                +{note.content.items.length - 3} more items
              </p>
            )}
          </div>
        ) : note.type === 'timetable' ? (
          <div className="space-y-2">
            {note.content?.entries && note.content.entries.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
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
                +{note.content.entries.length - 3} more activities
              </p>
            )}
          </div>
        ) : (
          <p className="text-[var(--text-primary)] text-sm leading-relaxed">
            {note.content?.text ? (
              note.content.text.length > 120 
                ? `${note.content.text.substring(0, 120)}...` 
                : note.content.text
            ) : (
              'No content'
            )}
          </p>
        )}
      </div>

      {/* Note Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <div className="flex items-center space-x-2">
          <span>{formatDate(note.createdAt || note.updatedAt)}</span>
          {note.syncStatus && (
            <span className={`px-2 py-1 rounded-full text-xs ${
              note.syncStatus === 'synced' 
                ? 'bg-[var(--success)] bg-opacity-10 text-[var(--success)]'
                : note.syncStatus === 'pending'
                ? 'bg-[var(--warning)] bg-opacity-10 text-[var(--warning)]'
                : 'bg-[var(--error)] bg-opacity-10 text-[var(--error)]'
            }`}>
              {note.syncStatus}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(note);
            }}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            title="Edit note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(note, e);
            }}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selection Indicator */}
      {/* isSelected prop is not defined in the original file, so this block is removed */}
      {/* {isSelected && (
        <div className="absolute inset-0 border-2 border-[var(--accent-primary)] rounded-xl pointer-events-none"></div>
      )} */}
    </motion.div>
  );
};

export default NoteCard;