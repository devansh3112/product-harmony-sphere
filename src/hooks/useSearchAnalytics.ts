import { useCallback } from 'react';

// Type definitions for search analytics
export interface SearchAnalyticsEvent {
  query: string;
  category?: string;
  resultsCount: number;
  timestamp: number;
  selectedResult?: {
    id: string;
    title: string;
    type: string;
    position: number;
  };
  filters?: Record<string, string>;
  searchDuration?: number;
}

/**
 * Custom hook for tracking search analytics
 * In a real implementation, this would send data to an analytics service
 */
export function useSearchAnalytics() {
  // Track a search query event
  const trackSearch = useCallback((data: Omit<SearchAnalyticsEvent, 'timestamp'>) => {
    // This would normally send the data to an analytics service
    // For now, we'll just log it to the console
    const event: SearchAnalyticsEvent = {
      ...data,
      timestamp: Date.now()
    };
    
    console.log('Search Event:', event);
    
    // In a real implementation:
    // analyticsService.track('search', event);
  }, []);
  
  // Track when a user selects a search result
  const trackResultClick = useCallback((
    query: string, 
    result: { id: string; title: string; type: string; }, 
    position: number,
    category?: string
  ) => {
    // This would normally send the data to an analytics service
    const event: SearchAnalyticsEvent = {
      query,
      category,
      resultsCount: -1, // We don't know the total count in this context
      timestamp: Date.now(),
      selectedResult: {
        id: result.id,
        title: result.title,
        type: result.type,
        position
      }
    };
    
    console.log('Result Click Event:', event);
    
    // In a real implementation:
    // analyticsService.track('search_result_click', event);
  }, []);
  
  // Track search performance
  const trackSearchPerformance = useCallback((query: string, duration: number, resultsCount: number) => {
    console.log('Search Performance:', { query, duration, resultsCount });
    
    // In a real implementation:
    // analyticsService.track('search_performance', { query, duration, resultsCount });
  }, []);
  
  return {
    trackSearch,
    trackResultClick,
    trackSearchPerformance
  };
} 