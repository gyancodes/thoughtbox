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
          className="relative overflow-hidden cursor-text p-4 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            }}
          />
          
          <div className="relative flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <PencilIcon className="w-5 h-5 text-gray-500" />
            </motion.div>
            
            <motion.span 
              className="text-gray-600 flex-1 font-medium"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              Take a note...
            </motion.span>
            
            <div className="flex space-x-1">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTypeChange("todo");
                  handleOpenModal();
                }}
                className="p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                title="Create todo list"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ListBulletIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTypeChange("timetable");
                  handleOpenModal();
                }}
                className="p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                title="Create timetable"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ClockIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4 
              }}
              className="relative overflow-hidden p-6 rounded-2xl border border-white/30 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <div className="relative">
              <motion.input
                ref={inputRef}
                type="text"
                placeholder="Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full text-lg font-semibold placeholder-gray-500 border-none outline-none mb-4 bg-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileFocus={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 30 }
                }}
              />

              {selectedType === "text" && (
                <motion.textarea
                  placeholder="Take a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full placeholder-gray-500 border-none outline-none resize-none min-h-[120px] bg-transparent leading-relaxed"
                  rows={4}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  whileFocus={{ 
                    scale: 1.01,
                    transition: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                />
              )}

              {selectedType === "todo" && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <AnimatePresence>
                    {todoItems.map((item, index) => (
                      <motion.div 
                        key={item.id} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => updateTodoItem(item.id, item.text)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          whileTap={{ scale: 0.9 }}
                        />
                        <motion.input
                          type="text"
                          placeholder="List item"
                          value={item.text}
                          onChange={(e) => updateTodoItem(item.id, e.target.value)}
                          className="flex-1 border-none outline-none bg-transparent"
                          whileFocus={{ 
                            scale: 1.01,
                            transition: { type: "spring", stiffness: 300, damping: 30 }
                          }}
                        />
                        {todoItems.length > 1 && (
                          <motion.button
                            onClick={() => removeTodoItem(item.id)}
                            className="p-1 hover:bg-white/50 rounded-full transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    onClick={addTodoItem}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 hover:bg-white/50 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm font-medium">Add item</span>
                  </motion.button>
                </motion.div>
              )}

              {selectedType === "timetable" && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <AnimatePresence>
                    {timetableEntries.map((entry, index) => (
                      <motion.div 
                        key={entry.id} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.input
                          type="time"
                          value={entry.time}
                          onChange={(e) =>
                            updateTimetableEntry(entry.id, "time", e.target.value)
                          }
                          className="border border-white/30 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          whileFocus={{ scale: 1.05 }}
                        />
                        <motion.input
                          type="text"
                          placeholder="Activity"
                          value={entry.description}
                          onChange={(e) =>
                            updateTimetableEntry(entry.id, "description", e.target.value)
                          }
                          className="flex-1 border-none outline-none bg-transparent"
                          whileFocus={{ 
                            scale: 1.01,
                            transition: { type: "spring", stiffness: 300, damping: 30 }
                          }}
                        />
                        {timetableEntries.length > 1 && (
                          <motion.button
                            onClick={() => removeTimetableEntry(entry.id)}
                            className="p-1 hover:bg-white/50 rounded-full transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    onClick={addTimetableEntry}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 hover:bg-white/50 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm font-medium">Add entry</span>
                  </motion.button>
                </motion.div>
              )}

              <motion.div 
                className="flex items-center justify-between mt-6 pt-4 border-t border-white/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className="flex space-x-1">
                  <motion.button
                    onClick={() => handleTypeChange("text")}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      selectedType === "text"
                        ? "bg-blue-500/20 text-blue-600 shadow-lg"
                        : "hover:bg-white/50 text-gray-600"
                    }`}
                    title="Text note"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleTypeChange("todo")}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      selectedType === "todo"
                        ? "bg-green-500/20 text-green-600 shadow-lg"
                        : "hover:bg-white/50 text-gray-600"
                    }`}
                    title="Todo list"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ListBulletIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleTypeChange("timetable")}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      selectedType === "timetable"
                        ? "bg-purple-500/20 text-purple-600 shadow-lg"
                        : "hover:bg-white/50 text-gray-600"
                    }`}
                    title="Timetable"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ClockIcon className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleSave}
                    className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save
                  </motion.button>
                  <motion.button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white/50 hover:bg-white/70 rounded-xl transition-all duration-200 border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Close button */}
              <motion.button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-colors z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateNoteButton;