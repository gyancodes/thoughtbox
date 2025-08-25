import { describe, it, expect } from 'vitest';

// Extract the search logic for testing
const searchNotes = (notes, query) => {
  if (!query.trim()) return { results: notes, query: '' };
  
  const lowercaseQuery = query.toLowerCase().trim();
  const searchTerms = lowercaseQuery.split(/\s+/);
  
  const searchResults = notes.map(note => {
    let score = 0;
    let titleMatches = [];
    let contentMatches = [];
    
    // Search in title
    const title = note.title?.toLowerCase() || '';
    searchTerms.forEach(term => {
      if (title.includes(term)) {
        score += title === term ? 100 : 50; // Exact match gets higher score
        titleMatches.push(term);
      }
    });
    
    // Search in content based on note type
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
        score += 10;
        contentMatches.push(term);
      }
    });
    
    // Boost score for recent notes (only if there's already a match)
    if (score > 0) {
      const daysSinceUpdate = (Date.now() - new Date(note.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 7) score += 5;
      if (daysSinceUpdate < 1) score += 10;
    }
    
    return {
      note,
      score,
      titleMatches,
      contentMatches,
      isMatch: score > 0
    };
  })
  .filter(result => result.isMatch)
  .sort((a, b) => b.score - a.score) // Sort by relevance score
  .map(result => ({
    ...result.note,
    searchMeta: {
      score: result.score,
      titleMatches: result.titleMatches,
      contentMatches: result.contentMatches
    }
  }));
  
  return { 
    results: searchResults, 
    query: query.trim(),
    totalResults: searchResults.length 
  };
};

describe('searchNotes function', () => {
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
      type: 'text',
      title: 'Python Guide',
      content: { text: 'Learn Python programming' },
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'todo',
      title: 'Shopping List',
      content: {
        items: [
          { id: '1', text: 'Buy groceries', completed: false },
          { id: '2', text: 'Pick up dry cleaning', completed: true },
        ]
      },
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      type: 'timetable',
      title: 'Daily Schedule',
      content: {
        entries: [
          { id: '1', time: '09:00', description: 'Team meeting', completed: false },
          { id: '2', time: '14:00', description: 'Doctor appointment', completed: false },
        ]
      },
      updatedAt: new Date().toISOString(),
    },
  ];

  it('returns all notes when search query is empty', () => {
    const result = searchNotes(testNotes, '');
    
    expect(result.results).toHaveLength(4);
    expect(result.query).toBe('');
  });

  it('filters notes by title match', () => {
    const result = searchNotes(testNotes, 'JavaScript');
    
    expect(result.results).toHaveLength(1);
    expect(result.results[0].title).toBe('JavaScript Tutorial');
    expect(result.totalResults).toBe(1);
  });

  it('filters notes by content match', () => {
    const result = searchNotes(testNotes, 'Python');
    
    expect(result.results).toHaveLength(1);
    expect(result.results[0].content.text).toContain('Python');
  });

  it('searches todo note items', () => {
    const result = searchNotes(testNotes, 'groceries');
    
    expect(result.results).toHaveLength(1);
    expect(result.results[0].type).toBe('todo');
  });

  it('searches timetable note entries', () => {
    const result = searchNotes(testNotes, 'meeting');
    
    expect(result.results).toHaveLength(1);
    expect(result.results[0].type).toBe('timetable');
  });

  it('handles multiple search terms', () => {
    const result = searchNotes(testNotes, 'JavaScript tutorial');
    
    expect(result.results).toHaveLength(1);
    expect(result.results[0].title).toBe('JavaScript Tutorial');
  });

  it('sorts results by relevance score', () => {
    const notesWithDifferentScores = [
      {
        id: '1',
        type: 'text',
        title: 'Some Note',
        content: { text: 'Contains JavaScript in content' },
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'text',
        title: 'JavaScript',
        content: { text: 'Exact title match' },
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'text',
        title: 'JavaScript Tutorial',
        content: { text: 'Title contains JavaScript' },
        updatedAt: new Date().toISOString(),
      },
    ];

    const result = searchNotes(notesWithDifferentScores, 'JavaScript');
    
    expect(result.results).toHaveLength(3);
    // Exact title match should be first
    expect(result.results[0].title).toBe('JavaScript');
    // Title containing term should be second
    expect(result.results[1].title).toBe('JavaScript Tutorial');
    // Content match should be last
    expect(result.results[2].title).toBe('Some Note');
  });

  it('includes search metadata in results', () => {
    const result = searchNotes(testNotes, 'JavaScript');
    
    expect(result.results[0].searchMeta).toBeDefined();
    expect(result.results[0].searchMeta.score).toBeGreaterThan(0);
    expect(result.results[0].searchMeta.titleMatches).toContain('javascript');
  });

  it('is case insensitive', () => {
    const result = searchNotes(testNotes, 'javascript');
    
    expect(result.results).toHaveLength(1);
    expect(result.results[0].title).toBe('JavaScript Tutorial');
  });

  it('boosts recent notes in search results', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const notesWithDifferentDates = [
      {
        id: '1',
        type: 'text',
        title: 'Old Note',
        content: { text: 'Contains test content' },
        updatedAt: weekAgo.toISOString(),
      },
      {
        id: '2',
        type: 'text',
        title: 'Recent Note',
        content: { text: 'Contains test content' },
        updatedAt: yesterday.toISOString(),
      },
    ];

    const result = searchNotes(notesWithDifferentDates, 'test');
    
    expect(result.results).toHaveLength(2);
    // Recent note should have higher score and appear first
    expect(result.results[0].title).toBe('Recent Note');
    expect(result.results[0].searchMeta.score).toBeGreaterThan(
      result.results[1].searchMeta.score
    );
  });

  it('handles whitespace in query', () => {
    const result = searchNotes(testNotes, '  JavaScript  ');
    
    expect(result.results).toHaveLength(1);
    expect(result.query).toBe('JavaScript');
  });

  it('returns empty results for no matches', () => {
    const result = searchNotes(testNotes, 'nonexistent');
    
    expect(result.results).toHaveLength(0);
    expect(result.totalResults).toBe(0);
    expect(result.query).toBe('nonexistent');
  });
});