import type { ScrId, ScrStatus } from '../contracts/types.js';
import { generateScrId } from '../contracts/types.js';

/**
 * Memory entry.
 */
export interface MemoryEntry {
  readonly id: ScrId;
  readonly key: string;
  readonly value: unknown;
  readonly ttl?: number;
  readonly createdAt: number;
  readonly expiresAt?: number;
}

/**
 * Mutable memory entry for internal use.
 */
interface MutableMemoryEntry {
  id: ScrId;
  key: string;
  value: unknown;
  ttl?: number;
  createdAt: number;
  expiresAt?: number;
}

/**
 * Memory statistics.
 */
export interface MemoryStats {
  readonly size: number;
  readonly maxSize: number;
  readonly hits: number;
  readonly misses: number;
  readonly evictions: number;
}

/**
 * Memory interface for storing and retrieving data.
 */
export interface Memory {
  readonly id: ScrId;
  readonly status: ScrStatus;

  /**
   * Sets a value in memory.
   */
  set(key: string, value: unknown, ttlMs?: number): void;

  /**
   * Gets a value from memory.
   */
  get<T>(key: string): T | undefined;

  /**
   * Deletes a value from memory.
   */
  delete(key: string): boolean;

  /**
   * Checks if a key exists in memory.
   */
  has(key: string): boolean;

  /**
   * Clears all entries from memory.
   */
  clear(): void;

  /**
   * Returns memory statistics.
   */
  stats(): MemoryStats;

  /**
   * Prunes expired entries.
   */
  prune(): number;
}

/**
 * Configuration for memory store.
 */
export interface MemoryConfig {
  readonly maxSize?: number;
  readonly defaultTtlMs?: number;
}

/**
 * Creates a new in-memory store with optional TTL support.
 *
 * @param config - Memory configuration
 * @returns A new memory instance
 *
 * @example
 * ```typescript
 * const memory = createMemory({ maxSize: 1000 });
 * memory.set('key', 'value');
 * const value = memory.get<string>('key');
 * ```
 */
export function createMemory(config: MemoryConfig = {}): Memory {
  const id = generateScrId();
  let status: ScrStatus = 'running';
  const entries = new Map<string, MutableMemoryEntry>();
  const maxSize = config.maxSize ?? 10000;
  const defaultTtlMs = config.defaultTtlMs;
  
  let hits = 0;
  let misses = 0;
  let evictions = 0;

  function pruneExpired(): number {
    const now = Date.now();
    let pruned = 0;
    
    for (const [key, entry] of entries.entries()) {
      if (entry.expiresAt !== undefined && now >= entry.expiresAt) {
        entries.delete(key);
        pruned++;
      }
    }
    
    return pruned;
  }

  function evictOldest(): void {
    let oldestTime = Infinity;
    let oldestKey: string | null = null;
    
    for (const [key, entry] of entries.entries()) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }
    
    if (oldestKey !== null) {
      entries.delete(oldestKey);
      evictions++;
    }
  }

  return {
    id,
    get status() {
      return status;
    },

    set(key: string, value: unknown, ttlMs?: number): void {
      // Prune expired entries first
      pruneExpired();
      
      const now = Date.now();
      const effectiveTtl = ttlMs ?? defaultTtlMs;
      
      const entry: MutableMemoryEntry = {
        id: generateScrId(),
        key,
        value,
        createdAt: now,
        ...(effectiveTtl !== undefined && { ttl: effectiveTtl, expiresAt: now + effectiveTtl }),
      };
      
      // Check if we need to evict
      if (entries.size >= maxSize && !entries.has(key)) {
        evictOldest();
      }
      
      entries.set(key, entry);
    },

    get<T>(key: string): T | undefined {
      const entry = entries.get(key);
      
      if (entry === undefined) {
        misses++;
        return undefined;
      }
      
      // Check if expired
      if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
        entries.delete(key);
        misses++;
        return undefined;
      }
      
      hits++;
      return entry.value as T;
    },

    delete(key: string): boolean {
      return entries.delete(key);
    },

    has(key: string): boolean {
      const entry = entries.get(key);
      
      if (entry === undefined) {
        return false;
      }
      
      // Check if expired
      if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
        entries.delete(key);
        return false;
      }
      
      return true;
    },

    clear(): void {
      entries.clear();
      status = 'running';
    },

    stats(): MemoryStats {
      return {
        size: entries.size,
        maxSize,
        hits,
        misses,
        evictions,
      };
    },

    prune(): number {
      return pruneExpired();
    },
  };
}
