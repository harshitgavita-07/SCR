import type { ScrId, ScrStatus } from '../contracts/types.js';

/**
 * Represents a UI element in the observed application.
 */
export interface UiElement {
  readonly id: ScrId;
  readonly selector: string;
  readonly type: string;
  readonly text?: string;
  readonly value?: string;
  readonly bounds: ElementBounds;
  readonly visible: boolean;
  readonly enabled: boolean;
}

/**
 * Bounding box for a UI element.
 */
export interface ElementBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Snapshot of the current UI state.
 */
export interface UiSnapshot {
  readonly timestamp: number;
  readonly elements: UiElement[];
  readonly screenshot?: Buffer;
  readonly title?: string;
  readonly url?: string;
}

/**
 * Observer interface for monitoring UI state.
 */
export interface Observer {
  readonly id: ScrId;
  readonly status: ScrStatus;

  /**
   * Starts observing the target application.
   */
  start(): Promise<void>;

  /**
   * Captures a snapshot of the current UI state.
   */
  captureSnapshot(): Promise<UiSnapshot>;

  /**
   * Finds an element by selector.
   */
  findElement(selector: string): Promise<UiElement | null>;

  /**
   * Finds all elements matching a selector.
   */
  findElements(selector: string): Promise<UiElement[]>;

  /**
   * Waits for an element to be visible.
   */
  waitForVisible(selector: string, timeoutMs?: number): Promise<UiElement>;

  /**
   * Stops observing.
   */
  stop(): Promise<void>;
}
