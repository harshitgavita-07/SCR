/**
 * Browser Agent Example
 * 
 * Demonstrates web scraping and form automation using SCR Runtime.
 * 
 * Run: pnpm start
 */

import { Runtime } from '@scr/runtime';

async function main() {
  console.log('🚀 Starting Browser Agent Example\n');

  const runtime = new Runtime({
    appName: 'browser-agent-example',
    debug: true,
  });

  try {
    await runtime.start();
    console.log('✅ Runtime started\n');

    // Navigate to a page
    console.log('📍 Navigating to example.com...');
    await runtime.browser.goto('https://example.com');
    
    const title = await runtime.browser.title();
    console.log(`📄 Page title: ${title}\n`);

    // Take a screenshot
    console.log('📸 Capturing screenshot...');
    const screenshot = await runtime.browser.screenshot();
    console.log(`📊 Screenshot size: ${screenshot.length} bytes\n`);

    // Extract content
    console.log('📝 Extracting page content...');
    const content = await runtime.browser.content();
    const textContent = await runtime.browser.text('body');
    console.log(`📄 Content length: ${content.length} characters`);
    console.log(`📝 Text preview: ${textContent.slice(0, 100)}...\n`);

    // Demonstrate element querying
    console.log('🔍 Querying elements...');
    const heading = await runtime.browser.$('h1');
    if (heading) {
      const headingText = await heading.textContent();
      console.log(`📌 H1 text: ${headingText}\n`);
    }

    // Verify page state
    console.log('✅ Verifying page loaded correctly...');
    await runtime.verify(async () => {
      const h1 = await runtime.browser.$('h1');
      return h1 !== null;
    });
    console.log('✅ Verification passed\n');

    // Observe full state
    console.log('👁️  Observing screen state...');
    const observation = await runtime.observe();
    console.log(`📊 Detected ${observation.elements.length} UI elements`);
    console.log(`📝 Extracted ${observation.text.length} characters of text\n`);

    console.log('✨ Browser Agent Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await runtime.stop();
    console.log('\n👋 Runtime stopped');
  }
}

main();
