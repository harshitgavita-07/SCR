import { EventEmitter } from 'node:events';
import type { ScrId } from '../contracts/types.js';

/**
 * Event payload types for SCR events.
 */
export interface ScrEventMap {
  /** Runtime started */
  'runtime:start': { timestamp: number };
  /** Runtime stopped */
  'runtime:stop': { timestamp: number; reason?: string };
  /** Runtime error */
  'runtime:error': { timestamp: number; error: Error };
  /** Session created */
  'session:create': { sessionId: ScrId; timestamp: number };
  /** Session destroyed */
  'session:destroy': { sessionId: ScrId; timestamp: number };
  /** Action started */
  'action:start': { actionId: string; actionType: string; timestamp: number };
  /** Action completed */
  'action:complete': {
    actionId: string;
    actionType: string;
    result: unknown;
    timestamp: number;
  };
  /** Action failed */
  'action:fail': {
    actionId: string;
    actionType: string;
    error: Error;
    timestamp: number;
  };
  /** State changed */
  'state:change': {
    previousState: string;
    newState: string;
    timestamp: number;
  };
  /** Observation captured */
  'observation:capture': {
    observationId: string;
    type: string;
    timestamp: number;
  };
}

/**
 * SCR event emitter type.
 */
export type ScrEventEmitter = EventEmitter<ScrEventMap>;

/**
 * Creates a new SCR event emitter.
 *
 * @returns A new event emitter instance
 *
 * @example
 * ```typescript
 * const emitter = createScrEventEmitter();
 * emitter.on('runtime:start', (data) => {
 *   console.log('Runtime started at', data.timestamp);
 * });
 * ```
 */
export function createScrEventEmitter(): ScrEventEmitter {
  return new EventEmitter<ScrEventMap>();
}

/**
 * Type-safe event listener function.
 */
export type ScrEventListener<T extends keyof ScrEventMap> = (
  payload: ScrEventMap[T],
) => void | Promise<void>;

/**
 * Subscribes to an SCR event.
 *
 * @param emitter - The event emitter
 * @param event - The event name
 * @param listener - The event listener
 * @returns An unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToEvent(emitter, 'runtime:start', (data) => {
 *   console.log('Started:', data.timestamp);
 * });
 *
 * // Later...
 * unsubscribe();
 * ```
 */
export function subscribeToEvent<T extends keyof ScrEventMap>(
  emitter: ScrEventEmitter,
  event: T,
  listener: ScrEventListener<T>,
): () => void {
  emitter.on(event, listener);
  return () => {
    emitter.off(event, listener);
  };
}

/**
 * Waits for a specific event to occur.
 *
 * @param emitter - The event emitter
 * @param event - The event to wait for
 * @param timeoutMs - Optional timeout in milliseconds
 * @returns A promise that resolves with the event payload
 * @throws {Error} If the timeout is reached
 *
 * @example
 * ```typescript
 * const payload = await waitForEvent(emitter, 'runtime:start', 5000);
 * console.log('Runtime started with payload:', payload);
 * ```
 */
export async function waitForEvent<T extends keyof ScrEventMap>(
  emitter: ScrEventEmitter,
  event: T,
  timeoutMs?: number,
): Promise<ScrEventMap[T]> {
  return new Promise((resolve, reject) => {
    let timeoutHandle: NodeJS.Timeout | undefined;

    const handler = (payload: ScrEventMap[T]) => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      emitter.off(event, handler);
      resolve(payload);
    };

    emitter.on(event, handler);

    if (timeoutMs !== undefined) {
      timeoutHandle = setTimeout(() => {
        emitter.off(event, handler);
        reject(new Error(`Timeout waiting for event: ${event}`));
      }, timeoutMs);
    }
  });
}

/**
 * Emits an SCR event.
 *
 * @param emitter - The event emitter
 * @param event - The event name
 * @param payload - The event payload
 *
 * @example
 * ```typescript
 * emitEvent(emitter, 'runtime:start', { timestamp: Date.now() });
 * ```
 */
export function emitEvent<T extends keyof ScrEventMap>(
  emitter: ScrEventEmitter,
  event: T,
  payload: ScrEventMap[T],
): void {
  emitter.emit(event, payload);
}
