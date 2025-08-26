import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';

const OfflineIndicator = ({ className = '', size = 'md', showText = true }) => {
  const { isOnline, syncStatus, notes, NOTE_SYNC_STATUS } = useNotes();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  // Show offline message when going offline
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000); // Hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // Count offline changes
  const offlineChanges = notes.filter(note => 
    note.syncStatus === NOTE_SYNC_STATUS.PENDING || 
    note.syncStatus === NOTE_SYNC_STATUS.ERROR
  ).length;

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

  // Don't show indicator when online and no offline changes
  if (isOnline && offlineChanges === 0) {
    return null;
  }

  const getDisplayState = () => {
    if (!isOnline) {
      return {
        status: 'offline',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 border-orange-200',
        text: 'Offline',
        description: offlineChanges > 0 
          ? `Working offline • ${offlineChanges} change${offlineChanges !== 1 ? 's' : ''} pending`
          : 'Working offline • Changes will sync when online'
      };
    }

    if (offlineChanges > 0) {
      return {
        status: 'syncing',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 border-blue-200',
        text: 'Syncing',
        description: `${offlineChanges} change${offlineChanges !== 1 ? 's' : ''} syncing to cloud`
      };
    }

    return {
      status: 'online',
      color: 'text-green-600',
      bgColor: 'bg-green-100 border-green-200',
      text: 'Online',
      description: 'All changes synced'
    };
  };

  const displayState = getDisplayState();

  const renderIcon = () => {
    const iconClass = `${config.icon} ${displayState.color}`;

    if (!isOnline) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12" />
        </svg>
      );
    }

    if (offlineChanges > 0) {
      return (
        <svg className={`${iconClass} animate-spin`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }

    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  };

  return (
    <>
      {/* Main indicator */}
      <div 
        className={`inline-flex items-center ${config.container} ${config.padding} rounded-full border ${displayState.bgColor} ${className}`}
        title={displayState.description}
      >
        {renderIcon()}
        {showText && (
          <span className={`ml-2 font-medium ${displayState.color} ${config.text}`}>
            {displayState.text}
            {offlineChanges > 0 && (
              <span className="ml-1 opacity-75">
                ({offlineChanges})
              </span>
            )}
          </span>
        )}
      </div>

      {/* Offline notification toast */}
      {showOfflineMessage && (
        <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in-right">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12" />
          </svg>
          <div>
            <p className="font-medium">You're now offline</p>
            <p className="text-sm opacity-90">Changes will sync when you're back online</p>
          </div>
          <button
            onClick={() => setShowOfflineMessage(false)}
            className="ml-2 text-white hover:text-orange-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default OfflineIndicator;