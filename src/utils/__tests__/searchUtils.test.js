import { 
  highlightSearchTerms, 
  highlightSearchTermsReact, 
  getSearchSnippet, 
  formatSearchResults,
  debounce,
  advancedSearch,
  getSearchSuggestions
} from '../searchUtils';

describe('searchUtils', () => {
  describe('highlightSearchTerms', () => {
    it('highlights single term', () => {
      const result = highlightSearchTerms('Hello world', 'hello');
      expect(result).toContain('<mark class="bg-yellow-200 px-1 rounded">Hello</mark>');
    });

    it('highlights multiple terms', () => {
      const result = highlightSearchTerms('Hello beautiful world', 'hello world');
      expect(result).toContain('<mark class="bg-yellow-200 px-1 rounded">Hello</mark>');
      expect(result).toContain('<mark class="bg-yellow-200 px-1 rounded">world</mark>');
    });

    it('uses custom className', () => {
      const result = highlightSearchTerms('Hello world', 'hello', 'custom-class');
      expect(result).toContain('<mark class="custom-class">Hello</mark>');
    });

    it('returns original text when no query', () => {
      const result = highlightSearchTerms('Hello world', '');
      expect(result).toBe('Hello world');
    });

    it('returns original text when no text', () => {
      const result = highlightSearchTerms('', 'hello');
      expect(result).toBe('');
    });

    it('handles special regex characters', () => {
      const result = highlightSearchTerms('Price: $10.99', '$10.99');
      expect(result).toContain('<mark class="bg-yellow-200 px-1 rounded">$10.99</mark>');
    });
  });

  describe('highlightSearchTermsReact', () => {
    it('returns array with highlighted parts', () => {
      const result = highlightSearchTermsReact('Hello world', 'hello');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: 'highlight',
        text: 'Hello',
        key: expect.stringContaining('highlight-hello')
      });
      expect(result[1]).toBe(' world');
    });

    it('returns original text array when no query', () => {
      const result = highlightSearchTermsReact('Hello world', '');
      expect(result).toEqual(['Hello world']);
    });

    it('handles multiple terms', () => {
      const result = highlightSearchTermsReact('Hello beautiful world', 'hello world');
      expect(result.some(part => 
        typeof part === 'object' && part.text === 'Hello'
      )).toBe(true);
      expect(result.some(part => 
        typeof part === 'object' && part.text === 'world'
      )).toBe(true);
    });
  });

  describe('getSearchSnippet', () => {
    const longText = 'This is a very long text that contains many words and we want to extract a snippet around the search term to show context to the user when displaying search results.';

    it('returns snippet around first match', () => {
      const result = getSearchSnippet(longText, 'search term', 50);
      expect(result).toContain('search term');
      expect(result.length).toBeLessThanOrEqual(56); // 50 + ellipsis (3 chars each side)
    });

    it('adds ellipsis when text is truncated', () => {
      const result = getSearchSnippet(longText, 'search term', 50);
      expect(result).toMatch(/^\.\.\..*\.\.\.$/);
    });

    it('returns beginning of text when no match', () => {
      const result = getSearchSnippet(longText, 'nonexistent', 50);
      expect(result).toBe(longText.substring(0, 50));
    });

    it('returns full text when shorter than maxLength', () => {
      const shortText = 'Short text with search term';
      const result = getSearchSnippet(shortText, 'search', 100);
      expect(result).toBe(shortText);
    });
  });

  describe('formatSearchResults', () => {
    it('formats zero results', () => {
      const result = formatSearchResults(0, 'test');
      expect(result).toBe('No results found for "test"');
    });

    it('formats single result', () => {
      const result = formatSearchResults(1, 'test');
      expect(result).toBe('1 result found for "test"');
    });

    it('formats multiple results', () => {
      const result = formatSearchResults(5, 'test');
      expect(result).toBe('5 results found for "test"');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('cancels previous calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });

    it('passes all arguments', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 'arg3');
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });
  });

  describe('advancedSearch', () => {
    const testNotes = [
      {
        id: '1',
        type: 'text',
        title: 'JavaScript Tutorial',
        content: { text: 'Learn JavaScript programming basics' },
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'todo',
        title: 'Shopping List',
        content: {
          items: [
            { text: 'Buy JavaScript book', completed: false },
            { text: 'Learn programming', completed: true },
          ]
        },
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      }
    ];

    it('returns enhanced search results with metadata', () => {
      const result = advancedSearch(testNotes, 'JavaScript');
      
      expect(result.results).toHaveLength(2);
      expect(result.query).toBe('JavaScript');
      expect(result.totalResults).toBe(2);
      expect(result.searchTime).toBeGreaterThanOrEqual(0);
      
      // Check search metadata
      expect(result.results[0].searchMeta).toBeDefined();
      expect(result.results[0].searchMeta.score).toBeGreaterThan(0);
      expect(result.results[0].searchMeta.matches).toBeDefined();
    });

    it('sorts by relevance by default', () => {
      const result = advancedSearch(testNotes, 'JavaScript');
      
      // Title match should score higher than content match
      expect(result.results[0].title).toBe('JavaScript Tutorial');
      expect(result.results[0].searchMeta.score).toBeGreaterThan(
        result.results[1].searchMeta.score
      );
    });

    it('can sort by date', () => {
      const result = advancedSearch(testNotes, 'JavaScript', { sortBy: 'date' });
      
      expect(result.results).toHaveLength(2);
      // More recent note should be first when sorting by date
      expect(new Date(result.results[0].updatedAt).getTime()).toBeGreaterThan(
        new Date(result.results[1].updatedAt).getTime()
      );
    });

    it('limits results based on maxResults option', () => {
      const result = advancedSearch(testNotes, 'JavaScript', { maxResults: 1 });
      
      expect(result.results).toHaveLength(1);
    });

    it('can exclude score metadata', () => {
      const result = advancedSearch(testNotes, 'JavaScript', { includeScore: false });
      
      expect(result.results[0].searchMeta).toBeUndefined();
    });
  });

  describe('getSearchSuggestions', () => {
    const testNotes = [
      {
        id: '1',
        type: 'text',
        title: 'JavaScript Programming Tutorial',
        content: { text: 'JavaScript fundamentals and advanced concepts' }
      },
      {
        id: '2',
        type: 'todo',
        title: 'Programming Tasks',
        content: {
          items: [
            { text: 'JavaScript debugging session', completed: false }
          ]
        }
      }
    ];

    it('returns word suggestions based on partial query', () => {
      const suggestions = getSearchSuggestions(testNotes, 'Java');
      
      expect(suggestions).toContain('javascript');
    });

    it('returns suggestions from both title and content', () => {
      const suggestions = getSearchSuggestions(testNotes, 'prog');
      
      expect(suggestions).toContain('programming');
    });

    it('limits number of suggestions', () => {
      const suggestions = getSearchSuggestions(testNotes, 'j', 2);
      
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('returns empty array for short queries', () => {
      const suggestions = getSearchSuggestions(testNotes, 'j');
      
      expect(suggestions).toEqual([]);
    });

    it('returns empty array for empty query', () => {
      const suggestions = getSearchSuggestions(testNotes, '');
      
      expect(suggestions).toEqual([]);
    });

    it('sorts suggestions by length', () => {
      const suggestions = getSearchSuggestions(testNotes, 'java');
      
      if (suggestions.length > 1) {
        for (let i = 1; i < suggestions.length; i++) {
          expect(suggestions[i].length).toBeGreaterThanOrEqual(suggestions[i - 1].length);
        }
      }
    });
  });
});