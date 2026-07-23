/**
 * SCR configuration options.
 */
export interface ScrConfig {
  /** Enable verbose logging */
  verbose?: boolean;
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Timeout for operations in milliseconds */
  timeoutMs?: number;
  /** Additional custom options */
  [key: string]: unknown;
}

/**
 * Creates a default SCR configuration.
 *
 * @returns A default configuration object
 *
 * @example
 * ```typescript
 * const config = createDefaultConfig();
 * ```
 */
export function createDefaultConfig(): ScrConfig {
  return {
    verbose: false,
    logLevel: 'info',
    timeoutMs: 30000,
  };
}

/**
 * Merges user configuration with defaults.
 *
 * @param userConfig - User-provided configuration
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const config = mergeConfig({ verbose: true });
 * ```
 */
export function mergeConfig(userConfig: Partial<ScrConfig>): ScrConfig {
  return {
    ...createDefaultConfig(),
    ...userConfig,
  };
}
