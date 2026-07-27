# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

We take the security of SCR Runtime seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [security@scr-runtime.dev](mailto:security@scr-runtime.dev) or use GitHub's private vulnerability reporting feature.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

After the initial reply to your report, we will send a follow-up message indicating the next steps in handling your report. After the initial reply, we will keep you informed of the progress toward a fix and full announcement, and may ask for additional information or guidance.

## Security Considerations

SCR Runtime executes code on your machine and interacts with applications, files, and systems. Understanding the security implications is critical.

### Permission Model

SCR Runtime implements a permission system to control what actions are allowed:

```typescript
const runtime = new Runtime({
  permissions: {
    browser: ['navigate', 'click', 'fill'],
    desktop: ['observe'], // No control allowed
    terminal: ['read-only'], // No execution
    filesystem: {
      allow: ['/tmp/*', './data/*'],
      deny: ['/**'], // Block everything else
    },
  },
});
```

Always configure permissions according to the principle of least privilege.

### Dangerous Operations

The following operations are considered dangerous and require explicit confirmation:

- **Terminal Execution** — `terminal.run()` can execute arbitrary commands
- **Filesystem Write** — `filesystem.write()` can modify or delete files
- **Desktop Control** — `desktop.click()` can interact with any application
- **Browser Navigation** — `browser.goto()` can navigate to untrusted sites

Enable confirmation mode for untrusted agents:

```typescript
const runtime = new Runtime({
  confirmationMode: 'always', // or 'dangerous-only'
  onConfirm: async (action) => {
    console.log(`Confirm: ${action.type}`);
    return true; // or false to deny
  },
});
```

### Sandboxing

Run SCR Runtime in isolated environments when possible:

```typescript
const runtime = new Runtime({
  sandbox: {
    enabled: true,
    networkIsolation: true,
    filesystemRoot: '/tmp/scr-sandbox',
  },
});
```

### Audit Trail

All actions are logged for security auditing:

```typescript
runtime.on('action', (event) => {
  console.log(`[${event.timestamp}] ${event.type}: ${JSON.stringify(event.payload)}`);
});

// Export audit log
const log = await runtime.exportAuditLog();
await fs.writeFile('audit.json', log);
```

### Best Practices

1. **Never run untrusted agent code** — Only use agents from trusted sources
2. **Use minimal permissions** — Grant only the permissions necessary
3. **Enable confirmation mode** — For sensitive operations
4. **Review audit logs** — Regularly check action history
5. **Use sandboxing** — Isolate execution when possible
6. **Keep updated** — Install security patches promptly

## Known Limitations

- Desktop control operates at the OS level and cannot be fully sandboxed
- Terminal execution inherits the permissions of the running process
- Browser automation shares cookies and storage with the user's browser profile

## Security Updates

Security updates will be released as patch versions (e.g., 0.1.1). Subscribe to releases to stay informed.

## Acknowledgments

We thank everyone who contributes to the security of SCR Runtime by responsibly disclosing vulnerabilities.
