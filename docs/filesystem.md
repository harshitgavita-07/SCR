# Filesystem Runtime

The filesystem module provides safe, controlled access to the file system.

## Overview

SCR Runtime's filesystem module enables AI agents to:
- Read and write files
- Create and delete directories
- Watch for file changes
- Search for files by pattern

All operations respect configured permissions and can be audited.

## Basic Usage

```typescript
import { Runtime } from '@scr/runtime';

const runtime = new Runtime();

// Read a file
const content = await runtime.filesystem.read('/path/to/file.txt');

// Write to a file
await runtime.filesystem.write('/path/to/file.txt', 'Hello, World!');

// Copy a file
await runtime.filesystem.copy('/src/file.txt', '/dest/file.txt');

// Move a file
await runtime.filesystem.move('/old/path.txt', '/new/path.txt');

// Delete a file
await runtime.filesystem.delete('/path/to/file.txt');

// Create directory
await runtime.filesystem.mkdir('/path/to/new/dir');

// Get file stats
const stats = await runtime.filesystem.stat('/path/to/file.txt');
console.log(stats.size, stats.modifiedAt);
```

## File Watching

Watch for file changes:

```typescript
const watcher = await runtime.filesystem.watch('/path/to/dir', {
  recursive: true,
});

watcher.on('change', (event) => {
  console.log(`File ${event.path} was ${event.type}`);
});

// Stop watching
await watcher.close();
```

## Search

Find files matching patterns:

```typescript
const files = await runtime.filesystem.search('/path', {
  pattern: '*.ts',
  recursive: true,
  maxResults: 100,
});
```

## Temporary Files

Create temporary files safely:

```typescript
const tempFile = await runtime.filesystem.createTempFile({
  prefix: 'scr-',
  suffix: '.txt',
});

await runtime.filesystem.write(tempFile.path, 'Temporary content');

// Clean up when done
await runtime.filesystem.delete(tempFile.path);
```

## Permissions

Configure filesystem permissions:

```typescript
const runtime = new Runtime({
  permissions: {
    filesystem: {
      allow: ['/tmp/*', './data/*'],
      deny: ['/etc/*', '/root/*'],
    },
  },
});
```

## Security Notes

### Dangerous Operations

The following operations require confirmation in strict mode:
- `write()` — Can modify or overwrite files
- `delete()` — Permanently removes files
- `move()` — Can relocate files outside allowed paths

### Best Practices

1. **Use allowlists** — Specify exactly which paths are accessible
2. **Enable confirmation mode** — For untrusted agents
3. **Audit all operations** — Review filesystem access logs
4. **Use temporary directories** — Isolate agent file operations

```typescript
const runtime = new Runtime({
  permissions: {
    filesystem: {
      allow: ['./agent-data/*'],
      deny: ['/**'], // Deny everything else
    },
  },
  confirmationMode: 'dangerous-only',
});
```

## Error Handling

```typescript
try {
  await runtime.filesystem.read('/protected/file.txt');
} catch (error) {
  if (error.code === 'PERMISSION_DENIED') {
    console.log('Access denied to path');
  } else if (error.code === 'FILE_NOT_FOUND') {
    console.log('File does not exist');
  } else {
    throw error;
  }
}
```

## API Reference

### Methods

| Method | Description |
|--------|-------------|
| `read(path)` | Read file contents as string |
| `write(path, content)` | Write string content to file |
| `copy(src, dest)` | Copy file from src to dest |
| `move(src, dest)` | Move file from src to dest |
| `delete(path)` | Delete file or directory |
| `mkdir(path, options?)` | Create directory |
| `stat(path)` | Get file metadata |
| `search(root, options)` | Find files matching pattern |
| `watch(path, options)` | Watch for file changes |
| `createTempFile(options)` | Create temporary file |

## Next Steps

- [Security Guide](./security.md) — Permission model details
- [Verification](./verification.md) — Verify filesystem state
