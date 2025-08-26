import { useState, useRef, useEffect } from 'react';
import { 
  PlusIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CreateNoteButton = ({ 
  onCreateNote, 
  className = "",
  variant = "floating" // "floating" or "inline"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isMenuOpen) return;

      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMenuOpen]);

  const handleButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNoteTypeSelect = (type) => {
    setIsMenuOpen(false);
    onCreateNote?.(type);
  };

  const noteTypes = [
    {
      type: 'text',
      label: 'Text Note',
      description: 'Quick thoughts and ideas',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      type: 'todo',
      label: 'Todo List',
      description: 'Track your tasks',
      icon: ListBulletIcon,
      color: 'green'
    },
    {
      type: 'timetable',
      label: 'Timetable',
      description: 'Schedule your day',
      icon: ClockIcon,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, variant = 'bg') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50 hover:bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50 hover:bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50 hover:bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      }
    };
    return colorMap[color]?.[variant] || '';
  };

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        {/* Menu */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[280px] animate-in slide-in-from-bottom-2 duration-200"
            data-testid="create-note-menu"
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Create New Note</h3>
            </div>
            
            {noteTypes.map((noteType) => {
              const Icon = noteType.icon;
              return (
                <button
                  key={noteType.type}
                  onClick={() => handleNoteTypeSelect(noteType.type)}
                  className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                  data-testid={`create-note-${noteType.type}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-gray-100">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {noteType.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {noteType.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Action Button */}
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className={`w-14 h-14 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group ${
            isMenuOpen ? 'rotate-45' : ''
          }`}
          data-testid="create-note-fab"
          aria-label="Create new note"
        >
          <PlusIcon className="w-6 h-6 transition-transform duration-200" />
        </button>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`relative ${className}`}>
      {/* Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[280px] z-50 animate-in slide-in-from-top-2 duration-200"
          data-testid="create-note-menu"
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Create New Note</h3>
          </div>
          
          {noteTypes.map((noteType) => {
            const Icon = noteType.icon;
            return (
              <button
                key={noteType.type}
                onClick={() => handleNoteTypeSelect(noteType.type)}
                className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                data-testid={`create-note-${noteType.type}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center bg-gray-100">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {noteType.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {noteType.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Inline Button */}
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        data-testid="create-note-button"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Create Note</span>
      </button>
    </div>
  );
};

export default CreateNoteButton;