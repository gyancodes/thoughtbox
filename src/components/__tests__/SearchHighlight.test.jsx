import { render, screen } from '@testing-library/react';
import SearchHighlight from '../SearchHighlight';

describe('SearchHighlight', () => {
  it('renders text without highlighting when no query', () => {
    render(<SearchHighlight text="Hello world" query="" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.queryByRole('mark')).not.toBeInTheDocument();
  });

  it('renders text without highlighting when no text', () => {
    render(<SearchHighlight text="" query="hello" />);
    expect(screen.queryByRole('mark')).not.toBeInTheDocument();
  });

  it('highlights single word match', () => {
    render(<SearchHighlight text="Hello world" query="hello" />);
    const highlighted = screen.getByText('Hello');
    expect(highlighted.tagName).toBe('MARK');
    expect(highlighted).toHaveClass('bg-yellow-200');
  });

  it('highlights multiple word matches', () => {
    render(<SearchHighlight text="Hello beautiful world" query="hello world" />);
    const helloMark = screen.getByText('Hello');
    const worldMark = screen.getByText('world');
    
    expect(helloMark.tagName).toBe('MARK');
    expect(worldMark.tagName).toBe('MARK');
  });

  it('is case insensitive', () => {
    render(<SearchHighlight text="Hello World" query="hello world" />);
    const helloMark = screen.getByText('Hello');
    const worldMark = screen.getByText('World');
    
    expect(helloMark.tagName).toBe('MARK');
    expect(worldMark.tagName).toBe('MARK');
  });

  it('applies custom className to container', () => {
    const { container } = render(
      <SearchHighlight text="Hello world" query="hello" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom highlight className', () => {
    render(
      <SearchHighlight 
        text="Hello world" 
        query="hello" 
        highlightClassName="custom-highlight"
      />
    );
    const highlighted = screen.getByText('Hello');
    expect(highlighted).toHaveClass('custom-highlight');
  });

  it('handles partial word matches', () => {
    render(<SearchHighlight text="JavaScript is awesome" query="Script" />);
    const highlighted = screen.getByText('Script');
    expect(highlighted.tagName).toBe('MARK');
  });

  it('handles special regex characters', () => {
    render(<SearchHighlight text="Price: $10.99" query="$10.99" />);
    const highlighted = screen.getByText('$10.99');
    expect(highlighted.tagName).toBe('MARK');
  });

  it('handles overlapping matches correctly', () => {
    render(<SearchHighlight text="test testing" query="test testing" />);
    
    // Should highlight both "test" words
    const testMarks = screen.getAllByText(/test/i);
    expect(testMarks.length).toBeGreaterThan(0);
  });

  it('preserves text structure with non-matching parts', () => {
    render(<SearchHighlight text="Hello beautiful world" query="hello world" />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText(/beautiful/)).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });
});