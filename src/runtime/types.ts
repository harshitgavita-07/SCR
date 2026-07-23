import type { ScrEntity, ScrStatus } from '../contracts/types.js';

/**
 * Configuration for the SCR runtime.
 */
export interface RuntimeConfig {
  /** Application name */
  readonly appName: string;
  /** Runtime version */
  readonly version: string;
  /** Enable debug mode */
  readonly debug?: boolean;
  /** Log level */
  readonly logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * SCR Runtime entity representing the main runtime instance.
 */
export interface Runtime extends ScrEntity {
  readonly config: RuntimeConfig;
  readonly status: ScrStatus;
}

/**
 * Creates a new runtime configuration with defaults.
 *
 * @param config - Partial configuration to merge with defaults
 * @returns Complete runtime configuration
 *
 * @example
 * ```typescript
 * const config = createRuntimeConfig({ appName: 'my-app' });
 * ```
 */
export function createRuntimeConfig(config: Partial<RuntimeConfig>): RuntimeConfig {
  return {
    appName: config.appName ?? 'scr-runtime',
    version: config.version ?? '0.1.0',
    debug: config.debug ?? false,
    logLevel: config.logLevel ?? 'info',
  };
}
