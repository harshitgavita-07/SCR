# SDK Guide

TypeScript SDK for programmatic access to SCR Runtime.

## Installation

```bash
pnpm add @scr-runtime/runtime
# or
npm install @scr-runtime/runtime
# or
yarn add @scr-runtime/runtime
```

## Quick Start

```typescript
import { Runtime } from '@scr-runtime/runtime';

async function main() {
  const runtime = new Runtime({
    appName: 'my-app',
    debug: true,
  });

  await runtime.start();

  // Use browser automation
  await runtime.browser.goto('https://example.com');
  await runtime.browser.click('#button');

  await runtime.stop();
}

main();
```

## Configuration

### Basic Config

```typescript
const runtime = new Runtime({
  appName: 'my-agent',
  debug: false,
});
```

### Full Config

```typescript
const runtime = new Runtime({
  appName: 'my-agent',
  version: '1.0.0',
  debug: true,
  permissions: {
    browser: ['*'],
    desktop: ['observe'],
    terminal: ['read-only'],
  },
  sandbox: {
    enabled: true,
    filesystemRoot: '/tmp/scr-sandbox',
  },
  confirmationMode: 'dangerous-only',
});
```

## Browser API

### Navigation

```typescript
await runtime.browser.goto('https://example.com');
await runtime.browser.reload();
await runtime.browser.goBack();
await runtime.browser.goForward();
```

### Interaction

```typescript
await runtime.browser.click('#submit');
await runtime.browser.fill('#email', 'test@example.com');
await runtime.browser.check('#agree');
await runtime.browser.select('#country', 'US');
await runtime.browser.hover('.menu');
```

### Querying

```typescript
const element = await runtime.browser.$('#id');
const elements = await runtime.browser.$$('.class');
const text = await runtime.browser.text('h1');
const html = await runtime.browser.content();
const title = await runtime.browser.title();
```

### Waiting

```typescript
await runtime.browser.waitForSelector('.loaded');
await runtime.browser.waitForNavigation();
await runtime.browser.waitForTimeout(1000);
```

## Desktop API

### Mouse

```typescript
await runtime.desktop.moveMouse(100, 200);
await runtime.desktop.click();
await runtime.desktop.doubleClick({ x: 150, y: 150 });
await runtime.desktop.rightClick();
```

### Keyboard

```typescript
await runtime.desktop.type('Hello World');
await runtime.desktop.press('Enter');
await runtime.desktop.hotkey(['Control', 'C']);
```

### Windows

```typescript
const windows = await runtime.desktop.listWindows();
const window = await runtime.desktop.findWindow('Calculator');
await runtime.desktop.focus(window);
await runtime.desktop.close(window);
```

## Terminal API

### Run Commands

```typescript
const result = await runtime.terminal.run('ls -la');
console.log(result.stdout);
console.log(result.exitCode);
```

### Options

```typescript
const result = await runtime.terminal.run('npm install', {
  cwd: './project',
  timeout: 60000,
  env: { NODE_ENV: 'production' },
});
```

## Filesystem API

### Read/Write

```typescript
const content = await runtime.filesystem.read('./file.txt');
await runtime.filesystem.write('./file.txt', 'New content');
```

### Directory Operations

```typescript
await runtime.filesystem.mkdir('./new-dir');
const entries = await runtime.filesystem.readdir('./src');
await runtime.filesystem.rmdir('./old-dir');
```

### Watch

```typescript
const watcher = await runtime.filesystem.watch('./logs');
watcher.on('change', (path) => console.log(`Changed: ${path}`));
```

## Observer API

### Observe Screen

```typescript
const observation = await runtime.observe();
console.log(observation.screenshot);
console.log(observation.elements);
console.log(observation.text);
```

### OCR

```typescript
const text = await runtime.observer.ocr();
const regionText = await runtime.observer.ocr({
  region: { x: 0, y: 0, width: 300, height: 100 },
});
```

