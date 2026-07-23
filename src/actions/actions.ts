import type { ScrId } from '../contracts/types.js';

/**
 * Base action interface for all actions.
 */
export interface Action {
  readonly id: ScrId;
  readonly name: string;
  readonly description: string;
}

/**
 * Click action parameters.
 */
export interface ClickParams {
  readonly selector: string;
  readonly button?: 'left' | 'right' | 'middle';
  readonly clickCount?: number;
}

/**
 * Type action parameters.
 */
export interface TypeParams {
  readonly selector: string;
  readonly text: string;
  readonly delay?: number;
}

/**
 * Navigate action parameters.
 */
export interface NavigateParams {
  readonly url: string;
  readonly waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
}

/**
 * Wait action parameters.
 */
export interface WaitParams {
  readonly selector?: string;
  readonly timeoutMs?: number;
}

/**
 * Scroll action parameters.
 */
export interface ScrollParams {
  readonly selector?: string;
  readonly deltaX: number;
  readonly deltaY: number;
}

/**
 * Hover action parameters.
 */
export interface HoverParams {
  readonly selector: string;
}

/**
 * Select option action parameters.
 */
export interface SelectOptionParams {
  readonly selector: string;
  readonly value: string | string[];
}

/**
 * Press key action parameters.
 */
export interface PressKeyParams {
  readonly key: string;
  readonly count?: number;
  readonly delay?: number;
}

/**
 * Screenshot action parameters.
 */
export interface ScreenshotParams {
  readonly path?: string;
  readonly fullPage?: boolean;
}

/**
 * Action execution result.
 */
export interface ActionResult {
  readonly actionId: ScrId;
  readonly success: boolean;
  readonly data?: unknown;
  readonly error?: Error;
}

/**
 * Registry of available actions.
 */
export interface ActionRegistry {
  register(action: Action): void;
  get(name: string): Action | undefined;
  has(name: string): boolean;
  list(): Action[];
}
