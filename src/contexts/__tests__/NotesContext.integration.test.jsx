import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { NotesProvider, useNotes } from '../NotesContext';
import { useAuth } from '../AuthContext';

// Mock the auth context
vi.mock('../AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock the services
vi.mock('../../lib/appwrite', () => ({
  appwriteService: {
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
    getNote: vi.fn()
  },
  NetworkError: class NetworkError extends Error {},
  ValidationError: class ValidationError extends Error {}
}));

vi.mock('../../lib/encryption', () => ({
  default: {
    generateUserKey: vi.fn(() => 'test-key'),
    encrypt: vi.fn(() => Promise.resolve({ ciphertext: 'encrypted' })),
    decrypt: vi.fn(() => Promise.resolve({ text: 'decrypted' })),
    clearKeyCache: vi.fn()
  }
}));

vi.mock('../../lib/storage', () => ({
  default: {
    getNotes: vi.fn(() => Promise.resolve([])),
    saveNote: vi.fn(() => Promise.resolve({})),
    deleteNote: vi.fn(() => Promise.resolve(true)),
    addToSyncQueue: vi.fn(() => Promise.resolve({})),
    getSyncQueue: vi.fn(() => Promise.resolve([])),
    updateSyncStatus: vi.fn(() => Promise.resolve({})),
    removeFromSyncQueue: vi.fn(() => Promise.resolve(true)),
    incrementRetryCount: vi.fn(() => Promise.resolve({})),
    clearUserData: vi.fn(() => Promise.resolve(true))
  }
}));

const TestComponent = () => {
  const { notes, loading, syncStatus, error } = useNotes();
  
  return (
    <div>
      <div data-testid="notes-count">{notes.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="sync-status">{syncStatus}</div>
      <div data-testid="error">{error || 'no-error'}</div>
    </div>
  );
};

describe('NotesContext Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock authenticated user
    useAuth.mockReturnValue({
      user: { $id: 'test-user', email: 'test@example.com' },
      isAuthenticated: true,
      loading: false,
      error: null
    });
  });

  it('should provide notes context without errors', async () => {
    render(
      <NotesProvider>
        <TestComponent />
      </NotesProvider>
    );

    // Should render without throwing
    expect(screen.getByTestId('notes-count')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByTestId('sync-status')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('should initialize with empty notes array', async () => {
    render(
      <NotesProvider>
        <TestComponent />
      </NotesProvider>
    );

    expect(screen.getByTestId('notes-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('sync-status')).toHaveTextContent('idle');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should handle unauthenticated state', async () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });

    render(
      <NotesProvider>
        <TestComponent />
      </NotesProvider>
    );

    expect(screen.getByTestId('notes-count')).toHaveTextContent('0');
  });
});