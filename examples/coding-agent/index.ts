/**
 * Coding Agent Example
 * 
 * Demonstrates code generation and file management using SCR Runtime.
 * 
 * Run: pnpm start
 */

import { Runtime } from '@scr/runtime';
import * as path from 'path';

async function main() {
  console.log('🚀 Starting Coding Agent Example\n');

  const runtime = new Runtime({
    appName: 'coding-agent-example',
    debug: true,
    sandbox: {
      enabled: true,
      filesystemRoot: './sandbox',
    },
  });

  try {
    await runtime.start();
    console.log('✅ Runtime started\n');

    // Create a working directory
    console.log('📁 Creating working directory...');
    const workDir = path.join(process.cwd(), 'sandbox', 'coding-demo');
    await runtime.filesystem.mkdir(workDir, { recursive: true });
    console.log(`📍 Working directory: ${workDir}\n`);

    // Write a sample file
    console.log('📝 Writing sample TypeScript file...');
    const codeContent = `// Sample TypeScript module
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

export const version = '1.0.0';
`;
    await runtime.filesystem.write(path.join(workDir, 'greet.ts'), codeContent);
    console.log('✅ File written\n');

    // Read the file back
    console.log('📖 Reading file back...');
    const content = await runtime.filesystem.read(path.join(workDir, 'greet.ts'));
    console.log(`📄 Content:\n${content}\n`);

    // List directory contents
    console.log('📋 Listing directory contents...');
    const entries = await runtime.filesystem.readdir(workDir);
    console.log(`📊 Files: ${entries.join(', ')}\n`);

    // Verify file exists
    console.log('✅ Verifying file was created...');
    await runtime.verify(async () => {
      return await runtime.filesystem.exists(path.join(workDir, 'greet.ts'));
    });
    console.log('✅ Verification passed\n');

    // Check file stats
    console.log('📊 Checking file statistics...');
    const stats = await runtime.filesystem.stat(path.join(workDir, 'greet.ts'));
    console.log(`📏 Size: ${stats.size} bytes`);
    console.log(`📅 Modified: ${new Date(stats.mtime).toISOString()}\n`);

    // Clean up (optional - keep for inspection)
    // await runtime.filesystem.unlink(path.join(workDir, 'greet.ts'));

    console.log('✨ Coding Agent Example completed successfully!');
    console.log(`💡 Check ${workDir} for generated files`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await runtime.stop();
    console.log('\n👋 Runtime stopped');
  }
}

main();
