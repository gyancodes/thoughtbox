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

const NoteCard = ({ note, onClick, onEdit, onDelete }) => {
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

  // Get sync status indicator
  const getSyncStatusIndicator = (syncStatus) => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ArrowPathIcon className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'conflict':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
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
            {note.title || 'Untitled'}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sync status indicator */}
          {getSyncStatusIndicator(note.syncStatus)}
          
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
              <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
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
          {previewContent}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(note.updatedAt)}</span>
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