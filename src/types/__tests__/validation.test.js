/**
 * Unit tests for validation functions
 */

import { describe, it, expect } from "vitest";
import {
  isValidNoteType,
  isValidSyncStatus,
  validateBaseNote,
  validateTextNoteContent,
  validateTodoItem,
  validateTodoNoteContent,
  validateTimetableEntry,
  validateTimetableNoteContent,
  validateNote,
} from "../validation.js";

describe("isValidNoteType", () => {
  it("should return true for valid note types", () => {
    expect(isValidNoteType("text")).toBe(true);
    expect(isValidNoteType("todo")).toBe(true);
    expect(isValidNoteType("timetable")).toBe(true);
  });

  it("should return false for invalid note types", () => {
    expect(isValidNoteType("invalid")).toBe(false);
    expect(isValidNoteType("")).toBe(false);
    expect(isValidNoteType(null)).toBe(false);
    expect(isValidNoteType(undefined)).toBe(false);
  });
});

describe("isValidSyncStatus", () => {
  it("should return true for valid sync statuses", () => {
    expect(isValidSyncStatus("synced")).toBe(true);
    expect(isValidSyncStatus("pending")).toBe(true);
    expect(isValidSyncStatus("conflict")).toBe(true);
  });

  it("should return false for invalid sync statuses", () => {
    expect(isValidSyncStatus("invalid")).toBe(false);
    expect(isValidSyncStatus("")).toBe(false);
    expect(isValidSyncStatus(null)).toBe(false);
    expect(isValidSyncStatus(undefined)).toBe(false);
  });
});

describe("validateBaseNote", () => {
  const validBaseNote = {
    id: "test-id",
    type: "text",
    title: "Test Note",
    content: { text: "Test content" },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: "user-123",
    syncStatus: "pending",
  };

  it("should validate a correct base note", () => {
    const result = validateBaseNote(validBaseNote);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject null or undefined notes", () => {
    expect(validateBaseNote(null).isValid).toBe(false);
    expect(validateBaseNote(undefined).isValid).toBe(false);
    expect(validateBaseNote("not an object").isValid).toBe(false);
  });

  it("should reject notes with missing id", () => {
    const note = { ...validBaseNote, id: "" };
    const result = validateBaseNote(note);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Note must have a valid id");
  });

  it("should reject notes with invalid type", () => {
    const note = { ...validBaseNote, type: "invalid" };
    const result = validateBaseNote(note);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Note must have a valid type (text, todo, or timetable)"
    );
  });

  it("should reject notes with invalid timestamps", () => {
    const note = { ...validBaseNote, createdAt: 0 };
    const result = validateBaseNote(note);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Note must have a valid createdAt timestamp"
    );
  });

  it("should reject notes with invalid userId", () => {
    const note = { ...validBaseNote, userId: "" };
    const result = validateBaseNote(note);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Note must have a valid userId");
  });
});

describe("validateTextNoteContent", () => {
  it("should validate correct text note content", () => {
    const content = { text: "Hello world" };
    const result = validateTextNoteContent(content);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should accept empty text", () => {
    const content = { text: "" };
    const result = validateTextNoteContent(content);
    expect(result.isValid).toBe(true);
  });

  it("should reject non-object content", () => {
    const result = validateTextNoteContent("not an object");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Text note content must be an object");
  });

  it("should reject content without text property", () => {
    const content = { notText: "value" };
    const result = validateTextNoteContent(content);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Text note content must have a text property of type string"
    );
  });
});

describe("validateTodoItem", () => {
  const validTodoItem = {
    id: "item-1",
    text: "Buy groceries",
    completed: false,
    createdAt: Date.now(),
  };

  it("should validate correct todo item", () => {
    const result = validateTodoItem(validTodoItem);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject todo item with missing id", () => {
    const item = { ...validTodoItem, id: "" };
    const result = validateTodoItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Todo item must have a valid id");
  });

  it("should reject todo item with non-boolean completed", () => {
    const item = { ...validTodoItem, completed: "true" };
    const result = validateTodoItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Todo item must have a completed property of type boolean"
    );
  });

  it("should reject todo item with invalid timestamp", () => {
    const item = { ...validTodoItem, createdAt: 0 };
    const result = validateTodoItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Todo item must have a valid createdAt timestamp"
    );
  });
});

