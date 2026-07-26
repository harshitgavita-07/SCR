import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page, type Locator } from 'playwright';
import type { ScrId } from '../../contracts/types.js';
import { generateScrId, createResourceUnavailableError, createInternalError } from '../../contracts/types.js';
import type { UiElement, UiSnapshot, ElementBounds } from '../../observer/observer.js';
import { EventEmitter } from 'node:events';

/**
 * Browser configuration options.
 */
export interface BrowserConfig {
  /** Browser type: chromium, firefox, or webkit */
  readonly browserType?: 'chromium' | 'firefox' | 'webkit';
  /** Run in headless mode */
  readonly headless?: boolean;
  /** Custom executable path */
  readonly executablePath?: string;
  /** Browser launch arguments */
  readonly args?: string[];
  /** Viewport size */
  readonly viewport?: ViewportSize;
  /** Default timeout for operations in milliseconds */
  readonly timeoutMs?: number;
  /** Enable browser devtools */
  readonly devtools?: boolean;
  /** Ignore HTTPS errors */
  readonly ignoreHTTPSErrors?: boolean;
  /** User agent string */
  readonly userAgent?: string;
  /** Proxy configuration */
  readonly proxy?: ProxyConfig;
}

/**
 * Viewport size configuration.
 */
export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

/**
 * Proxy configuration.
 */
export interface ProxyConfig {
  readonly server: string;
  readonly bypass?: string;
  readonly username?: string;
  readonly password?: string;
}

/**
 * Cookie data.
 */
export interface Cookie {
  readonly name: string;
  readonly value: string;
  readonly domain?: string;
  readonly path?: string;
  readonly expires?: number;
  readonly httpOnly?: boolean;
  readonly secure?: boolean;
  readonly sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Browser storage state.
 */
export interface StorageState {
  readonly cookies: Cookie[];
  readonly origins: { origin: string; localStorage: { name: string; value: string }[] }[];
}

/**
 * Navigation options.
 */
export interface NavigateOptions {
  readonly waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  readonly timeoutMs?: number;
}

/**
 * Click options.
 */
export interface ClickOptions {
  readonly button?: 'left' | 'right' | 'middle';
  readonly clickCount?: number;
  readonly delay?: number;
  readonly position?: { x: number; y: number };
}

/**
 * Type options.
 */
export interface TypeOptions {
  readonly delay?: number;
}

/**
 * Screenshot options.
 */
export interface ScreenshotOptions {
  readonly fullPage?: boolean;
  readonly path?: string;
  readonly type?: 'png' | 'jpeg';
  readonly quality?: number;
}

/**
 * Wait options.
 */
export interface WaitOptions {
  readonly timeoutMs?: number;
  readonly state?: 'visible' | 'hidden' | 'attached' | 'detached';
}

/**
 * Browser runtime for web automation.
 */
export interface BrowserRuntime {
  readonly id: ScrId;
  readonly status: 'idle' | 'initializing' | 'running' | 'paused' | 'stopping' | 'stopped' | 'error';
  readonly page: Page | null;
  readonly url: string | undefined;
  readonly title: string | undefined;

  /**
   * Launches the browser.
   */
  launch(config?: Partial<BrowserConfig>): Promise<void>;

  /**
   * Navigates to a URL.
   */
  goto(url: string, options?: NavigateOptions): Promise<void>;

  /**
   * Reloads the current page.
   */
  reload(options?: NavigateOptions): Promise<void>;

  /**
   * Navigates back in history.
   */
  back(options?: NavigateOptions): Promise<void>;

  /**
   * Navigates forward in history.
   */
  forward(options?: NavigateOptions): Promise<void>;

  /**
   * Clicks an element.
   */
  click(selector: string, options?: ClickOptions): Promise<void>;

  /**
   * Double-clicks an element.
   */
  doubleClick(selector: string, options?: Omit<ClickOptions, 'clickCount'>): Promise<void>;

  /**
   * Right-clicks an element.
   */
  rightClick(selector: string, options?: Omit<ClickOptions, 'button' | 'clickCount'>): Promise<void>;

  /**
   * Hovers over an element.
   */
  hover(selector: string): Promise<void>;

  /**
   * Fills an input field with text.
   */
  fill(selector: string, value: string): Promise<void>;

  /**
   * Types text character by character.
   */
  type(selector: string, text: string, options?: TypeOptions): Promise<void>;

  /**
   * Presses a key.
   */
  press(key: string, options?: { count?: number; delay?: number }): Promise<void>;

  /**
   * Selects an option in a select element.
   */
  select(selector: string, value: string | string[]): Promise<void>;

