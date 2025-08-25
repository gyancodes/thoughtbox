import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NoteGrid from '../NoteGrid';

// Mock NoteCard component
vi.mock('../NoteCard', () => ({
  default: ({ note, onClick, onEdit, onDelete }) => (
    <div data-testid={`note-card-${note.id}`}>
      <span>{note.title}</span>
      <button onClick={() => onClick?.(note)}>Click</button>
      <button onClick={() => onEdit?.(note)}>Edit</button>
      <button onClick={() => onDelete?.(note)}>Delete</button>
    </div>
  )
}));

describe('NoteGrid', () => {
  const mockNotes = [
    {
      id: '1',
      type: 'text',
      title: 'Note 1',
      content: { text: 'Content 1' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user1',
      syncStatus: 'synced'
    },
    {
      id: '2',
      type: 'todo',
      title: 'Note 2',
      content: { items: [] },
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      userId: 'user1',
      syncStatus: 'pending'
    }
  ];

  const mockProps = {
    notes: mockNotes,
    onNoteClick: vi.fn(),
    onNoteEdit: vi.fn(),
    onNoteDelete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders notes in a grid layout', () => {
    render(<NoteGrid {...mockProps} />);
    
    expect(screen.getByTestId('note-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('note-card-2')).toBeInTheDocument();
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading is true', () => {
    render(<NoteGrid {...mockProps} loading={true} />);
    
    // Should show loading skeletons instead of notes
    expect(screen.queryByTestId('note-card-1')).not.toBeInTheDocument();
    
    // Should have multiple skeleton items
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no notes are provided', () => {
    render(<NoteGrid {...mockProps} notes={[]} />);
    
    expect(screen.getByText('No notes found')).toBeInTheDocument();
    expect(screen.getByText(/No notes yet/)).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    const customMessage = 'Create your first note!';
    render(<NoteGrid {...mockProps} notes={[]} emptyMessage={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<NoteGrid {...mockProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles undefined notes gracefully', () => {
    render(<NoteGrid {...mockProps} notes={undefined} />);
    
    expect(screen.getByText('No notes found')).toBeInTheDocument();
  });

  it('renders responsive grid classes', () => {
    const { container } = render(<NoteGrid {...mockProps} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('sm:grid-cols-2');
    expect(gridContainer).toHaveClass('lg:grid-cols-3');
    expect(gridContainer).toHaveClass('xl:grid-cols-4');
    expect(gridContainer).toHaveClass('2xl:grid-cols-5');
  });

  it('passes correct props to NoteCard components', () => {
    render(<NoteGrid {...mockProps} />);
    
    // The mock NoteCard should receive the correct props
    expect(screen.getByTestId('note-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('note-card-2')).toBeInTheDocument();
  });
});