describe("validateTodoNoteContent", () => {
  const validTodoContent = {
    items: [
      {
        id: "item-1",
        text: "Task 1",
        completed: false,
        createdAt: Date.now(),
      },
    ],
  };

  it("should validate correct todo note content", () => {
    const result = validateTodoNoteContent(validTodoContent);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should validate empty todo list", () => {
    const content = { items: [] };
    const result = validateTodoNoteContent(content);
    expect(result.isValid).toBe(true);
  });

  it("should reject content without items array", () => {
    const content = { notItems: [] };
    const result = validateTodoNoteContent(content);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Todo note content must have an items array"
    );
  });

  it("should reject content with invalid todo items", () => {
    const content = {
      items: [
        { id: "", text: "Invalid", completed: false, createdAt: Date.now() },
      ],
    };
    const result = validateTodoNoteContent(content);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain("Todo item at index 0");
  });
});

describe("validateTimetableEntry", () => {
  const validEntry = {
    id: "entry-1",
    time: "09:30",
    description: "Meeting",
    completed: false,
    date: "2024-01-15",
  };

  it("should validate correct timetable entry", () => {
    const result = validateTimetableEntry(validEntry);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject entry with invalid time format", () => {
    const entry = { ...validEntry, time: "25:00" };
    const result = validateTimetableEntry(entry);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Timetable entry must have a valid time in HH:MM format"
    );
  });

  it("should reject entry with invalid date format", () => {
    const entry = { ...validEntry, date: "2024/01/15" };
    const result = validateTimetableEntry(entry);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Timetable entry must have a valid date in YYYY-MM-DD format"
    );
  });

  it("should accept valid time formats", () => {
    const times = ["00:00", "12:30", "23:59", "9:15"];
    times.forEach((time) => {
      const entry = { ...validEntry, time };
      const result = validateTimetableEntry(entry);
      expect(result.isValid).toBe(true);
    });
  });
});

describe("validateTimetableNoteContent", () => {
  const validTimetableContent = {
    entries: [
      {
        id: "entry-1",
        time: "09:30",
        description: "Meeting",
        completed: false,
        date: "2024-01-15",
      },
    ],
  };

  it("should validate correct timetable note content", () => {
    const result = validateTimetableNoteContent(validTimetableContent);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should validate empty timetable", () => {
    const content = { entries: [] };
    const result = validateTimetableNoteContent(content);
    expect(result.isValid).toBe(true);
  });

  it("should reject content without entries array", () => {
    const content = { notEntries: [] };
    const result = validateTimetableNoteContent(content);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Timetable note content must have an entries array"
    );
  });
});

describe("validateNote", () => {
  const baseNote = {
    id: "test-id",
    title: "Test Note",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: "user-123",
    syncStatus: "pending",
  };

  it("should validate a complete text note", () => {
    const note = {
      ...baseNote,
      type: "text",
      content: { text: "Hello world" },
    };
    const result = validateNote(note);
    expect(result.isValid).toBe(true);
  });

  it("should validate a complete todo note", () => {
    const note = {
      ...baseNote,
      type: "todo",
      content: {
        items: [
          {
            id: "item-1",
            text: "Task",
            completed: false,
            createdAt: Date.now(),
          },
        ],
      },
    };
    const result = validateNote(note);
    expect(result.isValid).toBe(true);
  });

  it("should validate a complete timetable note", () => {
    const note = {
      ...baseNote,
      type: "timetable",
      content: {
        entries: [
          {
            id: "entry-1",
            time: "09:30",
            description: "Meeting",
            completed: false,
            date: "2024-01-15",
          },
        ],
      },
    };
    const result = validateNote(note);
    expect(result.isValid).toBe(true);
  });

  it("should reject note with mismatched type and content", () => {
    const note = {
      ...baseNote,
      type: "text",
      content: { items: [] }, // Todo content for text note
    };
    const result = validateNote(note);
    expect(result.isValid).toBe(false);
  });
});
