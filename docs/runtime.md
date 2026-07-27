# Runtime API Reference

Complete reference for the SCR Runtime API.

## Runtime Class

The main entry point for all SCR operations.

### Constructor

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime(config?: RuntimeConfig);
```

### Configuration

```typescript
interface RuntimeConfig {
  appName?: string;           // Application identifier
  debug?: boolean;            // Enable debug logging
  permissions?: Permissions;  // Access control
  sandbox?: SandboxConfig;    // Isolation settings
  confirmationMode?: 'always' | 'dangerous-only' | 'never';
}
```

### Lifecycle Methods

#### `start()`

Initialize the runtime and all engines.

```typescript
await runtime.start();
```

#### `stop()`

Shut down the runtime and release resources.

```typescript
await runtime.stop();
```

#### `dispose()`

Alias for `stop()`. Ensures cleanup.

```typescript
await runtime.dispose();
```

---

## Browser Engine

Browser automation via Playwright.

### Navigation

```typescript
await runtime.browser.goto(url: string, options?: GotoOptions);
await runtime.browser.reload();
await runtime.browser.goBack();
await runtime.browser.goForward();
```

### Interaction

```typescript
await runtime.browser.click(selector: string);
await runtime.browser.fill(selector: string, value: string);
await runtime.browser.check(selector: string);
await runtime.browser.uncheck(selector: string);
await runtime.browser.select(selector: string, value: string);
await runtime.browser.hover(selector: string);
await runtime.browser.focus(selector: string);
await runtime.browser.press(selector: string, key: string);
```

### Querying

```typescript
const element = await runtime.browser.$(selector: string);
const elements = await runtime.browser.$$(selector: string);
const text = await runtime.browser.text(selector: string);
const html = await runtime.browser.content();
const title = await runtime.browser.title();
const url = await runtime.browser.url();
```

### Screenshots & Media

```typescript
const screenshot = await runtime.browser.screenshot(options?: ScreenshotOptions);
await runtime.browser.pdf(options?: PDFOptions);
```

### Waiting

```typescript
await runtime.browser.waitForSelector(selector: string, options?: WaitForOptions);
await runtime.browser.waitForNavigation(options?: WaitForNavigationOptions);
await runtime.browser.waitForTimeout(ms: number);
```

---

## Desktop Engine

Native desktop application control.

### Mouse Control

```typescript
await runtime.desktop.moveMouse(x: number, y: number);
await runtime.desktop.click(position?: { x: number; y: number });
await runtime.desktop.doubleClick(position?: { x: number; y: number });
await runtime.desktop.rightClick(position?: { x: number; y: number });
await runtime.dragAndDrop(from: Position, to: Position);
```

### Keyboard Control

```typescript
await runtime.desktop.type(text: string);
await runtime.desktop.press(key: string);
await runtime.desktop.hotkey(keys: string[]);
```

### Window Management

```typescript
const windows = await runtime.desktop.listWindows();
const window = await runtime.desktop.findWindow(title: string);
await runtime.desktop.focus(window: WindowHandle);
await runtime.desktop.minimize(window: WindowHandle);
await runtime.desktop.maximize(window: WindowHandle);
await runtime.desktop.close(window: WindowHandle);
```

### Application Control

```typescript
await runtime.desktop.launch(appPath: string);
await runtime.desktop.quit(appName: string);
const apps = await runtime.desktop.listApplications();
```

---

## Terminal Engine

Safe command-line execution.

### Command Execution

```typescript
const result = await runtime.terminal.run(command: string, options?: RunOptions);

interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}
```

### Options

```typescript
interface RunOptions {
  cwd?: string;              // Working directory
  env?: Record<string, string>; // Environment variables
  timeout?: number;          // Timeout in ms
  shell?: string;            // Shell to use
}
```

### Interactive Sessions

```typescript
const session = await runtime.terminal.createSession(options?: SessionOptions);
await session.send(command: string);
await session.read(): Promise<string>;
await session.close();
```

---

## Filesystem Engine

Sandboxed file operations.

### Reading

```typescript
const content = await runtime.filesystem.read(path: string);
const buffer = await runtime.filesystem.readBuffer(path: string);
const json = await runtime.filesystem.readJson(path: string);
const stats = await runtime.filesystem.stat(path: string);
```

### Writing

```typescript
await runtime.filesystem.write(path: string, content: string);
await runtime.filesystem.writeBuffer(path: string, buffer: Buffer);
await runtime.filesystem.writeJson(path: string, data: unknown);
```

### Directory Operations

```typescript
await runtime.filesystem.mkdir(path: string, options?: MkdirOptions);
const entries = await runtime.filesystem.readdir(path: string);
await runtime.filesystem.rmdir(path: string);
```

### File Operations

```typescript
await runtime.filesystem.copy(src: string, dest: string);
await runtime.filesystem.move(src: string, dest: string);
await runtime.filesystem.unlink(path: string);
await runtime.filesystem.exists(path: string): Promise<boolean>;
```

### Watching

```typescript
const watcher = await runtime.filesystem.watch(path: string);
watcher.on('change', (path: string) => { /* ... */ });
watcher.on('unlink', (path: string) => { /* ... */ });
await watcher.close();
```

---

## Observer

Screen observation and vision capabilities.

### Basic Observation

```typescript
const observation = await runtime.observe();

