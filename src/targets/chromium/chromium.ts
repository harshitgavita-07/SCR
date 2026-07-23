import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';
import type { ScrId, ScrStatus } from '../../contracts/types.js';
import { generateScrId, createResourceUnavailableError, createInternalError } from '../../contracts/types.js';
import type { Observer, UiElement, UiSnapshot } from '../../observer/observer.js';

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
 * Default viewport size for Chromium browser.
 */
const DEFAULT_VIEWPORT: ViewportSize = { width: 1280, height: 720 };

/**
 * Default timeout for browser operations in milliseconds.
 */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * ChromiumTarget implementation using Playwright.
 * 
 * This class provides a production-ready browser automation target
 * that implements the Observer interface for screen observation.
 * 
 * @example
 * ```typescript
 * const target = new ChromiumTargetImpl();
 * await target.launch({ headless: true });
 * await target.navigate('https://example.com');
 * const snapshot = await target.captureSnapshot();
 * await target.close();
 * ```
 */
export class ChromiumTargetImpl implements Observer {
  readonly id: ScrId;
  private _status: ScrStatus;
  private _config: ChromiumConfig;
  private _browser: Browser | null = null;
  private _context: BrowserContext | null = null;
  private _page: Page | null = null;
  private _currentUrl?: string;
  private _title?: string;

  constructor(config: ChromiumConfig = {}) {
    this.id = generateScrId();
    this._status = 'idle';
    this._config = config;
  }

  get status(): ScrStatus {
    return this._status;
  }

  get config(): ChromiumConfig {
    return this._config;
  }

  /**
   * Launches the Chromium browser with the provided configuration.
   * 
   * @param config - Optional configuration to override constructor config
   * @throws Error if browser fails to launch
   */
  async launch(config?: ChromiumConfig): Promise<void> {
    if (this._status === 'running') {
      return;
    }

    try {
      this._status = 'initializing';
      const finalConfig = { ...this._config, ...config };

      const launchOptions: { headless: boolean; args: string[]; executablePath?: string } = {
        headless: finalConfig.headless ?? true,
        args: finalConfig.args ?? [],
      };

      if (finalConfig.executablePath) {
        launchOptions.executablePath = finalConfig.executablePath;
      }

      this._browser = await chromium.launch(launchOptions);

      const viewport = finalConfig.viewport ?? DEFAULT_VIEWPORT;
      this._context = await this._browser.newContext({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });

      this._page = await this._context.newPage();
      this._page.setDefaultTimeout(finalConfig.timeoutMs ?? DEFAULT_TIMEOUT_MS);

      this._status = 'running';
    } catch (error) {
      this._status = 'error';
      throw createResourceUnavailableError(
        'Chromium browser',
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Navigates to the specified URL.
   * 
   * @param url - The URL to navigate to
   * @throws Error if navigation fails or page is not available
   */
  async navigate(url: string): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { url });
    }

    try {
      await this._page.goto(url, { waitUntil: 'networkidle' });
      this._currentUrl = this._page.url();
      this._title = await this._page.title();
    } catch (error) {
      throw createInternalError(
        `Failed to navigate to ${url}`,
        error instanceof Error ? error : undefined,
        { url }
      );
    }
  }

  /**
   * Gets the current URL of the page.
   * 
   * @returns The current URL or undefined if not available
   */
  getCurrentUrl(): string | undefined {
    return this._currentUrl;
  }

  /**
   * Gets the current page title.
   * 
   * @returns The page title or undefined if not available
   */
  getTitle(): string | undefined {
    return this._title;
  }

