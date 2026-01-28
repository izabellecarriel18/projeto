import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  staleTime?: number;
  cacheTime?: number;
}

const DEFAULT_STALE_TIME = 30 * 1000;

const memoryCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();
const subscribers = new Map<string, Set<() => void>>();

function getFromStorage<T>(key: string): CacheEntry<T> | null {
  try {
    const stored = localStorage.getItem(`cache_${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

function setToStorage<T>(key: string, entry: CacheEntry<T>): void {
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
  } catch {
    // Ignore storage errors
  }
}

function notifySubscribers(key: string): void {
  const subs = subscribers.get(key);
  if (subs) {
    subs.forEach((callback) => callback());
  }
}

export function getCachedData<T>(key: string): T | null {
  const memEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memEntry) {
    return memEntry.data;
  }

  const storageEntry = getFromStorage<T>(key);
  if (storageEntry) {
    memoryCache.set(key, storageEntry);
    return storageEntry.data;
  }

  return null;
}

export function setCachedData<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };
  memoryCache.set(key, entry);
  setToStorage(key, entry);
  notifySubscribers(key);
}

export function isCacheStale(key: string, staleTime: number = DEFAULT_STALE_TIME): boolean {
  const memEntry = memoryCache.get(key);
  if (memEntry) {
    return Date.now() - memEntry.timestamp > staleTime;
  }

  const storageEntry = getFromStorage(key);
  if (storageEntry) {
    return Date.now() - storageEntry.timestamp > staleTime;
  }

  return true;
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig = {}
): Promise<T> {
  const { staleTime = DEFAULT_STALE_TIME } = config;

  const cached = getCachedData<T>(key);
  const isStale = isCacheStale(key, staleTime);

  if (cached && !isStale) {
    return cached;
  }

  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const request = fetcher().then((data) => {
    setCachedData(key, data);
    pendingRequests.delete(key);
    return data;
  }).catch((error) => {
    pendingRequests.delete(key);
    throw error;
  });

  pendingRequests.set(key, request);
  return request;
}

export function prefetch<T>(key: string, fetcher: () => Promise<T>): void {
  fetchWithCache(key, fetcher).catch(() => {});
}

export function invalidateCache(key: string): void {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(`cache_${key}`);
  } catch {
    // Ignore storage errors
  }
  notifySubscribers(key);
}

export function useSWR<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  config: CacheConfig = {}
): {
  data: T | null;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  mutate: (data?: T) => void;
} {
  const { staleTime = DEFAULT_STALE_TIME } = config;

  const [data, setData] = useState<T | null>(() => {
    if (!key) return null;
    return getCachedData<T>(key);
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (!key) return false;
    return !getCachedData<T>(key);
  });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const revalidate = useCallback(async () => {
    if (!key) return;

    const cached = getCachedData<T>(key);
    const isStale = isCacheStale(key, staleTime);

    if (cached && !isStale) {
      if (mountedRef.current) {
        setData(cached);
        setIsLoading(false);
      }
      return;
    }

    if (!cached) {
      setIsLoading(true);
    }
    setIsValidating(true);

    try {
      const freshData = await fetchWithCache(key, fetcher, config);
      if (mountedRef.current) {
        setData(freshData);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        setIsValidating(false);
      }
    }
  }, [key, fetcher, staleTime, config]);

  const mutate = useCallback((newData?: T) => {
    if (!key) return;

    if (newData !== undefined) {
      setCachedData(key, newData);
      setData(newData);
    } else {
      invalidateCache(key);
      revalidate();
    }
  }, [key, revalidate]);

  useEffect(() => {
    mountedRef.current = true;

    if (key) {
      const cached = getCachedData<T>(key);
      if (cached) {
        setData(cached);
        setIsLoading(false);
      }

      revalidate();

      if (!subscribers.has(key)) {
        subscribers.set(key, new Set());
      }
      const callback = () => {
        const newData = getCachedData<T>(key);
        if (newData && mountedRef.current) {
          setData(newData);
        }
      };
      subscribers.get(key)!.add(callback);

      return () => {
        mountedRef.current = false;
        subscribers.get(key)?.delete(callback);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [key, revalidate]);

  return { data, isLoading, isValidating, error, mutate };
}

export function clearAllCache(): void {
  memoryCache.clear();
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage errors
  }
}
