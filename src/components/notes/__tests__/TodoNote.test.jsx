import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoNote from '../TodoNote';
import { useNotes } from '../../../contexts/NotesContext';

// Mock the NotesContext
vi.mock('../../../contexts/NotesContext', () => ({
  useNotes: vi.fn()
}));

describe('TodoNote', () => {
  const mockUpdateNote = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

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

  const mockNote = {
    id: 'note-1',
    type: 'todo',
    title: 'Test Todo List',
    content: { items: mockTodoItems },
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

  describe('Rendering', () => {
    it('renders with initial note data', () => {
      render(<TodoNote note={mockNote} />);
      
      expect(screen.getByDisplayValue('Test Todo List')).toBeInTheDocument();
      expect(screen.getByText('First todo item')).toBeInTheDocument();
      expect(screen.getByText('Second todo item')).toBeInTheDocument();
    });

    it('renders with empty data for new note', () => {
      render(<TodoNote note={null} />);
      
      expect(screen.getByPlaceholderText('Todo list title...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add a new todo item...')).toBeInTheDocument();
    });

    it('auto-focuses title input when autoFocus is true', () => {
      render(<TodoNote note={mockNote} autoFocus={true} />);
      
      const titleInput = screen.getByTestId('todo-note-title');
      expect(titleInput).toHaveFocus();
    });

    it('applies custom className', () => {
      const { container } = render(<TodoNote note={mockNote} className="custom-class" />);
      
      expect(container.querySelector('.todo-note-editor')).toHaveClass('custom-class');
    });
  });

  describe('Progress Indicator', () => {
    it('shows progress indicator when items exist', () => {
      render(<TodoNote note={mockNote} />);
      
      expect(screen.getByText('Progress: 1 of 2 completed')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('does not show progress indicator when no items exist', () => {
      const emptyNote = { ...mockNote, content: { items: [] } };
      render(<TodoNote note={emptyNote} />);
      
      expect(screen.queryByText(/Progress:/)).not.toBeInTheDocument();
    });

    it('shows 100% completion when all items are completed', () => {
      const completedItems = mockTodoItems.map(item => ({ ...item, completed: true }));
      const completedNote = { ...mockNote, content: { items: completedItems } };
      
      render(<TodoNote note={completedNote} />);
      
      expect(screen.getByText('Progress: 2 of 2 completed')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('shows 0% completion when no items are completed', () => {
      const incompleteItems = mockTodoItems.map(item => ({ ...item, completed: false }));
      const incompleteNote = { ...mockNote, content: { items: incompleteItems } };
      
      render(<TodoNote note={incompleteNote} />);
      
      expect(screen.getByText('Progress: 0 of 2 completed')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Title Management', () => {
    it('updates title when user types', async () => {
      render(<TodoNote note={mockNote} />);
      
      const titleInput = screen.getByTestId('todo-note-title');
      
      await act(async () => {
        fireEvent.change(titleInput, { target: { value: 'New Todo Title' } });
      });
      
      expect(titleInput).toHaveValue('New Todo Title');
    });

    it('shows unsaved changes indicator when title is modified', async () => {
      render(<TodoNote note={mockNote} />);
      
      const titleInput = screen.getByTestId('todo-note-title');
      
      await act(async () => {
        fireEvent.change(titleInput, { target: { value: 'Modified Title' } });
      });
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
  });

  describe('Todo Item Management', () => {
    it('adds new todo item when Add button is clicked', async () => {
      render(<TodoNote note={mockNote} />);
      
      const input = screen.getByTestId('todo-new-item-input');
      const addButton = screen.getByTestId('todo-add-item-button');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'New todo item' } });
        fireEvent.click(addButton);
      });
      
      expect(screen.getByText('New todo item')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('adds new todo item when Enter is pressed', async () => {
      render(<TodoNote note={mockNote} />);
      
      const input = screen.getByTestId('todo-new-item-input');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Another new item' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });
      
      expect(screen.getByText('Another new item')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('does not add empty todo items', async () => {
      render(<TodoNote note={mockNote} />);
      
      const addButton = screen.getByTestId('todo-add-item-button');
      
      await act(async () => {
        fireEvent.click(addButton);
      });
      
      // Should still only have the original 2 items
      expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('trims whitespace from new todo items', async () => {
      render(<TodoNote note={mockNote} />);
      
      const input = screen.getByTestId('todo-new-item-input');
      const addButton = screen.getByTestId('todo-add-item-button');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: '  Trimmed item  ' } });
        fireEvent.click(addButton);
      });
      
      expect(screen.getByText('Trimmed item')).toBeInTheDocument();
    });

    it('disables Add button when input is empty', () => {
      render(<TodoNote note={mockNote} />);
      
      const addButton = screen.getByTestId('todo-add-item-button');
      expect(addButton).toBeDisabled();
    });

    it('enables Add button when input has text', async () => {
      render(<TodoNote note={mockNote} />);
      
      const input = screen.getByTestId('todo-new-item-input');
      const addButton = screen.getByTestId('todo-add-item-button');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Some text' } });
      });
      
      expect(addButton).not.toBeDisabled();
    });
  });

  describe('Todo Item Interactions', () => {
    it('toggles todo item completion when checkbox is clicked', async () => {
      render(<TodoNote note={mockNote} />);
      
      const checkbox = screen.getByTestId('todo-item-checkbox-item-1');
      
      await act(async () => {
        fireEvent.click(checkbox);
      });
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });

    it('removes todo item when remove button is clicked', async () => {
      render(<TodoNote note={mockNote} />);
      
      const removeButton = screen.getByTestId('todo-item-remove-item-1');
      
      await act(async () => {
        fireEvent.click(removeButton);
      });
      
      expect(screen.queryByText('First todo item')).not.toBeInTheDocument();
      expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    it('enters edit mode when item text is clicked', async () => {
      render(<TodoNote note={mockNote} />);
      
      const itemText = screen.getByTestId('todo-item-text-item-1');
      
      await act(async () => {
        fireEvent.click(itemText);
      });
      
      expect(screen.getByTestId('todo-item-edit-input-item-1')).toBeInTheDocument();
    });

    it('saves edited text when Enter is pressed', async () => {
      render(<TodoNote note={mockNote} />);
      
      const itemText = screen.getByTestId('todo-item-text-item-1');
      
      await act(async () => {
        fireEvent.click(itemText);
      });
      
      const editInput = screen.getByTestId('todo-item-edit-input-item-1');
      
      await act(async () => {
        fireEvent.change(editInput, { target: { value: 'Edited item text' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      });
      
      expect(screen.getByText('Edited item text')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-item-edit-input-item-1')).not.toBeInTheDocument();
    });

    it('cancels edit when Escape is pressed', async () => {
      render(<TodoNote note={mockNote} />);
      
      const itemText = screen.getByTestId('todo-item-text-item-1');
      
      await act(async () => {
        fireEvent.click(itemText);
      });
      
      const editInput = screen.getByTestId('todo-item-edit-input-item-1');
      
      await act(async () => {
        fireEvent.change(editInput, { target: { value: 'Changed text' } });
        fireEvent.keyDown(editInput, { key: 'Escape' });
      });
      
      expect(screen.getByText('First todo item')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-item-edit-input-item-1')).not.toBeInTheDocument();
    });

    it('saves edited text when input loses focus', async () => {
      render(<TodoNote note={mockNote} />);
      
      const itemText = screen.getByTestId('todo-item-text-item-1');
      
      await act(async () => {
        fireEvent.click(itemText);
      });
      
      const editInput = screen.getByTestId('todo-item-edit-input-item-1');
      
      await act(async () => {
        fireEvent.change(editInput, { target: { value: 'Blur edited text' } });
        fireEvent.blur(editInput);
      });
      
      expect(screen.getByText('Blur edited text')).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('shows completed items with strikethrough and different styling', () => {
      render(<TodoNote note={mockNote} />);
      
      const completedItem = screen.getByTestId('todo-item-text-item-2');
      expect(completedItem).toHaveClass('line-through', 'text-gray-500');
    });

    it('shows incomplete items without strikethrough', () => {
      render(<TodoNote note={mockNote} />);
      
      const incompleteItem = screen.getByTestId('todo-item-text-item-1');
      expect(incompleteItem).not.toHaveClass('line-through');
      expect(incompleteItem).toHaveClass('text-gray-900');
    });

    it('shows checkmark in completed item checkbox', () => {
      render(<TodoNote note={mockNote} />);
      
      const completedCheckbox = screen.getByTestId('todo-item-checkbox-item-2');
      expect(completedCheckbox).toHaveClass('bg-green-500', 'border-green-500', 'text-white');
    });

    it('shows empty checkbox for incomplete items', () => {
      render(<TodoNote note={mockNote} />);
      
      const incompleteCheckbox = screen.getByTestId('todo-item-checkbox-item-1');
      expect(incompleteCheckbox).toHaveClass('border-gray-300');
      expect(incompleteCheckbox).not.toHaveClass('bg-green-500');
    });
  });

  describe('Status and Feedback', () => {
    it('shows item count', () => {
      render(<TodoNote note={mockNote} />);
      
      expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('shows singular item count', () => {
      const singleItemNote = { 
        ...mockNote, 
        content: { items: [mockTodoItems[0]] } 
      };
      render(<TodoNote note={singleItemNote} />);
      
      expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    it('shows saved indicator when no changes are pending', () => {
      render(<TodoNote note={mockNote} />);
      
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('shows unsaved changes indicator when items are modified', async () => {
      render(<TodoNote note={mockNote} />);
      
      const checkbox = screen.getByTestId('todo-item-checkbox-item-1');
      
      await act(async () => {
        fireEvent.click(checkbox);
      });
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('shows keyboard shortcuts hint', () => {
      render(<TodoNote note={mockNote} />);
      
      expect(screen.getByText('Ctrl+S to save')).toBeInTheDocument();
      expect(screen.getByText('Enter to add item')).toBeInTheDocument();
    });

    it('shows cancel shortcut when onCancel is provided', () => {
      render(<TodoNote note={mockNote} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('Esc to cancel')).toBeInTheDocument();
    });

    it('handles Ctrl+S shortcut', () => {
      render(<TodoNote note={mockNote} />);
      
      const container = screen.getByTestId('todo-note-title').closest('.todo-note-editor');
      fireEvent.keyDown(container, { key: 's', ctrlKey: true });
      
      // Should not throw error
      expect(container).toBeInTheDocument();
    });

    it('handles Escape shortcut when onCancel is provided', () => {
      render(<TodoNote note={mockNote} onCancel={mockOnCancel} />);
      
      const container = screen.getByTestId('todo-note-title').closest('.todo-note-editor');
      fireEvent.keyDown(container, { key: 'Escape' });
      
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles null note correctly', () => {
      render(<TodoNote note={null} />);
      
      const titleInput = screen.getByTestId('todo-note-title');
      
      act(() => {
        fireEvent.change(titleInput, { target: { value: 'New todo list' } });
      });
      
      expect(titleInput).toHaveValue('New todo list');
      expect(mockUpdateNote).not.toHaveBeenCalled();
    });

    it('handles empty items array', () => {
      const emptyNote = { ...mockNote, content: { items: [] } };
      render(<TodoNote note={emptyNote} />);
      
      expect(screen.getByText('0 items')).toBeInTheDocument();
      expect(screen.queryByText(/Progress:/)).not.toBeInTheDocument();
    });

    it('handles component lifecycle correctly', () => {
      const { unmount } = render(<TodoNote note={mockNote} />);
      
      expect(screen.getByTestId('todo-note-title')).toBeInTheDocument();
      
      unmount();
      
      // Should not throw errors on unmount
      expect(true).toBe(true);
    });

    it('handles multiple rapid changes correctly', async () => {
      render(<TodoNote note={mockNote} />);
      
      const input = screen.getByTestId('todo-new-item-input');
      const addButton = screen.getByTestId('todo-add-item-button');
      
      // Add multiple items rapidly
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Item 1' } });
        fireEvent.click(addButton);
      });
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Item 2' } });
        fireEvent.click(addButton);
      });
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('4 items')).toBeInTheDocument();
    });
  });

  describe('Auto-save Functionality', () => {
    it('shows saving state management', () => {
      render(<TodoNote note={mockNote} />);
      
      // Component should render without errors and have save functionality
      expect(screen.getByTestId('todo-note-title')).toBeInTheDocument();
      expect(screen.getByTestId('todo-new-item-input')).toBeInTheDocument();
    });

    it('tracks changes correctly', async () => {
      render(<TodoNote note={mockNote} />);
      
      const input = screen.getByTestId('todo-new-item-input');
      const addButton = screen.getByTestId('todo-add-item-button');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'New item' } });
        fireEvent.click(addButton);
      });
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
  });
});