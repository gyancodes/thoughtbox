/**
 * Validation functions for note data models
 */

/**
 * Validates if a string is a valid note type
 * @param {string} type - The type to validate
 * @returns {boolean} True if valid note type
 */
export function isValidNoteType(type) {
  return ['text', 'todo', 'timetable'].includes(type);
}

/**
 * Validates if a string is a valid sync status
 * @param {string} status - The status to validate
 * @returns {boolean} True if valid sync status
 */
export function isValidSyncStatus(status) {
  return ['synced', 'pending', 'conflict'].includes(status);
}

/**
 * Validates a base note structure
 * @param {Object} note - The note to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateBaseNote(note) {
  const errors = [];

  if (!note || typeof note !== 'object') {
    errors.push('Note must be an object');
    return { isValid: false, errors };
  }

  if (!note.id || typeof note.id !== 'string' || note.id.trim() === '') {
    errors.push('Note must have a valid id');
  }

  if (!isValidNoteType(note.type)) {
    errors.push('Note must have a valid type (text, todo, or timetable)');
  }

  if (!note.title || typeof note.title !== 'string') {
    errors.push('Note must have a valid title');
  }

  if (!note.content || typeof note.content !== 'object') {
    errors.push('Note must have valid content object');
  }

  if (!note.createdAt || typeof note.createdAt !== 'number' || note.createdAt <= 0) {
    errors.push('Note must have a valid createdAt timestamp');
  }

  if (!note.updatedAt || typeof note.updatedAt !== 'number' || note.updatedAt <= 0) {
    errors.push('Note must have a valid updatedAt timestamp');
  }

  if (!note.userId || typeof note.userId !== 'string' || note.userId.trim() === '') {
    errors.push('Note must have a valid userId');
  }

  if (!isValidSyncStatus(note.syncStatus)) {
    errors.push('Note must have a valid syncStatus');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates text note content
 * @param {Object} content - The content to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateTextNoteContent(content) {
  const errors = [];

  if (!content || typeof content !== 'object') {
    errors.push('Text note content must be an object');
    return { isValid: false, errors };
  }

  if (typeof content.text !== 'string') {
    errors.push('Text note content must have a text property of type string');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates a todo item
 * @param {Object} item - The todo item to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateTodoItem(item) {
  const errors = [];

  if (!item || typeof item !== 'object') {
    errors.push('Todo item must be an object');
    return { isValid: false, errors };
  }

  if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
    errors.push('Todo item must have a valid id');
  }

  if (typeof item.text !== 'string') {
    errors.push('Todo item must have a text property of type string');
  }

  if (typeof item.completed !== 'boolean') {
    errors.push('Todo item must have a completed property of type boolean');
  }

  if (!item.createdAt || typeof item.createdAt !== 'number' || item.createdAt <= 0) {
    errors.push('Todo item must have a valid createdAt timestamp');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates todo note content
 * @param {Object} content - The content to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateTodoNoteContent(content) {
  const errors = [];

  if (!content || typeof content !== 'object') {
    errors.push('Todo note content must be an object');
    return { isValid: false, errors };
  }

  if (!Array.isArray(content.items)) {
    errors.push('Todo note content must have an items array');
    return { isValid: false, errors };
  }

  content.items.forEach((item, index) => {
    const itemValidation = validateTodoItem(item);
    if (!itemValidation.isValid) {
      errors.push(`Todo item at index ${index}: ${itemValidation.errors.join(', ')}`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates a timetable entry
 * @param {Object} entry - The timetable entry to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateTimetableEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== 'object') {
    errors.push('Timetable entry must be an object');
    return { isValid: false, errors };
  }

  if (!entry.id || typeof entry.id !== 'string' || entry.id.trim() === '') {
    errors.push('Timetable entry must have a valid id');
  }

  if (typeof entry.time !== 'string' || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(entry.time)) {
    errors.push('Timetable entry must have a valid time in HH:MM format');
  }

  if (typeof entry.description !== 'string') {
    errors.push('Timetable entry must have a description property of type string');
  }

  if (typeof entry.completed !== 'boolean') {
    errors.push('Timetable entry must have a completed property of type boolean');
  }

  if (typeof entry.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
    errors.push('Timetable entry must have a valid date in YYYY-MM-DD format');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates timetable note content
 * @param {Object} content - The content to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateTimetableNoteContent(content) {
  const errors = [];

  if (!content || typeof content !== 'object') {
    errors.push('Timetable note content must be an object');
    return { isValid: false, errors };
  }

  if (!Array.isArray(content.entries)) {
    errors.push('Timetable note content must have an entries array');
    return { isValid: false, errors };
  }

  content.entries.forEach((entry, index) => {
    const entryValidation = validateTimetableEntry(entry);
    if (!entryValidation.isValid) {
      errors.push(`Timetable entry at index ${index}: ${entryValidation.errors.join(', ')}`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates a complete note based on its type
 * @param {Object} note - The note to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validateNote(note) {
  const baseValidation = validateBaseNote(note);
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  let contentValidation;
  switch (note.type) {
    case 'text':
      contentValidation = validateTextNoteContent(note.content);
      break;
    case 'todo':
      contentValidation = validateTodoNoteContent(note.content);
      break;
    case 'timetable':
      contentValidation = validateTimetableNoteContent(note.content);
      break;
    default:
      return { isValid: false, errors: ['Invalid note type'] };
  }

  return {
    isValid: contentValidation.isValid,
    errors: [...baseValidation.errors, ...contentValidation.errors]
  };
}