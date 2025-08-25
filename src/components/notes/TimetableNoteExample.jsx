import { useState } from 'react';
import TimetableNote from './TimetableNote';
import { createTimetableNote } from '../../types/noteUtils';

const TimetableNoteExample = () => {
  const [note, setNote] = useState(() => {
    // Create a sample timetable note with some entries
    const sampleNote = createTimetableNote(
      'Daily Schedule',
      [
        {
          id: 'entry-1',
          time: '09:00',
          description: 'Team standup meeting',
          completed: false,
          date: new Date().toISOString().split('T')[0] // Today
        },
        {
          id: 'entry-2',
          time: '11:30',
          description: 'Project review session',
          completed: true,
          date: new Date().toISOString().split('T')[0] // Today
        },
        {
          id: 'entry-3',
          time: '14:00',
          description: 'Client presentation',
          completed: false,
          date: (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
          })() // Tomorrow
        },
        {
          id: 'entry-4',
          time: '16:30',
          description: 'Code review',
          completed: false,
          date: (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
          })() // Tomorrow
        }
      ],
      'demo-user'
    );
    
    return sampleNote;
  });

  // Mock update function for demo
  const handleNoteUpdate = (updatedNote) => {
    setNote(updatedNote);
    console.log('Note updated:', updatedNote);
  };

  // Mock Notes context
  const mockNotesContext = {
    updateNote: async (noteId, updates) => {
      const updatedNote = {
        ...note,
        ...updates,
        updatedAt: Date.now(),
        syncStatus: 'pending'
      };
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNote(updatedNote);
      return updatedNote;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          TimetableNote Component Demo
        </h1>
        <p className="text-gray-600">
          This demo shows the TimetableNote component with time picker interface, 
          conflict prevention, chronological sorting, and completion tracking.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Interactive Timetable Note
        </h2>
        
        <div className="border border-gray-200 rounded-lg p-4">
          {/* Mock the NotesContext provider */}
          <div style={{ '--notes-context': JSON.stringify(mockNotesContext) }}>
            <TimetableNote
              note={note}
              onSave={handleNoteUpdate}
              autoFocus={false}
              className="demo-timetable-note"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Features Demonstrated
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              ✅ Time Picker Interface
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Date, time, and description inputs</li>
              <li>• HTML5 time and date pickers</li>
              <li>• Form validation and error handling</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              ⚠️ Conflict Prevention
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Prevents duplicate time slots</li>
              <li>• Shows conflict error messages</li>
              <li>• Validates time format (HH:MM)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              📅 Chronological Sorting
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Entries sorted by date then time</li>
              <li>• Grouped by date with headers</li>
              <li>• Today/Tomorrow smart labels</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              ✔️ Completion Tracking
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Checkbox to mark entries complete</li>
              <li>• Progress indicator with percentage</li>
              <li>• Visual styling for completed items</li>
              <li>• Overdue indicator for past entries</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Try These Features
        </h2>
        
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Add Entry:</strong> Fill in the date, time, and description fields, then click "Add Entry"
          </p>
          <p>
            <strong>Edit Entry:</strong> Click on any existing entry to edit its time, date, or description
          </p>
          <p>
            <strong>Complete Entry:</strong> Click the checkbox next to an entry to mark it as completed
          </p>
          <p>
            <strong>Remove Entry:</strong> Click the × button to remove an entry
          </p>
          <p>
            <strong>Conflict Test:</strong> Try adding an entry with the same time and date as an existing one
          </p>
          <p>
            <strong>Keyboard Shortcuts:</strong> Use Ctrl+S to save, Enter to add entry
          </p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Current Note State (Debug)
        </h2>
        <pre className="text-xs text-blue-700 bg-blue-100 p-3 rounded overflow-auto">
          {JSON.stringify(note, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TimetableNoteExample;