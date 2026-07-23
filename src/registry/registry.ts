import type { ScrId } from '../contracts/types.js';
import { generateScrId } from '../contracts/types.js';

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
 * Mutable registry entry for internal use.
 */
interface MutableRegistryEntry<T> {
  id: ScrId;
  name: string;
  value: T;
  metadata?: Record<string, unknown>;
  registeredAt: number;
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
  register(
    name: string,
    value: T,
    metadata?: Record<string, unknown>
  ): RegistryEntry<T>;

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

/**
 * Creates a new generic registry.
 *
 * @returns A new registry instance
 *
 * @example
 * ```typescript
 * const registry = createRegistry<Action>();
 * registry.register('click', clickAction);
 * const action = registry.get('click');
 * ```
 */
export function createRegistry<T>(): Registry<T> {
  const entries = new Map<string, MutableRegistryEntry<T>>();
  const byId = new Map<ScrId, MutableRegistryEntry<T>>();

  return {
    get size() {
      return entries.size;
    },

    register(
      name: string,
      value: T,
      metadata?: Record<string, unknown>
    ): RegistryEntry<T> {
      const now = Date.now();
      const entry: MutableRegistryEntry<T> = {
        id: generateScrId(),
        name,
        value,
        ...(metadata !== undefined && { metadata }),
        registeredAt: now,
      };

      entries.set(name, entry);
      byId.set(entry.id, entry);

      return entry as RegistryEntry<T>;
    },

    get(name: string): RegistryEntry<T> | undefined {
      const entry = entries.get(name);
      return entry as RegistryEntry<T> | undefined;
    },

    getById(id: ScrId): RegistryEntry<T> | undefined {
      const entry = byId.get(id);
      return entry as RegistryEntry<T> | undefined;
    },

    has(name: string): boolean {
      return entries.has(name);
    },

    unregister(name: string): boolean {
      const entry = entries.get(name);
      if (entry !== undefined) {
        byId.delete(entry.id);
        return entries.delete(name);
      }
      return false;
    },

    list(query?: RegistryQuery): RegistryEntry<T>[] {
      let result = Array.from(entries.values()) as RegistryEntry<T>[];

      if (query?.name !== undefined) {
        result = result.filter((entry) => entry.name === query.name);
      }

      if (query?.metadata !== undefined) {
        result = result.filter((entry) => {
          if (entry.metadata === undefined) {
            return false;
          }
          return Object.entries(query.metadata!).every(
            ([key, value]) => entry.metadata?.[key] === value
          );
        });
      }

      if (query?.limit !== undefined && query.limit > 0) {
        result = result.slice(0, query.limit);
      }

      return result;
    },

    clear(): void {
      entries.clear();
      byId.clear();
    },
  };
}
