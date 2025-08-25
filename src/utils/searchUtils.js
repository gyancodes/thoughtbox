/**
 * Highlights search terms in text with HTML markup
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @param {string} className - CSS class for highlighted text
 * @returns {string} HTML string with highlighted terms
 */
export const highlightSearchTerms = (text, query, className = 'bg-yellow-200 px-1 rounded') => {
  if (!text || !query) return text;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    if (term.length > 0) {
      const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="${className}">$1</mark>`);
    }
  });
  
  return highlightedText;
};

/**
 * Highlights search terms in React components
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @returns {Array} Array of React elements and strings
 */
export const highlightSearchTermsReact = (text, query) => {
  if (!text || !query) return [text];
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  let parts = [text];
  
  searchTerms.forEach(term => {
    if (term.length > 0) {
      const newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
          const splitParts = part.split(regex);
          
          splitParts.forEach((splitPart, index) => {
            if (splitPart.toLowerCase() === term.toLowerCase()) {
              newParts.push({
                type: 'highlight',
                text: splitPart,
                key: `highlight-${term}-${index}`
              });
            } else if (splitPart) {
              newParts.push(splitPart);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    }
  });
  
  return parts;
};

/**
 * Escapes special regex characters
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Extracts a snippet of text around search matches
 * @param {string} text - The full text
 * @param {string} query - The search query
 * @param {number} maxLength - Maximum snippet length
 * @returns {string} Text snippet with context around matches
 */
export const getSearchSnippet = (text, query, maxLength = 150) => {
  if (!text || !query) return text.substring(0, maxLength);
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const lowerText = text.toLowerCase();
  
  // Find the first match
  let firstMatchIndex = -1;
  for (const term of searchTerms) {
    const index = lowerText.indexOf(term);
    if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
      firstMatchIndex = index;
    }
  }
  
  if (firstMatchIndex === -1) {
    return text.substring(0, maxLength);
  }
  
  // Calculate snippet boundaries
  const contextLength = Math.floor((maxLength - query.length) / 2);
  const start = Math.max(0, firstMatchIndex - contextLength);
  const end = Math.min(text.length, start + maxLength);
  
  let snippet = text.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet;
};

/**
 * Formats search results count
 * @param {number} count - Number of results
 * @param {string} query - Search query
 * @returns {string} Formatted results text
 */
export const formatSearchResults = (count, query) => {
  if (count === 0) {
    return `No results found for "${query}"`;
  } else if (count === 1) {
    return `1 result found for "${query}"`;
  } else {
    return `${count} results found for "${query}"`;
  }
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Advanced search with fuzzy matching and ranking
 * @param {Array} notes - Array of notes to search
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Object} Search results with metadata
 */
export const advancedSearch = (notes, query, options = {}) => {
  const {
    fuzzyThreshold = 0.6,
    maxResults = 50,
    includeScore = true,
    sortBy = 'relevance' // 'relevance', 'date', 'title'
  } = options;

  if (!query.trim()) {
    return { 
      results: notes.slice(0, maxResults), 
      query: '', 
      totalResults: notes.length,
      searchTime: 0
    };
  }

  const startTime = performance.now();
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  const searchResults = notes.map(note => {
    let score = 0;
    let matches = {
      title: [],
      content: [],
      type: note.type
    };
    
    // Title matching with higher weight
    const title = note.title?.toLowerCase() || '';
    searchTerms.forEach(term => {
      if (title.includes(term)) {
        const exactMatch = title === term;
        const startsWith = title.startsWith(term);
        score += exactMatch ? 100 : startsWith ? 75 : 50;
        matches.title.push(term);
      }
    });
    
    // Content matching based on note type
    let searchableContent = '';
    if (note.content) {
      switch (note.type) {
        case 'text':
          searchableContent = note.content.text?.toLowerCase() || '';
          break;
        case 'todo':
          searchableContent = note.content.items?.map(item => item.text).join(' ').toLowerCase() || '';
          break;
        case 'timetable':
          searchableContent = note.content.entries?.map(entry => 
            `${entry.time} ${entry.description}`
          ).join(' ').toLowerCase() || '';
          break;
        default:
          searchableContent = JSON.stringify(note.content).toLowerCase();
      }
    }
    
    searchTerms.forEach(term => {
      if (searchableContent.includes(term)) {
        score += 15;
        matches.content.push(term);
      }
    });
    
    // Boost recent notes
    if (score > 0) {
      const daysSinceUpdate = (Date.now() - new Date(note.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 1) score += 15;
      else if (daysSinceUpdate < 7) score += 10;
      else if (daysSinceUpdate < 30) score += 5;
    }
    
    // Boost by note type preference (text notes slightly preferred)
    if (score > 0) {
      if (note.type === 'text') score += 2;
      else if (note.type === 'todo') score += 1;
    }
    
    return {
      note,
      score,
      matches,
      isMatch: score > 0
    };
  })
  .filter(result => result.isMatch)
  .sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.note.updatedAt) - new Date(a.note.updatedAt);
      case 'title':
        return (a.note.title || '').localeCompare(b.note.title || '');
      default: // relevance
        return b.score - a.score;
    }
  })
  .slice(0, maxResults)
  .map(result => ({
    ...result.note,
    searchMeta: includeScore ? {
      score: result.score,
      matches: result.matches,
      titleMatches: result.matches.title,
      contentMatches: result.matches.content
    } : undefined
  }));
  
  const endTime = performance.now();
  
  return { 
    results: searchResults, 
    query: query.trim(),
    totalResults: searchResults.length,
    searchTime: Math.round(endTime - startTime)
  };
};

/**
 * Get search suggestions based on note content
 * @param {Array} notes - Array of notes
 * @param {string} partialQuery - Partial search query
 * @param {number} maxSuggestions - Maximum number of suggestions
 * @returns {Array} Array of search suggestions
 */
export const getSearchSuggestions = (notes, partialQuery, maxSuggestions = 5) => {
  if (!partialQuery.trim() || partialQuery.length < 2) return [];
  
  const query = partialQuery.toLowerCase().trim();
  const suggestions = new Set();
  
  notes.forEach(note => {
    // Extract words from title
    const titleWords = (note.title || '').toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.startsWith(query) && word.length > query.length) {
        suggestions.add(word);
      }
    });
    
    // Extract words from content
    let contentText = '';
    if (note.content) {
      switch (note.type) {
        case 'text':
          contentText = note.content.text || '';
          break;
        case 'todo':
          contentText = note.content.items?.map(item => item.text).join(' ') || '';
          break;
        case 'timetable':
          contentText = note.content.entries?.map(entry => entry.description).join(' ') || '';
          break;
      }
    }
    
    const contentWords = contentText.toLowerCase().split(/\s+/);
    contentWords.forEach(word => {
      if (word.startsWith(query) && word.length > query.length && word.length <= 20) {
        suggestions.add(word);
      }
    });
  });
  
  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length) // Prefer shorter suggestions
    .slice(0, maxSuggestions);
};