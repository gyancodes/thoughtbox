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

const CreateNoteButton = ({ className = "" }) => {
  const { createNote } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedType, setSelectedType] = useState("text");
  const [todoItems, setTodoItems] = useState([]);
  const [timetableEntries, setTimetableEntries] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        setNoteTitle("");
        setNoteContent("");
        setTodoItems([]);
        setTimetableEntries([]);
        setSelectedType("text");
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
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
      
      // Close after save
      setIsExpanded(false);
      setNoteTitle("");
      setNoteContent("");
      setTodoItems([]);
      setTimetableEntries([]);
      setSelectedType("text");
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
    <div className={`max-w-2xl mx-auto mb-8 ${className}`} ref={containerRef}>
      {!isExpanded ? (
        <div
          onClick={handleExpand}
          className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-text p-4"
        >
          <div className="flex items-center space-x-3">
            <PencilIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 flex-1">Take a note...</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTypeChange("todo");
                  handleExpand();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Create todo list"
              >
                <ListBulletIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTypeChange("timetable");
                  handleExpand();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Create timetable"
              >
                <ClockIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="bg-white/95 backdrop-blur-xl border border-gray-300 rounded-xl shadow-xl p-4"
          style={{
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full text-lg font-medium placeholder-gray-500 border-none outline-none mb-3"
          />

          {selectedType === "text" && (
            <textarea
              placeholder="Take a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full placeholder-gray-500 border-none outline-none resize-none min-h-[100px]"
              rows={4}
            />
          )}

          {selectedType === "todo" && (
            <div className="space-y-2">
              {todoItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => updateTodoItem(item.id, item.text)}
                    className="rounded"
                  />
                  <input
                    type="text"
                    placeholder="List item"
                    value={item.text}
                    onChange={(e) => updateTodoItem(item.id, e.target.value)}
                    className="flex-1 border-none outline-none"
                  />
                  {todoItems.length > 1 && (
                    <button
                      onClick={() => removeTodoItem(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTodoItem}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-1"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Add item</span>
              </button>
            </div>
          )}

          {selectedType === "timetable" && (
            <div className="space-y-2">
              {timetableEntries.map((entry) => (
                <div key={entry.id} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={entry.time}
                    onChange={(e) =>
                      updateTimetableEntry(entry.id, "time", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Activity"
                    value={entry.description}
                    onChange={(e) =>
                      updateTimetableEntry(entry.id, "description", e.target.value)
                    }
                    className="flex-1 border-none outline-none"
                  />
                  {timetableEntries.length > 1 && (
                    <button
                      onClick={() => removeTimetableEntry(entry.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTimetableEntry}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-1"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Add entry</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => handleTypeChange("text")}
                className={`p-2 rounded-full transition-colors ${
                  selectedType === "text"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title="Text note"
              >
                <DocumentTextIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleTypeChange("todo")}
                className={`p-2 rounded-full transition-colors ${
                  selectedType === "todo"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title="Todo list"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleTypeChange("timetable")}
                className={`p-2 rounded-full transition-colors ${
                  selectedType === "timetable"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title="Timetable"
              >
                <ClockIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setNoteTitle("");
                  setNoteContent("");
                  setTodoItems([]);
                  setTimetableEntries([]);
                  setSelectedType("text");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNoteButton;