# Model Context Protocol (MCP) Server

SCR Runtime exposes capabilities through the Model Context Protocol for AI integration.

## Overview

The MCP server allows AI clients (Claude Desktop, Cursor, etc.) to use SCR Runtime as a tool provider.

## Installation

```bash
pnpm add -g @scr/runtime
```

## Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "scr": {
      "command": "scr",
      "args": ["mcp", "serve"],
      "env": {
        "DEBUG": "false"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "scr": {
      "command": "scr",
      "args": ["mcp", "serve"]
    }
  }
}
```

## Available Tools

### Browser Tools

#### `browser_navigate`

Navigate to a URL.

```json
{
  "name": "browser_navigate",
  "arguments": {
    "url": "https://example.com"
  }
}
```

#### `browser_click`

Click an element.

```json
{
  "name": "browser_click",
  "arguments": {
    "selector": "#submit-button"
  }
}
```

#### `browser_fill`

Fill a form field.

```json
{
  "name": "browser_fill",
  "arguments": {
    "selector": "#email",
    "value": "user@example.com"
  }
}
```

#### `browser_screenshot`

Take a screenshot.

```json
{
  "name": "browser_screenshot",
  "arguments": {}
}
```

#### `browser_content`

Get page content.

```json
{
  "name": "browser_content",
  "arguments": {}
}
```

### Terminal Tools

#### `terminal_run`

Execute a shell command.

```json
{
  "name": "terminal_run",
  "arguments": {
    "command": "ls -la"
  }
}
```

### Desktop Tools

#### `desktop_click`

Click at screen coordinates.

```json
{
  "name": "desktop_click",
  "arguments": {
    "x": 100,
    "y": 200
  }
}
```

#### `desktop_type`

Type text.

```json
{
  "name": "desktop_type",
  "arguments": {
    "text": "Hello World"
  }
}
```

### Filesystem Tools

#### `filesystem_read`

Read a file.

```json
{
  "name": "filesystem_read",
  "arguments": {
    "path": "./file.txt"
  }
}
```

#### `filesystem_write`

Write to a file.

```json
{
  "name": "filesystem_write",
  "arguments": {
    "path": "./file.txt",
    "content": "New content"
  }
}
```

#### `filesystem_list`

List directory contents.

```json
{
  "name": "filesystem_list",
  "arguments": {
    "path": "./src"
  }
}
```

### Observation Tools

#### `observe_screen`

Capture current screen state.

```json
{
  "name": "observe_screen",
  "arguments": {}
}
```

#### `detect_elements`

Detect UI elements on screen.

```json
{
  "name": "detect_elements",
  "arguments": {
    "types": ["button", "input"]
  }
}
```

### Verification Tools

#### `verify_condition`

Verify an expected condition.

```json
{
  "name": "verify_condition",
  "arguments": {
    "condition": "element_visible",
    "selector": "#submit"
  }
}
```

## Resources

The MCP server also exposes resources:

### `scr://session/current`

Current session state.

### `scr://audit/recent`

Recent audit log entries.

### `scr://config/active`

Active configuration.

## Prompts

Pre-defined prompts for common tasks:

### `browser_automation`

Helps structure browser automation tasks.

### `research_workflow`

Multi-step research workflow template.

## Security

### Permission Configuration

Configure allowed tools in MCP config:

```json
{
  "mcpServers": {
    "scr": {
      "command": "scr",
      "args": ["mcp", "serve", "--permissions", "limited"]
    }
  }
}
```

Permission levels:

- `full` — All tools available
- `limited` — Read-only tools
- `minimal` — Observation only

### Confirmation Mode

Require confirmation for dangerous operations:

```json
{
  "mcpServers": {
    "scr": {
      "command": "scr",
      "args": ["mcp", "serve", "--confirm", "dangerous"]
    }
  }
}
```

## Programmatic Usage

### Create MCP Server

```typescript
import { createMCPServer } from '@scr/runtime/mcp';

const server = createMCPServer({
  name: 'my-scr-server',
  version: '1.0.0',
});

// Add custom tools
server.addTool({
  name: 'custom_action',
  description: 'Custom action description',
  handler: async (args) => {
    // Custom logic
    return { result: 'success' };
  },
});

// Start server
await server.start();
```

### Custom Tool Registration

```typescript
server.addTool({
  name: 'my_custom_tool',
  description: 'Does something useful',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string' },
    },
    required: ['param1'],
  },
  handler: async (args) => {
    const runtime = server.getRuntime();
    await runtime.browser.goto(args.param1);
    return { success: true };
  },
});
```

## Debugging

### Enable Debug Logging

```bash
scr mcp serve --debug
```

### Test Connection

```bash
scr mcp test
```

### View Available Tools

```bash
scr mcp tools
```

## Best Practices

### Use Descriptive Names

Name your MCP server instance:

```json
{
  "mcpServers": {
    "scr-browser-automation": {
      "command": "scr",
      "args": ["mcp", "serve", "--name", "browser-bot"]
    }
  }
}
```

### Limit Scope

Only enable needed tools:

```bash
scr mcp serve --tools browser.*,filesystem.read.*
```

### Monitor Usage

Enable audit logging:

```bash
scr mcp serve --audit ./logs
```

## Troubleshooting

### Connection Issues

Check that:
1. `scr` is in PATH
2. Node.js >= 22 is installed
3. No firewall blocking stdio

### Tool Not Found

Verify tool name matches exactly. List available tools:

```bash
scr mcp tools
```

### Permission Denied

Check filesystem permissions for paths being accessed.

## Next Steps

- **[SDK Guide](./sdk.md)** — TypeScript SDK
- **[CLI Reference](./cli.md)** — Command-line tools
- **[Security](./security.md)** — Security best practices
- **[Integrations](./integrations.md)** — Framework integrations
