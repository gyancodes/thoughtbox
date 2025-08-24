import { describe, it, expect, beforeEach, vi } from 'vitest';
import StorageService from '../storage.js';

// Mock IndexedDB with working async behavior
const createWorkingMockIndexedDB = () => {
  const databases = new Map();
  
  return {
    open(name, version) {
      const request = {
        result: null,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null
      };

      // Simulate async database opening
      Promise.resolve().then(() => {
        let db = databases.get(name);
        
        if (!db) {
          // Create new database
          const stores = new Map();
          
          db = {
            name,
            version,
            stores,
            objectStoreNames: {
              contains: (storeName) => stores.has(storeName)
            },
            
            createObjectStore(storeName, options = {}) {
              const data = new Map();
              const store = {
                name: storeName,
                keyPath: options.keyPath || 'id',
                data,
                
                createIndex: vi.fn(),
                
                put(value) {
                  const req = { onsuccess: null, onerror: null, result: null };
                  Promise.resolve().then(() => {
                    try {
                      const key = value[this.keyPath] || value.id || value.key;
                      this.data.set(key, { ...value });
                      req.result = key;
                      if (req.onsuccess) req.onsuccess();
                    } catch (error) {
                      req.error = error;
                      if (req.onerror) req.onerror();
                    }
                  });
                  return req;
                },
                
                get(key) {
                  const req = { onsuccess: null, onerror: null, result: null };
                  Promise.resolve().then(() => {
                    req.result = this.data.get(key) || null;
                    if (req.onsuccess) req.onsuccess();
                  });
                  return req;
                },
                
                getAll(query) {
                  const req = { onsuccess: null, onerror: null, result: [] };
                  Promise.resolve().then(() => {
                    let result = Array.from(this.data.values());
                    if (query) {
                      result = result.filter(item => 
                        item.userId === query || item.type === query
                      );
                    }
                    req.result = result;
                    if (req.onsuccess) req.onsuccess();
                  });
                  return req;
                },
                
                delete(key) {
                  const req = { onsuccess: null, onerror: null, result: false };
                  Promise.resolve().then(() => {
                    req.result = this.data.delete(key);
                    if (req.onsuccess) req.onsuccess();
                  });
                  return req;
                },
                
                clear() {
                  const req = { onsuccess: null, onerror: null };
                  Promise.resolve().then(() => {
                    this.data.clear();
                    if (req.onsuccess) req.onsuccess();
                  });
                  return req;
                },
                
                count() {
                  const req = { onsuccess: null, onerror: null, result: 0 };
                  Promise.resolve().then(() => {
                    req.result = this.data.size;
                    if (req.onsuccess) req.onsuccess();
                  });
                  return req;
                },
                
                index(name) {
                  return {
                    getAll: this.getAll.bind(this)
                  };
                }
              };
              
              stores.set(storeName, store);
              return store;
            },
            
            transaction(storeNames, mode = 'readonly') {
              const storeArray = Array.isArray(storeNames) ? storeNames : [storeNames];
              return {
                objectStore: (name) => stores.get(name),
                mode,
                error: null
              };
            },
            
            close() {
              // Mock close
            }
          };
          
          databases.set(name, db);
          
          // Trigger upgrade needed
          if (request.onupgradeneeded) {
            const event = {
              target: { result: db },
              oldVersion: 0,
              newVersion: version
            };
            request.onupgradeneeded(event);
          }
        }
        
        request.result = db;
        if (request.onsuccess) {
          request.onsuccess();
        }
      });

      return request;
    }
  };
};

describe('StorageService Integration Tests', () => {
  let originalIndexedDB;

  beforeEach(() => {
    originalIndexedDB = global.indexedDB;
    global.indexedDB = createWorkingMockIndexedDB();
    
    StorageService.db = null;
    StorageService.isInitialized = false;
  });

  afterEach(() => {
    global.indexedDB = originalIndexedDB;
    if (StorageService.db) {
      StorageService.close();
    }
  });

  it('should initialize successfully', async () => {
    await StorageService.initialize();
    expect(StorageService.isInitialized).toBe(true);
    expect(StorageService.db).toBeTruthy();
  });

  it('should save and retrieve a note', async () => {
    await StorageService.initialize();
    
    const mockNote = {
      id: 'test-note-1',
      userId: 'user-123',
      type: 'text',
      title: 'Test Note',
      content: { text: 'This is a test note' },
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    const savedNote = await StorageService.saveNote(mockNote);
    expect(savedNote).toMatchObject(mockNote);
    expect(savedNote.updatedAt).toBeTruthy();
    expect(savedNote.syncStatus).toBe('pending');

    const retrievedNote = await StorageService.getNote(mockNote.id);
    expect(retrievedNote).toMatchObject(mockNote);
  });

  it('should handle sync queue operations', async () => {
    await StorageService.initialize();
    
    const operation = {
      type: 'create',
      noteId: 'test-note-1',
      data: { title: 'Test Note' }
    };

    const queueItem = await StorageService.addToSyncQueue(operation);
    expect(queueItem.operation).toBe('create');
    expect(queueItem.noteId).toBe('test-note-1');
    expect(queueItem.id).toBeTruthy();

    const queue = await StorageService.getSyncQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].operation).toBe('create');
  });

  it('should handle metadata operations', async () => {
    await StorageService.initialize();
    
    await StorageService.setMetadata('lastSync', '2024-01-01T00:00:00.000Z');
    const retrieved = await StorageService.getMetadata('lastSync');
    expect(retrieved).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should validate required parameters', async () => {
    await StorageService.initialize();
    
    await expect(StorageService.saveNote(null))
      .rejects.toThrow('Note must have an id');
    
    await expect(StorageService.getNotes(''))
      .rejects.toThrow('User ID is required');
  });
});