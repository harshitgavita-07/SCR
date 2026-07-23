import type { ScrId } from '../contracts/types.js';
import type { ExecutionEngine } from '../engine/engine.js';
import type { Planner } from '../planner/planner.js';
import type { Observer } from '../observer/observer.js';
import type { Verifier } from '../verifier/verifier.js';
import type { Session } from '../sessions/sessions.js';
import type { Memory } from '../memory/memory.js';

/**
 * SCR SDK configuration.
 */
export interface SdkConfig {
  readonly appName?: string;
  readonly debug?: boolean;
}

/**
 * SCR SDK interface for programmatic access.
 */
export interface ScrSdk {
  readonly id: ScrId;
  readonly version: string;

  /**
   * Creates a new execution engine.
   */
  createEngine(): ExecutionEngine;

  /**
   * Creates a new planner.
   */
  createPlanner(): Planner;

  /**
   * Creates a new observer.
   */
  createObserver(): Observer;

  /**
   * Creates a new verifier.
   */
  createVerifier(): Verifier;

  /**
   * Creates a new session.
   */
  createSession(): Session;

  /**
   * Creates a new memory store.
   */
  createMemory(): Memory;

  /**
   * Disposes all resources.
   */
  dispose(): Promise<void>;
}
