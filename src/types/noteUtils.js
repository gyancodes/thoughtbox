/**
 * Utility functions for note creation and manipulation
 */

import {
  validateNote,
  validateTodoItem,
  validateTimetableEntry,
} from "./validation.js";

/**
 * Generates a unique ID for notes and items
 * @returns {string} Unique identifier
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a new base note structure
 * @param {string} type - The type of note ('text', 'todo', 'timetable')
 * @param {string} title - The title of the note
 * @param {Object} content - The content of the note
 * @param {string} userId - The ID of the user creating the note
 * @returns {Object} New note object
 */
export function createBaseNote(type, title, content, userId) {
  const now = Date.now();
  return {
    id: generateId(),
    type,
    title: title || "",
    content,
    createdAt: now,
    updatedAt: now,
    userId,
    syncStatus: "pending",
  };
}

/**
 * Creates a new text note
 * @param {string} title - The title of the note
 * @param {string} text - The text content
 * @param {string} userId - The ID of the user creating the note
 * @returns {Object} New text note object
 */
export function createTextNote(title, text = "", userId) {
  const content = { text };
  return createBaseNote("text", title, content, userId);
}

/**
 * Creates a new todo note
 * @param {string} title - The title of the note
 * @param {Array} items - Initial todo items (optional)
 * @param {string} userId - The ID of the user creating the note
 * @returns {Object} New todo note object
 */
export function createTodoNote(title, items = [], userId) {
  const content = { items };
  return createBaseNote("todo", title, content, userId);
}

/**
 * Creates a new timetable note
 * @param {string} title - The title of the note
 * @param {Array} entries - Initial timetable entries (optional)
 * @param {string} userId - The ID of the user creating the note
 * @returns {Object} New timetable note object
 */
export function createTimetableNote(title, entries = [], userId) {
  const content = { entries };
  return createBaseNote("timetable", title, content, userId);
}

/**
 * Creates a new todo item
 * @param {string} text - The text content of the todo item
 * @param {boolean} completed - Whether the item is completed (default: false)
 * @returns {Object} New todo item object
 */
export function createTodoItem(text, completed = false) {
  return {
    id: generateId(),
    text,
    completed,
    createdAt: Date.now(),
  };
}

/**
 * Creates a new timetable entry
 * @param {string} time - Time in HH:MM format
 * @param {string} description - Description of the entry
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {boolean} completed - Whether the entry is completed (default: false)
 * @returns {Object} New timetable entry object
 */
export function createTimetableEntry(
  time,
  description,
  date,
  completed = false
) {
  return {
    id: generateId(),
    time,
    description,
    completed,
    date,
  };
}

/**
 * Updates a note's content and timestamp
 * @param {Object} note - The note to update
 * @param {Object} newContent - The new content
 * @returns {Object} Updated note object
 */
export function updateNoteContent(note, newContent) {
  return {
    ...note,
    content: newContent,
    updatedAt: Date.now(),
    syncStatus: "pending",
  };
}

/**
 * Updates a note's title and timestamp
 * @param {Object} note - The note to update
 * @param {string} newTitle - The new title
 * @returns {Object} Updated note object
 */
export function updateNoteTitle(note, newTitle) {
  return {
    ...note,
    title: newTitle,
    updatedAt: Date.now(),
    syncStatus: "pending",
  };
}

/**
 * Adds a todo item to a todo note
 * @param {Object} todoNote - The todo note to update
 * @param {string} text - The text for the new todo item
 * @returns {Object} Updated todo note object
 */
export function addTodoItem(todoNote, text) {
  if (todoNote.type !== "todo") {
    throw new Error("Can only add todo items to todo notes");
  }

  const newItem = createTodoItem(text);
  const newItems = [...todoNote.content.items, newItem];

  return updateNoteContent(todoNote, { items: newItems });
}

/**
 * Updates a todo item in a todo note
 * @param {Object} todoNote - The todo note to update
 * @param {string} itemId - The ID of the item to update
 * @param {Object} updates - The updates to apply to the item
 * @returns {Object} Updated todo note object
 */
export function updateTodoItem(todoNote, itemId, updates) {
  if (todoNote.type !== "todo") {
    throw new Error("Can only update todo items in todo notes");
  }

  const newItems = todoNote.content.items.map((item) =>
    item.id === itemId ? { ...item, ...updates } : item
  );

  return updateNoteContent(todoNote, { items: newItems });
}

