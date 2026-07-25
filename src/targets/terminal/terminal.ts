import { exec } from 'child_process';
import { promisify } from 'util';
import type { ScrId, ScrStatus } from '../../contracts/types.js';
import { generateScrId, createInternalError, createInvalidStateError } from '../../contracts/types.js';

const execAsync = promisify(exec);

/**
 * Terminal-specific configuration.
 */
export interface TerminalConfig {
  /** Working directory for executed commands. Defaults to process.cwd(). */
  readonly cwd?: string;
  /** Timeout for command execution in milliseconds. */
  readonly timeoutMs?: number;
  /** Maximum buffer size for stdout/stderr, in bytes. */
  readonly maxBuffer?: number;
}

/**
 * Result of executing a terminal command.
 */
export interface TerminalResult {
  readonly command: string;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
  readonly durationMs: number;
}

/**
 * Default timeout for terminal commands in milliseconds.
 */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Default max buffer size (10 MB), matching Node's child_process default order of magnitude.
 */
const DEFAULT_MAX_BUFFER = 10 * 1024 * 1024;

/**
 * TerminalTarget implementation using Node's child_process.
 *
 * This class provides a production-ready terminal execution target,
 * running real shell commands and returning their real stdout, stderr,
 * and exit code. It intentionally does not interpret, template, or
 * simulate commands -- it always shells out for real.
 */
export class TerminalTargetImpl {
  readonly id: ScrId;
  private _status: ScrStatus;
  private readonly _config: TerminalConfig;

  constructor(config: TerminalConfig = {}) {
    this.id = generateScrId();
    this._status = 'idle';
    this._config = config;
  }

  get status(): ScrStatus {
    return this._status;
  }

  get config(): TerminalConfig {
    return this._config;
  }

  /**
   * Marks the target as ready to accept commands.
   * There is no external process to launch (unlike Chromium) --
   * this only transitions internal state so the lifecycle matches
   * other SCR targets.
   */
  async start(): Promise<void> {
    if (this._status === 'running') {
      return;
    }
    this._status = 'running';
  }

  /**
   * Executes a real shell command and returns its real result.
   *
   * @param command - The command to execute
   * @throws ScrError if the target has not been started
   */
  async run(command: string): Promise<TerminalResult> {
    if (this._status !== 'running') {
      throw createInvalidStateError(
        'Terminal target must be started before running a command',
        { status: this._status }
      );
    }

    const startedAt = Date.now();
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this._config.cwd,
        timeout: this._config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        maxBuffer: this._config.maxBuffer ?? DEFAULT_MAX_BUFFER,
      });
      return {
        command,
        stdout,
        stderr,
        exitCode: 0,
        durationMs: Date.now() - startedAt,
      };
    } catch (error) {
      // Node's exec rejects on non-zero exit codes, but still gives us
      // stdout/stderr/code on the error object -- surface the real result
      // instead of only throwing, since a non-zero exit is a legitimate
      // outcome, not necessarily an SCR-level failure.
      const execError = error as NodeJS.ErrnoException & {
        stdout?: string;
        stderr?: string;
        code?: number;
      };
      if (typeof execError.code === 'number') {
        return {
          command,
          stdout: execError.stdout ?? '',
          stderr: execError.stderr ?? '',
          exitCode: execError.code,
          durationMs: Date.now() - startedAt,
        };
      }
      throw createInternalError(
        `Failed to execute command: ${command}`,
        error instanceof Error ? error : undefined,
        { command }
      );
    }
  }

  /**
   * Stops the target. No external process to tear down, but this keeps
   * lifecycle symmetry with other SCR targets (e.g. Chromium).
   */
  async stop(): Promise<void> {
    this._status = 'stopping';
    this._status = 'stopped';
  }

  /**
   * Alias for stop(), matching the close() naming used elsewhere in SCR.
   */
  async close(): Promise<void> {
    await this.stop();
  }
}

/**
 * Creates a new terminal target.
 *
 * @param config - Optional terminal configuration
 * @returns A configured, unstarted TerminalTargetImpl
 *
 * @example
 * ```typescript
 * const terminal = createTerminalTarget();
 * await terminal.start();
 * const result = await terminal.run('pwd');
 * console.log(result.stdout);
 * await terminal.stop();
 * ```
 */
export function createTerminalTarget(config?: TerminalConfig): TerminalTargetImpl {
  return new TerminalTargetImpl(config);
}