### Element Detection

```typescript
const elements = await runtime.observer.detectElements({
  types: ['button', 'input'],
  minConfidence: 0.8,
});
```

## Verifier API

### Basic Verification

```typescript
await runtime.verify(async () => {
  const button = await runtime.browser.$('#submit');
  return button && await button.isVisible();
});
```

### With Options

```typescript
await runtime.verify(
  async () => {
    const text = await runtime.browser.text('.status');
    return text === 'Complete';
  },
  { timeout: 5000, interval: 200 }
);
```

### Pre-built Assertions

```typescript
await runtime.verifier.elementVisible('#form');
await runtime.verifier.textContains('h1', 'Welcome');
await runtime.verifier.urlMatches(/\/dashboard$/);
await runtime.verifier.fileExists('./config.json');
```

## Sessions

### Create Session

```typescript
const session = runtime.createSession({
  id: 'user-123',
  ttl: 3600,
});

await session.start();
// ... actions
await session.end();
```

### Session Isolation

```typescript
const session1 = runtime.createSession({ id: 's1' });
const session2 = runtime.createSession({ id: 's2' });

// Each session has isolated state
await session1.browser.goto('https://example1.com');
await session2.browser.goto('https://example2.com');
```

## Events

### Listen to Events

```typescript
runtime.on('action.started', (event) => {
  console.log(`Starting: ${event.type}`);
});

runtime.on('action.completed', (event) => {
  console.log(`Completed: ${event.type}`);
});

runtime.on('verification.failed', (event) => {
  console.error(`Verification failed: ${event.message}`);
});
```

### Remove Listeners

```typescript
const handler = (event) => console.log(event);
runtime.on('action.completed', handler);

// Later...
runtime.off('action.completed', handler);
```

## Error Handling

### Catch Errors

```typescript
try {
  await runtime.browser.click('#nonexistent');
} catch (error) {
  if (error instanceof ScrError) {
    switch (error.code) {
      case ScrErrorCode.NOT_FOUND:
        console.log('Element not found');
        break;
      case ScrErrorCode.TIMEOUT:
        console.log('Operation timed out');
        break;
    }
  }
}
```

### Error Types

```typescript
import { ScrError, ScrErrorCode } from '@scr-runtime/runtime';

// Common error codes
ScrErrorCode.INVALID_CONFIG;
ScrErrorCode.NOT_FOUND;
ScrErrorCode.PERMISSION_DENIED;
ScrErrorCode.TIMEOUT;
ScrErrorCode.VALIDATION_FAILED;
```

## Type Exports

All types are exported:

```typescript
import type {
  Runtime,
  RuntimeConfig,
  Permissions,
  SandboxConfig,
  Action,
  Observation,
  Session,
  ScrError,
  ScrErrorCode,
  BrowserEngine,
  DesktopEngine,
  TerminalEngine,
  FilesystemEngine,
  Observer,
  Verifier,
} from '@scr-runtime/runtime';
```

## Best Practices

### Always Clean Up

```typescript
const runtime = new Runtime();
try {
  await runtime.start();
  // ... actions
} finally {
  await runtime.stop();
}
```

### Use Type Safety

```typescript
// TypeScript will catch errors
await runtime.browser.fill('#email', 'not-an-email'); // OK
await runtime.browser.fill('#email', 123); // Type error!
```

### Leverage Verification

```typescript
// Verify before acting
await runtime.verify(async () => {
  const form = await runtime.browser.$('#form');
  return form !== null;
});

await runtime.browser.fill('#form input', 'value');
```

### Monitor with Events

```typescript
runtime.on('action.dangerous', (event) => {
  logger.warn(`Dangerous action: ${event.type}`);
});
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[MCP Server](./mcp.md)** — Model Context Protocol
- **[CLI Reference](./cli.md)** — Command-line tools
- **[Examples](../examples/)** — Code examples
