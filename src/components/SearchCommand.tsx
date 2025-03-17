import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { 
  Search, 
  Package, 
  FileText, 
  Tag, 
  Grid, 
  Star, 
  AlertCircle, 
  Zap, 
  Lightbulb, 
  Clock, 
  ChevronRight,
  Hash,
  TrendingUp,
  BarChart,
  Share2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics';
import {
  levenshteinDistance,
  fuzzyMatch,
  calculateRelevanceScore,
  highlightTerms,
  extractRelevantSnippet,
  parseSearchQuery,
  generateSearchSuggestions as generateSuggestions
} from '@/lib/search-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define the search result types
type SearchResultType = 'product' | 'category' | 'documentation' | 'feature';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: SearchResultType;
  category?: string;
  relevance: number;
  url: string;
  tags?: string[];
  image?: string;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

interface CommandOption {
  name: string;
  description: string;
  prefix: string;
  icon: React.ElementType;
}

// Sample categories data for demonstration
const sampleCategories = [
  'Carbon Black', 'DLP', 'Endpoint', 'Proxy', 'AOD', 'IMS', 'ITSM'
];

// Sample tags for suggestion
const sampleTags = [
  'security', 'cloud', 'data', 'protection', 'detection', 'monitoring',
  'endpoint', 'network', 'authentication', 'encryption', 'prevention', 
  'compliance', 'management', 'automation', 'analytics'
];

// Command options for advanced search
const commandOptions: CommandOption[] = [
  { 
    name: 'Category', 
    description: 'Filter by product category',
    prefix: 'category:',
    icon: Grid
  },
  { 
    name: 'Tag', 
    description: 'Search for specific tags',
    prefix: 'tag:',
    icon: Tag
  },
  { 
    name: 'Documentation', 
    description: 'Search within documentation',
    prefix: 'docs:',
    icon: FileText
  },
  { 
    name: 'Feature', 
    description: 'Search for specific features',
    prefix: 'feature:',
    icon: Zap
  }
];

const RECENT_SEARCHES_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 5;

// Simulated search API with AI capabilities
const simulateSearchAPI = async (
  query: string,
  options: {
    categoryFilter?: string;
    tagFilter?: string;
    docFilter?: boolean;
    featureFilter?: string;
  } = {}
): Promise<SearchResult[]> => {
  // This would be replaced with a real API call
  // Simulate network delay
  const startTime = performance.now();
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  // Parse the query to extract commands
  const { categoryFilter, tagFilter, docFilter, featureFilter } = options;
  
  // Sample products data
  const products: SearchResult[] = [
    {
      id: '7',
      title: 'Carbon Black App Control',
      description: 'Trusted software enforcement with flexible deployment',
      type: 'product',
      category: 'Carbon Black',
      relevance: 0.95,
      url: '/products/7',
      tags: ['security', 'software', 'enforcement']
    },
    {
      id: '30',
      title: 'Endpoint DLP',
      description: 'Endpoint Prevent and Endpoint Discover for comprehensive endpoint data protection',
      type: 'product',
      category: 'DLP',
      relevance: 0.9,
      url: '/products/30',
      tags: ['data', 'protection', 'endpoint']
    },
    {
      id: '34',
      title: 'SEP-SES',
      description: 'Symantec Endpoint Security - Comprehensive endpoint protection suite',
      type: 'product',
      category: 'Endpoint',
      relevance: 0.85,
      url: '/products/34',
      tags: ['endpoint', 'security', 'protection']
    },
    {
      id: '51',
      title: 'CloudSOC CASB',
      description: 'Cloud Security Broker for secure cloud access',
      type: 'product',
      category: 'Proxy',
      relevance: 0.8,
      url: '/products/51',
      tags: ['cloud', 'security', 'access']
    }
  ];
  
  // Sample categories data
  const categories: SearchResult[] = sampleCategories.map(category => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    title: category,
    description: `Browse all ${category} products`,
    type: 'category',
    relevance: 0.75,
    url: `/products?category=${category.toLowerCase().replace(/\s+/g, '-')}`,
  }));
  
  // Sample documentation data
  const docs: SearchResult[] = [
    {
      id: 'doc-1',
      title: 'Getting Started with Endpoint Security',
      description: 'Learn how to set up and configure endpoint security solutions',
      type: 'documentation',
      category: 'Endpoint',
      relevance: 0.7,
      url: '/docs/endpoint-security',
      tags: ['guide', 'setup', 'endpoint', 'security']
    },
    {
      id: 'doc-2',
      title: 'DLP Best Practices',
      description: 'Best practices for implementing Data Loss Prevention',
      type: 'documentation',
      category: 'DLP',
      relevance: 0.65,
      url: '/docs/dlp-best-practices',
      tags: ['guide', 'best practices', 'dlp']
    }
  ];
  
  // Sample features data
  const features: SearchResult[] = [
    {
      id: 'feature-1',
      title: 'Real-time Threat Detection',
      description: 'Detect and respond to threats in real-time',
      type: 'feature',
      category: 'Endpoint',
      relevance: 0.6,
      url: '/features/threat-detection',
      tags: ['security', 'detection', 'real-time']
    },
    {
      id: 'feature-2',
      title: 'Data Classification',
      description: 'Automatically classify sensitive data',
      type: 'feature',
      category: 'DLP',
      relevance: 0.55,
      url: '/features/data-classification',
      tags: ['data', 'classification', 'automation']
    }
  ];
  
  let results = [...products, ...categories];
  
  // Add docs and features based on filters
  if (docFilter) {
    results = [...results, ...docs];
  }
  
  if (featureFilter) {
    const filteredFeatures = features.filter(f => 
      f.title.toLowerCase().includes(featureFilter.toLowerCase()) ||
      f.description.toLowerCase().includes(featureFilter.toLowerCase())
    );
    results = [...results, ...filteredFeatures];
  }
  
  // Apply category filter if specified
  if (categoryFilter) {
    results = results.filter(r => 
      r.category?.toLowerCase() === categoryFilter.toLowerCase() || 
      (r.type === 'category' && r.title.toLowerCase() === categoryFilter.toLowerCase())
    );
  }
  
  // Apply tag filter if specified
  if (tagFilter) {
    results = results.filter(r => 
      r.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  }
  
  // Extract search terms from the main query
  const { mainQuery, filters } = parseSearchQuery(query);
  const searchTerms = mainQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0);
  
  // Filter by the main query terms if there are any
  if (searchTerms.length > 0) {
    results = results.filter(r => {
      // Use fuzzy matching for more forgiving search
      return (
        fuzzyMatch(r.title, mainQuery) || 
        fuzzyMatch(r.description, mainQuery) ||
        r.tags?.some(tag => fuzzyMatch(tag, mainQuery))
      );
    });
    
    // Calculate relevance scores for sorting
    results.forEach(r => {
      r.relevance = calculateRelevanceScore(
        {
          title: r.title,
          description: r.description,
          tags: r.tags,
          category: r.category
        },
        searchTerms
      );
    });
  }
  
  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  
  // Simulate search duration to track performance
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // In a real implementation, you would track search performance metrics
  // trackSearchPerformance(query, duration, results.length);
  
  return results;
};

