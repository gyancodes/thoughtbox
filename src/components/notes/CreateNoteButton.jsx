import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ClockIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useNotes } from "../../contexts/NotesContext";
import { motion, AnimatePresence } from "motion/react";

const CreateNoteButton = ({ className = "" }) => {
  const { createNote } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedType, setSelectedType] = useState("text");
  const [todoItems, setTodoItems] = useState([]);
  const [timetableEntries, setTimetableEntries] = useState([]);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNoteTitle("");
    setNoteContent("");
    setTodoItems([]);
    setTimetableEntries([]);
    setSelectedType("text");
  };

  const handleSave = async () => {
    const hasTextContent = noteTitle.trim() || noteContent.trim();
    const hasTodoContent = todoItems.some(item => item.text.trim());
    const hasTimetableContent = timetableEntries.some(entry => entry.description.trim());
    
    if (!hasTextContent && !hasTodoContent && !hasTimetableContent) {
      return;
    }

    try {
      let content;
      switch (selectedType) {
        case "text":
          content = { text: noteContent };
          break;
        case "todo":
          content = { items: todoItems.filter((item) => item.text.trim()) };
          break;
        case "timetable":
          content = {
            entries: timetableEntries.filter((entry) =>
              entry.description.trim()
            ),
          };
          break;
        default:
          content = { text: noteContent };
      }

      await createNote(selectedType, content, noteTitle);
      
      // Close modal after save
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === "todo" && todoItems.length === 0) {
      setTodoItems([{ id: Date.now(), text: "", completed: false }]);
    }
    if (type === "timetable" && timetableEntries.length === 0) {
      setTimetableEntries([
        {
          id: Date.now(),
          time: "",
          description: "",
          completed: false,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
  };

  const addTodoItem = () => {
    setTodoItems([
      ...todoItems,
      { id: Date.now(), text: "", completed: false },
    ]);
  };

  const updateTodoItem = (id, text) => {
    setTodoItems(
      todoItems.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const removeTodoItem = (id) => {
    setTodoItems(todoItems.filter((item) => item.id !== id));
  };

  const addTimetableEntry = () => {
    setTimetableEntries([
      ...timetableEntries,
      {
        id: Date.now(),
        time: "",
        description: "",
        completed: false,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const updateTimetableEntry = (id, field, value) => {
    setTimetableEntries(
      timetableEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeTimetableEntry = (id) => {
    setTimetableEntries(timetableEntries.filter((entry) => entry.id !== id));
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.div 
        className={`max-w-2xl mx-auto mb-8 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          onClick={handleOpenModal}
          className="cursor-text p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center space-x-3">
            <PencilIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-secondary)] text-sm">
              Type to create a new note...
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="create-note-modal relative rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - positioned outside content area */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="p-6 pr-16">
              <input
                ref={inputRef}
                type="text"
                placeholder="Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full text-lg font-medium placeholder-[var(--text-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] outline-none mb-4 bg-[var(--bg-tertiary)] p-3 rounded-lg focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
              />

              {selectedType === "text" && (
                <textarea
                  placeholder="Take a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full placeholder-[var(--text-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] outline-none resize-none min-h-[120px] bg-[var(--bg-tertiary)] leading-relaxed p-3 rounded-lg focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
                  rows={4}
                />
              )}

              {selectedType === "todo" && (
                <div className="space-y-3">
                  <AnimatePresence>
                    {todoItems.map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => updateTodoItem(item.id, item.text)}
                          className="rounded border-[var(--border-primary)] text-[var(--text-primary)] focus:ring-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          placeholder="List item"
                          value={item.text}
                          onChange={(e) => updateTodoItem(item.id, e.target.value)}
                          className="flex-1 border border-[var(--border-primary)] outline-none bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] p-2 rounded focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
                        />
                        {todoItems.length > 1 && (
                          <button
                            onClick={() => removeTodoItem(item.id)}
                            className="p-1 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-[var(--text-tertiary)]" />
                          </button>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>
                  <button
                    onClick={addTodoItem}
                    className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Add item</span>
                  </button>
                </div>
              )}

              {selectedType === "timetable" && (
                <div className="space-y-3">
                  <AnimatePresence>
                    {timetableEntries.map((entry, index) => (
                      <div key={entry.id} className="flex items-center space-x-3">
                        <input
                          type="time"
                          value={entry.time}
                          onChange={(e) =>
                            updateTimetableEntry(entry.id, "time", e.target.value)
                          }
                          className="border border-[var(--border-primary)] bg-[var(--bg-tertiary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Activity"
                          value={entry.description}
                          onChange={(e) =>
                            updateTimetableEntry(entry.id, "description", e.target.value)
                          }
                          className="flex-1 border border-[var(--border-primary)] outline-none bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] p-2 rounded focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
                        />
                        {timetableEntries.length > 1 && (
                          <button
                            onClick={() => removeTimetableEntry(entry.id)}
                            className="p-1 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-[var(--text-tertiary)]" />
                          </button>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>
                  <button
                    onClick={addTimetableEntry}
                    className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Add entry</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-primary)]">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleTypeChange("text")}
                    className={`p-3 rounded-lg transition-colors ${
                      selectedType === "text"
                        ? "bg-[var(--accent-primary)] text-white"
                        : "hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                    }`}
                    title="Text note"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleTypeChange("todo")}
                    className={`p-3 rounded-lg transition-colors ${
                      selectedType === "todo"
                        ? "bg-[var(--accent-primary)] text-white"
                        : "hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                    }`}
                    title="Todo list"
                  >
                    <ListBulletIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleTypeChange("timetable")}
                    className={`p-3 rounded-lg transition-colors ${
                      selectedType === "timetable"
                        ? "bg-[var(--accent-primary)] text-white"
                        : "hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                    }`}
                    title="Timetable"
                  >
                    <ClockIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateNoteButton;