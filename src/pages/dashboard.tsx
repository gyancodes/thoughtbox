import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { api, type NoteUI } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/sidebar";
import { NoteEditor } from "@/components/note-editor";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<NoteUI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  // Check auth on mount, then load notes
  useEffect(() => {
    async function initDashboard() {
      try {
        const user = await api.getCurrentUser();
        if (!user) {
          navigate({ to: "/login" });
          return;
        }
        setIsAuthenticated(true);
        setUserName(user.name || user.email || "User");
        loadNotes();
      } catch {
        navigate({ to: "/login" });
      }
    }
    initDashboard();
  }, [navigate]);

  // Debounced search - only run when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timer = setTimeout(() => {
      loadNotes(searchQuery || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isAuthenticated]);

  async function loadNotes(search?: string) {
    try {
      setIsLoading(true);
      setError("");
      const fetchedNotes = await api.getNotes(search);
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetchedNotes[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        navigate({ to: "/login" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateNote() {
    try {
      const newNote = await api.createNote({
        title: "Untitled",
        content: "",
      });
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    }
  }

  async function handleSaveNote(noteId: string, data: { title: string; content: string }) {
    try {
      const updated = await api.updateNote(noteId, data);
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note");
      throw err;
    }
  }

  async function handleDeleteNote(noteId: string) {
    try {
      await api.deleteNote(noteId);
      const remainingNotes = notes.filter((n) => n.id !== noteId);
      setNotes(remainingNotes);
      if (selectedNoteId === noteId) {
        setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
      throw err;
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        isOpen={sidebarOpen}
        isLoading={isLoading}
        searchQuery={searchQuery}
        userName={userName}
        onSelectNote={setSelectedNoteId}
        onCreateNote={handleCreateNote}
        onSearchChange={setSearchQuery}
        onToggle={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Bar (when sidebar is closed) */}
        {!sidebarOpen && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/30">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              {selectedNote?.title || "ThoughtBox"}
            </span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
            <button 
              onClick={() => setError("")}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Note Editor */}
        <div className="flex-1 overflow-hidden">
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
          />
        </div>
      </div>
    </div>
  );
}