// A hook to handle search history persistence
const useSearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  
  // Load search history from localStorage on component mount
  useEffect(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
      }
    }
  }, []);
  
  // Add a search to history
  const addToHistory = useCallback((query: string) => {
    if (!query || query.trim() === '') return;
    
    setRecentSearches(prev => {
      // Remove if already exists (to move it to the top)
      const filtered = prev.filter(item => item.query !== query);
      
      // Create new history with this search at the top
      const updated = [
        { query, timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT_SEARCHES);
      
      // Save to localStorage
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      
      return updated;
    });
  }, []);
  
  return { recentSearches, addToHistory };
};

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
  const [query, setQuery] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState(0);
  const { recentSearches, addToHistory } = useSearchHistory();
  const { trackSearch, trackResultClick, trackSearchPerformance } = useSearchAnalytics();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  
  // Debounce the search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);
  
  // Reset active item when query changes
  useEffect(() => {
    setActiveItemIndex(0);
  }, [query]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else if (!open) {
      // Only clear search when dialog actually closes
      setQuery('');
      setResults([]);
      setSuggestions([]);
    }
  }, [open]);
  
  // Memoize the fetch results function to prevent recreating it on every render
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    const startTime = performance.now();
    setSearchStartTime(startTime);
    
    // Extract command filters
    const { filters } = parseSearchQuery(searchQuery);
    const categoryFilter = filters.category;
    const tagFilter = filters.tag;
    const docFilter = Boolean(filters.docs);
    const featureFilter = filters.feature;
    
    try {
      const searchResults = await simulateSearchAPI(searchQuery, {
        categoryFilter,
        tagFilter,
        docFilter,
        featureFilter
      });
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setResults(searchResults);
        
        // Track search performance
        const duration = performance.now() - startTime;
        trackSearchPerformance(searchQuery, duration, searchResults.length);
        
        // Track the search event
        trackSearch({
          query: searchQuery,
          resultsCount: searchResults.length,
          filters: filters as Record<string, string>
        });
        
        // Generate suggestions based on query and results
        const recentSearchQueries = recentSearches.map(item => item.query);
        const availableTags = Array.from(
          new Set(searchResults.flatMap(r => r.tags || []))
        );
        
        const searchSuggestions = generateSuggestions(
          searchQuery,
          recentSearchQueries,
          sampleCategories,
          [...sampleTags, ...availableTags]
        );
        
        setSuggestions(searchSuggestions);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [recentSearches, trackSearch, trackSearchPerformance]);
  
  // Update results when debounced query changes
  useEffect(() => {
    // Don't run search if dialog is closed
    if (!open) return;
    
    // Run search when debounced query changes
    fetchResults(debouncedQuery);
    
  }, [debouncedQuery, open, fetchResults]);
  
  // Handle selecting a search result
  const handleSelectResult = (result: SearchResult, position: number = 0) => {
    // Add to search history
    addToHistory(query);
    
    // Track result click for analytics
    trackResultClick(query, result, position, result.category);
    
    // Navigate to the appropriate URL
    navigate(result.url);
    
    // Close the dialog
    onOpenChange(false);
  };
  
  // Apply a search suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };
  
  // Apply a recent search
  const handleSelectRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    inputRef.current?.focus();
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab to cycle through command options
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      
      // Find next command option
      const commandOption = commandOptions.find(option => !query.includes(option.prefix));
      if (commandOption) {
        setQuery(prev => `${prev}${prev.endsWith(' ') ? '' : ' '}${commandOption.prefix}`);
      }
    }
  };
  
  // Execute search on Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query && results.length > 0) {
      // Select first result
      handleSelectResult(results[0]);
    }
  };
  
  // Generate placeholder text based on recent searches
  const getPlaceholderText = () => {
    if (recentSearches.length > 0) {
      const mostRecent = recentSearches[0].query;
      return `Search or try "${mostRecent}"...`;
    }
    return "Search or type a command...";
  };
  
  // Get search terms for highlighting
  const getSearchTerms = () => {
    if (!query) return [];
    const { mainQuery } = parseSearchQuery(query);
    return mainQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 1);
  };
  
  // Group results by type for display
  const groupedResults = {
    products: results.filter(r => r.type === 'product'),
    categories: results.filter(r => r.type === 'category'),
    documentation: results.filter(r => r.type === 'documentation'),
    features: results.filter(r => r.type === 'feature')
  };
  
  // Check if we have any results
  const hasResults = results.length > 0;
  const hasRecentSearches = recentSearches.length > 0;
  const searchTerms = getSearchTerms();
  
  // Get trending searches (would be from analytics in a real app)
  const trendingSearches = [
    'endpoint security', 
    'cloud protection', 
    'data loss prevention',
    'threat detection'
  ];
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex items-center border-b px-3 relative">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholderText()}
            className="flex h-11 py-3"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            </div>
          )}
        </div>
        
        <CommandList className="max-h-[500px] overflow-y-auto">
          {!hasResults && !query && (
            <>
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-muted-foreground py-2">
                  COMMAND SHORTCUTS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {commandOptions.map((command) => (
                    <TooltipProvider key={command.prefix}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start h-auto py-2"
                            onClick={() => setQuery(`${command.prefix} `)}
                          >
                            <command.icon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col items-start text-left">
                              <span className="text-sm">{command.name}</span>
                              <span className="text-xs text-muted-foreground">{command.prefix}</span>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{command.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
              
              {/* Trending searches */}
              <CommandGroup heading="Trending Searches">
                <div className="flex flex-wrap gap-2 p-2">
                  {trendingSearches.map((term, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="h-8 bg-slate-50"
                      onClick={() => setQuery(term)}
                    >
                      <TrendingUp className="mr-1 h-3 w-3 text-blue-500" />
                      {term}
                    </Button>
                  ))}
                </div>
              </CommandGroup>
            </>
          )}
          
          {!hasResults && query.length > 0 && !loading && (
            <CommandEmpty className="py-6 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p>No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different search term or browse categories
                </p>
                <div className="flex mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuery('')}
                  >
                    Clear search
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      // This would typically create a feedback event
                      alert('Thanks for your feedback! We\'ll improve our search results.');
                      setQuery('');
                    }}
                  >
                    Report missing result
                  </Button>
                </div>
              </div>
            </CommandEmpty>
          )}
          
          {/* AI-powered suggestions */}
          {suggestions.length > 0 && (
            <CommandGroup heading="Suggestions">
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={`suggestion-${index}`}
                  value={`suggestion-${index}-${suggestion}`}
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  className="flex items-center py-3"
                >
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="flex-1">{suggestion}</span>
                  <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {/* Products results */}
          {groupedResults.products.length > 0 && (
            <CommandGroup heading="Products">
              {groupedResults.products.map((result, index) => (
                <CommandItem
                  key={`product-${result.id}`}
                  value={`product-${result.id}-${result.title}`}
                  onSelect={() => handleSelectResult(result, index)}
                  className="flex items-center py-3"
                >
                  <Package className="mr-2 h-4 w-4 text-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-medium" 
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.title, searchTerms) 
                          : result.title 
                      }}
                    />
                    <div 
                      className="text-xs text-muted-foreground line-clamp-1"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(
                              extractRelevantSnippet(result.description, searchTerms), 
                              searchTerms
                            ) 
                          : result.description 
                      }}
                    />
                    {result.tags && (
                      <div className="flex flex-wrap mt-1 gap-1">
                        {result.tags.slice(0, 3).map((tag, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className={cn(
                              "text-xs py-0 px-1.5",
                              searchTerms.some(term => tag.toLowerCase().includes(term)) &&
                                "bg-yellow-50 border-yellow-200"
                            )}
                          >
                            <span
                              dangerouslySetInnerHTML={{ 
                                __html: searchTerms.length 
                                  ? highlightTerms(tag, searchTerms) 
                                  : tag 
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end ml-2 shrink-0">
                    <Badge variant="secondary" className="mb-1">
                      {result.category}
                    </Badge>
                    <div className="flex items-center text-xs">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={cn(
                            "h-3 w-3",
                            idx < Math.floor(result.relevance * 5)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CommandItem>
              ))}
              {groupedResults.products.length > 5 && (
                <div className="px-2 py-1.5 text-xs text-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-500"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(query)}`);
                      onOpenChange(false);
                    }}
                  >
                    View all {groupedResults.products.length} products matching "{query}"
                  </Button>
                </div>
              )}
            </CommandGroup>
          )}
          
          {/* Categories results */}
          {groupedResults.categories.length > 0 && (
            <CommandGroup heading="Categories">
              {groupedResults.categories.map((result, index) => (
                <CommandItem
                  key={`category-${result.id}`}
                  value={`category-${result.id}-${result.title}`}
                  onSelect={() => handleSelectResult(result, index)}
                  className="flex items-center py-3"
                >
                  <Grid className="mr-2 h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <div 
                      className="font-medium"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.title, searchTerms) 
                          : result.title 
                      }}
                    />
                    <div 
                      className="text-xs text-muted-foreground line-clamp-1"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.description, searchTerms) 
                          : result.description 
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <BarChart className="mr-1 h-3 w-3" />
                      {Math.floor(Math.random() * 20) + 5} products
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {/* Documentation results */}
          {groupedResults.documentation.length > 0 && (
            <CommandGroup heading="Documentation">
              {groupedResults.documentation.map((result, index) => (
                <CommandItem
                  key={`doc-${result.id}`}
                  value={`doc-${result.id}-${result.title}`}
                  onSelect={() => handleSelectResult(result, index)}
                  className="flex items-center py-3"
                >
                  <FileText className="mr-2 h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <div 
                      className="font-medium"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.title, searchTerms) 
                          : result.title 
                      }}
                    />
                    <div 
                      className="text-xs text-muted-foreground line-clamp-1"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.description, searchTerms) 
                          : result.description 
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="ml-2">
                      {result.category}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // This would normally copy a link to clipboard
                      alert(`Link to ${result.title} copied to clipboard!`);
                    }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {/* Features results */}
          {groupedResults.features.length > 0 && (
            <CommandGroup heading="Features">
              {groupedResults.features.map((result, index) => (
                <CommandItem
                  key={`feature-${result.id}`}
                  value={`feature-${result.id}-${result.title}`}
                  onSelect={() => handleSelectResult(result, index)}
                  className="flex items-center py-3"
                >
                  <Zap className="mr-2 h-4 w-4 text-amber-500" />
                  <div className="flex-1">
                    <div 
                      className="font-medium"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.title, searchTerms) 
                          : result.title 
                      }}
                    />
                    <div 
                      className="text-xs text-muted-foreground line-clamp-1"
                      dangerouslySetInnerHTML={{ 
                        __html: searchTerms.length 
                          ? highlightTerms(result.description, searchTerms) 
                          : result.description 
                      }}
                    />
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {result.category}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {/* Recent searches */}
          {!query && hasRecentSearches && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((item, index) => (
                  <CommandItem
                    key={`recent-${index}`}
                    value={`recent-${index}-${item.query}`}
                    onSelect={() => handleSelectRecentSearch(item.query)}
                    className="flex items-center py-2"
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{item.query}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          
          {/* Quick category buttons when no query */}
          {!query && (
            <>
              <CommandSeparator />
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-muted-foreground py-2">
                  BROWSE CATEGORIES
                </div>
                <div className="flex flex-wrap gap-2">
                  {sampleCategories.map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => setQuery(`category:${category} `)}
                    >
                      <Hash className="mr-1 h-3 w-3" />
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Search metadata - when we have results */}
          {hasResults && !loading && (
            <div className="px-2 py-2 text-xs text-center text-muted-foreground border-t">
              {results.length} results · Search powered by Westcon-Comstor AI · 
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground px-1"
                onClick={() => {
                  // This would normally submit feedback
                  alert('Thank you for your feedback! We\'ll use it to improve search results.');
                }}
              >
                Send Feedback
              </Button>
            </div>
          )}
        </CommandList>
      </form>
    </CommandDialog>
  );
};

export default SearchCommand; 