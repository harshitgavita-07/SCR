# Terminal Execution

Execute shell commands safely with SCR Runtime.

## Overview

SCR Runtime provides safe terminal execution with:

- Command output capture (stdout/stderr)
- Exit code tracking
- Timeout protection
- Working directory control
- Environment variable management

## Quick Start

```typescript
import { Runtime } from '@scr/runtime';

const runtime = new Runtime();
await runtime.start();

// Run a command
const result = await runtime.terminal.run('ls -la');
console.log(result.stdout);
console.log(`Exit code: ${result.exitCode}`);

await runtime.stop();
```

## Basic Execution

### Run Commands

```typescript
// Simple command
const result = await runtime.terminal.run('echo "Hello"');

// With options
const result = await runtime.terminal.run('npm install', {
  cwd: '/path/to/project',
  timeout: 60000,
});
```

### Result Structure

```typescript
interface RunResult {
  stdout: string;    // Standard output
  stderr: string;    // Error output
  exitCode: number;  // Process exit code
  duration: number;  // Execution time in ms
}
```

## Command Options

### Working Directory

```typescript
// Run in specific directory
const result = await runtime.terminal.run('git status', {
  cwd: '/path/to/repo',
});
```

### Environment Variables

```typescript
// Set environment variables
const result = await runtime.terminal.run('echo $NODE_ENV', {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    API_KEY: 'secret',
  },
});
```

### Timeout

```typescript
// Set timeout (default: 30000ms)
const result = await runtime.terminal.run('long-running-command', {
  timeout: 120000, // 2 minutes
});
```

### Shell Selection

```typescript
// Use specific shell
const result = await runtime.terminal.run('echo $SHELL', {
  shell: '/bin/bash',
});

// Windows PowerShell
const result = await runtime.terminal.run('Get-ChildItem', {
  shell: 'powershell.exe',
});
```

## Output Handling

### Parse Output

```typescript
const result = await runtime.terminal.run('ls -la');

// Split into lines
const lines = result.stdout.split('\n');

// Parse JSON output
const data = JSON.parse(result.stdout);

// Extract numbers
const matches = result.stdout.match(/\d+/g);
```

### Handle Errors

```typescript
const result = await runtime.terminal.run('invalid-command');

if (result.exitCode !== 0) {
  console.error(`Command failed: ${result.stderr}`);
}
```

### Stream Output

For long-running commands:

```typescript
const session = await runtime.terminal.createSession();

session.on('stdout', (data) => {
  console.log(data.toString());
});

session.on('stderr', (data) => {
  console.error(data.toString());
});

await session.send('tail -f logs.txt');

// Later...
await session.close();
```

## Interactive Sessions

### Create Session

```typescript
const session = await runtime.terminal.createSession({
  cwd: '/path/to/dir',
  env: { CUSTOM_VAR: 'value' },
  shell: 'bash',
});
```

### Send Commands

```typescript
// Send command
await session.send('cd /path/to/project');
await session.send('npm install');

// Read output
const output = await session.read();
console.log(output);
```

### Close Session

```typescript
await session.close();
```

## Common Patterns

### Git Operations

```typescript
// Clone repository
await runtime.terminal.run('git clone https://github.com/user/repo.git');

// Check status
const status = await runtime.terminal.run('git status --porcelain');

// Commit changes
await runtime.terminal.run('git add .');
await runtime.terminal.run('git commit -m "Update files"');

// Push
await runtime.terminal.run('git push origin main');
```

### File Operations

```typescript
// Create directory
await runtime.terminal.run('mkdir -p new-folder');

// Copy files
await runtime.terminal.run('cp source.txt destination.txt');

// Move files
await runtime.terminal.run('mv old.txt new.txt');

// Delete files
await runtime.terminal.run('rm -rf temp/');
```

### Package Management

```typescript
// Install dependencies
await runtime.terminal.run('npm install');

// Run scripts
await runtime.terminal.run('npm run build');

// Update packages
await runtime.terminal.run('npm update');
```

