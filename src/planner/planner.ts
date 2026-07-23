import type { ScrId, ScrStatus } from '../contracts/types.js';
import type { Plan } from '../engine/engine.js';

/**
 * A goal to be achieved by the planner.
 */
export interface Goal {
  readonly id: ScrId;
  readonly description: string;
  readonly priority: number;
  readonly createdAt: number;
}

/**
 * Result of planning operation.
 */
export interface PlanningResult {
  readonly goalId: ScrId;
  readonly plan: Plan | null;
  readonly success: boolean;
  readonly message?: string;
}

/**
 * Planner interface for generating execution plans from goals.
 */
export interface Planner {
  readonly id: ScrId;
  readonly status: ScrStatus;

  /**
   * Creates a new goal.
   */
  createGoal(description: string, priority?: number): Goal;

  /**
   * Generates a plan for achieving a goal.
   */
  plan(goal: Goal): Promise<PlanningResult>;

  /**
   * Cancels a goal and any associated planning.
   */
  cancelGoal(goalId: ScrId): Promise<void>;

  /**
   * Clears all goals and resets the planner.
   */
  clear(): void;
}
