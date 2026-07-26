/**
 * Desktop Agent Example
 * 
 * Demonstrates native desktop application control using SCR Runtime.
 * 
 * Run: pnpm start
 */

import { Runtime } from '@scr/runtime';

async function main() {
  console.log('🚀 Starting Desktop Agent Example\n');

  const runtime = new Runtime({
    appName: 'desktop-agent-example',
    debug: true,
  });

  try {
    await runtime.start();
    console.log('✅ Runtime started\n');

    // List open windows
    console.log('🪟 Listing open windows...');
    const windows = await runtime.desktop.listWindows();
    console.log(`📊 Found ${windows.length} windows:`);
    for (const window of windows.slice(0, 5)) {
      console.log(`   - ${window.title} (${window.appName})`);
    }
    console.log();

    // Get mouse position
    console.log('🖱️  Getting mouse position...');
    const mousePos = await runtime.desktop.getMousePosition();
    console.log(`📍 Mouse at: (${mousePos.x}, ${mousePos.y})\n`);

    // Take desktop screenshot
    console.log('📸 Capturing desktop screenshot...');
    const screenshot = await runtime.desktop.screenshot();
    console.log(`📊 Screenshot size: ${screenshot.length} bytes\n`);

    // Observe screen
    console.log('👁️  Observing screen state...');
    const observation = await runtime.observe();
    console.log(`📊 Detected ${observation.elements.length} UI elements`);
    console.log(`📝 Extracted ${observation.text.length} characters of text\n`);

    // Demonstrate keyboard input (safe demo - just types in active window)
    console.log('⌨️  Keyboard demo (would type "Hello" in active window)');
    console.log('   Note: Actual typing disabled in demo mode\n');

    console.log('✨ Desktop Agent Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await runtime.stop();
    console.log('\n👋 Runtime stopped');
  }
}

main();
