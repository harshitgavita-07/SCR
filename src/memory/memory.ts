import type { ScrId, ScrStatus } from '../contracts/types.js';

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
