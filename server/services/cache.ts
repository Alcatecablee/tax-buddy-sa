/**
 * Cache Service
 * 
 * Production-ready caching layer with in-memory storage and TTL support.
 * Designed to work without Redis for simplicity, but can be extended to use Redis later.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  metadata?: CacheMetadata;
}

interface CacheMetadata {
  lastLiveFetch?: string; // ISO timestamp of last successful live data fetch
  lastFallbackAt?: string; // ISO timestamp when fallback data was last used
  source?: 'live' | 'fallback' | 'stale-cache';
  nextRefreshEta?: string; // ISO timestamp of next planned refresh
}

export class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    this.cache = new Map();
    this.startCleanup();
  }
  
  /**
   * Get value from cache
   * Returns null if key doesn't exist or has expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Get value with metadata from cache
   * Returns null if key doesn't exist or has expired
   */
  getWithMetadata<T>(key: string): { data: T; metadata?: CacheMetadata } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return {
      data: entry.data as T,
      metadata: entry.metadata,
    };
  }
  
  /**
   * Set value in cache with TTL (time-to-live) in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number = 3600, metadata?: CacheMetadata): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    
    this.cache.set(key, {
      data,
      expiresAt,
      metadata,
    });
  }
  
  /**
   * Delete specific key from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Delete all keys matching a pattern (simple prefix matching)
   */
  deletePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    
    for (const key of keys) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
  
  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }
  
  /**
   * Remove all expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keys = Array.from(this.cache.keys());
    
    let removed = 0;
    
    for (const key of keys) {
      const entry = this.cache.get(key);
      
      if (entry && now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`[Cache] Cleaned up ${removed} expired entries`);
    }
  }
  
  /**
   * Stop cleanup interval (for graceful shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Export singleton instance
export const cache = new CacheService();

/**
 * Cached function wrapper
 * Automatically caches function results with TTL
 */
export function cached<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  return async function() {
    // Try to get from cache
    const cached = cache.get<T>(cacheKey);
    
    if (cached !== null) {
      console.log(`[Cache] HIT: ${cacheKey}`);
      return cached;
    }
    
    console.log(`[Cache] MISS: ${cacheKey}`);
    
    // Execute function and cache result
    const result = await fn();
    cache.set(cacheKey, result, ttlSeconds);
    
    return result;
  }();
}

/**
 * Cached function wrapper with metadata support
 * Returns both cached data and metadata for transparency
 */
export function cachedWithMetadata<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<{ data: T; metadata?: CacheMetadata }> {
  return async function() {
    // Try to get from cache with metadata
    const cached = cache.getWithMetadata<T>(cacheKey);
    
    if (cached !== null) {
      console.log(`[Cache] HIT with metadata: ${cacheKey}`);
      return cached;
    }
    
    console.log(`[Cache] MISS: ${cacheKey}`);
    
    // Execute function and cache result
    const result = await fn();
    
    // Add metadata for new live fetch
    const now = new Date().toISOString();
    const nextRefresh = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    
    const metadata: CacheMetadata = {
      lastLiveFetch: now,
      source: 'live',
      nextRefreshEta: nextRefresh,
    };
    
    cache.set(cacheKey, result, ttlSeconds, metadata);
    
    return { data: result, metadata };
  }();
}

// Export cache metadata type for use in other modules
export type { CacheMetadata };
