import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NoteCard, NoteGrid } from '../index.js';

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

describe('Core Note Components Integration', () => {
  const mockNotes = [
    {
      id: '1',
      type: 'text',
      title: 'Text Note',
      content: { text: 'This is a text note with some content' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user1',
      syncStatus: 'synced'
    },
    {
      id: '2',
      type: 'todo',
      title: 'Todo Note',
      content: {
        items: [
          { id: '1', text: 'Task 1', completed: true, createdAt: Date.now() },
          { id: '2', text: 'Task 2', completed: false, createdAt: Date.now() }
        ]
      },
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      userId: 'user1',
      syncStatus: 'pending'
    },
    {
      id: '3',
      type: 'timetable',
      title: 'Schedule',
      content: {
        entries: [
          { id: '1', time: '09:00', description: 'Meeting', completed: false, date: '2024-01-15' },
          { id: '2', time: '14:00', description: 'Call', completed: true, date: '2024-01-15' }
        ]
      },
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      userId: 'user1',
      syncStatus: 'conflict'
    }
  ];

  describe('Requirement 6.1: Grid/Card Layout Display', () => {
    it('displays notes in a grid layout', () => {
      const { container } = render(
        <NoteGrid 
          notes={mockNotes}
          onNoteClick={vi.fn()}
          onNoteEdit={vi.fn()}
          onNoteDelete={vi.fn()}
        />
      );

      // Should have grid container with responsive classes
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('sm:grid-cols-2');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
      expect(gridContainer).toHaveClass('xl:grid-cols-4');
      expect(gridContainer).toHaveClass('2xl:grid-cols-5');

      // Should display all notes
      expect(screen.getByText('Text Note')).toBeInTheDocument();
      expect(screen.getByText('Todo Note')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
    });

    it('implements responsive design with Tailwind CSS', () => {
      const { container } = render(
        <NoteCard 
          note={mockNotes[0]}
          onClick={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      // Should have responsive classes and proper styling
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('hover:shadow-md');
      expect(card).toHaveClass('transition-shadow');
    });
  });

  describe('Requirement 6.4: Note Type Indicators and Preview Content', () => {
    it('shows note type indicators for all note types', () => {
      render(
        <div>
          <NoteCard note={mockNotes[0]} onClick={vi.fn()} />
          <NoteCard note={mockNotes[1]} onClick={vi.fn()} />
          <NoteCard note={mockNotes[2]} onClick={vi.fn()} />
        </div>
      );

      // Should show correct icons for each note type
      expect(screen.getByTestId('text-icon')).toBeInTheDocument();
      expect(screen.getByTestId('todo-icon')).toBeInTheDocument();
      expect(screen.getByTestId('timetable-icon')).toBeInTheDocument();
    });

    it('displays preview content for text notes', () => {
      render(<NoteCard note={mockNotes[0]} onClick={vi.fn()} />);
      
      expect(screen.getByText('This is a text note with some content')).toBeInTheDocument();
    });

    it('displays preview content for todo notes', () => {
      render(<NoteCard note={mockNotes[1]} onClick={vi.fn()} />);
      
      // Should show completion status and task preview
      expect(screen.getByText(/1\/2 completed/)).toBeInTheDocument();
      expect(screen.getByText(/✓ Task 1/)).toBeInTheDocument();
      expect(screen.getByText(/○ Task 2/)).toBeInTheDocument();
    });

    it('displays preview content for timetable notes', () => {
      render(<NoteCard note={mockNotes[2]} onClick={vi.fn()} />);
      
      // Should show time entries
      expect(screen.getByText(/09:00 - Meeting/)).toBeInTheDocument();
      expect(screen.getByText(/14:00 - Call/)).toBeInTheDocument();
    });

    it('shows sync status indicators', () => {
      render(
        <div>
          <NoteCard note={mockNotes[0]} onClick={vi.fn()} />
          <NoteCard note={mockNotes[1]} onClick={vi.fn()} />
          <NoteCard note={mockNotes[2]} onClick={vi.fn()} />
        </div>
      );

      // Should show different sync status icons
      expect(screen.getByTestId('synced-icon')).toBeInTheDocument();
      expect(screen.getByTestId('pending-icon')).toBeInTheDocument();
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    });
  });

  describe('Individual Note Card Display', () => {
    it('implements NoteCard component for displaying individual notes', () => {
      const mockOnClick = vi.fn();
      const mockOnEdit = vi.fn();
      const mockOnDelete = vi.fn();

      render(
        <NoteCard 
          note={mockNotes[0]}
          onClick={mockOnClick}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // Should display note information
      expect(screen.getByText('Text Note')).toBeInTheDocument();
      expect(screen.getByText('text')).toBeInTheDocument();
      
      // Should be clickable
      fireEvent.click(screen.getByText('Text Note'));
      expect(mockOnClick).toHaveBeenCalledWith(mockNotes[0]);

      // Should have edit/delete functionality
      fireEvent.click(screen.getByTestId('menu-icon'));
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Card Layout Display', () => {
    it('creates NoteGrid component for card layout display', () => {
      const { container } = render(
        <NoteGrid 
          notes={mockNotes}
          onNoteClick={vi.fn()}
          onNoteEdit={vi.fn()}
          onNoteDelete={vi.fn()}
        />
      );

      // Should render in grid layout
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      
      // Should display all notes as cards
      expect(screen.getAllByText(/Note|Schedule/)).toHaveLength(3);
    });

    it('handles empty state properly', () => {
      render(
        <NoteGrid 
          notes={[]}
          onNoteClick={vi.fn()}
          onNoteEdit={vi.fn()}
          onNoteDelete={vi.fn()}
        />
      );

      expect(screen.getByText('No notes found')).toBeInTheDocument();
    });

    it('handles loading state properly', () => {
      render(
        <NoteGrid 
          notes={mockNotes}
          loading={true}
          onNoteClick={vi.fn()}
          onNoteEdit={vi.fn()}
          onNoteDelete={vi.fn()}
        />
      );

      // Should show loading skeletons instead of actual notes
      expect(screen.queryByText('Text Note')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design Implementation', () => {
    it('implements responsive design with proper breakpoints', () => {
      const { container } = render(
        <NoteGrid 
          notes={mockNotes}
          onNoteClick={vi.fn()}
          onNoteEdit={vi.fn()}
          onNoteDelete={vi.fn()}
        />
      );

      const gridContainer = container.querySelector('.grid');
      
      // Should have all responsive breakpoint classes
      expect(gridContainer).toHaveClass('grid-cols-1');      // Mobile
      expect(gridContainer).toHaveClass('sm:grid-cols-2');   // Small screens
      expect(gridContainer).toHaveClass('lg:grid-cols-3');   // Large screens
      expect(gridContainer).toHaveClass('xl:grid-cols-4');   // Extra large
      expect(gridContainer).toHaveClass('2xl:grid-cols-5');  // 2X large
    });

    it('uses Tailwind CSS classes throughout components', () => {
      const { container } = render(
        <NoteCard note={mockNotes[0]} onClick={vi.fn()} />
      );

      const card = container.firstChild;
      
      // Should use Tailwind utility classes
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-gray-200');
      expect(card).toHaveClass('p-4');
      expect(card).toHaveClass('cursor-pointer');
      expect(card).toHaveClass('hover:shadow-md');
      expect(card).toHaveClass('transition-shadow');
      expect(card).toHaveClass('duration-200');
    });
  });
});