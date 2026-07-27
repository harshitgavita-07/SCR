# Security Guide

SCR Runtime executes code on your machine. This guide covers security best practices.

## Permission Model

### Granular Permissions

```typescript
const runtime = new Runtime({
  permissions: {
    browser: ['navigate', 'click', 'fill', 'screenshot'],
    desktop: ['observe'], // Read-only, no control
    terminal: ['read-only'], // Can read output, not execute
    filesystem: {
      allow: ['/tmp/*', './data/*'],
      deny: ['/etc/*', '/root/*', '/var/*'],
    },
  },
});
```

### Permission Levels

| Level | Description |
|-------|-------------|
| `full` | All operations allowed |
| `limited` | Specific operations only |
| `read-only` | Observation without modification |
| `none` | Completely blocked |

### Runtime Permission Checks

```typescript
// Check if operation is allowed
if (await runtime.permissions.allows('terminal', 'run')) {
  await runtime.terminal.run('ls -la');
} else {
  console.log('Terminal execution not permitted');
}
```

## Dangerous Operations

### High-Risk Actions

These operations require extra caution:

- `terminal.run()` — Arbitrary command execution
- `filesystem.write()` — File modification
- `filesystem.unlink()` — File deletion
- `desktop.click()` — System-wide control
- `desktop.type()` — Global keyboard input

### Confirmation Mode

```typescript
const runtime = new Runtime({
  confirmationMode: 'dangerous-only', // or 'always' or 'never'
  onConfirm: async (action) => {
    console.log(`Confirm action: ${action.type}`);
    console.log(`Details: ${JSON.stringify(action.payload)}`);
    
    // Could integrate with UI for user confirmation
    return confirm(`Allow ${action.type}?`);
  },
});
```

### Action Logging

All dangerous actions are logged:

```typescript
runtime.on('action.dangerous', (event) => {
  console.warn(`[AUDIT] ${event.timestamp}: ${event.type}`);
  console.warn(`Session: ${event.sessionId}`);
  console.warn(`Payload: ${JSON.stringify(event.payload)}`);
});
```

## Sandboxing

### Filesystem Sandbox

```typescript
const runtime = new Runtime({
  sandbox: {
    enabled: true,
    filesystemRoot: '/tmp/scr-sandbox',
    networkIsolation: true,
    processIsolation: true,
  },
});
```

### Path Restrictions

```typescript
const runtime = new Runtime({
  filesystem: {
    allowedPaths: [
      './project/*',
      '/tmp/scr-work/*',
    ],
    deniedPaths: [
      '/etc/**',
      '/root/**',
      '/var/log/**',
      '**/.env',
      '**/*.key',
    ],
  },
});
```

### Command Restrictions

```typescript
const runtime = new Runtime({
  terminal: {
    allowedCommands: ['ls', 'cat', 'grep', 'git', 'npm'],
    blockedCommands: ['rm', 'sudo', 'curl', 'wget', 'ssh'],
    pathWhitelist: ['/usr/bin', '/usr/local/bin'],
  },
});
```

## Audit Trail

### Enable Audit Logging

```typescript
const runtime = new Runtime({
  audit: {
    enabled: true,
    logPath: './audit-logs',
    format: 'json',
    includeScreenshots: true,
  },
});
```

### Export Audit Log

```typescript
// Get complete audit trail
const log = await runtime.exportAuditLog();

// Save to file
await fs.writeFile('audit.json', JSON.stringify(log, null, 2));

// Stream for real-time monitoring
const stream = runtime.auditStream();
stream.on('data', (entry) => {
  console.log(`[${entry.timestamp}] ${entry.action}`);
});
```

### Audit Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "sessionId": "sess_abc123",
  "action": "browser.click",
  "payload": { "selector": "#submit" },
  "result": "success",
  "duration": 150,
  "verified": true
}
```

## Secure Configuration

### Environment Variables

Never hardcode secrets:

```typescript
// BAD - Don't do this
const runtime = new Runtime({
  apiKey: 'sk-secret-key-123',
});

