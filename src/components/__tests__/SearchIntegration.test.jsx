import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotesProvider, useNotes } from '../../contexts/NotesContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../SearchBar';
import { NoteGrid } from '../notes';

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
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

// Test component that integrates search functionality
const SearchIntegrationTest = () => {
  const { notes, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState({ results: [], query: '', totalResults: 0 });

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = searchNotes(query);
    setSearchResults(results);
  };

  const displayNotes = searchQuery ? searchResults.results : notes;

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search notes..."
        showResultsCount={true}
        resultsCount={searchResults.totalResults}
        totalNotes={notes.length}
        debounceMs={100}
      />
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="results-count">{searchResults.totalResults}</div>
      <NoteGrid
        notes={displayNotes}
        searchQuery={searchQuery}
        onNoteClick={() => {}}
        onNoteEdit={() => {}}
        onNoteDelete={() => {}}
      />
    </div>
  );
};

describe('Search Integration Tests', () => {
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

  it('should integrate SearchBar with NotesContext search functionality', async () => {
    render(
      <NotesProvider>
        <SearchIntegrationTest />
      </NotesProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search notes...');
    
    // Type in search query
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Wait for debounced search
    await waitFor(() => {
      expect(screen.getByTestId('search-query')).toHaveTextContent('test query');
    }, { timeout: 200 });
  });

  it('should show search results count', async () => {
    render(
      <NotesProvider>
        <SearchIntegrationTest />
      </NotesProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText(/No results found for "test"/)).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('should clear search results when query is cleared', async () => {
    render(
      <NotesProvider>
        <SearchIntegrationTest />
      </NotesProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search notes...');
    
    // Enter search query
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('search-query')).toHaveTextContent('test');
    });
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('search-query')).toHaveTextContent('');
    });
  });

  it('should handle keyboard shortcuts for search', async () => {
    render(
      <NotesProvider>
        <SearchIntegrationTest />
      </NotesProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search notes...');
    
    // Test Ctrl+K to focus search
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(searchInput).toHaveFocus();
    
    // Type search query
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Test Escape to clear
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    expect(searchInput.value).toBe('');
  });
});