import type { ScrId, ScrStatus } from '../contracts/types.js';
import type { Observer } from '../observer/observer.js';

/**
 * Chromium-specific configuration.
 */
export interface ChromiumConfig {
  readonly headless?: boolean;
  readonly executablePath?: string;
  readonly args?: string[];
  readonly viewport?: ViewportSize;
  readonly timeoutMs?: number;
}

/**
 * Viewport size configuration.
 */
export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

/**
 * Chromium target implementation.
 */
export interface ChromiumTarget extends Observer {
  readonly id: ScrId;
  readonly status: ScrStatus;
  readonly config: ChromiumConfig;

  /**
   * Launches the Chromium browser.
   */
  launch(config?: ChromiumConfig): Promise<void>;

  /**
   * Navigates to a URL.
   */
  navigate(url: string): Promise<void>;

  /**
   * Gets the current URL.
   */
  getCurrentUrl(): string | undefined;

  /**
   * Gets the page title.
   */
  getTitle(): string | undefined;

  /**
   * Closes the browser.
   */
  close(): Promise<void>;
}
