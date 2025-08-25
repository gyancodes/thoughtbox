import { 
  highlightSearchTerms, 
  highlightSearchTermsReact, 
  getSearchSnippet, 
  formatSearchResults,
  debounce
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
});