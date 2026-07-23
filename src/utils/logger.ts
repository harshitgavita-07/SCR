import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino';
import type { ScrId } from '../contracts/types.js';

/**
 * Log level types.
 */
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * SCR Logger interface.
 */
export interface ScrLogger {
  /** Fatal level log */
  fatal(msg: string, ...args: unknown[]): void;
  fatal(obj: object, msg?: string, ...args: unknown[]): void;

  /** Error level log */
  error(msg: string, ...args: unknown[]): void;
  error(obj: object, msg?: string, ...args: unknown[]): void;

  /** Warning level log */
  warn(msg: string, ...args: unknown[]): void;
  warn(obj: object, msg?: string, ...args: unknown[]): void;

  /** Info level log */
  info(msg: string, ...args: unknown[]): void;
  info(obj: object, msg?: string, ...args: unknown[]): void;

  /** Debug level log */
  debug(msg: string, ...args: unknown[]): void;
  debug(obj: object, msg?: string, ...args: unknown[]): void;

  /** Trace level log */
  trace(msg: string, ...args: unknown[]): void;
  trace(obj: object, msg?: string, ...args: unknown[]): void;

  /** Create a child logger */
  child(bindings: Record<string, unknown>): ScrLogger;
}

/**
 * Logger configuration.
 */
export interface LoggerConfig {
  /** Minimum log level */
  level?: LogLevel;
  /** Pretty print output */
  prettyPrint?: boolean;
  /** Additional bindings */
  bindings?: Record<string, unknown>;
}

/**
 * Default logger configuration.
 */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  level: 'info',
  prettyPrint: false,
  bindings: {},
};

/**
 * Creates an SCR logger instance.
 *
 * @param config - Logger configuration
 * @returns A new logger instance
 *
 * @example
 * ```typescript
 * const logger = createScrLogger({ level: 'debug' });
 * logger.info('Application started');
 * ```
 */
export function createScrLogger(config: LoggerConfig = {}): ScrLogger {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const pinoOptions: LoggerOptions = {
    level: mergedConfig.level,
    base: mergedConfig.bindings,
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  if (mergedConfig.prettyPrint) {
    pinoOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    };
  }

  return pino(pinoOptions);
}

/**
 * Creates a session-scoped logger.
 *
 * @param sessionId - The session identifier
 * @param config - Logger configuration
 * @returns A session-scoped logger
 *
 * @example
 * ```typescript
 * const sessionLogger = createSessionLogger('scr_abc123', { level: 'debug' });
 * sessionLogger.info('Session initialized');
 * ```
 */
export function createSessionLogger(
  sessionId: ScrId,
  config: LoggerConfig = {},
): ScrLogger {
  const logger = createScrLogger(config);
  return logger.child({ sessionId, module: 'session' });
}

/**
 * Creates an action-scoped logger.
 *
 * @param actionId - The action identifier
 * @param config - Logger configuration
 * @returns An action-scoped logger
 *
 * @example
 * ```typescript
 * const actionLogger = createActionLogger('action_456', { level: 'debug' });
 * actionLogger.info('Action executing');
 * ```
 */
export function createActionLogger(
  actionId: string,
  config: LoggerConfig = {},
): ScrLogger {
  const logger = createScrLogger(config);
  return logger.child({ actionId, module: 'action' });
}
