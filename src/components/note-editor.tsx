import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trash2,
  Save,
  Clock,
  FileText,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { NoteUI } from "@/lib/api";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHasChanges(false);
    }
  }, [note?.id]);

  useEffect(() => {
    if (note) {
      const titleChanged = title !== note.title;
      const contentChanged = content !== note.content;
      setHasChanges(titleChanged || contentChanged);
    }
  }, [title, content, note]);

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

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em>$1</em>`)
      .replace(
        /`(.*?)`/g,
        `<code class="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono">$1</code>`
      )
      .replace(/^### (.*$)/gm, `<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>`)
      .replace(/^## (.*$)/gm, `<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>`)
      .replace(/^# (.*$)/gm, `<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>`)
      .replace(/^- (.*$)/gm, `<li class="ml-4 list-disc">$1</li>`)
      .replace(/\n\n/g, `</p><p class="mb-4">`)
      .replace(/\n/g, `<br>`);
  };

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="max-w-md text-center">
          <FileText className="mx-auto mb-6 h-16 w-16 opacity-20" />
          <h3 className="mb-2 text-xl font-medium">No note selected</h3>
          <p className="text-sm text-muted-foreground/80">
            Select a note from the sidebar to start editing, or create a new one.
          </p>
        </div>
      </div>
    );
  }

  if (focusMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-background"
      >
        <div className="flex items-center justify-between border-b border-border/30 px-8 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Focus Mode</span>
            {hasChanges && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setFocusMode(false)}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-8 py-12">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="mb-8 w-full border-none bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground/40"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="min-h-[60vh] w-full resize-none border-none bg-transparent text-lg leading-relaxed outline-none placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/30 bg-card/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="border-none bg-transparent text-xl font-semibold outline-none placeholder:text-muted-foreground/40"
          />
          {hasChanges && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
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
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFocusMode(true)}
            className="text-muted-foreground hover:text-foreground"
            title="Focus mode"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={hasChanges ? "text-primary hover:text-primary" : "text-muted-foreground"}
            title="Save (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col ${showPreview ? "w-1/2 border-r border-border/30" : "w-full"}`}>
          <div className="flex-1 overflow-y-auto">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="h-full w-full resize-none border-none bg-transparent p-6 font-mono text-base leading-relaxed outline-none placeholder:text-muted-foreground/40"
              style={{ minHeight: "100%" }}
            />
          </div>
        </div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col overflow-hidden bg-secondary/20"
            >
              <div className="border-b border-border/30 bg-secondary/30 px-6 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Preview
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <h1 className="mb-6 text-2xl font-bold">{title || "Untitled"}</h1>
                {content ? (
                  <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: `<p class="mb-4">${renderMarkdown(content)}</p>`,
                    }}
                  />
                ) : (
                  <p className="italic text-muted-foreground/60">No content yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-border/30 bg-card/30 px-6 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Edited {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
          </div>
          <span className="text-muted-foreground/50">/</span>
          <span>{content.length} characters</span>
          <span className="text-muted-foreground/50">/</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono">Ctrl+S</kbd>
          <span>to save</span>
        </div>
      </div>
    </div>
  );
}
