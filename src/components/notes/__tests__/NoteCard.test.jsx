import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NoteCard from '../NoteCard';

// Mock Heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  DocumentTextIcon: ({ className }) => <div data-testid="text-icon" className={className} />,
  ListBulletIcon: ({ className }) => <div data-testid="todo-icon" className={className} />,
  ClockIcon: ({ className }) => <div data-testid="timetable-icon" className={className} />,
  EllipsisVerticalIcon: ({ className }) => <div data-testid="menu-icon" className={className} />,
  CheckCircleIcon: ({ className }) => <div data-testid="synced-icon" className={className} />,
  ExclamationTriangleIcon: ({ className }) => <div data-testid="error-icon" className={className} />,
  ArrowPathIcon: ({ className }) => <div data-testid="pending-icon" className={className} />
}));

describe('NoteCard', () => {
  const mockNote = {
    id: '1',
    type: 'text',
    title: 'Test Note',
    content: { text: 'This is a test note content' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'user1',
    syncStatus: 'synced'
  };

  const mockProps = {
    note: mockNote,
    onClick: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders note card with basic information', () => {
    render(<NoteCard {...mockProps} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note content')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('displays correct icon for text note type', () => {
    render(<NoteCard {...mockProps} />);
    expect(screen.getByTestId('text-icon')).toBeInTheDocument();
  });

  it('displays correct icon for todo note type', () => {
    const todoNote = {
      ...mockNote,
      type: 'todo',
      content: { items: [{ id: '1', text: 'Task 1', completed: false }] }
    };
    
    render(<NoteCard {...mockProps} note={todoNote} />);
    expect(screen.getByTestId('todo-icon')).toBeInTheDocument();
  });

  it('displays correct icon for timetable note type', () => {
    const timetableNote = {
      ...mockNote,
      type: 'timetable',
      content: { entries: [{ id: '1', time: '09:00', description: 'Meeting' }] }
    };
    
    render(<NoteCard {...mockProps} note={timetableNote} />);
    expect(screen.getByTestId('timetable-icon')).toBeInTheDocument();
  });

  it('shows sync status indicator', () => {
    render(<NoteCard {...mockProps} />);
    expect(screen.getByTestId('synced-icon')).toBeInTheDocument();
  });

  it('shows pending sync status', () => {
    const pendingNote = { ...mockNote, syncStatus: 'pending' };
    render(<NoteCard {...mockProps} note={pendingNote} />);
    expect(screen.getByTestId('pending-icon')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(<NoteCard {...mockProps} />);
    fireEvent.click(screen.getByText('Test Note'));
    expect(mockProps.onClick).toHaveBeenCalledWith(mockNote);
  });

  it('shows menu when menu button is clicked', () => {
    render(<NoteCard {...mockProps} />);
    
    // Menu should not be visible initially
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    
    // Click menu button
    fireEvent.click(screen.getByTestId('menu-icon'));
    
    // Menu should now be visible
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onEdit when edit is clicked', () => {
    render(<NoteCard {...mockProps} />);
    
    // Open menu and click edit
    fireEvent.click(screen.getByTestId('menu-icon'));
    fireEvent.click(screen.getByText('Edit'));
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockNote);
  });

  it('calls onDelete when delete is clicked', () => {
    render(<NoteCard {...mockProps} />);
    
    // Open menu and click delete
    fireEvent.click(screen.getByTestId('menu-icon'));
    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockNote);
  });

  it('displays todo preview correctly', () => {
    const todoNote = {
      ...mockNote,
      type: 'todo',
      content: {
        items: [
          { id: '1', text: 'Task 1', completed: true },
          { id: '2', text: 'Task 2', completed: false }
        ]
      }
    };
    
    render(<NoteCard {...mockProps} note={todoNote} />);
    expect(screen.getByText(/1\/2 completed/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/○ Task 2/)).toBeInTheDocument();
  });

  it('displays timetable preview correctly', () => {
    const timetableNote = {
      ...mockNote,
      type: 'timetable',
      content: {
        entries: [
          { id: '1', time: '09:00', description: 'Morning meeting' },
          { id: '2', time: '14:00', description: 'Afternoon call' }
        ]
      }
    };
    
    render(<NoteCard {...mockProps} note={timetableNote} />);
    expect(screen.getByText(/09:00 - Morning meeting/)).toBeInTheDocument();
    expect(screen.getByText(/14:00 - Afternoon call/)).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    const emptyNote = { ...mockNote, content: null };
    render(<NoteCard {...mockProps} note={emptyNote} />);
    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('displays untitled for notes without title', () => {
    const untitledNote = { ...mockNote, title: '' };
    render(<NoteCard {...mockProps} note={untitledNote} />);
    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });
});