  /**
   * Starts observing the browser page.
   * 
   * @throws Error if browser is not launched
   */
  async start(): Promise<void> {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }
    this._status = 'running';
  }

  /**
   * Captures a snapshot of the current UI state.
   * 
   * @returns A UI snapshot containing elements, screenshot, title, and URL
   * @throws Error if page is not available
   */
  async captureSnapshot(): Promise<UiSnapshot> {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timestamp = Date.now();
      const elements = await this.findAllElements();
      const screenshot = await this._page.screenshot({ type: 'png', fullPage: false });
      const title = await this._page.title();
      const url = this._page.url();

      this._currentUrl = url;
      this._title = title;

      return {
        timestamp,
        elements,
        screenshot,
        title,
        url,
      };
    } catch (error) {
      throw createInternalError(
        'Failed to capture UI snapshot',
        error instanceof Error ? error : undefined,
        { status: this._status }
      );
    }
  }

  /**
   * Finds all visible elements on the page.
   * 
   * @private
   * @returns Array of UI elements
   */
  private async findAllElements(): Promise<UiElement[]> {
    if (!this._page) {
      return [];
    }

    try {
      // Get all visible interactive elements
      const elementHandles = await this._page.$$(
        'a, button, input, select, textarea, [role="button"], [role="link"], [role="textbox"]'
      );

      const elements: UiElement[] = [];
      for (const handle of elementHandles) {
        try {
          const isVisible = await handle.isVisible();
          if (!isVisible) continue;

          const boundingBox = await handle.boundingBox();
          if (!boundingBox) continue;

          const tagName = await handle.evaluate((el: Element) => (el as HTMLElement).tagName.toLowerCase());
          const textContent = await handle.evaluate((el: Element) => (el as HTMLElement).innerText?.slice(0, 500));
          const inputValue = await handle.evaluate((el: Element) => (el as HTMLInputElement).value);
          const isEnabled = await handle.isEnabled();

          const element: UiElement = {
            id: generateScrId(),
            selector: '', // Will be populated by findElement methods
            type: tagName,
            ...(textContent && { text: textContent }),
            ...(inputValue && { value: inputValue }),
            bounds: {
              x: boundingBox.x,
              y: boundingBox.y,
              width: boundingBox.width,
              height: boundingBox.height,
            },
            visible: isVisible,
            enabled: isEnabled,
          };

          elements.push(element);
        } catch {
          // Skip elements that can't be processed
          continue;
        }
      }

      return elements;
    } catch {
      return [];
    }
  }

  /**
   * Finds an element by selector.
   * 
   * @param selector - CSS selector to find the element
   * @returns The UI element or null if not found
   * @throws Error if page is not available
   */
  async findElement(selector: string): Promise<UiElement | null> {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const handle = await this._page.$(selector);
      if (!handle) {
        return null;
      }

      const isVisible = await handle.isVisible();
      const boundingBox = await handle.boundingBox();
      if (!boundingBox) {
        return null;
      }

      const tagName = await handle.evaluate((el: Element) => (el as HTMLElement).tagName.toLowerCase());
      const textContent = await handle.evaluate((el: Element) => (el as HTMLElement).innerText?.slice(0, 500));
      const inputValue = await handle.evaluate((el: Element) => (el as HTMLInputElement).value);
      const isEnabled = await handle.isEnabled();

      const element: UiElement = {
        id: generateScrId(),
        selector,
        type: tagName,
        ...(textContent && { text: textContent }),
        ...(inputValue && { value: inputValue }),
        bounds: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
        visible: isVisible,
        enabled: isEnabled,
      };

      return element;
    } catch {
      return null;
    }
  }

  /**
   * Finds all elements matching a selector.
   * 
   * @param selector - CSS selector to find elements
   * @returns Array of matching UI elements
   * @throws Error if page is not available
   */
  async findElements(selector: string): Promise<UiElement[]> {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const handles = await this._page.$$(selector);
      const elements: UiElement[] = [];

      for (const handle of handles) {
        try {
          const isVisible = await handle.isVisible();
          if (!isVisible) continue;

          const boundingBox = await handle.boundingBox();
          if (!boundingBox) continue;

          const tagName = await handle.evaluate((el: Element) => (el as HTMLElement).tagName.toLowerCase());
          const textContent = await handle.evaluate((el: Element) => (el as HTMLElement).innerText?.slice(0, 500));
          const inputValue = await handle.evaluate((el: Element) => (el as HTMLInputElement).value);
          const isEnabled = await handle.isEnabled();

          const element: UiElement = {
            id: generateScrId(),
            selector,
            type: tagName,
            ...(textContent && { text: textContent }),
            ...(inputValue && { value: inputValue }),
            bounds: {
              x: boundingBox.x,
              y: boundingBox.y,
              width: boundingBox.width,
              height: boundingBox.height,
            },
            visible: isVisible,
            enabled: isEnabled,
          };

          elements.push(element);
        } catch {
          continue;
        }
      }

      return elements;
    } catch {
      return [];
    }
  }

  /**
   * Waits for an element to be visible.
   * 
   * @param selector - CSS selector to wait for
   * @param timeoutMs - Optional timeout in milliseconds
   * @returns The visible UI element
   * @throws Error if element doesn't become visible within timeout
   */
  async waitForVisible(selector: string, timeoutMs?: number): Promise<UiElement> {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = timeoutMs ?? this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      await this._page.waitForSelector(selector, { state: 'visible', timeout });

      const element = await this.findElement(selector);
      if (!element) {
        throw createInternalError('Element not found after waiting', {}, { selector });
      }

      return element;
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        throw createInternalError(
          `Timeout waiting for element to be visible`,
          error,
          { selector, timeoutMs }
        );
      }
      throw error;
    }
  }

  /**
   * Stops observing and cleans up resources.
   */
  async stop(): Promise<void> {
    this._status = 'stopping';
    await this.close();
  }

  /**
   * Closes the browser and cleans up all resources.
   */
  async close(): Promise<void> {
    try {
      if (this._page) {
        await this._page.close();
        this._page = null;
      }
      if (this._context) {
        await this._context.close();
        this._context = null;
      }
      if (this._browser) {
        await this._browser.close();
        this._browser = null;
      }
      this._status = 'stopped';
    } catch (error) {
      this._status = 'error';
      throw createInternalError(
        'Failed to close browser',
        error instanceof Error ? error : undefined
      );
    }
  }
}

/**
 * Factory function to create a Chromium target instance.
 * 
 * @param config - Optional configuration for the Chromium target
 * @returns A new ChromiumTarget instance
 * 
 * @example
 * ```typescript
 * const target = createChromiumTarget({ headless: true });
 * await target.launch();
 * ```
 */
export function createChromiumTarget(config?: ChromiumConfig): Observer & {
  launch(config?: ChromiumConfig): Promise<void>;
  navigate(url: string): Promise<void>;
  getCurrentUrl(): string | undefined;
  getTitle(): string | undefined;
  close(): Promise<void>;
} {
  return new ChromiumTargetImpl(config);
}
