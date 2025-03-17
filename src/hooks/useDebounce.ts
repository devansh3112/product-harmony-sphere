import { useState, useEffect, useRef } from 'react';

/**
 * A hook that returns a debounced value
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Set a timer to update the debounced value after the specified delay
    timerRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
      timerRef.current = null;
    }, delay);

    // Clear the timer if the value changes or the component unmounts
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
} 