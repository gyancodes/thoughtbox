import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import {
  NotesProvider,
  useNotes,
  SYNC_STATUS,
  NOTE_SYNC_STATUS,
} from "../NotesContext";
import { AuthProvider } from "../AuthContext";
import { appwriteService } from "../../lib/appwrite";
import encryptionService from "../../lib/encryption";
import storageService from "../../lib/storage";

// Mock dependencies
vi.mock("../../lib/appwrite");
vi.mock("../../lib/encryption");
vi.mock("../../lib/storage");

// Mock user for testing
const mockUser = {
  $id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
};

// Mock note data
const mockNote = {
  id: "test-note-1",
  type: "text",
  title: "Test Note",
  content: { text: "This is a test note" },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  userId: "test-user-id",
  syncStatus: NOTE_SYNC_STATUS.SYNCED,
};

const mockEncryptedNote = {
  ...mockNote,
  content: {
    ciphertext: "encrypted-content",
    iv: "test-iv",
    hmac: "test-hmac",
    algorithm: "AES-256-CBC-HMAC",
  },
};

// Test component to access notes context
const TestComponent = () => {
  const {
    notes,
    loading,
    syncStatus,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNotesByType,
  } = useNotes();

  return (
    <div>
      <div data-testid="notes-count">{notes.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="sync-status">{syncStatus}</div>
      <div data-testid="error">{error || "no-error"}</div>
      <button
        data-testid="create-note"
        onClick={() => createNote("text", { text: "New note" }, "New Note")}
      >
        Create Note
      </button>
      <button
        data-testid="update-note"
        onClick={() => updateNote("test-note-1", { title: "Updated Note" })}
      >
        Update Note
      </button>
      <button
        data-testid="delete-note"
        onClick={() => deleteNote("test-note-1")}
      >
        Delete Note
      </button>
      <button data-testid="search-notes" onClick={() => searchNotes("test")}>
        Search Notes
      </button>
    </div>
  );
};

// Wrapper component with auth context
const TestWrapper = ({ children, isAuthenticated = true }) => {
  const mockAuthValue = {
    user: isAuthenticated ? mockUser : null,
    isAuthenticated,
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
    refreshSession: vi.fn(),
    clearError: vi.fn(),
    clearSensitiveData: vi.fn(),
  };

  return (
    <AuthProvider value={mockAuthValue}>
      <NotesProvider>{children}</NotesProvider>
    </AuthProvider>
  );
};

describe("NotesContext", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock encryption service
    encryptionService.generateUserKey.mockReturnValue("test-encryption-key");
    encryptionService.encrypt.mockResolvedValue(mockEncryptedNote.content);
    encryptionService.decrypt.mockResolvedValue(mockNote.content);

    // Mock storage service
    storageService.getNotes.mockResolvedValue([mockEncryptedNote]);
    storageService.saveNote.mockResolvedValue(mockEncryptedNote);
    storageService.deleteNote.mockResolvedValue(true);
    storageService.addToSyncQueue.mockResolvedValue({ id: "queue-item-1" });
    storageService.getSyncQueue.mockResolvedValue([]);
    storageService.updateSyncStatus.mockResolvedValue(mockNote);

    // Mock appwrite service
    appwriteService.createNote.mockResolvedValue(mockEncryptedNote);
    appwriteService.updateNote.mockResolvedValue(mockEncryptedNote);
    appwriteService.deleteNote.mockResolvedValue(true);

    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Provider initialization", () => {
    it("should provide notes context to children", () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId("notes-count")).toBeInTheDocument();
      expect(screen.getByTestId("sync-status")).toBeInTheDocument();
    });

    it("should throw error when useNotes is used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useNotes must be used within a NotesProvider");

      consoleSpy.mockRestore();
    });
  });

  describe("Authentication integration", () => {
    it("should initialize encryption key when user is authenticated", async () => {
      render(
        <TestWrapper isAuthenticated={true}>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(encryptionService.generateUserKey).toHaveBeenCalledWith(
          mockUser.$id,
          mockUser.email
        );
      });
    });

    it("should clear encryption key when user is not authenticated", async () => {
      render(
        <TestWrapper isAuthenticated={false}>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(encryptionService.clearKeyCache).toHaveBeenCalled();
      });
    });
  });

  describe("Notes loading", () => {
    it("should load and decrypt notes on initialization", async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(storageService.getNotes).toHaveBeenCalledWith(mockUser.$id);
        expect(encryptionService.decrypt).toHaveBeenCalledWith(
          mockEncryptedNote.content,
          "test-encryption-key"
        );
      });

      expect(screen.getByTestId("notes-count")).toHaveTextContent("1");
    });

    it("should handle decryption errors gracefully", async () => {
      encryptionService.decrypt.mockRejectedValue(
        new Error("Decryption failed")
      );

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId("notes-count")).toHaveTextContent("1");
      });
    });
  });

  describe("Note creation", () => {
    it("should create and encrypt new note", async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await act(async () => {
        screen.getByTestId("create-note").click();
      });

      await waitFor(() => {
        expect(encryptionService.encrypt).toHaveBeenCalledWith(
          { text: "New note" },
          "test-encryption-key"
        );
        expect(storageService.saveNote).toHaveBeenCalled();
        expect(storageService.addToSyncQueue).toHaveBeenCalledWith({
          type: "create",
          noteId: expect.any(String),
          data: expect.any(Object),
        });
      });
    });

    it("should handle creation errors", async () => {
      storageService.saveNote.mockRejectedValue(new Error("Storage failed"));

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await act(async () => {
        screen.getByTestId("create-note").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("error")).not.toHaveTextContent("no-error");
      });
    });
  });

  describe("Note updating", () => {
    it("should update and re-encrypt note", async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("notes-count")).toHaveTextContent("1");
      });

      await act(async () => {
        screen.getByTestId("update-note").click();
      });

      await waitFor(() => {
        expect(storageService.saveNote).toHaveBeenCalled();
        expect(storageService.addToSyncQueue).toHaveBeenCalledWith({
          type: "update",
          noteId: "test-note-1",
          data: expect.any(Object),
        });
      });
    });
  });

  describe("Note deletion", () => {
    it("should delete note and add to sync queue", async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("notes-count")).toHaveTextContent("1");
      });

      await act(async () => {
        screen.getByTestId("delete-note").click();
      });

      await waitFor(() => {
        expect(storageService.deleteNote).toHaveBeenCalledWith("test-note-1");
        expect(storageService.addToSyncQueue).toHaveBeenCalledWith({
          type: "delete",
          noteId: "test-note-1",
        });
        expect(screen.getByTestId("notes-count")).toHaveTextContent("0");
      });
    });
  });

  describe("Sync functionality", () => {
    it("should sync pending operations with cloud", async () => {
      const mockSyncQueue = [
        {
          id: "sync-1",
          operation: "create",
          noteId: "test-note-1",
          data: mockEncryptedNote,
        },
      ];

      storageService.getSyncQueue.mockResolvedValue(mockSyncQueue);

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(appwriteService.createNote).toHaveBeenCalledWith(
          mockEncryptedNote
        );
        expect(storageService.removeFromSyncQueue).toHaveBeenCalledWith(
          "sync-1"
        );
      });
    });

    it("should handle sync errors with retry logic", async () => {
      const mockSyncQueue = [
        {
          id: "sync-1",
          operation: "create",
          noteId: "test-note-1",
          data: mockEncryptedNote,
        },
      ];

      storageService.getSyncQueue.mockResolvedValue(mockSyncQueue);
      appwriteService.createNote.mockRejectedValue(new Error("Network error"));
      storageService.incrementRetryCount.mockResolvedValue({ retryCount: 1 });

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(storageService.incrementRetryCount).toHaveBeenCalledWith(
          "sync-1"
        );
      });
    });
  });

  describe("Offline functionality", () => {
    it("should handle offline state", async () => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Simulate offline event
      await act(async () => {
        window.dispatchEvent(new Event("offline"));
      });

      await waitFor(() => {
        expect(screen.getByTestId("sync-status")).toHaveTextContent(
          SYNC_STATUS.OFFLINE
        );
      });
    });

    it("should trigger sync when coming back online", async () => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Simulate coming back online
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event("online"));
      });

      await waitFor(() => {
        expect(storageService.getSyncQueue).toHaveBeenCalled();
      });
    });
  });

  describe("Search and filtering", () => {
    it("should search notes by content", async () => {
      const { rerender } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Wait for notes to load
      await waitFor(() => {
        expect(screen.getByTestId("notes-count")).toHaveTextContent("1");
      });

      // Test search functionality would need to be implemented in the test component
      // This is a basic structure test
      expect(screen.getByTestId("search-notes")).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should handle encryption key unavailable error", async () => {
      encryptionService.generateUserKey.mockReturnValue(null);

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await act(async () => {
        screen.getByTestId("create-note").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("error")).not.toHaveTextContent("no-error");
      });
    });
  });
});
