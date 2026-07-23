import type { Runtime } from './types.js';

export type { RuntimeConfig, Runtime } from './types.js';
export { createRuntimeConfig, createScrRuntime } from './types.js';

/**
 * Type alias for ScrRuntime to maintain backward compatibility.
 */
export type ScrRuntime = Runtime;
