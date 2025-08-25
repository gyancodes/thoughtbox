import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';

const ConflictResolutionModal = ({ isOpen, onClose, conflictNote, cloudNote }) => {
  const { resolveConflict } = useNotes();
  const [selectedResolution, setSelectedResolution] = useState('local');
  const [isResolving, setIsResolving] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedResolution('local');
      setIsResolving(false);
    }
  }, [isOpen]);

  if (!isOpen || !conflictNote) return null;

  const handleResolve = async () => {
    if (!conflictNote?.id) return;

    setIsResolving(true);
    try {
      await resolveConflict(conflictNote.id, selectedResolution);
      onClose();
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      // Error handling is done in the context
    } finally {
      setIsResolving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderNoteContent = (note, isCloud = false) => {
    if (!note?.content) return <p className="text-gray-500 italic">No content</p>;

    switch (note.type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{note.content.text || 'No text content'}</p>
          </div>
        );
      case 'todo':
        return (
          <div className="space-y-2">
            {note.content.items?.length > 0 ? (
              note.content.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    disabled
                    className="rounded border-gray-300"
                  />
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.text}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No todo items</p>
            )}
          </div>
        );
      case 'timetable':
        return (
          <div className="space-y-2">
            {note.content.entries?.length > 0 ? (
              note.content.entries
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {entry.time}
                    </span>
                    <span className={entry.completed ? 'line-through text-gray-500' : ''}>
                      {entry.description}
                    </span>
                    {entry.completed && (
                      <span className="text-xs text-green-600 font-medium">✓</span>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic">No timetable entries</p>
            )}
          </div>
        );
      default:
        return (
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(note.content, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sync Conflict Detected</h2>
                <p className="text-sm text-gray-600">
                  This note has been modified both locally and on another device
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              disabled={isResolving}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Note Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              {conflictNote.title || 'Untitled Note'}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Type:</span> {conflictNote.type}</p>
              <p><span className="font-medium">Note ID:</span> {conflictNote.id}</p>
            </div>
          </div>

          {/* Version Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Local Version */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Local Version</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resolution"
                      value="local"
                      checked={selectedResolution === 'local'}
                      onChange={(e) => setSelectedResolution(e.target.value)}
                      className="text-blue-600"
                      disabled={isResolving}
                    />
                    <span className="text-sm font-medium text-blue-700">Use this version</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Last modified: {formatDate(conflictNote.updatedAt)}
                </p>
              </div>
              <div className="p-4">
                {renderNoteContent(conflictNote)}
              </div>
            </div>

            {/* Cloud Version */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Cloud Version</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resolution"
                      value="cloud"
                      checked={selectedResolution === 'cloud'}
                      onChange={(e) => setSelectedResolution(e.target.value)}
                      className="text-green-600"
                      disabled={isResolving}
                    />
                    <span className="text-sm font-medium text-green-700">Use this version</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Last modified: {cloudNote ? formatDate(cloudNote.updatedAt) : 'Unknown'}
                </p>
              </div>
              <div className="p-4">
                {cloudNote ? renderNoteContent(cloudNote, true) : (
                  <p className="text-gray-500 italic">Loading cloud version...</p>
                )}
              </div>
            </div>
          </div>

          {/* Resolution Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">How conflict resolution works</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Local Version:</strong> Keep your changes and overwrite the cloud version</li>
                  <li>• <strong>Cloud Version:</strong> Discard your local changes and use the cloud version</li>
                  <li>• The selected version will be saved both locally and in the cloud</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            disabled={isResolving}
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">
                {selectedResolution === 'local' ? 'Local Version' : 'Cloud Version'}
              </span>
            </p>
            <button
              onClick={handleResolve}
              disabled={isResolving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isResolving && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{isResolving ? 'Resolving...' : 'Resolve Conflict'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;