/**
 * Removes a todo item from a todo note
 * @param {Object} todoNote - The todo note to update
 * @param {string} itemId - The ID of the item to remove
 * @returns {Object} Updated todo note object
 */
export function removeTodoItem(todoNote, itemId) {
  if (todoNote.type !== "todo") {
    throw new Error("Can only remove todo items from todo notes");
  }

  const newItems = todoNote.content.items.filter((item) => item.id !== itemId);

  return updateNoteContent(todoNote, { items: newItems });
}

/**
 * Adds a timetable entry to a timetable note
 * @param {Object} timetableNote - The timetable note to update
 * @param {string} time - Time in HH:MM format
 * @param {string} description - Description of the entry
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Object} Updated timetable note object
 */
export function addTimetableEntry(timetableNote, time, description, date) {
  if (timetableNote.type !== "timetable") {
    throw new Error("Can only add timetable entries to timetable notes");
  }

  const newEntry = createTimetableEntry(time, description, date);
  const newEntries = [...timetableNote.content.entries, newEntry];

  return updateNoteContent(timetableNote, { entries: newEntries });
}

/**
 * Updates a timetable entry in a timetable note
 * @param {Object} timetableNote - The timetable note to update
 * @param {string} entryId - The ID of the entry to update
 * @param {Object} updates - The updates to apply to the entry
 * @returns {Object} Updated timetable note object
 */
export function updateTimetableEntry(timetableNote, entryId, updates) {
  if (timetableNote.type !== "timetable") {
    throw new Error("Can only update timetable entries in timetable notes");
  }

  const newEntries = timetableNote.content.entries.map((entry) =>
    entry.id === entryId ? { ...entry, ...updates } : entry
  );

  return updateNoteContent(timetableNote, { entries: newEntries });
}

/**
 * Removes a timetable entry from a timetable note
 * @param {Object} timetableNote - The timetable note to update
 * @param {string} entryId - The ID of the entry to remove
 * @returns {Object} Updated timetable note object
 */
export function removeTimetableEntry(timetableNote, entryId) {
  if (timetableNote.type !== "timetable") {
    throw new Error("Can only remove timetable entries from timetable notes");
  }

  const newEntries = timetableNote.content.entries.filter(
    (entry) => entry.id !== entryId
  );

  return updateNoteContent(timetableNote, { entries: newEntries });
}

/**
 * Sorts timetable entries by time
 * @param {Object} timetableNote - The timetable note to sort
 * @returns {Object} Timetable note with sorted entries
 */
export function sortTimetableEntries(timetableNote) {
  if (timetableNote.type !== "timetable") {
    throw new Error("Can only sort timetable entries in timetable notes");
  }

  const sortedEntries = [...timetableNote.content.entries].sort((a, b) => {
    // First sort by date, then by time
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.time.localeCompare(b.time);
  });

  return updateNoteContent(timetableNote, { entries: sortedEntries });
}

/**
 * Marks a note as synced
 * @param {Object} note - The note to mark as synced
 * @returns {Object} Updated note object
 */
export function markNoteSynced(note) {
  return {
    ...note,
    syncStatus: "synced",
  };
}

/**
 * Marks a note as having sync conflict
 * @param {Object} note - The note to mark as conflicted
 * @returns {Object} Updated note object
 */
export function markNoteConflicted(note) {
  return {
    ...note,
    syncStatus: "conflict",
  };
}

/**
 * Creates a deep copy of a note
 * @param {Object} note - The note to clone
 * @returns {Object} Cloned note object
 */
export function cloneNote(note) {
  return JSON.parse(JSON.stringify(note));
}

/**
 * Validates and creates a note, throwing an error if invalid
 * @param {string} type - The type of note
 * @param {string} title - The title of the note
 * @param {Object} content - The content of the note
 * @param {string} userId - The ID of the user creating the note
 * @returns {Object} New note object
 * @throws {Error} If the note is invalid
 */
export function createValidatedNote(type, title, content, userId) {
  const note = createBaseNote(type, title, content, userId);
  const validation = validateNote(note);

  if (!validation.isValid) {
    throw new Error(`Invalid note: ${validation.errors.join(", ")}`);
  }

  return note;
}
