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