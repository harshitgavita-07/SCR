import type { ScrId, ScrStatus } from '../contracts/types.js';
import { generateScrId } from '../contracts/types.js';

/**
 * Session configuration.
 */
export interface SessionConfig {
  readonly name: string;
  readonly timeoutMs?: number;
  readonly autoSave?: boolean;
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
 * Session state.
 */
export interface SessionState {
  readonly data: Record<string, unknown>;
  readonly history: SessionHistoryEntry[];
}

/**
 * Session state (mutable internal version).
 */
export interface MutableSessionState {
  data: Record<string, unknown>;
  history: SessionHistoryEntry[];
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
  record(
    action: string,
    params?: Record<string, unknown>,
    result?: unknown
  ): void;

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

/**
 * Creates a new session with the given configuration.
 *
 * @param config - Session configuration
 * @returns A new session instance
 *
 * @example
 * ```typescript
 * const session = createSession({ name: 'browser-session' });
 * session.set('url', 'https://example.com');
 * ```
 */
export function createSession(config: SessionConfig): Session {
  const id = generateScrId();
  let status: ScrStatus = 'running';
  const state: MutableSessionState = {
    data: {},
    history: [],
  };

  return {
    id,
    get status() {
      return status;
    },
    config,
    get state() {
      return { ...state } as SessionState;
    },

    set(key: string, value: unknown): void {
      state.data[key] = value;
    },

    get<T>(key: string): T | undefined {
      return state.data[key] as T | undefined;
    },

    delete(key: string): boolean {
      if (key in state.data) {
        delete state.data[key];
        return true;
      }
      return false;
    },

    record(
      action: string,
      params?: Record<string, unknown>,
      result?: unknown
    ): void {
      const entry: SessionHistoryEntry = {
        timestamp: Date.now(),
        action,
        ...(params !== undefined && { params }),
        ...(result !== undefined && { result }),
      };
      state.history.push(entry);
    },

    export(): Record<string, unknown> {
      return {
        id: this.id,
        status: this.status,
        config: this.config,
        state: { ...state } as SessionState,
      };
    },

    import(newState: Record<string, unknown>): void {
      const newData = newState['data'];
      const newHistory = newState['history'];
      
      if (newData && typeof newData === 'object') {
        state.data = { ...(newData as Record<string, unknown>) };
      }
      if (newHistory && Array.isArray(newHistory)) {
        state.history = newHistory as SessionHistoryEntry[];
      }
    },

    clear(): void {
      state.data = {};
      state.history = [];
      status = 'running';
    },
  };
}
