import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';

const SyncIndicator = ({ className = '', showText = true, size = 'md' }) => {
  const { syncStatus, isOnline, notes, SYNC_STATUS, NOTE_SYNC_STATUS } = useNotes();
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Update last sync time when sync completes
  useEffect(() => {
    if (syncStatus === SYNC_STATUS.IDLE) {
      setLastSyncTime(new Date());
    }
  }, [syncStatus, SYNC_STATUS.IDLE]);

  // Count notes by sync status
  const syncStats = notes.reduce((acc, note) => {
    acc[note.syncStatus] = (acc[note.syncStatus] || 0) + 1;
    return acc;
  }, {});

  const pendingCount = syncStats[NOTE_SYNC_STATUS.PENDING] || 0;
  const errorCount = syncStats[NOTE_SYNC_STATUS.ERROR] || 0;
  const conflictCount = syncStats[NOTE_SYNC_STATUS.CONFLICT] || 0;

  // Determine display state
  const getDisplayState = () => {
    if (!isOnline) {
      return {
        status: 'offline',
        icon: 'offline',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        text: 'Offline',
        description: 'Changes will sync when online'
      };
    }

    if (syncStatus === SYNC_STATUS.SYNCING) {
      return {
        status: 'syncing',
        icon: 'syncing',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        text: 'Syncing...',
        description: 'Synchronizing your notes'
      };
    }

    if (syncStatus === SYNC_STATUS.ERROR || errorCount > 0) {
      return {
        status: 'error',
        icon: 'error',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: 'Sync Error',
        description: `${errorCount} note${errorCount !== 1 ? 's' : ''} failed to sync`
      };
    }

    if (conflictCount > 0) {
      return {
        status: 'conflict',
        icon: 'conflict',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        text: 'Conflicts',
        description: `${conflictCount} note${conflictCount !== 1 ? 's' : ''} need${conflictCount === 1 ? 's' : ''} attention`
      };
    }

    if (pendingCount > 0) {
      return {
        status: 'pending',
        icon: 'pending',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        text: 'Pending',
        description: `${pendingCount} note${pendingCount !== 1 ? 's' : ''} waiting to sync`
      };
    }

    return {
      status: 'synced',
      icon: 'synced',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      text: 'Synced',
      description: lastSyncTime ? `Last synced ${formatRelativeTime(lastSyncTime)}` : 'All notes synced'
    };
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const displayState = getDisplayState();

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-6',
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'px-2'
    },
    md: {
      container: 'h-8',
      icon: 'w-4 h-4',
      text: 'text-sm',
      padding: 'px-3'
    },
    lg: {
      container: 'h-10',
      icon: 'w-5 h-5',
      text: 'text-base',
      padding: 'px-4'
    }
  };

  const config = sizeConfig[size];

  // Render icon based on status
  const renderIcon = () => {
    const iconClass = `${config.icon} ${displayState.color}`;

    switch (displayState.icon) {
      case 'syncing':
        return (
          <svg className={`${iconClass} animate-spin`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'synced':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'conflict':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'offline':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`inline-flex items-center ${config.container} ${config.padding} rounded-full ${displayState.bgColor} ${className}`}
      title={displayState.description}
    >
      {renderIcon()}
      {showText && (
        <span className={`ml-2 font-medium ${displayState.color} ${config.text}`}>
          {displayState.text}
        </span>
      )}
    </div>
  );
};

export default SyncIndicator;