  /**
   * Scrolls the page or element.
   */
  scroll(selector: string | null, deltaX: number, deltaY: number): Promise<void>;

  /**
   * Waits for an element or condition.
   */
  waitFor(selector: string, options?: WaitOptions): Promise<UiElement>;
  waitFor(fn: () => Promise<boolean>, options?: WaitOptions): Promise<void>;

  /**
   * Gets a locator for an element.
   */
  locator(selector: string): Locator;

  /**
   * Evaluates JavaScript in the page context.
   */
  evaluate<R>(fn: (arg?: unknown) => R, arg?: unknown): Promise<R>;

  /**
   * Gets the page content (HTML).
   */
  content(): Promise<string>;

  /**
   * Gets the page title.
   */
  title(): Promise<string>;

  /**
   * Gets the current URL.
   */
  url(): string | undefined;

  /**
   * Gets cookies.
   */
  cookies(urls?: string[]): Promise<Cookie[]>;

  /**
   * Gets/sets storage state.
   */
  storage(): Promise<StorageState>;
  setStorage(state: StorageState): Promise<void>;

  /**
   * Takes a screenshot.
   */
  screenshot(options?: ScreenshotOptions): Promise<Buffer>;

  /**
   * Generates a PDF.
   */
  pdf(options?: { path?: string; scale?: number }): Promise<Buffer>;

  /**
   * Closes the browser.
   */
  close(): Promise<void>;
}

/**
 * Default viewport size.
 */
const DEFAULT_VIEWPORT: ViewportSize = { width: 1280, height: 720 };

/**
 * Default timeout in milliseconds.
 */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Browser runtime implementation using Playwright.
 */
export class BrowserRuntimeImpl implements BrowserRuntime {
  readonly id: ScrId;
  private _status: 'idle' | 'initializing' | 'running' | 'paused' | 'stopping' | 'stopped' | 'error' = 'idle';
  private _config: BrowserConfig;
  private _browser: Browser | null = null;
  private _context: BrowserContext | null = null;
  private _page: Page | null = null;
  private _currentUrl?: string;
  private _title?: string;
  private _eventEmitter: EventEmitter;

  constructor(config: BrowserConfig = {}) {
    this.id = generateScrId();
    this._config = config;
    this._eventEmitter = new EventEmitter();
  }

  get status(): 'idle' | 'initializing' | 'running' | 'paused' | 'stopping' | 'stopped' | 'error' {
    return this._status;
  }

  get page(): Page | null {
    return this._page;
  }

  get url(): string | undefined {
    return this._currentUrl;
  }

  get title(): string | undefined {
    return this._title;
  }

  async launch(config?: Partial<BrowserConfig>): Promise<void> {
    if (this._status === 'running') {
      return;
    }

    try {
      this._status = 'initializing';
      const finalConfig = { ...this._config, ...config };

      const browserType = finalConfig.browserType ?? 'chromium';
      const launchOptions: {
        headless: boolean;
        args: string[];
        executablePath?: string;
        devtools?: boolean;
        ignoreHTTPSErrors?: boolean;
      } = {
        headless: finalConfig.headless ?? true,
        args: finalConfig.args ?? [],
      };

      if (finalConfig.executablePath) {
        launchOptions.executablePath = finalConfig.executablePath;
      }

      if (finalConfig.devtools !== undefined) {
        launchOptions.devtools = finalConfig.devtools;
      }

      if (finalConfig.ignoreHTTPSErrors !== undefined) {
        launchOptions.ignoreHTTPSErrors = finalConfig.ignoreHTTPSErrors;
      }

      // Launch browser
      switch (browserType) {
        case 'firefox':
          this._browser = await firefox.launch(launchOptions);
          break;
        case 'webkit':
          this._browser = await webkit.launch(launchOptions);
          break;
        case 'chromium':
        default:
          this._browser = await chromium.launch(launchOptions);
          break;
      }

      // Create context
      const viewport = finalConfig.viewport ?? DEFAULT_VIEWPORT;
      const contextOptions: {
        viewport: { width: number; height: number };
        userAgent?: string;
        proxy?: { server: string; bypass?: string; username?: string; password?: string };
        ignoreHTTPSErrors?: boolean;
      } = {
        viewport: { width: viewport.width, height: viewport.height },
      };

      if (finalConfig.userAgent) {
        contextOptions.userAgent = finalConfig.userAgent;
      }

      if (finalConfig.proxy) {
        contextOptions.proxy = finalConfig.proxy;
      }

      if (finalConfig.ignoreHTTPSErrors) {
        contextOptions.ignoreHTTPSErrors = finalConfig.ignoreHTTPSErrors;
      }

      this._context = await this._browser.newContext(contextOptions);
      this._page = await this._context.newPage();
      this._page.setDefaultTimeout(finalConfig.timeoutMs ?? DEFAULT_TIMEOUT_MS);

      this._status = 'running';
      this._eventEmitter.emit('launch', { timestamp: Date.now() });
    } catch (error) {
      this._status = 'error';
      throw createResourceUnavailableError(
        'Browser',
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async goto(url: string, options?: NavigateOptions): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = options?.timeoutMs ?? this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const waitUntil = options?.waitUntil ?? 'networkidle';

      const response = await this._page.goto(url, { waitUntil, timeout });
      
      if (!response?.ok()) {
        console.warn(`Navigation to ${url} returned status: ${response?.status()}`);
      }

      this._currentUrl = this._page.url();
      this._title = await this._page.title();
      this._eventEmitter.emit('navigate', { url, timestamp: Date.now() });
    } catch (error) {
      throw createInternalError(
        `Failed to navigate to ${url}`,
        error instanceof Error ? error : undefined,
        { url }
      );
    }
  }

  async reload(options?: NavigateOptions): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    const timeout = options?.timeoutMs ?? this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const waitUntil = options?.waitUntil ?? 'networkidle';

    await this._page.reload({ waitUntil, timeout });
    this._currentUrl = this._page.url();
    this._title = await this._page.title();
  }

