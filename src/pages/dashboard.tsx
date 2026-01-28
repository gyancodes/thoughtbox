import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Folder, 
  Star, 
  Trash2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckSquare,
  Loader2,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type NoteUI } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

// Static Data
const FOLDERS = [
  { id: "all", name: "All Notes", icon: Folder },
  { id: "favorites", name: "Favorites", icon: Star },
  { id: "trash", name: "Trash", icon: Trash2 },
];

const TAGS = [
  { id: "personal", name: "Personal", color: "bg-red-500" },
  { id: "work", name: "Work", color: "bg-blue-500" },
  { id: "ideas", name: "Ideas", color: "bg-yellow-500" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<NoteUI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState<{ title: string; content: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);
  const displayNote = selectedNote ? {
    ...selectedNote,
    title: editingNote?.title ?? selectedNote.title,
    content: editingNote?.content ?? selectedNote.content,
  } : null;

  // Check auth on mount, then load notes
  useEffect(() => {
    async function initDashboard() {
      const user = await api.getCurrentUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      setIsAuthenticated(true);
      loadNotes();
    }
    initDashboard();
  }, []);

  // Debounced search - only run when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timer = setTimeout(() => {
      if (searchQuery) {
        loadNotes(searchQuery);
      } else {
        loadNotes();
      }
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
        tags: [],
      });
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
      setEditingNote({ title: newNote.title, content: newNote.content });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    }
  }

  async function handleDeleteNote(noteId: string) {
    try {
      await api.deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(notes.length > 1 ? notes[0].id : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    }
  }

  async function handleUpdateNote() {
    if (!selectedNote || !editingNote) return;

    try {
      const updated = await api.updateNote(selectedNote.id, {
        title: editingNote.title,
        content: editingNote.content,
      });
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
      setEditingNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note");
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
      navigate({ to: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    }
  }

  function handleNoteChange(field: "title" | "content", value: string) {
    if (!selectedNote) return;
    
    setEditingNote({
      title: editingNote?.title ?? selectedNote.title,
      content: editingNote?.content ?? selectedNote.content,
      [field]: value,
    });
  }

  // Auto-save on blur
  function handleBlur() {
    if (editingNote) {
      handleUpdateNote();
    }
  }

  function formatDate(date: Date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col border-r border-border/50 bg-secondary/5 h-full shrink-0"
          >
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                T
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                ThoughtBox
              </span>
            </div>

            <div className="px-3 mb-4">
              <Button 
                className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                onClick={handleCreateNote}
                data-testid="button-new-note"
              >
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            </div>

            <div className="px-3 mb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  className="pl-9 bg-card border-border/50 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3">
              <div className="space-y-1 py-4">
                {FOLDERS.map((folder) => (
                  <Button
                    key={folder.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-medium"
                  >
                    <folder.icon className="w-4 h-4" />
                    {folder.name}
                  </Button>
                ))}
              </div>

              <Separator className="my-2 bg-border/50" />

              <div className="py-4">
                <h4 className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Tags
                </h4>
                <div className="space-y-1">
                  {TAGS.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    >
                      <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border/50 space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Note List */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-background/50 h-full shrink-0">
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <span className="font-semibold text-sm">All Notes</span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && notes.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm text-muted-foreground">No notes yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first note to get started</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notes.map((note) => {
                const preview = note.content.substring(0, 100).replace(/\n/g, ' ');
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-4 border-b border-border/20 cursor-pointer transition-all hover:bg-secondary/30 ${
                      selectedNoteId === note.id ? "bg-secondary/50 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                    }`}
                    data-testid={`note-item-${note.id}`}
                  >
                    <h3 className={`font-semibold text-sm mb-1 ${selectedNoteId === note.id ? "text-primary" : "text-foreground"}`}>
                      {note.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                      {preview}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {note.tags.map((tagId: string) => {
                          const tag = TAGS.find((t) => t.id === tagId);
                          return tag ? (
                            <div key={tagId} className={`w-1.5 h-1.5 rounded-full ${tag.color}`} />
                          ) : null;
                        })}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <main className="flex-1 flex flex-col h-full bg-background relative z-0">
        {error && (
          <div className="absolute top-4 right-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm z-10">
            {error}
          </div>
        )}
        
        {displayNote ? (
          <>
            <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs" data-testid="text-last-edited">Last edited {formatDate(displayNote.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                   <Star className="w-4 h-4" />
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                   onClick={() => handleDeleteNote(displayNote.id)}
                   data-testid="button-delete-note"
                 >
                   <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="h-12 border-b border-border/50 flex items-center px-4 gap-1 overflow-x-auto">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <Italic className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-2" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <CheckSquare className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-2" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <LinkIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-12 px-8">
                 <textarea 
                    className="w-full text-4xl font-display font-bold bg-transparent border-none focus:ring-0 focus:outline-none resize-none placeholder:text-muted-foreground/50 mb-4"
                    placeholder="Untitled"
                    value={displayNote.title}
                    onChange={(e) => handleNoteChange("title", e.target.value)}
                    onBlur={handleBlur}
                    data-testid="input-note-title"
                    rows={1}
                 />
                 <textarea
                   className="w-full min-h-[400px] bg-transparent border-none focus:ring-0 focus:outline-none resize-none font-sans text-lg leading-relaxed text-foreground/90 placeholder:text-muted-foreground/50"
                   placeholder="Start writing..."
                   value={displayNote.content}
                   onChange={(e) => handleNoteChange("content", e.target.value)}
                   onBlur={handleBlur}
                   data-testid="input-note-content"
                 />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">No note selected</p>
            <p className="text-sm">Select a note from the sidebar to start writing.</p>
          </div>
        )}
      </main>
    </div>
  );
}
