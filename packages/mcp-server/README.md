# @scr/mcp-server

MCP Server for SCR Runtime - Exposes SCR capabilities through the Model Context Protocol.

## Installation

```bash
pnpm add @scr/mcp-server
```

## Usage

### As a standalone server

```bash
npx scr-mcp-server
```

### Configure in Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "scr": {
      "command": "npx",
      "args": ["scr-mcp-server"]
    }
  }
}
```

### Configure in Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "scr": {
      "command": "npx",
      "args": ["scr-mcp-server"]
    }
  }
}
```

## Available Tools

### Browser Tools

- `browser_goto` - Navigate to a URL
- `browser_click` - Click an element by CSS selector
- `browser_fill` - Fill a form field
- `browser_screenshot` - Capture page screenshot
- `browser_content` - Get HTML content
- `browser_title` - Get page title

### Desktop Tools

- `desktop_click` - Click at coordinates
- `desktop_type` - Type text

### Terminal Tools

- `terminal_run` - Execute a command

### Filesystem Tools

- `filesystem_read` - Read a file
- `filesystem_write` - Write to a file

### Observation Tools

- `observe` - Observe current screen state

### Verification Tools

- `verify` - Verify a condition

## Development

```bash
cd packages/mcp-server
pnpm install
pnpm build
pnpm start
```

## License

MIT