### System Commands

```typescript
// Check disk space
const disk = await runtime.terminal.run('df -h');

// Check memory
const memory = await runtime.terminal.run('free -m');

// List processes
const processes = await runtime.terminal.run('ps aux');
```

## Security Considerations

### Command Injection

Never interpolate user input directly:

```typescript
// DANGEROUS - Do not do this
const userInput = 'file.txt; rm -rf /';
await runtime.terminal.run(`cat ${userInput}`);

// SAFE - Use arguments
const userInput = 'file.txt';
await runtime.terminal.run('cat', [userInput]);
```

### Sandboxing

```typescript
const runtime = new Runtime({
  terminal: {
    sandbox: true,
    allowedCommands: ['ls', 'cat', 'grep', 'git'],
    blockedCommands: ['rm', 'sudo', 'curl', 'wget'],
    restrictedPaths: ['/etc', '/root', '/var'],
  },
});
```

### Path Validation

```typescript
import path from 'path';

function validatePath(inputPath: string, baseDir: string): string {
  const resolved = path.resolve(baseDir, inputPath);
  if (!resolved.startsWith(baseDir)) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}

const safePath = validatePath('../etc/passwd', '/tmp/sandbox');
```

## Error Handling

```typescript
try {
  const result = await runtime.terminal.run('nonexistent-command');
  
  if (result.exitCode !== 0) {
    throw new Error(`Command failed: ${result.stderr}`);
  }
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Command timed out');
  } else {
    console.error(`Execution error: ${error.message}`);
  }
}
```

## Platform Differences

### Unix/Linux/macOS

```typescript
// Bash built-ins work
await runtime.terminal.run('source ~/.bashrc');

// Pipe commands
await runtime.terminal.run('ls | grep .txt | wc -l');

// Background processes
await runtime.terminal.run('sleep 10 &');
```

### Windows

```typescript
// PowerShell commands
await runtime.terminal.run('Get-Process', {
  shell: 'powershell.exe',
});

// CMD commands
await runtime.terminal.run('dir', {
  shell: 'cmd.exe',
});

// WSL
await runtime.terminal.run('ls -la', {
  shell: 'wsl',
});
```

## Integration with Verification

```typescript
// Verify command succeeds
await runtime.verify(async () => {
  const result = await runtime.terminal.run('git status');
  return result.exitCode === 0;
});

// Verify file exists after command
await runtime.terminal.run('touch test.txt');
await runtime.verify(async () => {
  const result = await runtime.terminal.run('test -f test.txt');
  return result.exitCode === 0;
});
```

## Best Practices

### Use Absolute Paths

```typescript
// Prefer absolute paths
await runtime.terminal.run('/usr/bin/python3 script.py');

// Or resolve relative paths
const scriptPath = path.resolve(__dirname, 'script.py');
await runtime.terminal.run(`python3 ${scriptPath}`);
```

### Set Timeouts

Always set reasonable timeouts:

```typescript
await runtime.terminal.run('npm install', {
  timeout: 120000, // 2 minutes max
});
```

### Log Commands

```typescript
async function runWithLogging(command: string) {
  console.log(`Running: ${command}`);
  const start = Date.now();
  const result = await runtime.terminal.run(command);
  console.log(`Completed in ${Date.now() - start}ms`);
  return result;
}
```

### Clean Up Temporary Files

```typescript
const tempDir = '/tmp/scr-work';
await runtime.terminal.run(`mkdir -p ${tempDir}`);

try {
  // Do work
  await runtime.terminal.run(`cp files/* ${tempDir}/`);
} finally {
  // Clean up
  await runtime.terminal.run(`rm -rf ${tempDir}`);
}
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[Filesystem](./filesystem.md)** — File operations
- **[Security](./security.md)** — Safe execution practices
- **[Verification](./verification.md)** — State verification