interface Observation {
  screenshot: Buffer;
  elements: DetectedElement[];
  text: string;
  activeWindow: WindowInfo;
  cursorPosition: { x: number; y: number };
  timestamp: number;
}
```

### Element Detection

```typescript
const elements = await runtime.observer.detectElements(options?: DetectOptions);

interface DetectedElement {
  type: 'button' | 'input' | 'link' | 'text' | 'image';
  bounds: { x: number; y: number; width: number; height: number };
  text?: string;
  confidence: number;
}
```

### OCR

```typescript
const text = await runtime.observer.ocr(region?: Region);

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### Visual Search

```typescript
const match = await runtime.observer.findImage(template: Buffer, options?: FindOptions);

interface FindOptions {
  threshold?: number;  // Match confidence (0-1)
  region?: Region;     // Search area
}
```

---

## Verifier

State verification and assertions.

### Basic Verification

```typescript
await runtime.verify(condition: () => boolean | Promise<boolean>);
await runtime.verify(condition, options?: VerifyOptions);

interface VerifyOptions {
  timeout?: number;    // Max wait time in ms
  interval?: number;   // Check interval in ms
  message?: string;    // Error message on failure
}
```

### Pre-built Assertions

```typescript
await runtime.verifier.elementVisible(selector: string);
await runtime.verifier.elementHidden(selector: string);
await runtime.verifier.textContains(selector: string, text: string);
await runtime.verifier.urlMatches(pattern: string | RegExp);
await runtime.verifier.fileExists(path: string);
await runtime.verifier.commandSucceeds(command: string);
```

### Custom Assertions

```typescript
runtime.verifier.register('my-check', async (context) => {
  // Custom verification logic
  return {
    passed: true,
    message: 'Check passed',
  };
});

await runtime.verify(() => runtime.verifier.assert('my-check'));
```

---

## Sessions

Isolated execution contexts.

### Creating Sessions

```typescript
const session = runtime.createSession(config?: SessionConfig);

interface SessionConfig {
  id?: string;
  ttl?: number;        // Time-to-live in seconds
  permissions?: Permissions;
}
```

### Session Lifecycle

```typescript
await session.start();
// ... perform actions
await session.end();
```

### Session State

```typescript
session.id: string;
session.status: 'idle' | 'running' | 'paused' | 'stopped';
session.createdAt: number;
session.actions: ActionRecord[];
```

---

## Events

Event-driven architecture for reactive programming.

### Event Types

```typescript
runtime.on('runtime.started', (event: RuntimeEvent) => { /* ... */ });
runtime.on('runtime.stopped', (event: RuntimeEvent) => { /* ... */ });

runtime.on('action.started', (event: ActionEvent) => { /* ... */ });
runtime.on('action.completed', (event: ActionEvent) => { /* ... */ });
runtime.on('action.failed', (event: ActionEvent) => { /* ... */ });

runtime.on('verification.started', (event: VerifyEvent) => { /* ... */ });
runtime.on('verification.passed', (event: VerifyEvent) => { /* ... */ });
runtime.on('verification.failed', (event: VerifyEvent) => { /* ... */ });

runtime.on('observation.captured', (event: ObserveEvent) => { /* ... */ });
```

### Event Objects

```typescript
interface ActionEvent {
  actionId: string;
  type: string;
  payload: Record<string, unknown>;
  sessionId?: string;
  timestamp: number;
}
```

### Removing Listeners

```typescript
runtime.off('action.completed', handler);
runtime.removeAllListeners();
```

---

## Error Handling

### Error Types

```typescript
import { ScrError, ScrErrorCode } from '@scr-runtime/runtime';

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
      case ScrErrorCode.PERMISSION_DENIED:
        console.log('Access denied');
        break;
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CONFIG` | Invalid configuration provided |
| `NOT_FOUND` | Resource not found |
| `ALREADY_EXISTS` | Resource already exists |
| `INVALID_STATE` | Invalid state transition |
| `TIMEOUT` | Operation timed out |
| `PERMISSION_DENIED` | Access denied |
| `RESOURCE_UNAVAILABLE` | Resource unavailable |
| `INTERNAL_ERROR` | Internal error |
| `VALIDATION_FAILED` | Validation failed |

---

## Type Exports

All types are exported from the main package:

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
} from '@scr-runtime/runtime';
```

## Next Steps

- **[Browser Guide](./browser.md)** — Detailed browser automation
- **[Desktop Guide](./desktop.md)** — Desktop application control
- **[Terminal Guide](./terminal.md)** — Command execution
- **[Vision Guide](./vision.md)** — Screen observation
- **[Verification Guide](./verification.md)** — State verification
