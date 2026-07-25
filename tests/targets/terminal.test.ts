import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTerminalTarget, TerminalTargetImpl } from '../../src/targets/terminal/index.js';

describe('TerminalTarget', () => {
  let terminal: TerminalTargetImpl;

  beforeEach(() => {
    terminal = createTerminalTarget();
  });

  afterEach(async () => {
    await terminal.stop();
  });

  it('starts as idle and becomes running after start()', async () => {
    expect(terminal.status).toBe('idle');
    await terminal.start();
    expect(terminal.status).toBe('running');
  });

  it('rejects run() before start()', async () => {
    await expect(terminal.run('echo not-started')).rejects.toThrow();
  });

  it('actually executes a command and returns real stdout', async () => {
    await terminal.start();
    const result = await terminal.run('echo hello-from-scr-terminal');
    expect(result.stdout.trim()).toBe('hello-from-scr-terminal');
    expect(result.exitCode).toBe(0);
    expect(result.command).toBe('echo hello-from-scr-terminal');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('reports the real working directory', async () => {
    await terminal.start();
    const command = process.platform === 'win32' ? 'cd' : 'pwd';
    const result = await terminal.run(command);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim().length).toBeGreaterThan(0);
    expect(result.stdout.trim()).toBe(process.cwd());
  });

  it('returns a non-zero exit code for a failing command instead of throwing', async () => {
    await terminal.start();
    const command = process.platform === 'win32' ? 'exit 3' : 'exit 3';
    const result = await terminal.run(command);
    expect(result.exitCode).toBe(3);
  });

  it('respects a custom working directory', async () => {
    const scoped = createTerminalTarget({ cwd: '/tmp' });
    await scoped.start();
    const command = process.platform === 'win32' ? 'cd' : 'pwd';
    const result = await scoped.run(command);
    expect(result.stdout.trim()).toBe('/tmp');
    await scoped.stop();
  });

  it('transitions to stopped on stop()', async () => {
    await terminal.start();
    await terminal.stop();
    expect(terminal.status).toBe('stopped');
  });
});
