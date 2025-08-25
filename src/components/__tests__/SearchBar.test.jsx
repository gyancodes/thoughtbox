import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onSearch when typing', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={100} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    }, { timeout: 200 });
  });

  it('debounces search calls', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={100} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    // Type multiple characters quickly
    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.change(input, { target: { value: 'te' } });
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Should only call onSearch once after debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    }, { timeout: 200 });
  });

  it('shows clear button when there is text', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={50} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(input.value).toBe('');
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    }, { timeout: 100 });
  });

  it('shows keyboard shortcut hint when not focused', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('hides keyboard shortcut hint when focused', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.focus(input);
    
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
  });

  it('focuses input on Ctrl+K', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    
    expect(input).toHaveFocus();
  });

  it('clears and blurs input on Escape', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search notes...');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(input.value).toBe('');
    expect(input).not.toHaveFocus();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SearchBar onSearch={mockOnSearch} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('auto-focuses when autoFocus is true', () => {
    render(<SearchBar onSearch={mockOnSearch} autoFocus />);
    const input = screen.getByPlaceholderText('Search notes...');
    expect(input).toHaveFocus();
  });
});