# Terminal Agent Example

Demonstrates command-line task automation using SCR Runtime.

## What This Demonstrates

- Command execution
- Output capture (stdout/stderr)
- Exit code tracking
- Command options (timeout, cwd, env)
- State verification

## Run the Example

```bash
pnpm install
pnpm start
```

## Code Walkthrough

The example shows:

1. **Runtime initialization** - Start SCR Runtime
2. **Basic commands** - Run simple shell commands
3. **Command options** - Set timeouts and working directories
4. **Output handling** - Parse stdout and check exit codes
5. **Verification** - Assert command success

## Expected Output

```
🚀 Starting Terminal Agent Example

✅ Runtime started

💻 Running: ls -la
📊 Exit code: 0
⏱️  Duration: 15ms
📝 Output preview:
total 48
drwxr-xr-x  10 user  staff   320 Jan 15 10:00 .
drwxr-xr-x   5 user  staff   160 Jan 15 09:00 ..
...

💻 Running: node --version (with timeout)
📦 Node version: v22.0.0

💻 Running: git status
✅ In a git repository
📝 Status preview:
On branch main
Your branch is up to date...

✅ Verifying commands execute successfully...
✅ Verification passed

✨ Terminal Agent Example completed successfully!

👋 Runtime stopped
```

## Security Notes

Terminal execution can be dangerous. SCR Runtime includes:

- Permission controls
- Command allowlists/blocklists
- Path restrictions
- Audit logging

Configure security in your runtime:

```typescript
const runtime = new Runtime({
  terminal: {
    allowedCommands: ['ls', 'cat', 'git', 'npm'],
    blockedCommands: ['rm', 'sudo', 'curl'],
  },
});
```

## Next Steps

- Add interactive session examples
- Demonstrate file operations
- Show environment variable management
- Integrate with build pipelines
