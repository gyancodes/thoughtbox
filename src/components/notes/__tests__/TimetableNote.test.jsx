import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimetableNote from '../TimetableNote';
import { useNotes } from '../../../contexts/NotesContext';

// Mock the NotesContext
vi.mock('../../../contexts/NotesContext', () => ({
  useNotes: vi.fn()
}));

describe('TimetableNote', () => {
  const mockUpdateNote = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const mockTimetableEntries = [
    {
      id: 'entry-1',
      time: '09:00',
      description: 'Morning meeting',
      completed: false,
      date: '2024-01-15'
    },
    {
      id: 'entry-2',
      time: '14:30',
      description: 'Project review',
      completed: true,
      date: '2024-01-15'
    },
    {
      id: 'entry-3',
      time: '10:00',
      description: 'Team standup',
      completed: false,
      date: '2024-01-16'
    }
  ];

  const mockNote = {
    id: 'note-1',
    type: 'timetable',
    title: 'Test Timetable',
    content: { entries: mockTimetableEntries },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'user1',
    syncStatus: 'synced'
  };

  const mockNotesContext = {
    updateNote: mockUpdateNote
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNotes.mockReturnValue(mockNotesContext);
    
    // Mock Date.now() to return a consistent timestamp
    vi.spyOn(Date, 'now').mockReturnValue(1705315200000); // 2024-01-15 12:00:00 UTC
    
    // Mock toISOString to return consistent date
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-15T12:00:00.000Z');
  });

  describe('Rendering', () => {
    it('renders with initial note data', () => {
      render(<TimetableNote note={mockNote} />);
      
      expect(screen.getByDisplayValue('Test Timetable')).toBeInTheDocument();
      expect(screen.getByText('Morning meeting')).toBeInTheDocument();
      expect(screen.getByText('Project review')).toBeInTheDocument();
      expect(screen.getByText('Team standup')).toBeInTheDocument();
    });

    it('renders with empty data for new note', () => {
      render(<TimetableNote note={null} />);
      
      expect(screen.getByPlaceholderText('Timetable title...')).toBeInTheDocument();
      expect(screen.getByTestId('timetable-new-entry-time')).toBeInTheDocument();
      expect(screen.getByTestId('timetable-new-entry-description')).toBeInTheDocument();
      expect(screen.getByTestId('timetable-new-entry-date')).toBeInTheDocument();
    });

    it('auto-focuses title input when autoFocus is true', () => {
      render(<TimetableNote note={mockNote} autoFocus={true} />);
      
      const titleInput = screen.getByTestId('timetable-note-title');
      expect(titleInput).toHaveFocus();
    });

    it('applies custom className', () => {
      const { container } = render(<TimetableNote note={mockNote} className="custom-class" />);
      
      expect(container.querySelector('.timetable-note-editor')).toHaveClass('custom-class');
    });
  });

  describe('Progress Indicator', () => {
    it('shows progress indicator when entries exist', () => {
      render(<TimetableNote note={mockNote} />);
      
      expect(screen.getByText('Progress: 1 of 3 completed')).toBeInTheDocument();
      expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('does not show progress indicator when no entries exist', () => {
      const emptyNote = { ...mockNote, content: { entries: [] } };
      render(<TimetableNote note={emptyNote} />);
      
      expect(screen.queryByText(/Progress:/)).not.toBeInTheDocument();
    });

    it('shows 100% completion when all entries are completed', () => {
      const completedEntries = mockTimetableEntries.map(entry => ({ ...entry, completed: true }));
      const completedNote = { ...mockNote, content: { entries: completedEntries } };
      
      render(<TimetableNote note={completedNote} />);
      
      expect(screen.getByText('Progress: 3 of 3 completed')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('shows 0% completion when no entries are completed', () => {
      const incompleteEntries = mockTimetableEntries.map(entry => ({ ...entry, completed: false }));
      const incompleteNote = { ...mockNote, content: { entries: incompleteEntries } };
      
      render(<TimetableNote note={incompleteNote} />);
      
      expect(screen.getByText('Progress: 0 of 3 completed')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Title Management', () => {
    it('updates title when user types', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const titleInput = screen.getByTestId('timetable-note-title');
      
      await act(async () => {
        fireEvent.change(titleInput, { target: { value: 'New Timetable Title' } });
      });
      
      expect(titleInput).toHaveValue('New Timetable Title');
    });

    it('shows unsaved changes indicator when title is modified', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const titleInput = screen.getByTestId('timetable-note-title');
      
      await act(async () => {
        fireEvent.change(titleInput, { target: { value: 'Modified Title' } });
      });
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
  });

  describe('Entry Management', () => {
    it('adds new timetable entry when Add Entry button is clicked', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const timeInput = screen.getByTestId('timetable-new-entry-time');
      const descriptionInput = screen.getByTestId('timetable-new-entry-description');
      const dateInput = screen.getByTestId('timetable-new-entry-date');
      const addButton = screen.getByTestId('timetable-add-entry-button');
      
      await act(async () => {
        fireEvent.change(timeInput, { target: { value: '16:00' } });
        fireEvent.change(descriptionInput, { target: { value: 'New meeting' } });
        fireEvent.change(dateInput, { target: { value: '2024-01-17' } });
        fireEvent.click(addButton);
      });
      
      expect(screen.getByText('New meeting')).toBeInTheDocument();
      expect(timeInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });

    it('validates time format and shows error for invalid time', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const descriptionInput = screen.getByTestId('timetable-new-entry-description');
      const dateInput = screen.getByTestId('timetable-new-entry-date');
      const addButton = screen.getByTestId('timetable-add-entry-button');
      
      await act(async () => {
        // Set description and date first
        fireEvent.change(descriptionInput, { target: { value: 'Test entry' } });
        fireEvent.change(dateInput, { target: { value: '2024-01-17' } });
        // Leave time empty to trigger validation
        fireEvent.click(addButton);
      });
      
      // Should not add entry when time is empty
      expect(screen.queryByText('Test entry')).not.toBeInTheDocument();
      expect(screen.getByText('3 entries')).toBeInTheDocument(); // Still original count
    });

    it('prevents time conflicts and shows error', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const timeInput = screen.getByTestId('timetable-new-entry-time');
      const descriptionInput = screen.getByTestId('timetable-new-entry-description');
      const dateInput = screen.getByTestId('timetable-new-entry-date');
      const addButton = screen.getByTestId('timetable-add-entry-button');
      
      await act(async () => {
        fireEvent.change(timeInput, { target: { value: '09:00' } }); // Conflicts with existing entry
        fireEvent.change(descriptionInput, { target: { value: 'Conflicting meeting' } });
        fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
        fireEvent.click(addButton);
      });
      
      expect(screen.getByTestId('timetable-conflict-error')).toHaveTextContent('Time slot 09:00 on 2024-01-15 is already occupied');
    });
  });

  describe('Entry Interactions', () => {
    it('toggles entry completion when checkbox is clicked', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const checkbox = screen.getByTestId('timetable-entry-checkbox-entry-1');
      
      await act(async () => {
        fireEvent.click(checkbox);
      });
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });

    it('removes entry when remove button is clicked', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const removeButton = screen.getByTestId('timetable-entry-remove-entry-1');
      
      await act(async () => {
        fireEvent.click(removeButton);
      });
      
      expect(screen.queryByText('Morning meeting')).not.toBeInTheDocument();
      expect(screen.getByText('2 entries')).toBeInTheDocument();
    });

    it('enters edit mode when entry is clicked', async () => {
      render(<TimetableNote note={mockNote} />);
      
      const entryDescription = screen.getByTestId('timetable-entry-description-entry-1');
      
      await act(async () => {
        fireEvent.click(entryDescription);
      });
      
      expect(screen.getByTestId('timetable-entry-edit-time-entry-1')).toBeInTheDocument();
      expect(screen.getByTestId('timetable-entry-edit-description-entry-1')).toBeInTheDocument();
      expect(screen.getByTestId('timetable-entry-edit-date-entry-1')).toBeInTheDocument();
    });
  });

  describe('Chronological Sorting', () => {
    it('displays entries in chronological order by date and time', () => {
      render(<TimetableNote note={mockNote} />);
      
      // Entries should be sorted: 2024-01-15 09:00, 2024-01-15 14:30, 2024-01-16 10:00
      const entries = screen.getAllByTestId(/timetable-entry-description-/);
      
      expect(entries[0]).toHaveTextContent('Morning meeting'); // 09:00 on 2024-01-15
      expect(entries[1]).toHaveTextContent('Project review');  // 14:30 on 2024-01-15
      expect(entries[2]).toHaveTextContent('Team standup');    // 10:00 on 2024-01-16
    });
  });

  describe('Visual Indicators', () => {
    it('shows completed entries with proper styling', () => {
      render(<TimetableNote note={mockNote} />);
      
      const completedEntry = screen.getByTestId('timetable-entry-description-entry-2');
      expect(completedEntry).toHaveClass('line-through', 'text-gray-500');
    });

    it('shows checkmark in completed entry checkbox', () => {
      render(<TimetableNote note={mockNote} />);
      
      const completedCheckbox = screen.getByTestId('timetable-entry-checkbox-entry-2');
      expect(completedCheckbox).toHaveClass('bg-green-500', 'border-green-500', 'text-white');
    });

    it('formats time display correctly', () => {
      render(<TimetableNote note={mockNote} />);
      
      const timeDisplay = screen.getByTestId('timetable-entry-time-entry-1');
      expect(timeDisplay).toHaveTextContent('9:00 AM');
      
      const afternoonTimeDisplay = screen.getByTestId('timetable-entry-time-entry-2');
      expect(afternoonTimeDisplay).toHaveTextContent('2:30 PM');
    });
  });

  describe('Status and Feedback', () => {
    it('shows entry count', () => {
      render(<TimetableNote note={mockNote} />);
      
      expect(screen.getByText('3 entries')).toBeInTheDocument();
    });

    it('shows saved indicator when no changes are pending', () => {
      render(<TimetableNote note={mockNote} />);
      
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('shows keyboard shortcuts hint', () => {
      render(<TimetableNote note={mockNote} />);
      
      expect(screen.getByText('Ctrl+S to save')).toBeInTheDocument();
      expect(screen.getByText('Enter to add entry')).toBeInTheDocument();
    });

    it('shows cancel shortcut when onCancel is provided', () => {
      render(<TimetableNote note={mockNote} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('Esc to cancel')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null note correctly', () => {
      render(<TimetableNote note={null} />);
      
      const titleInput = screen.getByTestId('timetable-note-title');
      
      act(() => {
        fireEvent.change(titleInput, { target: { value: 'New timetable' } });
      });
      
      expect(titleInput).toHaveValue('New timetable');
      expect(mockUpdateNote).not.toHaveBeenCalled();
    });

    it('handles empty entries array', () => {
      const emptyNote = { ...mockNote, content: { entries: [] } };
      render(<TimetableNote note={emptyNote} />);
      
      expect(screen.getByText('0 entries')).toBeInTheDocument();
      expect(screen.queryByText(/Progress:/)).not.toBeInTheDocument();
    });
  });
});