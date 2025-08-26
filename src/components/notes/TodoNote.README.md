# TodoNote Component

A React component for creating and managing todo lists with checkable items, progress tracking, and auto-save functionality.

## Features

- **Dynamic Item Management**: Add, edit, and remove todo items
- **Checkable Interface**: Toggle completion status with visual indicators
- **Progress Tracking**: Visual progress bar and completion statistics
- **Auto-save**: Automatic saving with debounced updates
- **Keyboard Shortcuts**: Ctrl+S to save, Enter to add items, Esc to cancel
- **Visual Feedback**: Strikethrough for completed items, different styling states
- **Responsive Design**: Clean, mobile-friendly interface

## Usage

```jsx
import { TodoNote } from './components/notes';

// Basic usage
<TodoNote 
  note={todoNote} 
  onSave={handleSave}
  onCancel={handleCancel}
/>

// With auto-focus for new notes
<TodoNote 
  note={null} 
  autoFocus={true}
  onSave={handleSave}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `note` | `Object` | `null` | The todo note object with title and items |
| `onSave` | `Function` | `undefined` | Callback when note is saved |
| `onCancel` | `Function` | `undefined` | Callback when editing is cancelled |
| `autoFocus` | `Boolean` | `false` | Auto-focus title input on mount |
| `className` | `String` | `""` | Additional CSS classes |

## Note Data Structure

```javascript
{
  id: 'note-id',
  type: 'todo',
  title: 'My Todo List',
  content: {
    items: [
      {
        id: 'item-1',
        text: 'First todo item',
        completed: false,
        createdAt: 1640995200000
      },
      {
        id: 'item-2', 
        text: 'Second todo item',
        completed: true,
        createdAt: 1640995260000
      }
    ]
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  userId: 'user-id',
  syncStatus: 'synced'
}
```

## Key Features

### Progress Indicator
- Shows completion percentage and count
- Visual progress bar with smooth animations
- Only displayed when items exist

### Todo Item Management
- Click "Add" button or press Enter to add new items
- Click on item text to edit inline
- Click checkbox to toggle completion
- Click remove button (×) to delete items
- Empty items are not added (trimmed automatically)

### Visual States
- **Incomplete items**: Normal text, empty checkbox
- **Completed items**: Strikethrough text, green checkbox with checkmark, green background
- **Editing mode**: Input field with focus and selection

### Auto-save
- Debounced auto-save (2 second delay)
- Manual save with Ctrl+S
- Visual indicators for save status (Saving, Unsaved changes, Saved)

### Keyboard Shortcuts
- **Ctrl+S**: Manual save
- **Enter**: Add new todo item (when in add input)
- **Enter**: Save edit (when editing item)
- **Escape**: Cancel edit or close (if onCancel provided)

## Integration with NotesContext

The component integrates with the NotesContext for:
- Automatic encryption/decryption
- Cloud synchronization
- Offline support
- Conflict resolution

## Testing

Comprehensive test suite covers:
- Rendering with different states
- Todo item CRUD operations
- Progress calculation
- Visual indicators
- Keyboard interactions
- Edge cases and error handling

Run tests with:
```bash
npm test src/components/notes/__tests__/TodoNote.test.jsx
```

## Example Usage

See `TodoNoteExample.jsx` for a complete implementation example showing:
- Integration with NotesContext
- Create vs Edit modes
- Metadata display
- Error handling