import type { ScrId } from '../contracts/types.js';

/**
 * Registration entry in the registry.
 */
export interface RegistryEntry<T> {
  readonly id: ScrId;
  readonly name: string;
  readonly value: T;
  readonly metadata?: Record<string, unknown>;
  readonly registeredAt: number;
}

/**
 * Query options for registry lookups.
 */
export interface RegistryQuery {
  readonly name?: string;
  readonly metadata?: Record<string, unknown>;
  readonly limit?: number;
}

/**
 * Registry interface for managing component registrations.
 */
export interface Registry<T> {
  readonly size: number;

  /**
   * Registers a new entry.
   */
  register(name: string, value: T, metadata?: Record<string, unknown>): RegistryEntry<T>;

  /**
   * Gets an entry by name.
   */
  get(name: string): RegistryEntry<T> | undefined;

  /**
   * Gets an entry by ID.
   */
  getById(id: ScrId): RegistryEntry<T> | undefined;

  /**
   * Checks if an entry exists by name.
   */
  has(name: string): boolean;

  /**
   * Unregisters an entry by name.
   */
  unregister(name: string): boolean;

  /**
   * Lists all entries matching the query.
   */
  list(query?: RegistryQuery): RegistryEntry<T>[];

  /**
   * Clears all entries.
   */
  clear(): void;
}
