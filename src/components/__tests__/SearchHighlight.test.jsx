import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchHighlight from '../SearchHighlight';

// Mock the search utils
vi.mock('../../utils/searchUtils', () => ({
  highlightSearchTermsReact: vi.fn((text, query) => {
    if (!text || !query) return [text];
    
    // Simple mock implementation for testing
    const parts = [];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    if (lowerText.includes(lowerQuery)) {
      const index = lowerText.indexOf(lowerQuery);
      if (index > 0) {
        parts.push(text.substring(0, index));
      }
      parts.push({
        type: 'highlight',
        text: text.substring(index, index + query.length),
        key: 'highlight-0'
      });
      if (index + query.length < text.length) {
        parts.push(text.substring(index + query.length));
      }
    } else {
      parts.push(text);
    }
    
    return parts;
  })
}));

describe('SearchHighlight', () => {
  it('renders text without highlighting when no query', () => {
    render(<SearchHighlight text="Hello world" query="" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders empty span when no text', () => {
    const { container } = render(<SearchHighlight text="" query="hello" />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('highlights matching text', () => {
    render(<SearchHighlight text="Hello world" query="Hello" />);
    
    // Should have highlighted text
    const highlightedElement = screen.getByText('Hello');
    expect(highlightedElement.tagName).toBe('MARK');
  });

  it('applies custom highlight className', () => {
    render(
      <SearchHighlight 
        text="Hello world" 
        query="Hello" 
        highlightClassName="custom-highlight"
      />
    );
    
    const highlightedElement = screen.getByText('Hello');
    expect(highlightedElement).toHaveClass('custom-highlight');
  });

  it('applies custom container className', () => {
    const { container } = render(
      <SearchHighlight 
        text="Hello world" 
        query="Hello" 
        className="custom-container"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-container');
  });

  it('handles complex text with highlights', () => {
    const { container } = render(<SearchHighlight text="Hello world and hello again" query="hello" />);
    
    // Should have highlighted mark element
    const markElement = container.querySelector('mark');
    expect(markElement).toBeInTheDocument();
    expect(markElement).toHaveTextContent('Hello');
  });

  it('handles text with no matches', () => {
    render(<SearchHighlight text="No matches here" query="xyz" />);
    expect(screen.getByText('No matches here')).toBeInTheDocument();
  });
});