# Core Note Components

This directory contains the core note display components for the Secure Notes App.

## Components

### NoteCard

A component for displaying individual notes with the following features:

- **Note type indicators**: Shows appropriate icons for text, todo, and timetable notes
- **Preview content**: Displays truncated content based on note type
- **Sync status indicators**: Visual indicators for sync status (synced, pending, conflict, error)
- **Interactive menu**: Hover menu with edit and delete options
- **Responsive design**: Adapts to different screen sizes using Tailwind CSS

**Props:**
- `note` (object): The note object to display
- `onClick` (function): Callback when the card is clicked
- `onEdit` (function): Callback when edit is selected from menu
- `onDelete` (function): Callback when delete is selected from menu

### NoteGrid

A component for displaying notes in a responsive grid layout with the following features:

- **Responsive grid**: 1-5 columns based on screen size
- **Loading states**: Shows skeleton loading animation
- **Empty states**: Displays helpful message when no notes are available
- **Note selection**: Support for selecting multiple notes (for future bulk operations)

**Props:**
- `notes` (array): Array of note objects to display
- `loading` (boolean): Whether to show loading skeleton
- `onNoteClick` (function): Callback when a note is clicked
- `onNoteEdit` (function): Callback when a note edit is requested
- `onNoteDelete` (function): Callback when a note delete is requested
- `emptyMessage` (string): Custom message for empty state
- `className` (string): Additional CSS classes

### NotesDemo

A demo component showcasing the note components with sample data.

## Requirements Fulfilled

### Requirement 6.1: Grid/Card Layout Display
✅ **WHEN the app loads THEN the system SHALL display notes in a grid/card layout**
- Implemented responsive grid layout with 1-5 columns
- Cards display notes with proper spacing and alignment

### Requirement 6.4: Note Type Indicators and Preview Content
✅ **WHEN displaying notes THEN the system SHALL show note type icons and preview content**
- Text notes: Show document icon and text preview
- Todo notes: Show list icon, completion status, and task preview
- Timetable notes: Show clock icon and time entry preview
- All notes show sync status indicators

## Usage Example

```jsx
import { NoteGrid, NoteCard } from './components/notes';

// Display notes in a grid
<NoteGrid
  notes={notes}
  loading={isLoading}
  onNoteClick={handleNoteClick}
  onNoteEdit={handleNoteEdit}
  onNoteDelete={handleNoteDelete}
  emptyMessage="Create your first note!"
/>

// Display individual note card
<NoteCard
  note={note}
  onClick={handleClick}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Styling

The components use Tailwind CSS for styling with:
- Responsive breakpoints (sm, lg, xl, 2xl)
- Hover effects and transitions
- Consistent spacing and colors
- Accessibility-friendly design

## Testing

Comprehensive test suite includes:
- Unit tests for individual components
- Integration tests for component interaction
- Requirement validation tests
- Edge case handling (empty states, loading states, etc.)

Run tests with: `npm test src/components/notes/`