// Application constants
export const NOTE_TYPES = {
  TEXT: 'text',
  TODO: 'todo',
  TIMETABLE: 'timetable'
};

export const SYNC_STATUS = {
  SYNCED: 'synced',
  PENDING: 'pending',
  CONFLICT: 'conflict'
};

export const STORAGE_KEYS = {
  NOTES: 'thoughtbox_notes',
  USER_SESSION: 'thoughtbox_session',
  SYNC_QUEUE: 'thoughtbox_sync_queue'
};

export const ENCRYPTION_CONFIG = {
  ALGORITHM: 'AES',
  KEY_SIZE: 256,
  IV_SIZE: 16,
  ITERATIONS: 10000
};