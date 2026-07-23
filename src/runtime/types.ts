import type { ScrConfig, ScrStatus } from '../contracts/index.js';

/**
 * Configuration for the SCR runtime.
 */
export interface RuntimeConfig extends ScrConfig {
  /** Application name */
  readonly appName: string;
  /** Runtime version */
  readonly version: string;
}

/**
 * SCR Runtime entity representing the main runtime instance.
 */
export interface Runtime {
  readonly config: RuntimeConfig;
  readonly status: ScrStatus;
  /**
   * Execute a conversation file content.
   * @param content - The file content to execute
   */
  execute(content: string): Promise<void>;
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
export function createRuntimeConfig(
  config: Partial<RuntimeConfig>
): RuntimeConfig {
  return {
    appName: config.appName ?? 'scr-runtime',
    version: config.version ?? '0.1.0',
  };
}

/**
 * Creates a new SCR runtime instance.
 *
 * @param config - Optional configuration
 * @returns A configured runtime instance
 *
 * @example
 * ```typescript
 * const runtime = await createScrRuntime({ appName: 'my-app' });
 * await runtime.execute('conversation content');
 * ```
 */
export async function createScrRuntime(config: ScrConfig = {}): Promise<Runtime> {
  const runtimeConfig: RuntimeConfig = createRuntimeConfig(config);
  
  const runtime: Runtime = {
    config: runtimeConfig,
    status: 'running',
    execute: async (content: string) => {
      // Basic execution: log the content length for now
      // In a full implementation, this would parse and execute the conversation
      if (runtimeConfig.debug || config.logLevel === 'debug') {
        console.debug(`Executing content of ${content.length} bytes`);
      }
      // Placeholder for actual execution logic
      // The runtime is designed to be extended with real execution engines
    },
  };
  
  return runtime;
}
