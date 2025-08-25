import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoNoteExample from '../TodoNoteExample';
import { useNotes } from '../../../contexts/NotesContext';

// Mock the NotesContext
vi.mock('../../../contexts/NotesContext', () => ({
  useNotes: vi.fn()
}));

describe('TodoNoteExample', () => {
  const mockCreateNote = vi.fn();
  const mockUpdateNote = vi.fn();
  const mockOnClose = vi.fn();

  const mockTodoItems = [
    {
      id: 'item-1',
      text: 'First todo item',
      completed: false,
      createdAt: Date.now()
    },
    {
      id: 'item-2',
      text: 'Second todo item',
      completed: true,
      createdAt: Date.now()
    }
  ];

  const mockExistingNote = {
    id: 'note-1',
    type: 'todo',
    title: 'Existing Todo List',
    content: { items: mockTodoItems },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    userId: 'user1',
    syncStatus: 'synced'
  };

  const mockNotesContext = {
    notes: [mockExistingNote],
    createNote: mockCreateNote,
    updateNote: mockUpdateNote
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNotes.mockReturnValue(mockNotesContext);
  });

  describe('Rendering', () => {
    it('renders create mode for new note', () => {
      render(<TodoNoteExample />);
      
      expect(screen.getByText('Create New Todo List')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Todo list title...')).toBeInTheDocument();
    });

    it('renders edit mode for existing note', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      expect(screen.getByText('Edit Todo List')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Todo List')).toBeInTheDocument();
      expect(screen.getByText('First todo item')).toBeInTheDocument();
      expect(screen.getByText('Second todo item')).toBeInTheDocument();
    });

    it('shows completion stats for existing note', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      expect(screen.getByText('1 of 2 tasks completed')).toBeInTheDocument();
    });

    it('does not show completion stats for empty todo list', () => {
      const emptyNote = { ...mockExistingNote, content: { items: [] } };
      useNotes.mockReturnValue({
        ...mockNotesContext,
        notes: [emptyNote]
      });
      
      render(<TodoNoteExample noteId="note-1" />);
      
      expect(screen.queryByText(/tasks completed/)).not.toBeInTheDocument();
    });

    it('shows close button when onClose is provided', () => {
      render(<TodoNoteExample noteId="note-1" onClose={mockOnClose} />);
      
      const closeButton = screen.getByText('×');
      expect(closeButton).toBeInTheDocument();
    });

    it('does not show close button when onClose is not provided', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      expect(screen.queryByText('×')).not.toBeInTheDocument();
    });
  });

  describe('Note Management', () => {
    it('handles note not found', () => {
      render(<TodoNoteExample noteId="non-existent" />);
      
      expect(screen.getByText('Note not found')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      render(<TodoNoteExample noteId="note-1" onClose={mockOnClose} />);
      
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Metadata Display', () => {
    it('shows metadata section for existing note', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      // Check that the metadata section exists
      const { container } = render(<TodoNoteExample noteId="note-1" />);
      const metadataSection = container.querySelector('.mt-6.flex.items-center.justify-between');
      expect(metadataSection).toBeTruthy();
    });

    it('shows sync status', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      const syncStatus = screen.getByText('synced');
      expect(syncStatus).toBeInTheDocument();
      expect(syncStatus).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('shows different sync status colors', () => {
      const pendingNote = { ...mockExistingNote, syncStatus: 'pending' };
      useNotes.mockReturnValue({
        ...mockNotesContext,
        notes: [pendingNote]
      });
      
      render(<TodoNoteExample noteId="note-1" />);
      
      const syncStatus = screen.getByText('pending');
      expect(syncStatus).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });

  describe('Integration', () => {
    it('auto-focuses for new notes', () => {
      render(<TodoNoteExample />);
      
      const titleInput = screen.getByTestId('todo-note-title');
      expect(titleInput).toHaveFocus();
    });

    it('does not auto-focus for existing notes', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      const titleInput = screen.getByTestId('todo-note-title');
      expect(titleInput).not.toHaveFocus();
    });

    it('renders TodoNote component with correct props', () => {
      render(<TodoNoteExample noteId="note-1" />);
      
      // Verify TodoNote is rendered with the note data
      expect(screen.getByTestId('todo-note-title')).toBeInTheDocument();
      expect(screen.getByTestId('todo-new-item-input')).toBeInTheDocument();
    });

    it('applies minimum height class', () => {
      const { container } = render(<TodoNoteExample noteId="note-1" />);
      
      expect(container.querySelector('.todo-note-editor')).toHaveClass('min-h-[400px]');
    });
  });

  describe('Error Handling', () => {
    it('handles missing note gracefully', () => {
      useNotes.mockReturnValue({
        ...mockNotesContext,
        notes: []
      });
      
      render(<TodoNoteExample noteId="note-1" />);
      
      expect(screen.getByText('Note not found')).toBeInTheDocument();
    });

    it('handles empty notes array', () => {
      useNotes.mockReturnValue({
        ...mockNotesContext,
        notes: []
      });
      
      render(<TodoNoteExample />);
      
      expect(screen.getByText('Create New Todo List')).toBeInTheDocument();
    });
  });
});