// GOOD - Use environment variables
const runtime = new Runtime({
  apiKey: process.env.SCR_API_KEY,
});
```

### Configuration Files

Protect configuration files:

```bash
# Set restrictive permissions
chmod 600 scr.config.json
chown $USER:$USER scr.config.json
```

### Secret Masking

```typescript
const runtime = new Runtime({
  audit: {
    maskSecrets: true,
    secretPatterns: [
      /password[=:]\S+/gi,
      /api[_-]?key[=:]\S+/gi,
      /token[=:]\S+/gi,
      /secret[=:]\S+/gi,
    ],
  },
});
```

## Network Security

### Proxy Configuration

```typescript
const runtime = new Runtime({
  network: {
    proxy: {
      server: 'http://proxy.company.com:8080',
      bypass: ['localhost', '*.internal'],
    },
  },
});
```

### SSL/TLS Verification

```typescript
const runtime = new Runtime({
  network: {
    rejectUnauthorized: true, // Always verify SSL
    caCertificates: ['./certs/company-ca.pem'],
  },
});
```

### Network Isolation

```typescript
const runtime = new Runtime({
  sandbox: {
    networkIsolation: true,
    allowedHosts: ['example.com', 'api.example.com'],
    blockedHosts: ['malicious.com'],
  },
});
```

## Input Validation

### Sanitize User Input

```typescript
import { sanitize } from '@scr-runtime/runtime/utils';

// Never pass unsanitized input to commands
const userInput = getUserInput();
const safeInput = sanitize.shellArgument(userInput);

await runtime.terminal.run(`echo ${safeInput}`);
```

### Validate Selectors

```typescript
function isValidSelector(selector: string): boolean {
  // Prevent injection through selectors
  const safePattern = /^[a-zA-Z0-9_.#\-\[\]="'\s:>]+$/;
  return safePattern.test(selector);
}

if (isValidSelector(userSelector)) {
  await runtime.browser.click(userSelector);
}
```

## Error Handling

### Don't Leak Sensitive Info

```typescript
try {
  await runtime.terminal.run(command);
} catch (error) {
  // Log error but don't expose command details
  logger.error('Command execution failed');
  // Don't: console.error(`Failed running: ${command}`);
}
```

### Graceful Degradation

```typescript
if (!await runtime.permissions.allows('terminal', 'run')) {
  // Fallback to safer alternative
  const result = await runtime.filesystem.read('./output.txt');
  return result;
}
```

## Multi-Tenant Security

### Session Isolation

```typescript
// Each user gets isolated session
const userSession = runtime.createSession({
  id: `user-${userId}`,
  permissions: getUserPermissions(userId),
  sandbox: {
    filesystemRoot: `/tmp/scr-user-${userId}`,
  },
});
```

### Resource Limits

```typescript
const runtime = new Runtime({
  limits: {
    maxSessionDuration: 3600000, // 1 hour
    maxActionsPerMinute: 100,
    maxScreenshotSize: 10 * 1024 * 1024, // 10MB
    maxConcurrentSessions: 5,
  },
});
```

## Compliance Considerations

### Data Retention

```typescript
const runtime = new Runtime({
  audit: {
    retentionDays: 90, // Auto-delete after 90 days
    archivePath: '/secure/archive',
  },
});
```

### Access Control

```typescript
// Role-based access
const permissions = {
  admin: ['*'],
  developer: ['browser:*', 'terminal:read'],
  viewer: ['browser:observe'],
};
```

## Security Checklist

Before deploying SCR Runtime:

- [ ] Configure permission model
- [ ] Enable audit logging
- [ ] Set up sandboxing
- [ ] Restrict dangerous operations
- [ ] Implement confirmation mode
- [ ] Validate all inputs
- [ ] Protect configuration files
- [ ] Set resource limits
- [ ] Plan for incident response

## Incident Response

### Emergency Stop

```typescript
// Immediately stop all operations
await runtime.emergencyStop();

// Kill all sessions
await runtime.terminateAllSessions();
```

### Recovery

```typescript
// Restore from known-good state
await runtime.restoreState('./known-good-state.json');

// Verify system integrity
const integrity = await runtime.verifyIntegrity();
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[Verification](./verification.md)** — State verification
- **[Architecture](./architecture.md)** — System design
- **[FAQ](./faq.md)** — Common questions
