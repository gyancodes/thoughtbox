import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Save,
  Clock,
  FileText,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { NoteUI } from "@/lib/api";

interface NoteEditorProps {
  note: NoteUI | null;
  onSave: (noteId: string, data: { title: string; content: string }) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export function NoteEditor({ note, onSave, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync state with note prop
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHasChanges(false);
    }
  }, [note?.id]);

  // Track changes
  useEffect(() => {
    if (note) {
      const titleChanged = title !== note.title;
      const contentChanged = content !== note.content;
      setHasChanges(titleChanged || contentChanged);
    }
  }, [title, content, note]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, content, note, focusMode]);

  const handleSave = useCallback(async () => {
    if (!note || !hasChanges) return;
    
    setIsSaving(true);
    try {
      await onSave(note.id, { title, content });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [note, title, content, hasChanges, onSave]);

  const handleDelete = useCallback(async () => {
    if (!note) return;
    
    if (window.confirm("Are you sure you want to delete this note?")) {
      await onDelete(note.id);
    }
  }, [note, onDelete]);

  // Render markdown preview (simple implementation)
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em>$1</em>`)
      .replace(/`(.*?)`/g, `<code class="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono">$1</code>`)
      .replace(/^### (.*$)/gm, `<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>`)
      .replace(/^## (.*$)/gm, `<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>`)
      .replace(/^# (.*$)/gm, `<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>`)
      .replace(/^- (.*$)/gm, `<li class="ml-4 list-disc">$1</li>`)
      .replace(/\n\n/g, `</p><p class="mb-4">`)
      .replace(/\n/g, `<br>`);
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-6 opacity-20" />
          <h3 className="text-xl font-medium mb-2">No note selected</h3>
          <p className="text-sm text-muted-foreground/80">
            Select a note from the sidebar to start editing, or create a new one.
          </p>
        </div>
      </div>
    );
  }

  // Focus Mode View
  if (focusMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 flex flex-col"
      >
        {/* Focus Mode Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border/30">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Focus Mode</span>
            {hasChanges && (
              <span className="text-xs text-amber-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFocusMode(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Focus Mode Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full text-4xl font-bold bg-transparent border-none outline-none mb-8 placeholder:text-muted-foreground/40"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="w-full min-h-[60vh] text-lg leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-card/30">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
          />
          {hasChanges && (
            <span className="text-xs text-amber-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
            className="text-muted-foreground hover:text-foreground"
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFocusMode(true)}
            className="text-muted-foreground hover:text-foreground"
            title="Focus mode"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={hasChanges ? "text-primary hover:text-primary" : "text-muted-foreground"}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2 border-r border-border/30' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="w-full h-full p-6 text-base leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 font-mono"
              style={{ minHeight: "100%" }}
            />
          </div>
        </div>

        {/* Preview Pane */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col bg-secondary/20 overflow-hidden"
            >
              <div className="px-6 py-3 border-b border-border/30 bg-secondary/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <h1 className="text-2xl font-bold mb-6">{title || "Untitled"}</h1>
                {content ? (
                  <div 
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderMarkdown(content)}</p>` }}
                  />
                ) : (
                  <p className="text-muted-foreground/60 italic">No content yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/30 bg-card/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Edited {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
          </div>
          <span className="text-muted-foreground/50">•</span>
          <span>{content.length} characters</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Ctrl+S</kbd>
          <span>to save</span>
        </div>
      </div>
    </div>
  );
}
