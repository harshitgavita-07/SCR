/**
 * Unique identifier for SCR components.
 *
 * @example
 * ```typescript
 * const sessionId: ScrId = generateScrId();
 * ```
 */
export type ScrId = string;

/**
 * Generates a unique SCR identifier.
 *
 * @returns A unique identifier string
 *
 * @example
 * ```typescript
 * const id = generateScrId();
 * // "scr_7f3a9b2c1d4e5f6a"
 * ```
 */
export function generateScrId(): ScrId {
  return `scr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Status of a SCR component or operation.
 */
export type ScrStatus =
  | 'idle'
  | 'initializing'
  | 'running'
  | 'paused'
  | 'stopping'
  | 'stopped'
  | 'error';

/**
 * Base interface for all SCR entities.
 */
export interface ScrEntity {
  /** Unique identifier */
  readonly id: ScrId;
  /** Current status */
  readonly status: ScrStatus;
  /** Creation timestamp */
  readonly createdAt: number;
  /** Last update timestamp */
  readonly updatedAt: number;
}

/**
 * Error codes for SCR operations.
 */
export enum ScrErrorCode {
  /** Invalid configuration */
  INVALID_CONFIG = 'INVALID_CONFIG',
  /** Component not found */
  NOT_FOUND = 'NOT_FOUND',
  /** Component already exists */
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  /** Invalid state transition */
  INVALID_STATE = 'INVALID_STATE',
  /** Operation timeout */
  TIMEOUT = 'TIMEOUT',
  /** Permission denied */
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  /** Resource unavailable */
  RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE',
  /** Internal error */
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  /** Validation failed */
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

/**
 * SCR error data structure.
 */
export interface ScrErrorData {
  code: ScrErrorCode;
  message: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

/**
 * Base SCR error class.
 */
export class ScrError extends Error {
  public readonly code: ScrErrorCode;
  public readonly context?: Record<string, unknown>;

  constructor(data: ScrErrorData) {
    super(data.message);
    this.name = 'ScrError';
    this.code = data.code;
    this.cause = data.cause;
    this.context = data.context;
  }

  toJSON(): ScrErrorData {
    return {
      code: this.code,
      message: this.message,
      cause: this.cause,
      context: this.context,
    };
  }
}

/**
 * Creates an invalid configuration error.
 */
export function createInvalidConfigError(
  message: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.INVALID_CONFIG,
    message,
    context,
  });
}

/**
 * Creates a not found error.
 */
export function createNotFoundError(
  resource: string,
  id: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.NOT_FOUND,
    message: `${resource} with id '${id}' not found`,
    context,
  });
}

/**
 * Creates an already exists error.
 */
export function createAlreadyExistsError(
  resource: string,
  id: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.ALREADY_EXISTS,
    message: `${resource} with id '${id}' already exists`,
    context,
  });
}

/**
 * Creates an invalid state error.
 */
export function createInvalidStateError(
  message: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.INVALID_STATE,
    message,
    context,
  });
}

/**
 * Creates a timeout error.
 */
export function createTimeoutError(
  operation: string,
  timeoutMs: number,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.TIMEOUT,
    message: `Operation '${operation}' timed out after ${timeoutMs}ms`,
    context,
  });
}

/**
 * Creates a permission denied error.
 */
export function createPermissionDeniedError(
  message: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.PERMISSION_DENIED,
    message,
    context,
  });
}

/**
 * Creates a resource unavailable error.
 */
export function createResourceUnavailableError(
  resource: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.RESOURCE_UNAVAILABLE,
    message: `Resource '${resource}' is unavailable`,
    context,
  });
}

/**
 * Creates an internal error.
 */
export function createInternalError(
  message: string,
  cause?: unknown,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.INTERNAL_ERROR,
    message,
    cause,
    context,
  });
}

/**
 * Creates a validation failed error.
 */
export function createValidationError(
  message: string,
  context?: Record<string, unknown>,
): ScrError {
  return new ScrError({
    code: ScrErrorCode.VALIDATION_FAILED,
    message,
    context,
  });
}
