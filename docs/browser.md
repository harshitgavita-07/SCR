# Browser Automation

Control web browsers with SCR Runtime using Playwright as the backend.

## Overview

SCR Runtime provides browser automation through Playwright, supporting:

- **Chromium** — Chrome, Edge, Brave
- **Firefox** — Mozilla Firefox
- **WebKit** — Safari on macOS

## Quick Start

```typescript
import { Runtime } from '@scr/runtime';

const runtime = new Runtime();
await runtime.start();

// Navigate to a page
await runtime.browser.goto('https://example.com');

// Interact with elements
await runtime.browser.click('#submit-button');
await runtime.browser.fill('#email', 'user@example.com');

// Extract data
const title = await runtime.browser.title();
const content = await runtime.browser.content();

await runtime.stop();
```

## Navigation

### Basic Navigation

```typescript
// Go to URL
await runtime.browser.goto('https://example.com');

// With options
await runtime.browser.goto('https://example.com', {
  waitUntil: 'networkidle',
  timeout: 30000,
});

// Reload page
await runtime.browser.reload();

// Navigation history
await runtime.browser.goBack();
await runtime.browser.goForward();
```

### Wait Strategies

```typescript
// Wait for selector
await runtime.browser.waitForSelector('.loaded');

// Wait for navigation
await runtime.browser.waitForNavigation();

// Wait for specific URL
await runtime.browser.waitForURL('https://example.com/dashboard');

// Fixed timeout
await runtime.browser.waitForTimeout(1000);
```

## Interaction

### Clicking

```typescript
// Simple click
await runtime.browser.click('#button');

// Double click
await runtime.browser.dblclick('#item');

// Right click
await runtime.browser.click('#menu', { button: 'right' });

// Click with modifiers
await runtime.browser.click('#link', { modifiers: ['Control'] });
```

### Input

```typescript
// Fill text input
await runtime.browser.fill('#email', 'user@example.com');

// Type character by character
await runtime.browser.type('#search', 'hello world', { delay: 50 });

// Clear input
await runtime.browser.fill('#input', '');

// Check/uncheck
await runtime.browser.check('#agree');
await runtime.browser.uncheck('#subscribe');

// Select dropdown
await runtime.browser.select('#country', 'US');
await runtime.browser.select('#color', ['red', 'blue']); // Multiple
```

### Keyboard

```typescript
// Press single key
await runtime.browser.press('#input', 'Enter');

// Key combinations
await runtime.browser.press('#input', 'Control+A');
await runtime.browser.press('#input', 'Shift+ArrowRight');

// Special keys
await runtime.browser.press('#input', 'Backspace');
await runtime.browser.press('#input', 'Escape');
await runtime.browser.press('#input', 'Tab');
```

### Drag and Drop

```typescript
// Using mouse events
await runtime.browser.hover('#draggable');
await runtime.browser.mouse.down();
await runtime.browser.mouse.move(100, 100);
await runtime.browser.mouse.up();
```

## Querying Elements

### Selectors

```typescript
// CSS selectors
await runtime.browser.$('.class');
await runtime.browser.$('#id');
await runtime.browser.$('div > p');

// XPath selectors
await runtime.browser.$('xpath=/html/body/div');

// Text selectors
await runtime.browser.$('text=Submit');
await runtime.browser.$('"Submit"');

// Multiple elements
const items = await runtime.browser.$$('.item');
```

### Element Properties

```typescript
const element = await runtime.browser.$('#target');

// Get text content
const text = await element.textContent();

// Get attribute
const href = await element.getAttribute('href');

// Check visibility
const visible = await element.isVisible();

// Get bounding box
const box = await element.boundingBox();
```

### Page Content

```typescript
// Full HTML
const html = await runtime.browser.content();

// Page title
const title = await runtime.browser.title();

// Current URL
const url = await runtime.browser.url();

// Extract text
const text = await runtime.browser.text('body');
```

## Screenshots & PDF

### Screenshots

