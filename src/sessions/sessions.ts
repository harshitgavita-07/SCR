import type { ScrId, ScrStatus } from '../contracts/types.js';

/**
 * Session configuration.
 */
export interface SessionConfig {
  readonly name: string;
  readonly timeoutMs?: number;
  readonly autoSave?: boolean;
}

/**
 * Session state.
 */
export interface SessionState {
  readonly data: Record<string, unknown>;
  readonly history: SessionHistoryEntry[];
}

/**
 * Entry in the session history.
 */
export interface SessionHistoryEntry {
  readonly timestamp: number;
  readonly action: string;
  readonly params?: Record<string, unknown>;
  readonly result?: unknown;
}

/**
 * Session interface for managing execution context.
 */
export interface Session {
  readonly id: ScrId;
  readonly status: ScrStatus;
  readonly config: SessionConfig;
  readonly state: SessionState;

  /**
   * Sets a value in the session state.
   */
  set(key: string, value: unknown): void;

  /**
   * Gets a value from the session state.
   */
  get<T>(key: string): T | undefined;

  /**
   * Deletes a value from the session state.
   */
  delete(key: string): boolean;

  /**
   * Records an action in the session history.
   */
  record(action: string, params?: Record<string, unknown>, result?: unknown): void;

  /**
   * Exports the session state.
   */
  export(): Record<string, unknown>;

  /**
   * Imports session state.
   */
  import(state: Record<string, unknown>): void;

  /**
   * Clears the session state.
   */
  clear(): void;
}
