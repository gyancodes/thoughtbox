/**
 * @typedef {'text' | 'todo' | 'timetable'} NoteType
 */

/**
 * @typedef {'synced' | 'pending' | 'conflict'} SyncStatus
 */

/**
 * @typedef {Object} BaseNote
 * @property {string} id - Unique identifier for the note
 * @property {NoteType} type - Type of the note
 * @property {string} title - Title of the note
 * @property {Object} content - Encrypted content of the note
 * @property {number} createdAt - Creation timestamp
 * @property {number} updatedAt - Last update timestamp
 * @property {string} userId - ID of the user who owns the note
 * @property {SyncStatus} syncStatus - Current sync status
 */

/**
 * @typedef {Object} TextNoteContent
 * @property {string} text - The text content
 */

/**
 * @typedef {Object} TodoItem
 * @property {string} id - Unique identifier for the todo item
 * @property {string} text - Text content of the todo item
 * @property {boolean} completed - Whether the item is completed
 * @property {number} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} TodoNoteContent
 * @property {TodoItem[]} items - Array of todo items
 */

/**
 * @typedef {Object} TimetableEntry
 * @property {string} id - Unique identifier for the entry
 * @property {string} time - Time in HH:MM format
 * @property {string} description - Description of the entry
 * @property {boolean} completed - Whether the entry is completed
 * @property {string} date - Date in YYYY-MM-DD format
 */

/**
 * @typedef {Object} TimetableNoteContent
 * @property {TimetableEntry[]} entries - Array of timetable entries
 */

/**
 * @typedef {BaseNote & {content: TextNoteContent}} TextNote
 */

/**
 * @typedef {BaseNote & {content: TodoNoteContent}} TodoNote
 */

/**
 * @typedef {BaseNote & {content: TimetableNoteContent}} TimetableNote
 */

/**
 * @typedef {TextNote | TodoNote | TimetableNote} Note
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID from Clerk
 * @property {string} email - User email
 * @property {string} name - User name
 */

// Export validation functions
export {
  isValidNoteType,
  isValidSyncStatus,
  validateBaseNote,
  validateTextNoteContent,
  validateTodoItem,
  validateTodoNoteContent,
  validateTimetableEntry,
  validateTimetableNoteContent,
  validateNote
} from './validation.js';

// Export utility functions
export {
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
} from './noteUtils.js';