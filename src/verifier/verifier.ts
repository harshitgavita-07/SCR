import type { ScrId, ScrStatus } from '../contracts/types.js';
import type { PlanResult } from '../engine/engine.js';

/**
 * Verification result for a plan execution.
 */
export interface VerificationResult {
  readonly planId: ScrId;
  readonly success: boolean;
  readonly assertions: AssertionResult[];
  readonly message?: string;
}

/**
 * Result of a single assertion check.
 */
export interface AssertionResult {
  readonly name: string;
  readonly passed: boolean;
  readonly expected?: unknown;
  readonly actual?: unknown;
  readonly message?: string;
}

/**
 * Verifier interface for validating plan executions.
 */
export interface Verifier {
  readonly id: ScrId;
  readonly status: ScrStatus;

  /**
   * Adds an assertion to verify after plan execution.
   */
  addAssertion(name: string, condition: () => Promise<boolean>): void;

  /**
   * Verifies the result of a plan execution.
   */
  verify(planResult: PlanResult): Promise<VerificationResult>;

  /**
   * Clears all assertions.
   */
  clearAssertions(): void;

  /**
   * Resets the verifier state.
   */
  reset(): void;
}
