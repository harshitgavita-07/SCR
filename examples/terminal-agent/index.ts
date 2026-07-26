/**
 * Terminal Agent Example
 * 
 * Demonstrates command-line task automation using SCR Runtime.
 * 
 * Run: pnpm start
 */

import { Runtime } from '@scr/runtime';

async function main() {
  console.log('🚀 Starting Terminal Agent Example\n');

  const runtime = new Runtime({
    appName: 'terminal-agent-example',
    debug: true,
  });

  try {
    await runtime.start();
    console.log('✅ Runtime started\n');

    // Run a simple command
    console.log('💻 Running: ls -la');
    const lsResult = await runtime.terminal.run('ls -la');
    console.log(`📊 Exit code: ${lsResult.exitCode}`);
    console.log(`⏱️  Duration: ${lsResult.duration}ms`);
    console.log(`📝 Output preview:\n${lsResult.stdout.split('\n').slice(0, 5).join('\n')}\n`);

    // Run with options
    console.log('💻 Running: node --version (with timeout)');
    const nodeResult = await runtime.terminal.run('node --version', {
      timeout: 5000,
    });
    console.log(`📦 Node version: ${nodeResult.stdout.trim()}\n`);

    // Run git command (if in a git repo)
    console.log('💻 Running: git status');
    const gitResult = await runtime.terminal.run('git status');
    if (gitResult.exitCode === 0) {
      console.log('✅ In a git repository');
      console.log(`📝 Status preview:\n${gitResult.stdout.split('\n').slice(0, 3).join('\n')}\n`);
    } else {
      console.log('ℹ️  Not in a git repository\n');
    }

    // Verify command succeeds
    console.log('✅ Verifying commands execute successfully...');
    await runtime.verify(async () => {
      const result = await runtime.terminal.run('echo test');
      return result.exitCode === 0 && result.stdout.trim() === 'test';
    });
    console.log('✅ Verification passed\n');

    console.log('✨ Terminal Agent Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await runtime.stop();
    console.log('\n👋 Runtime stopped');
  }
}

main();
