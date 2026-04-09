import { useEffect, useRef, useCallback, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, indentWithTab, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput, HighlightStyle } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { tags } from "@lezer/highlight";

// Custom theme that integrates with our CSS variables
const thoughtboxTheme = EditorView.theme({
  "&": {
    height: "100%",
    width: "100%",
    fontSize: "15px",
    backgroundColor: "transparent",
  },
  ".cm-scroller": {
    overflow: "auto",
    height: "100%",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', monospace",
  },
  ".cm-content": {
    padding: "24px 0",
    caretColor: "var(--primary)",
    lineHeight: "1.7",
    minHeight: "100%",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--primary)",
    borderLeftWidth: "2px",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--primary)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "1px solid color-mix(in oklab, var(--border) 40%, transparent)",
    color: "var(--muted-foreground)",
    paddingRight: "12px",
    display: "flex",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--primary)",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in oklab, var(--primary) 5%, transparent)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in oklab, var(--primary) 20%, transparent) !important",
  },
  ".cm-selectionMatch": {
    backgroundColor: "color-mix(in oklab, var(--primary) 12%, transparent)",
  },
  ".cm-line": {
    padding: "0 24px",
  },
  ".cm-placeholder": {
    color: "var(--muted-foreground)",
    fontStyle: "italic",
    opacity: 0.5,
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "color-mix(in oklab, var(--secondary) 50%, transparent)",
    border: "1px solid var(--border)",
    color: "var(--muted-foreground)",
    borderRadius: "4px",
    padding: "0 6px",
  },
  // Search panel
  ".cm-panels": {
    backgroundColor: "var(--card)",
    borderBottom: "1px solid var(--border)",
    color: "var(--foreground)",
  },
  ".cm-panels input, .cm-panels button": {
    color: "var(--foreground)",
  },
  ".cm-searchMatch": {
    backgroundColor: "color-mix(in oklab, var(--primary) 25%, transparent)",
    outline: "1px solid color-mix(in oklab, var(--primary) 40%, transparent)",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
  },
  // Tooltip
  ".cm-tooltip": {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    color: "var(--popover-foreground)",
  },
});

// Markdown-specific syntax highlighting
const markdownHighlighting = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "1.8em", fontWeight: "700", color: "var(--foreground)", margin: "0.5em 0" },
  { tag: tags.heading2, fontSize: "1.5em", fontWeight: "600", color: "var(--foreground)", margin: "0.4em 0" },
  { tag: tags.heading3, fontSize: "1.25em", fontWeight: "600", color: "var(--foreground)", margin: "0.3em 0" },
  { tag: tags.emphasis, fontStyle: "italic", color: "var(--foreground)" },
  { tag: tags.strong, fontWeight: "700", color: "var(--foreground)" },
  { tag: tags.link, color: "var(--primary)", textDecoration: "underline" },
  { tag: tags.monospace, fontFamily: "inherit", backgroundColor: "color-mix(in oklab, var(--secondary) 60%, transparent)", borderRadius: "3px", padding: "1px 4px" },
  { tag: tags.quote, color: "var(--muted-foreground)", fontStyle: "italic" },
  { tag: tags.list, color: "var(--primary)" },
]);

interface UseCodeMirrorOptions {
  initialDoc: string;
  onChange: (doc: string) => void;
  placeholderText?: string;
  lineNumbersEnabled?: boolean;
}

export function useCodeMirror({
  initialDoc,
  onChange,
  placeholderText = "Start writing...",
  lineNumbersEnabled = true,
}: UseCodeMirrorOptions) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Use a callback ref to handle container switching (e.g. Focus Mode toggle)
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setDoc = useCallback((newDoc: string) => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== newDoc) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: newDoc },
      });
    }
  }, []);

  useEffect(() => {
    if (!container) return;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        history(),
        drawSelection(),
        rectangularSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        lineNumbersEnabled ? [lineNumbers(), highlightActiveLineGutter()] : [],
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        syntaxHighlighting(markdownHighlighting),
        thoughtboxTheme,
        placeholder(placeholderText),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: container,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [container, lineNumbersEnabled, initialDoc]); // React to container changes

  return { containerRef, viewRef, setDoc };
}
