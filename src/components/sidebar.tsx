import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Folder,
  Star,
  Trash2,
  ChevronLeft,
  FileText,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { NoteUI } from "@/lib/api";

interface SidebarProps {
  notes: NoteUI[];
  selectedNoteId: string | null;
  isOpen: boolean;
  isLoading: boolean;
  searchQuery: string;
  userName?: string;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onSearchChange: (query: string) => void;
  onToggle: () => void;
  onLogout: () => void;
}

const FOLDERS = [
  { id: "all", name: "All Notes", icon: Folder, count: 0 },
  { id: "favorites", name: "Favorites", icon: Star, count: 0 },
  { id: "trash", name: "Trash", icon: Trash2, count: 0 },
];

export function Sidebar({
  notes,
  selectedNoteId,
  isOpen,
  isLoading,
  searchQuery,
  userName = "User",
  onSelectNote,
  onCreateNote,
  onSearchChange,
  onToggle,
  onLogout,
}: SidebarProps) {
  const [activeFolder, setActiveFolder] = useState("all");

  // Update folder counts
  const foldersWithCounts = FOLDERS.map(folder => ({
    ...folder,
    count: folder.id === "all" ? notes.length : 0
  }));

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex flex-col h-full border-r border-border/30 bg-card/50 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="p-5 border-b border-border/30">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-base">ThoughtBox</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onToggle}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-10 shadow-lg shadow-primary/20"
              onClick={onCreateNote}
            >
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-9 bg-secondary/50 border-border/30 focus:border-primary/50"
              />
            </div>
          </div>

          {/* Folders */}
          <div className="px-4 pb-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 px-2">
              Folders
            </h3>
            <div className="space-y-0.5">
              {foldersWithCounts.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    activeFolder === folder.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <folder.icon className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className="text-xs text-muted-foreground/60">{folder.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 px-2">
              Recent Notes
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 px-4">
                <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground/60">No notes yet</p>
                <p className="text-xs text-muted-foreground/40 mt-1">Create your first note</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`w-full flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg text-left transition-all ${
                      selectedNoteId === note.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-secondary/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-sm truncate max-w-[180px] ${
                        selectedNoteId === note.id ? 'text-primary font-medium' : 'text-foreground'
                      }`}>
                        {note.title || "Untitled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-xs text-muted-foreground/60 truncate max-w-[160px]">
                        {note.content.substring(0, 40) || "No content"}
                        {note.content.length > 40 ? "..." : ""}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/40">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-border/30 bg-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[140px]">{userName}</span>
                  <span className="text-[10px] text-muted-foreground/60">Free Plan</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