```typescript
// Full page screenshot
const screenshot = await runtime.browser.screenshot({
  fullPage: true,
});

// Specific element
const element = await runtime.browser.$('#component');
const elementShot = await element.screenshot();

// Options
const screenshot = await runtime.browser.screenshot({
  path: './screenshot.png',
  type: 'png', // or 'jpeg'
  quality: 80, // for jpeg
  omitBackground: true,
});
```

### PDF Export

```typescript
await runtime.browser.pdf({
  path: './page.pdf',
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20px',
    bottom: '20px',
    left: '20px',
    right: '20px',
  },
});
```

## Frames and Popups

### Frames

```typescript
// Get frame by name
const frame = await runtime.browser.frame({ name: 'my-frame' });

// Get frame by URL
const frame = await runtime.browser.frame({ url: /embedded/ });

// Interact with frame
await frame.fill('#input', 'value');
await frame.click('#button');
```

### Popups

```typescript
// Wait for popup
const [popup] = await Promise.all([
  runtime.browser.waitForEvent('popup'),
  runtime.browser.click('#open-popup'),
]);

// Interact with popup
await popup.goto('https://example.com');
await popup.close();
```

## Authentication

### Cookies

```typescript
// Get cookies
const cookies = await runtime.browser.cookies();

// Set cookies
await runtime.browser.addCookies([{
  name: 'session',
  value: 'abc123',
  domain: 'example.com',
  path: '/',
}]);

// Clear cookies
await runtime.browser.clearCookies();
```

### Local Storage

```typescript
// Set local storage
await runtime.browser.evaluate(() => {
  localStorage.setItem('key', 'value');
});

// Get local storage
const value = await runtime.browser.evaluate(() => {
  return localStorage.getItem('key');
});
```

## Configuration

### Browser Launch Options

```typescript
const runtime = new Runtime({
  browser: {
    engine: 'chromium', // or 'firefox', 'webkit'
    launchOptions: {
      headless: true,
      slowMo: 100, // Slow down for debugging
      args: ['--start-maximized'],
    },
    contextOptions: {
      viewport: { width: 1920, height: 1080 },
      userAgent: 'custom-agent',
      locale: 'en-US',
      timezoneId: 'America/New_York',
    },
  },
});
```

### Proxy Configuration

```typescript
const runtime = new Runtime({
  browser: {
    contextOptions: {
      proxy: {
        server: 'http://proxy.example.com:8080',
        username: 'user',
        password: 'pass',
      },
    },
  },
});
```

## Error Handling

### Timeout Errors

```typescript
try {
  await runtime.browser.click('#submit', { timeout: 5000 });
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Element not found within timeout');
  }
}
```

### Element Not Found

```typescript
const element = await runtime.browser.$('#nonexistent');
if (!element) {
  console.log('Element not found');
}
```

### Navigation Errors

```typescript
try {
  await runtime.browser.goto('https://invalid-url');
} catch (error) {
  console.log(`Navigation failed: ${error.message}`);
}
```

## Best Practices

### Use Data Attributes

```typescript
// Prefer this
await runtime.browser.click('[data-testid="submit-button"]');

// Over brittle selectors
await runtime.browser.click('.form > div:nth-child(3) > button');
```

### Wait for Network Idle

```typescript
// Wait for network to settle before interacting
await runtime.browser.goto('https://example.com', {
  waitUntil: 'networkidle',
});
```

### Clean Up Resources

```typescript
const runtime = new Runtime();
try {
  await runtime.start();
  // ... actions
} finally {
  await runtime.stop();
}
```

### Screenshot on Failure

```typescript
try {
  await runtime.browser.click('#submit');
} catch (error) {
  const screenshot = await runtime.browser.screenshot();
  await fs.writeFile('failure.png', screenshot);
  throw error;
}
```

## Integration with Verification

```typescript
// Verify element is visible before clicking
await runtime.verify(async () => {
  const button = await runtime.browser.$('#submit');
  return button !== null && await button.isVisible();
});

await runtime.browser.click('#submit');

// Verify action succeeded
await runtime.verify(async () => {
  const status = await runtime.browser.text('.status');
  return status === 'Submitted';
});
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[Verification](./verification.md)** — State verification
- **[Vision](./vision.md)** — Screen observation
- **[Security](./security.md)** — Safe automation practices
