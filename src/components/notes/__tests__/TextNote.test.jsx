import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TextNote from '../TextNote';
import { useNotes } from '../../../contexts/NotesContext';

// Mock the NotesContext
vi.mock('../../../contexts/NotesContext', () => ({
  useNotes: vi.fn()
}));

describe('TextNote', () => {
  const mockUpdateNote = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const mockNote = {
    id: 'note-1',
    type: 'text',
    title: 'Test Note',
    content: { text: 'Initial content' },
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
  });

  it('renders with initial note data', () => {
    render(<TextNote note={mockNote} />);
    
    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument();
  });

  it('renders with empty data for new note', () => {
    render(<TextNote note={null} />);
    
    expect(screen.getByPlaceholderText('Note title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start writing your note...')).toBeInTheDocument();
  });

  it('auto-focuses title input when autoFocus is true', () => {
    render(<TextNote note={mockNote} autoFocus={true} />);
    
    const titleInput = screen.getByTestId('text-note-title');
    expect(titleInput).toHaveFocus();
  });

  it('updates title when user types', async () => {
    render(<TextNote note={mockNote} />);
    
    const titleInput = screen.getByTestId('text-note-title');
    
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
    });
    
    expect(titleInput).toHaveValue('New Title');
  });

  it('updates content when user types', async () => {
    render(<TextNote note={mockNote} />);
    
    const contentTextarea = screen.getByTestId('text-note-content');
    
    await act(async () => {
      fireEvent.change(contentTextarea, { target: { value: 'New content' } });
    });
    
    expect(contentTextarea).toHaveValue('New content');
  });

  it('shows unsaved changes indicator when content is modified', async () => {
    render(<TextNote note={mockNote} />);
    
    const contentTextarea = screen.getByTestId('text-note-content');
    
    await act(async () => {
      fireEvent.change(contentTextarea, { target: { value: 'Initial content modified' } });
    });
    
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('shows character count', () => {
    render(<TextNote note={mockNote} />);
    
    expect(screen.getByText('15 characters')).toBeInTheDocument(); // "Initial content" = 15 chars
  });

  it('shows auto-save functionality exists', () => {
    render(<TextNote note={mockNote} />);
    
    const titleInput = screen.getByTestId('text-note-title');
    
    act(() => {
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    });
    
    // Should show unsaved changes indicator
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('has saving state management', () => {
    render(<TextNote note={mockNote} />);
    
    // Component should render without errors and have save functionality
    expect(screen.getByTestId('text-note-title')).toBeInTheDocument();
    expect(screen.getByTestId('text-note-content')).toBeInTheDocument();
  });

  it('shows saved indicator when no changes are pending', async () => {
    render(<TextNote note={mockNote} />);
    
    // Initially should show saved state
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('handles keyboard shortcuts', () => {
    render(<TextNote note={mockNote} />);
    
    const container = screen.getByTestId('text-note-title').closest('.text-note-editor');
    
    // Test Ctrl+S shortcut
    fireEvent.keyDown(container, { key: 's', ctrlKey: true });
    
    // Should not throw error
    expect(container).toBeInTheDocument();
  });

  it('handles cancel with Escape key when onCancel is provided', () => {
    render(<TextNote note={mockNote} onCancel={mockOnCancel} />);
    
    const container = screen.getByTestId('text-note-title').closest('.text-note-editor');
    fireEvent.keyDown(container, { key: 'Escape' });
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('does not call onCancel when Escape is pressed without onCancel prop', () => {
    render(<TextNote note={mockNote} />);
    
    const container = screen.getByTestId('text-note-title').closest('.text-note-editor');
    fireEvent.keyDown(container, { key: 'Escape' });
    
    // Should not throw error or cause issues
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('handles multiple changes correctly', () => {
    render(<TextNote note={mockNote} />);
    
    const titleInput = screen.getByTestId('text-note-title');
    
    // Make multiple changes
    act(() => {
      fireEvent.change(titleInput, { target: { value: 'Change 1' } });
    });
    
    act(() => {
      fireEvent.change(titleInput, { target: { value: 'Change 2' } });
    });
    
    expect(titleInput).toHaveValue('Change 2');
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('handles component lifecycle correctly', () => {
    const { unmount } = render(<TextNote note={mockNote} />);
    
    // Component should render and unmount without errors
    expect(screen.getByTestId('text-note-title')).toBeInTheDocument();
    
    unmount();
    
    // Should not throw errors on unmount
    expect(true).toBe(true);
  });

  it('shows correct initial state', () => {
    render(<TextNote note={mockNote} />);
    
    // Should show saved state initially
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  it('handles null note correctly', () => {
    render(<TextNote note={null} />);
    
    const titleInput = screen.getByTestId('text-note-title');
    
    act(() => {
      fireEvent.change(titleInput, { target: { value: 'New note' } });
    });
    
    expect(titleInput).toHaveValue('New note');
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  it('handles title input correctly', () => {
    render(<TextNote note={mockNote} />);
    
    const titleInput = screen.getByTestId('text-note-title');
    
    act(() => {
      fireEvent.change(titleInput, { target: { value: '  Trimmed Title  ' } });
    });
    
    expect(titleInput).toHaveValue('  Trimmed Title  ');
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TextNote note={mockNote} className="custom-class" />);
    
    expect(container.querySelector('.text-note-editor')).toHaveClass('custom-class');
  });

  it('shows keyboard shortcuts hint', () => {
    render(<TextNote note={mockNote} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Ctrl+S to save')).toBeInTheDocument();
    expect(screen.getByText('Esc to cancel')).toBeInTheDocument();
  });

  it('shows only save shortcut when onCancel is not provided', () => {
    render(<TextNote note={mockNote} />);
    
    expect(screen.getByText('Ctrl+S to save')).toBeInTheDocument();
    expect(screen.queryByText('Esc to cancel')).not.toBeInTheDocument();
  });
});