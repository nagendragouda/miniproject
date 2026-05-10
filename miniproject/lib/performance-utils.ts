/**
 * Performance Optimization Utilities
 * Provides memoization, caching, and request deduplication
 */

import React, { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * High-performance request cache with automatic invalidation
 */
class RequestCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes default

  set(key: string, data: any, ttl?: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-cleanup after TTL
    const timeout = ttl || this.ttl;
    setTimeout(() => this.cache.delete(key), timeout);
  }

  get(key: string) {
    return this.cache.get(key)?.data;
  }

  has(key: string) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  invalidate(pattern: string | RegExp) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const requestCache = new RequestCache();

/**
 * Custom hook for cached fetch requests
 * Prevents duplicate requests and provides instant cached responses
 */
export function useCachedFetch<T>(
  url: string,
  options?: RequestInit & { ttl?: number }
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const requestInProgress = useRef(false);

  const cacheKey = `fetch:${url}`;

  const fetchData = useCallback(async () => {
    // Return cached data immediately if available
    const cached = requestCache.get(cacheKey);
    if (cached) {
      setData(cached);
      return;
    }

    // Prevent duplicate requests
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      
      // Cache with TTL
      requestCache.set(cacheKey, result, options?.ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  }, [url, cacheKey, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Debounce hook for expensive operations
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent events
 */
export function useThrottle<T>(value: T, interval: number = 1000): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(handler);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Memoized callback that updates only when dependencies change
 */
export function useMemoCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps) as T;
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 16.67) {  // More than one frame (60fps)
        console.warn(
          `⚠️  Performance: ${componentName} took ${duration.toFixed(2)}ms to render`
        );
      }
    };
  }, [componentName]);
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useInView(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isInView, setIsInView] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);  // Stop observing once in view
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

/**
 * Local storage hook with type safety
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

/**
 * API request with automatic retry on failure
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit & { retries?: number; retryDelay?: number }
) {
  const retries = options?.retries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;
  const { retries: _, retryDelay: __, ...fetchOptions } = options ?? {};

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

export default {
  requestCache,
  useCachedFetch,
  useDebounce,
  useThrottle,
  useMemoCallback,
  usePerformanceMonitor,
  useInView,
  useLocalStorage,
  fetchWithRetry,
};
