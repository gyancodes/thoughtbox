import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search notes...", 
  className = "",
  autoFocus = false,
  debounceMs = 300,
  showResultsCount = false,
  resultsCount = 0,
  totalNotes = 0,
  isSearching = false,
  suggestions = [],
  onSuggestionSelect = null,
  showSuggestions = false
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle search with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Escape to clear search and blur
      if (e.key === 'Escape' && isFocused) {
        setQuery('');
        setShowSuggestionsList(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Show/hide suggestions based on focus and query
  useEffect(() => {
    if (showSuggestions && isFocused && query.length >= 2 && suggestions.length > 0) {
      setShowSuggestionsList(true);
    } else {
      setShowSuggestionsList(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [showSuggestions, isFocused, query, suggestions]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestionsList || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Tab':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);
    setSelectedSuggestionIndex(-1);
    onSuggestionSelect?.(suggestion);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestionsList(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    // Delay blur to allow suggestion clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setIsFocused(false);
        setShowSuggestionsList(false);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative flex items-center bg-white border rounded-lg transition-all duration-200
        ${isFocused 
          ? 'border-blue-300 shadow-sm ring-1 ring-blue-100' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}>
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          <svg 
            className={`w-5 h-5 transition-colors ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Keyboard Shortcut Hint */}
        {!isFocused && !query && (
          <div className="absolute right-3 flex items-center space-x-1 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Search Results Count */}
      {showResultsCount && query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 px-3">
          {isSearching ? (
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Searching...</span>
            </span>
          ) : resultsCount === 0 ? (
            `No results found for "${query}"`
          ) : resultsCount === 1 ? (
            `1 of ${totalNotes} notes found`
          ) : (
            `${resultsCount} of ${totalNotes} notes found`
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestionsList && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <span className="font-medium">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;