import { z } from 'zod';
import type { ScrId, ScrStatus } from './types.js';

/**
 * Schema for SCR ID validation.
 */
export const scrIdSchema = z.string().regex(/^scr_[a-z0-9]+_[a-z0-9]+$/);

/**
 * Schema for SCR status validation.
 */
export const scrStatusSchema = z.enum([
  'idle',
  'initializing',
  'running',
  'paused',
  'stopping',
  'stopped',
  'error',
]);

/**
 * Schema for base SCR entity validation.
 */
export const scrEntitySchema = z.object({
  id: scrIdSchema,
  status: scrStatusSchema,
  createdAt: z.number().positive(),
  updatedAt: z.number().positive(),
});

/**
 * Validates an SCR ID.
 *
 * @param id - The ID to validate
 * @returns The validated ID
 * @throws {Error} If the ID is invalid
 *
 * @example
 * ```typescript
 * const validId = validateScrId('scr_abc123_def456');
 * ```
 */
export function validateScrId(id: string): ScrId {
  return scrIdSchema.parse(id);
}

/**
 * Validates an SCR status.
 *
 * @param status - The status to validate
 * @returns The validated status
 * @throws {Error} If the status is invalid
 *
 * @example
 * ```typescript
 * const validStatus = validateScrStatus('running');
 * ```
 */
export function validateScrStatus(status: string): ScrStatus {
  return scrStatusSchema.parse(status);
}

/**
 * Safely validates an SCR ID, returning null on failure.
 *
 * @param id - The ID to validate
 * @returns The validated ID or null
 *
 * @example
 * ```typescript
 * const result = tryValidateScrId('invalid');
 * if (result === null) {
 *   // Handle invalid ID
 * }
 * ```
 */
export function tryValidateScrId(id: string): ScrId | null {
  const result = scrIdSchema.safeParse(id);
  return result.success ? result.data : null;
}

/**
 * Safely validates an SCR status, returning null on failure.
 *
 * @param status - The status to validate
 * @returns The validated status or null
 *
 * @example
 * ```typescript
 * const result = tryValidateScrStatus('unknown');
 * if (result === null) {
 *   // Handle invalid status
 * }
 * ```
 */
export function tryValidateScrStatus(status: string): ScrStatus | null {
  const result = scrStatusSchema.safeParse(status);
  return result.success ? result.data : null;
}
