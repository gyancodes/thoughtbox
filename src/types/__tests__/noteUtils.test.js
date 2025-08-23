/**
 * Unit tests for note utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateId,
  createBaseNote,
  createTextNote,
  createTodoNote,
  createTimetableNote,
  createTodoItem,
  createTimetableEntry,
  updateNoteContent,
  updateNoteTitle,
  addTodoItem,
  updateTodoItem,
  removeTodoItem,
  addTimetableEntry,
  updateTimetableEntry,
  removeTimetableEntry,
  sortTimetableEntries,
  markNoteSynced,
  markNoteConflicted,
  cloneNote,
  createValidatedNote
} from '../noteUtils.js';

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
});

describe('createBaseNote', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a valid base note', () => {
    const note = createBaseNote('text', 'Test Title', { text: 'content' }, 'user-123');
    
    expect(note.type).toBe('text');
    expect(note.title).toBe('Test Title');
    expect(note.content).toEqual({ text: 'content' });
    expect(note.userId).toBe('user-123');
    expect(note.syncStatus).toBe('pending');
    expect(note.createdAt).toBe(Date.now());
    expect(note.updatedAt).toBe(Date.now());
    expect(note.id).toBeDefined();
  });

  it('should handle empty title', () => {
    const note = createBaseNote('text', '', { text: 'content' }, 'user-123');
    expect(note.title).toBe('');
  });
});

describe('createTextNote', () => {
  it('should create a valid text note', () => {
    const note = createTextNote('My Note', 'Hello world', 'user-123');
    
    expect(note.type).toBe('text');
    expect(note.title).toBe('My Note');
    expect(note.content.text).toBe('Hello world');
    expect(note.userId).toBe('user-123');
  });

  it('should create text note with empty text', () => {
    const note = createTextNote('Empty Note', '', 'user-123');
    expect(note.content.text).toBe('');
  });

  it('should create text note with default empty text', () => {
    const note = createTextNote('Default Note', undefined, 'user-123');
    expect(note.content.text).toBe('');
  });
});

describe('createTodoNote', () => {
  it('should create a valid todo note', () => {
    const items = [{ id: '1', text: 'Task 1', completed: false, createdAt: Date.now() }];
    const note = createTodoNote('My Todos', items, 'user-123');
    
    expect(note.type).toBe('todo');
    expect(note.title).toBe('My Todos');
    expect(note.content.items).toEqual(items);
    expect(note.userId).toBe('user-123');
  });

  it('should create todo note with empty items', () => {
    const note = createTodoNote('Empty Todos', [], 'user-123');
    expect(note.content.items).toEqual([]);
  });

  it('should create todo note with default empty items', () => {
    const note = createTodoNote('Default Todos', undefined, 'user-123');
    expect(note.content.items).toEqual([]);
  });
});

describe('createTimetableNote', () => {
  it('should create a valid timetable note', () => {
    const entries = [{ 
      id: '1', 
      time: '09:00', 
      description: 'Meeting', 
      completed: false, 
      date: '2024-01-15' 
    }];
    const note = createTimetableNote('My Schedule', entries, 'user-123');
    
    expect(note.type).toBe('timetable');
    expect(note.title).toBe('My Schedule');
    expect(note.content.entries).toEqual(entries);
    expect(note.userId).toBe('user-123');
  });

  it('should create timetable note with empty entries', () => {
    const note = createTimetableNote('Empty Schedule', [], 'user-123');
    expect(note.content.entries).toEqual([]);
  });
});

describe('createTodoItem', () => {
  it('should create a valid todo item', () => {
    const item = createTodoItem('Buy milk', false);
    
    expect(item.text).toBe('Buy milk');
    expect(item.completed).toBe(false);
    expect(item.id).toBeDefined();
    expect(item.createdAt).toBeDefined();
  });

  it('should create completed todo item', () => {
    const item = createTodoItem('Done task', true);
    expect(item.completed).toBe(true);
  });

  it('should default to not completed', () => {
    const item = createTodoItem('Default task');
    expect(item.completed).toBe(false);
  });
});

describe('createTimetableEntry', () => {
  it('should create a valid timetable entry', () => {
    const entry = createTimetableEntry('14:30', 'Doctor appointment', '2024-01-15', false);
    
    expect(entry.time).toBe('14:30');
    expect(entry.description).toBe('Doctor appointment');
    expect(entry.date).toBe('2024-01-15');
    expect(entry.completed).toBe(false);
    expect(entry.id).toBeDefined();
  });

  it('should default to not completed', () => {
    const entry = createTimetableEntry('10:00', 'Meeting', '2024-01-15');
    expect(entry.completed).toBe(false);
  });
});

describe('updateNoteContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update note content and timestamp', () => {
    const originalNote = createTextNote('Test', 'Original', 'user-123');
    
    // Advance time to ensure different timestamp
    vi.advanceTimersByTime(1000);
    
    const updatedNote = updateNoteContent(originalNote, { text: 'Updated' });
    
    expect(updatedNote.content.text).toBe('Updated');
    expect(updatedNote.updatedAt).toBeGreaterThan(originalNote.updatedAt);
    expect(updatedNote.syncStatus).toBe('pending');
  });
});

describe('updateNoteTitle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update note title and timestamp', () => {
    const originalNote = createTextNote('Original Title', 'Content', 'user-123');
    
    // Advance time to ensure different timestamp
    vi.advanceTimersByTime(1000);
    
    const updatedNote = updateNoteTitle(originalNote, 'New Title');
    
    expect(updatedNote.title).toBe('New Title');
    expect(updatedNote.updatedAt).toBeGreaterThan(originalNote.updatedAt);
    expect(updatedNote.syncStatus).toBe('pending');
  });
});

describe('addTodoItem', () => {
  it('should add todo item to todo note', () => {
    const todoNote = createTodoNote('My Todos', [], 'user-123');
    const updatedNote = addTodoItem(todoNote, 'New task');
    
    expect(updatedNote.content.items).toHaveLength(1);
    expect(updatedNote.content.items[0].text).toBe('New task');
    expect(updatedNote.content.items[0].completed).toBe(false);
  });

  it('should throw error for non-todo notes', () => {
    const textNote = createTextNote('Text', 'Content', 'user-123');
    expect(() => addTodoItem(textNote, 'Task')).toThrow('Can only add todo items to todo notes');
  });
});

describe('updateTodoItem', () => {
  it('should update specific todo item', () => {
    const item = createTodoItem('Original task', false);
    const todoNote = createTodoNote('Todos', [item], 'user-123');
    const updatedNote = updateTodoItem(todoNote, item.id, { text: 'Updated task', completed: true });
    
    expect(updatedNote.content.items[0].text).toBe('Updated task');
    expect(updatedNote.content.items[0].completed).toBe(true);
  });

  it('should throw error for non-todo notes', () => {
    const textNote = createTextNote('Text', 'Content', 'user-123');
    expect(() => updateTodoItem(textNote, 'id', {})).toThrow('Can only update todo items in todo notes');
  });
});

describe('removeTodoItem', () => {
  it('should remove specific todo item', () => {
    const item1 = createTodoItem('Task 1', false);
    const item2 = createTodoItem('Task 2', false);
    const todoNote = createTodoNote('Todos', [item1, item2], 'user-123');
    const updatedNote = removeTodoItem(todoNote, item1.id);
    
    expect(updatedNote.content.items).toHaveLength(1);
    expect(updatedNote.content.items[0].id).toBe(item2.id);
  });

  it('should throw error for non-todo notes', () => {
    const textNote = createTextNote('Text', 'Content', 'user-123');
    expect(() => removeTodoItem(textNote, 'id')).toThrow('Can only remove todo items from todo notes');
  });
});

describe('addTimetableEntry', () => {
  it('should add timetable entry to timetable note', () => {
    const timetableNote = createTimetableNote('Schedule', [], 'user-123');
    const updatedNote = addTimetableEntry(timetableNote, '10:00', 'Meeting', '2024-01-15');
    
    expect(updatedNote.content.entries).toHaveLength(1);
    expect(updatedNote.content.entries[0].time).toBe('10:00');
    expect(updatedNote.content.entries[0].description).toBe('Meeting');
    expect(updatedNote.content.entries[0].date).toBe('2024-01-15');
  });

  it('should throw error for non-timetable notes', () => {
    const textNote = createTextNote('Text', 'Content', 'user-123');
    expect(() => addTimetableEntry(textNote, '10:00', 'Meeting', '2024-01-15'))
      .toThrow('Can only add timetable entries to timetable notes');
  });
});

describe('sortTimetableEntries', () => {
  it('should sort entries by date and time', () => {
    const entry1 = createTimetableEntry('14:00', 'Afternoon', '2024-01-15');
    const entry2 = createTimetableEntry('09:00', 'Morning', '2024-01-15');
    const entry3 = createTimetableEntry('10:00', 'Next day', '2024-01-16');
    
    const timetableNote = createTimetableNote('Schedule', [entry1, entry2, entry3], 'user-123');
    const sortedNote = sortTimetableEntries(timetableNote);
    
    expect(sortedNote.content.entries[0].time).toBe('09:00');
    expect(sortedNote.content.entries[1].time).toBe('14:00');
    expect(sortedNote.content.entries[2].date).toBe('2024-01-16');
  });
});

describe('markNoteSynced', () => {
  it('should mark note as synced', () => {
    const note = createTextNote('Test', 'Content', 'user-123');
    const syncedNote = markNoteSynced(note);
    
    expect(syncedNote.syncStatus).toBe('synced');
  });
});

describe('markNoteConflicted', () => {
  it('should mark note as conflicted', () => {
    const note = createTextNote('Test', 'Content', 'user-123');
    const conflictedNote = markNoteConflicted(note);
    
    expect(conflictedNote.syncStatus).toBe('conflict');
  });
});

describe('cloneNote', () => {
  it('should create deep copy of note', () => {
    const original = createTodoNote('Todos', [createTodoItem('Task', false)], 'user-123');
    const clone = cloneNote(original);
    
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.content.items).not.toBe(original.content.items);
  });
});

describe('createValidatedNote', () => {
  it('should create valid note', () => {
    const note = createValidatedNote('text', 'Title', { text: 'Content' }, 'user-123');
    expect(note.type).toBe('text');
    expect(note.title).toBe('Title');
  });

  it('should throw error for invalid note', () => {
    expect(() => createValidatedNote('invalid', 'Title', { text: 'Content' }, 'user-123'))
      .toThrow('Invalid note');
  });
});