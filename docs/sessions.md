# Sessions

Sessions provide isolated, persistent execution contexts for AI agents.

## Overview

A session in SCR Runtime:
- Isolates state between different agents or tasks
- Tracks all actions for audit and replay
- Manages resource lifecycle (cleanup on end)
- Supports checkpointing for long-running operations

## Creating Sessions

```typescript
import { Runtime } from '@scr/runtime';

const runtime = new Runtime();

// Create a new session
const session = await runtime.createSession({
  id: 'my-session',
  ttl: 3600, // 1 hour
});

// Start the session
await session.start();

// Perform actions within the session
await runtime.browser.goto('https://example.com');
await runtime.observe();

// End the session (cleans up resources)
await session.end();
```

## Session Configuration

```typescript
const session = await runtime.createSession({
  id: 'unique-id',           // Optional: auto-generated if not provided
  ttl: 7200,                 // Time to live in seconds
  permissions: {             // Session-specific permissions
    browser: ['navigate', 'click'],
    filesystem: { allow: ['/tmp/*'] },
  },
  sandbox: {
    enabled: true,
    networkIsolation: false,
  },
  metadata: {                // Custom metadata for tracking
    agent: 'research-agent',
    taskId: 'task-123',
  },
});
```

## Session Lifecycle

### Start

```typescript
await session.start();
// Session is now active
// Resources are allocated
// Event listeners are attached
```

### Checkpoint

Save session state for later resumption:

```typescript
const checkpoint = await session.checkpoint();
// Returns serializable state
console.log(checkpoint.state);
console.log(checkpoint.timestamp);
```

### Resume

Restore from a checkpoint:

```typescript
await session.resume(checkpoint);
// Session continues from saved state
```

### End

```typescript
await session.end();
// All resources cleaned up
// Browser closed
// Temporary files deleted
// Audit log finalized
```

## Isolation

Sessions provide isolation:

```typescript
// Session A
const sessionA = await runtime.createSession({ id: 'A' });
await sessionA.start();
await runtime.browser.goto('https://site-a.com');

// Session B - completely isolated
const sessionB = await runtime.createSession({ id: 'B' });
await sessionB.start();
await runtime.browser.goto('https://site-b.com');

// Each session has its own browser context, cookies, etc.
```

## Audit Trail

All session actions are logged:

```typescript
session.on('action', (event) => {
  console.log(`[${event.timestamp}] ${event.type}`);
});

// Export complete audit log
const log = await session.exportAuditLog();
await fs.writeFile('session-audit.json', log);
```

## Error Handling

```typescript
try {
  await session.start();
  // ... perform actions
} catch (error) {
  console.error('Session error:', error);
  await session.end(); // Ensure cleanup
}
```

## Best Practices

1. **Always end sessions** — Use try/finally to ensure cleanup
2. **Set appropriate TTL** — Prevent resource leaks
3. **Use meaningful IDs** — For debugging and audit trails
4. **Limit concurrent sessions** — Based on system resources

```typescript
async function withSession<T>(fn: (session: Session) => Promise<T>): Promise<T> {
  const session = await runtime.createSession();
  try {
    await session.start();
    return await fn(session);
  } finally {
    await session.end();
  }
}

// Usage
const result = await withSession(async (session) => {
  await runtime.browser.goto('https://example.com');
  return await runtime.observe();
});
```

## API Reference

### Session Methods

| Method | Description |
|--------|-------------|
| `start()` | Initialize session |
| `end()` | Cleanup and close |
| `checkpoint()` | Save current state |
| `resume(checkpoint)` | Restore from checkpoint |
| `exportAuditLog()` | Get action history |

### Session Events

| Event | Description |
|-------|-------------|
| `start` | Session started |
| `end` | Session ended |
| `action` | Action performed |
| `error` | Error occurred |
| `checkpoint` | State saved |

## Next Steps

- [Security Guide](./security.md) — Permission and sandboxing details
- [Verification](./verification.md) — Verify session state