  async back(options?: NavigateOptions): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    const timeout = options?.timeoutMs ?? this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    await this._page.goBack({ waitUntil: options?.waitUntil ?? 'networkidle', timeout });
    this._currentUrl = this._page.url();
    this._title = await this._page.title();
  }

  async forward(options?: NavigateOptions): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    const timeout = options?.timeoutMs ?? this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    await this._page.goForward({ waitUntil: options?.waitUntil ?? 'networkidle', timeout });
    this._currentUrl = this._page.url();
    this._title = await this._page.title();
  }

  async click(selector: string, options?: ClickOptions): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      await this._page.click(selector, {
        button: options?.button ?? 'left',
        clickCount: options?.clickCount ?? 1,
        delay: options?.delay ?? 0,
        position: options?.position,
        timeout,
      });
      this._eventEmitter.emit('click', { selector, timestamp: Date.now() });
    } catch (error) {
      throw createInternalError(
        `Failed to click ${selector}`,
        error instanceof Error ? error : undefined,
        { selector }
      );
    }
  }

  async doubleClick(selector: string, options?: Omit<ClickOptions, 'clickCount'>): Promise<void> {
    await this.click(selector, { ...options, clickCount: 2 });
  }

  async rightClick(selector: string, options?: Omit<ClickOptions, 'button' | 'clickCount'>): Promise<void> {
    await this.click(selector, { ...options, button: 'right', clickCount: 1 });
  }

  async hover(selector: string): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      await this._page.hover(selector, { timeout });
    } catch (error) {
      throw createInternalError(
        `Failed to hover ${selector}`,
        error instanceof Error ? error : undefined,
        { selector }
      );
    }
  }

  async fill(selector: string, value: string): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      await this._page.fill(selector, value, { timeout });
      this._eventEmitter.emit('fill', { selector, value, timestamp: Date.now() });
    } catch (error) {
      throw createInternalError(
        `Failed to fill ${selector}`,
        error instanceof Error ? error : undefined,
        { selector, value }
      );
    }
  }

  async type(selector: string, text: string, options?: TypeOptions): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      await this._page.type(selector, text, { delay: options?.delay ?? 0, timeout });
    } catch (error) {
      throw createInternalError(
        `Failed to type into ${selector}`,
        error instanceof Error ? error : undefined,
        { selector, text }
      );
    }
  }

  async press(key: string, options?: { count?: number; delay?: number }): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const count = options?.count ?? 1;
      const delay = options?.delay ?? 0;

      for (let i = 0; i < count; i++) {
        if (i > 0 && delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        await this._page.keyboard.press(key);
      }
    } catch (error) {
      throw createInternalError(
        `Failed to press key ${key}`,
        error instanceof Error ? error : undefined,
        { key }
      );
    }
  }

  async select(selector: string, value: string | string[]): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const timeout = this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      await this._page.selectOption(selector, value, { timeout });
    } catch (error) {
      throw createInternalError(
        `Failed to select option in ${selector}`,
        error instanceof Error ? error : undefined,
        { selector, value }
      );
    }
  }

  async scroll(selector: string | null, deltaX: number, deltaY: number): Promise<void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      if (selector) {
        await this._page.evaluate(
          ({ sel, dx, dy }) => {
            const el = document.querySelector(sel) as HTMLElement | null;
            if (el) {
              el.scrollBy(dx, dy);
            }
          },
          { sel: selector, dx: deltaX, dy: deltaY }
        );
      } else {
        await this._page.evaluate(({ dx, dy }) => {
          window.scrollBy(dx, dy);
        }, { dx: deltaX, dy: deltaY });
      }
    } catch (error) {
      throw createInternalError(
        `Failed to scroll`,
        error instanceof Error ? error : undefined,
        { selector, deltaX, deltaY }
      );
    }
  }

  async waitFor(selector: string, options?: WaitOptions): Promise<UiElement>;
  async waitFor(fn: () => Promise<boolean>, options?: WaitOptions): Promise<void>;
  async waitFor(
    arg: string | (() => Promise<boolean>),
    options?: WaitOptions
  ): Promise<UiElement | void> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    const timeout = options?.timeoutMs ?? this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    if (typeof arg === 'string') {
      const state = options?.state ?? 'visible';
      await this._page.waitForSelector(arg, { state, timeout });
      return this._findElement(arg);
    } else {
      await this._page.waitForFunction(arg, { timeout });
    }
  }

  locator(selector: string): Locator {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }
    return this._page.locator(selector);
  }

  async evaluate<R>(fn: (arg?: unknown) => R, arg?: unknown): Promise<R> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }
    return this._page.evaluate(fn, arg);
  }

  async content(): Promise<string> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }
    return this._page.content();
  }

  async title(): Promise<string> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }
    return this._page.title();
  }

  url(): string | undefined {
    return this._currentUrl;
  }

  async cookies(urls?: string[]): Promise<Cookie[]> {
    if (!this._context || this._status !== 'running') {
      throw createResourceUnavailableError('Browser context', { status: this._status });
    }
    const cookieList = await this._context.cookies(urls);
    return cookieList.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      expires: c.expires,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite,
    }));
  }

  async storage(): Promise<StorageState> {
    if (!this._context || this._status !== 'running') {
      throw createResourceUnavailableError('Browser context', { status: this._status });
    }
    const state = await this._context.storageState();
    return {
      cookies: state.cookies.map((c) => ({
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        expires: c.expires,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite,
      })),
      origins: state.origins,
    };
  }

  async setStorage(state: StorageState): Promise<void> {
    if (!this._context || this._status !== 'running') {
      throw createResourceUnavailableError('Browser context', { status: this._status });
    }
    await this._context.addCookies(state.cookies);
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      const buffer = await this._page.screenshot({
        fullPage: options?.fullPage ?? false,
        path: options?.path,
        type: options?.type ?? 'png',
        quality: options?.quality,
      });
      this._eventEmitter.emit('screenshot', { timestamp: Date.now() });
      return buffer;
    } catch (error) {
      throw createInternalError(
        'Failed to take screenshot',
        error instanceof Error ? error : undefined
      );
    }
  }

  async pdf(options?: { path?: string; scale?: number }): Promise<Buffer> {
    if (!this._page || this._status !== 'running') {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    try {
      return await this._page.pdf({
        path: options?.path,
        scale: options?.scale ?? 1,
      });
    } catch (error) {
      throw createInternalError(
        'Failed to generate PDF',
        error instanceof Error ? error : undefined
      );
    }
  }

  async close(): Promise<void> {
    try {
      this._status = 'stopping';

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
      this._eventEmitter.emit('close', { timestamp: Date.now() });
    } catch (error) {
      this._status = 'error';
      throw createInternalError(
        'Failed to close browser',
        error instanceof Error ? error : undefined
      );
    }
  }

  private async _findElement(selector: string): Promise<UiElement> {
    if (!this._page) {
      throw createResourceUnavailableError('Browser page', { status: this._status });
    }

    const handle = await this._page.$(selector);
    if (!handle) {
      throw createInternalError('Element not found', {}, { selector });
    }

    const isVisible = await handle.isVisible();
    const boundingBox = await handle.boundingBox();
    const tagName = await handle.evaluate((el: Element) => el.tagName.toLowerCase());
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
        x: boundingBox?.x ?? 0,
        y: boundingBox?.y ?? 0,
        width: boundingBox?.width ?? 0,
        height: boundingBox?.height ?? 0,
      },
      visible: isVisible,
      enabled: isEnabled,
    };

    return element;
  }
}

/**
 * Factory function to create a browser runtime instance.
 */
export function createBrowserRuntime(config: BrowserConfig = {}): BrowserRuntime {
  return new BrowserRuntimeImpl(config);
}
