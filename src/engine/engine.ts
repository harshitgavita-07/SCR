import type { ScrId, ScrStatus } from '../contracts/types.js';
import { EventEmitter } from '../events/emitter.js';

/**
 * Event emitted when a plan step starts.
 */
export interface PlanStepStartEvent {
  readonly type: 'plan:step:start';
  readonly planId: ScrId;
  readonly stepId: ScrId;
  readonly stepName: string;
  readonly timestamp: number;
}

/**
 * Event emitted when a plan step completes.
 */
export interface PlanStepCompleteEvent {
  readonly type: 'plan:step:complete';
  readonly planId: ScrId;
  readonly stepId: ScrId;
  readonly stepName: string;
  readonly result: unknown;
  readonly timestamp: number;
}

/**
 * Event emitted when a plan step fails.
 */
export interface PlanStepFailEvent {
  readonly type: 'plan:step:fail';
  readonly planId: ScrId;
  readonly stepId: ScrId;
  readonly stepName: string;
  readonly error: Error;
  readonly timestamp: number;
}

/**
 * Event emitted when a plan completes.
 */
export interface PlanCompleteEvent {
  readonly type: 'plan:complete';
  readonly planId: ScrId;
  readonly timestamp: number;
}

/**
 * Event emitted when a plan fails.
 */
export interface PlanFailEvent {
  readonly type: 'plan:fail';
  readonly planId: ScrId;
  readonly error: Error;
  readonly timestamp: number;
}

/**
 * All engine events.
 */
export type EngineEvent =
  | PlanStepStartEvent
  | PlanStepCompleteEvent
  | PlanStepFailEvent
  | PlanCompleteEvent
  | PlanFailEvent;

/**
 * A step in an execution plan.
 */
export interface PlanStep {
  readonly id: ScrId;
  readonly name: string;
  readonly action: string;
  readonly params?: Record<string, unknown>;
}

/**
 * An execution plan containing multiple steps.
 */
export interface Plan {
  readonly id: ScrId;
  readonly name: string;
  readonly steps: PlanStep[];
  readonly status: ScrStatus;
  readonly createdAt: number;
  readonly updatedAt: number;
}

/**
 * Result of executing a plan step.
 */
export interface StepResult {
  readonly stepId: ScrId;
  readonly success: boolean;
  readonly result?: unknown;
  readonly error?: Error;
  readonly durationMs: number;
}

/**
 * Result of executing a complete plan.
 */
export interface PlanResult {
  readonly planId: ScrId;
  readonly success: boolean;
  readonly stepResults: StepResult[];
  readonly totalDurationMs: number;
}

/**
 * Execution engine for running plans.
 */
export interface ExecutionEngine {
  readonly id: ScrId;
  readonly status: ScrStatus;
  readonly eventEmitter: EventEmitter<EngineEvent>;

  /**
   * Creates a new execution plan.
   */
  createPlan(name: string, steps: PlanStep[]): Plan;

  /**
   * Executes a plan asynchronously.
   */
  execute(plan: Plan): Promise<PlanResult>;

  /**
   * Pauses the engine.
   */
  pause(): void;

  /**
   * Resumes the engine.
   */
  resume(): void;

  /**
   * Stops the engine.
   */
  stop(): Promise<void>;
}
