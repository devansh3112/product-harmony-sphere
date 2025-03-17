/**
 * Advanced search utility functions for implementing Google-like search capabilities
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching and typo tolerance
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  
  return track[str2.length][str1.length];
}

/**
 * Check if a string has a fuzzy match with a query
 * Allows for typos and small variations
 */
export function fuzzyMatch(text: string, query: string, threshold = 2): boolean {
  // Empty query always matches
  if (!query) return true;
  
  // For short queries, require exact substring match
  if (query.length <= 2) {
    return text.toLowerCase().includes(query.toLowerCase());
  }
  
  // For longer queries, check each word
  const words = text.toLowerCase().split(/\s+/);
  const queryWords = query.toLowerCase().split(/\s+/);
  
  // Check if any query word has a fuzzy match with any target word
  return queryWords.some(queryWord => 
    words.some(word => 
      word.includes(queryWord) || 
      queryWord.includes(word) || 
      levenshteinDistance(word, queryWord) <= threshold
    )
  );
}

/**
 * Calculate a relevance score for a search result
 * Higher score means more relevant
 */
export function calculateRelevanceScore(
  item: { 
    title: string; 
    description?: string; 
    tags?: string[];
    category?: string;
  }, 
  searchTerms: string[]
): number {
  let score = 0;
  const title = item.title.toLowerCase();
  const description = item.description?.toLowerCase() || '';
  const tags = item.tags?.map(t => t.toLowerCase()) || [];
  const category = item.category?.toLowerCase() || '';

  for (const term of searchTerms) {
    // Exact matches in title are weighted highest
    if (title.includes(term)) score += 3;
    
    // Exact title match gets a big bonus
    if (title === term) score += 5;
    
    // Word boundary match in title
    if (new RegExp(`\\b${term}\\b`, 'i').test(title)) score += 2;
    
    // Description matches
    if (description.includes(term)) score += 2;
    
    // Category matches
    if (category.includes(term)) score += 2;
    
    // Tags matches (exact tag match is highly relevant)
    if (tags.some(tag => tag === term)) score += 3;
    if (tags.some(tag => tag.includes(term))) score += 1.5;
    
    // Check for partial matches and typos
    const titleWords = title.split(/\s+/);
    const descWords = description.split(/\s+/);
    
    // Partial matches in title
    for (const word of titleWords) {
      if (word.startsWith(term) || term.startsWith(word)) score += 1.5;
      if (levenshteinDistance(term, word) <= 2) score += 1;
    }
    
    // Partial matches in description 
    for (const word of descWords) {
      if (word.startsWith(term) || term.startsWith(word)) score += 0.5;
      if (levenshteinDistance(term, word) <= 2) score += 0.3;
    }
  }
  
  return score;
}

/**
 * Highlight search terms in text by wrapping them in HTML 
 */
export function highlightTerms(text: string, terms: string[]): string {
  if (!terms.length) return text;
  
  let result = text;
  
  // Sort terms by length (descending) to avoid nested highlights
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    if (term.length < 2) continue;
    
    // Create a regular expression that matches the term with word boundaries
    // Use case insensitive matching with 'i' flag
    const regex = new RegExp(`(${term})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  }
  
  return result;
}

/**
 * Extract the most relevant snippet from a text based on search terms
 */
export function extractRelevantSnippet(text: string, terms: string[], snippetLength = 150): string {
  if (!text || !terms.length) return text;
  
  const textLower = text.toLowerCase();
  let bestPos = 0;
  let bestScore = -1;
  
  // Find the position with the highest density of search terms
  for (let i = 0; i < textLower.length; i++) {
    let score = 0;
    
    for (const term of terms) {
      if (textLower.slice(i, i + term.length) === term.toLowerCase()) {
        score += term.length;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestPos = i;
    }
  }
  
  // If no terms were found, return the beginning of the text
  if (bestScore === -1) {
    return text.length > snippetLength 
      ? text.slice(0, snippetLength) + '...'
      : text;
  }
  
  // Find a good starting position that doesn't break in the middle of a word
  const startPos = Math.max(0, bestPos - snippetLength / 2);
  const adjustedStart = startPos === 0 
    ? 0 
    : text.indexOf(' ', startPos) + 1;
  
  // Find a good ending position
  const endPos = Math.min(text.length, bestPos + snippetLength / 2);
  const adjustedEnd = endPos === text.length 
    ? text.length 
    : text.lastIndexOf(' ', endPos);
  
  // Create the snippet with ellipses if needed
  const prefix = adjustedStart > 0 ? '...' : '';
  const suffix = adjustedEnd < text.length ? '...' : '';
  
  return prefix + text.slice(adjustedStart, adjustedEnd) + suffix;
}

/**
 * Parse a search query to extract special commands and keywords
 */
export function parseSearchQuery(query: string): {
  mainQuery: string;
  filters: Record<string, string>;
} {
  const filters: Record<string, string> = {};
  
  // Match filter patterns like "key:value" or "key:"value""
  const filterRegex = /([\w]+):(["']?)(.*?)\2(?:\s|$)/g;
  
  // Extract all filters
  let mainQuery = query.replace(filterRegex, (match, key, quote, value) => {
    filters[key.toLowerCase()] = value;
    return ''; // Remove the filter from the main query
  }).trim();
  
  return {
    mainQuery,
    filters
  };
}

/**
 * Generate contextual search suggestions based on input and results
 */
export function generateSearchSuggestions(
  query: string,
  recentSearches: string[] = [],
  availableCategories: string[] = [],
  availableTags: string[] = []
): string[] {
  if (!query || query.length < 2) return [];
  
  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Suggest categories if the query might be category-related
  for (const category of availableCategories) {
    if (category.toLowerCase().includes(queryLower)) {
      suggestions.push(`category:${category}`);
    }
  }
  
  // Suggest tags if the query might be tag-related
  for (const tag of availableTags) {
    if (tag.toLowerCase().includes(queryLower)) {
      suggestions.push(`tag:${tag}`);
    }
  }
  
  // Suggest from recent searches
  for (const recent of recentSearches) {
    if (recent.toLowerCase().includes(queryLower) && recent !== query) {
      suggestions.push(recent);
    }
  }
  
  // Suggest adding "advanced" for complex queries
  if (query.includes('security') || query.includes('protection')) {
    suggestions.push(`${query} advanced`);
  }
  
  // Limit and return unique suggestions
  return [...new Set(suggestions)].slice(0, 5);
} 