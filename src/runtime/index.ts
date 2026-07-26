import type { Runtime } from './types.js';

export type { RuntimeConfig, Runtime } from './types.js';
export { createRuntimeConfig, createScrRuntime } from './types.js';

// Browser runtime
export type { BrowserRuntime, BrowserConfig, ViewportSize, Cookie, StorageState, NavigateOptions, ClickOptions, TypeOptions, ScreenshotOptions, WaitOptions } from './browser.js';
export { BrowserRuntimeImpl, createBrowserRuntime } from './browser.js';

/**
 * Type alias for ScrRuntime to maintain backward compatibility.
 */
export type ScrRuntime = Runtime;
