import { useCallback, useEffect, useState, useRef } from "react";
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
import { useCodeMirror } from "@/hooks/use-codemirror";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteEditorProps {
  note: NoteUI | null;
  onSave: (noteId: string, data: { title: string; content: string }) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

// Markdown preview components for the preview pane
const markdownComponents = {
  h1: ({ node, ...props }: Record<string, any>) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b border-border/50 pb-2" {...props} />,
  h2: ({ node, ...props }: Record<string, any>) => <h2 className="text-2xl font-semibold mt-6 mb-3 border-b border-border/50 pb-2" {...props} />,
  h3: ({ node, ...props }: Record<string, any>) => <h3 className="text-xl font-medium mt-5 mb-2" {...props} />,
  p: ({ node, ...props }: Record<string, any>) => <p className="leading-7 mb-4 text-foreground/90" {...props} />,
  ul: ({ node, ...props }: Record<string, any>) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: ({ node, ...props }: Record<string, any>) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: ({ node, ...props }: Record<string, any>) => <li className="leading-7" {...props} />,
  code: ({ node, inline, className, children, ...props }: Record<string, any>) => {
    return !inline ? (
      <pre className="bg-secondary/40 p-4 rounded-lg overflow-x-auto mb-4 border border-border/50 text-sm">
        <code className={className} {...props}>{children}</code>
      </pre>
    ) : (
      <code className="bg-secondary/60 px-1.5 py-0.5 rounded-md text-sm font-mono text-primary" {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ node, ...props }: Record<string, any>) => <blockquote className="border-l-4 border-primary/40 pl-4 py-1 italic bg-secondary/10 text-foreground/80 mb-4 rounded-r-md" {...props} />,
  a: ({ node, ...props }: Record<string, any>) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  strong: ({ node, ...props }: Record<string, any>) => <strong className="font-bold text-foreground" {...props} />,
  em: ({ node, ...props }: Record<string, any>) => <em className="italic" {...props} />,
  table: ({ node, ...props }: Record<string, any>) => <div className="overflow-x-auto mb-4"><table className="min-w-full border-collapse border border-border/50" {...props} /></div>,
  th: ({ node, ...props }: Record<string, any>) => <th className="border border-border/70 bg-secondary/30 px-4 py-2 font-semibold text-left" {...props} />,
  td: ({ node, ...props }: Record<string, any>) => <td className="border border-border/50 px-4 py-2" {...props} />,
  hr: ({ node, ...props }: Record<string, any>) => <hr className="my-8 border-t border-border/50" {...props} />,
};

export function NoteEditor({ note, onSave, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Content ref to track latest content for save handler
  const contentRef = useRef(content);
  const titleRef = useRef(title);
  contentRef.current = content;
  titleRef.current = title;

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  // Main editor CodeMirror instance
  const { containerRef: editorRef, setDoc } = useCodeMirror({
    initialDoc: note?.content || "",
    onChange: handleContentChange,
    placeholderText: "Start writing your thoughts...",
    lineNumbersEnabled: true,
  });

  // Focus mode CodeMirror instance
  const { containerRef: focusEditorRef, setDoc: setFocusDoc } = useCodeMirror({
    initialDoc: note?.content || "",
    onChange: handleContentChange,
    placeholderText: "Start writing your thoughts...",
    lineNumbersEnabled: false,
  });

  // Sync note data when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setDoc(note.content);
      setFocusDoc(note.content);
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

  // Sync content between editors when toggling focus mode
  useEffect(() => {
    if (focusMode) {
      setFocusDoc(contentRef.current);
    } else {
      setDoc(contentRef.current);
    }
  }, [focusMode]);

  const handleSave = useCallback(async () => {
    if (!note || !hasChanges) return;

    setIsSaving(true);
    try {
      await onSave(note.id, { title: titleRef.current, content: contentRef.current });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [note, hasChanges, onSave]);

  const handleDelete = useCallback(async () => {
    if (!note) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      await onDelete(note.id);
    }
  }, [note, onDelete]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleSave, focusMode]);

  // Empty state
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

  // Focus mode
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

        <div className="flex-1 overflow-hidden">
          <div className="mx-auto h-full max-w-4xl flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="shrink-0 border-none bg-transparent px-8 pt-12 pb-4 text-4xl font-bold outline-none placeholder:text-muted-foreground/40"
            />
            <div ref={focusEditorRef} className="flex-1 overflow-hidden" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Normal mode
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/30 bg-card/30 px-6 py-3">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="flex-1 min-w-0 border-none bg-transparent text-xl font-semibold outline-none placeholder:text-muted-foreground/40"
          />
          {hasChanges && (
            <span className="shrink-0 flex items-center gap-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-4">
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

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* CodeMirror Editor Pane */}
        <div className={`flex flex-col ${showPreview ? "w-1/2 border-r border-border/30" : "w-full"}`}>
          <div ref={editorRef} className="flex-1 overflow-hidden" />
        </div>

        {/* Markdown Preview Pane */}
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
                <h1 className="mb-6 text-3xl font-bold">{title || "Untitled"}</h1>
                {content ? (
                  <div className="max-w-none text-foreground break-words overflow-hidden">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents as any}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="italic text-muted-foreground/60">No content yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-border/30 bg-card/30 px-6 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Edited {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
          </div>
          <span className="text-muted-foreground/50">·</span>
          <span>{content.length} chars</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{content.split("\n").length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono">Ctrl+S</kbd>
          <span>save</span>
          <span className="text-muted-foreground/30">|</span>
          <kbd className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono">Ctrl+F</kbd>
          <span>find</span>
        </div>
      </div>
    </div>
  );
}
