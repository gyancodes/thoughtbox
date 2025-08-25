import { useState } from 'react';
import NoteGrid from './NoteGrid';

// Demo component to showcase the note components
const NotesDemo = () => {
  const [notes] = useState([
    {
      id: '1',
      type: 'text',
      title: 'Meeting Notes',
      content: { 
        text: 'Discussed project timeline and deliverables. Key points: 1) Launch date moved to Q2, 2) Need additional resources for testing, 3) Marketing campaign to start in March. Follow up with stakeholders next week.' 
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      userId: 'user1',
      syncStatus: 'synced'
    },
    {
      id: '2',
      type: 'todo',
      title: 'Shopping List',
      content: {
        items: [
          { id: '1', text: 'Buy groceries', completed: true, createdAt: Date.now() },
          { id: '2', text: 'Pick up dry cleaning', completed: false, createdAt: Date.now() },
          { id: '3', text: 'Call dentist for appointment', completed: false, createdAt: Date.now() },
          { id: '4', text: 'Fix kitchen faucet', completed: true, createdAt: Date.now() }
        ]
      },
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
      userId: 'user1',
      syncStatus: 'pending'
    },
    {
      id: '3',
      type: 'timetable',
      title: 'Daily Schedule',
      content: {
        entries: [
          { id: '1', time: '09:00', description: 'Team standup meeting', completed: true, date: '2024-01-15' },
          { id: '2', time: '10:30', description: 'Client presentation prep', completed: false, date: '2024-01-15' },
          { id: '3', time: '14:00', description: 'Code review session', completed: false, date: '2024-01-15' },
          { id: '4', time: '16:00', description: 'Project planning', completed: false, date: '2024-01-15' }
        ]
      },
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
      userId: 'user1',
      syncStatus: 'synced'
    },
    {
      id: '4',
      type: 'text',
      title: 'Ideas',
      content: { 
        text: 'App feature ideas:\n- Dark mode toggle\n- Export notes to PDF\n- Voice notes\n- Collaborative editing\n- Tags and categories' 
      },
      createdAt: '2024-01-13T20:15:00Z',
      updatedAt: '2024-01-14T11:30:00Z',
      userId: 'user1',
      syncStatus: 'conflict'
    },
    {
      id: '5',
      type: 'todo',
      title: 'Weekend Plans',
      content: {
        items: [
          { id: '1', text: 'Visit the museum', completed: false, createdAt: Date.now() },
          { id: '2', text: 'Try new restaurant', completed: false, createdAt: Date.now() },
          { id: '3', text: 'Go for a hike', completed: false, createdAt: Date.now() }
        ]
      },
      createdAt: '2024-01-12T18:45:00Z',
      updatedAt: '2024-01-13T09:20:00Z',
      userId: 'user1',
      syncStatus: 'error'
    },
    {
      id: '6',
      type: 'text',
      title: '',
      content: { text: 'Quick note without a title' },
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z',
      userId: 'user1',
      syncStatus: 'synced'
    }
  ]);

  const handleNoteClick = (note) => {
    console.log('Note clicked:', note);
    alert(`Clicked on note: ${note.title || 'Untitled'}`);
  };

  const handleNoteEdit = (note) => {
    console.log('Edit note:', note);
    alert(`Edit note: ${note.title || 'Untitled'}`);
  };

  const handleNoteDelete = (note) => {
    console.log('Delete note:', note);
    if (confirm(`Delete note: ${note.title || 'Untitled'}?`)) {
      alert('Note deleted (demo only)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes Demo</h1>
          <p className="text-gray-600">
            Showcasing the NoteCard and NoteGrid components with different note types and sync statuses.
          </p>
        </div>

        <NoteGrid
          notes={notes}
          onNoteClick={handleNoteClick}
          onNoteEdit={handleNoteEdit}
          onNoteDelete={handleNoteDelete}
          className="mb-8"
        />

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">NoteCard Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Note type icons (text, todo, timetable)</li>
                <li>• Sync status indicators</li>
                <li>• Content preview with truncation</li>
                <li>• Hover menu with edit/delete options</li>
                <li>• Responsive design</li>
                <li>• Date formatting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">NoteGrid Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Responsive grid layout (1-5 columns)</li>
                <li>• Loading skeleton states</li>
                <li>• Empty state with custom messages</li>
                <li>• Note selection (for future bulk operations)</li>
                <li>• Proper spacing and alignment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesDemo;