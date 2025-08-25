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
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
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
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 relative group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="text-gray-600 flex-shrink-0">
            {getTypeIcon(note.type)}
          </div>
          <h3 className="font-medium text-gray-900 truncate">
            {searchQuery ? (
              <SearchHighlight 
                text={note.title || 'Untitled'} 
                query={searchQuery}
                highlightClassName="bg-yellow-200 px-0.5 rounded font-semibold"
              />
            ) : (
              note.title || 'Untitled'
            )}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sync status indicator - clickable for conflicts */}
          {note.syncStatus === 'conflict' ? (
            <button
              onClick={handleConflictResolve}
              className="p-1 rounded-full hover:bg-orange-100 transition-colors"
              title="Click to resolve sync conflict"
            >
              {getSyncStatusIndicator(note.syncStatus)}
            </button>
          ) : (
            getSyncStatusIndicator(note.syncStatus)
          )}
          
          {/* Menu button */}
          <div className="note-menu relative">
            <button
              onClick={handleMenuClick}
              className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                {note.syncStatus === 'conflict' && (
                  <button
                    onClick={handleConflictResolve}
                    className="block w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50"
                  >
                    Resolve Conflict
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="mb-3">
        <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-4">
          {searchQuery ? (
            <SearchHighlight 
              text={previewContent} 
              query={searchQuery}
              highlightClassName="bg-yellow-200 px-0.5 rounded"
            />
          ) : (
            previewContent
          )}
        </p>
      </div>

      {/* Search relevance indicator */}
      {searchQuery && getSearchRelevance(note) && (
        <div className="mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            getSearchRelevance(note).level === 'high' 
              ? 'bg-green-100 text-green-800' 
              : getSearchRelevance(note).level === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {getSearchRelevance(note).label}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span>{formatDate(note.updatedAt)}</span>
          {/* Sync status badge */}
          {note.syncStatus && note.syncStatus !== 'synced' && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              note.syncStatus === 'pending' 
                ? 'bg-blue-100 text-blue-700'
                : note.syncStatus === 'conflict'
                ? 'bg-orange-100 text-orange-700'
                : note.syncStatus === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {note.syncStatus === 'pending' && 'Syncing'}
              {note.syncStatus === 'conflict' && 'Conflict'}
              {note.syncStatus === 'error' && 'Failed'}
            </span>
          )}
        </div>
        <span className="capitalize">{note.type}</span>
      </div>

      {/* Click outside handler for menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default NoteCard;