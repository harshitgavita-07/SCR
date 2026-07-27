# CLI Reference

Command-line interface for SCR Runtime.

## Installation

```bash
pnpm add -g @scr-runtime/runtime
```

Verify installation:

```bash
scr --version
```

## Commands

### `scr version`

Show version information.

```bash
scr version
# Output: scr-runtime v0.1.0
```

### `scr doctor`

Check installation and configuration.

```bash
scr doctor
```

Checks:
- Node.js version
- Package installation
- Playwright browsers
- Permissions
- Configuration files

### `scr browser open [url]`

Open a browser for inspection.

```bash
# Open default URL
scr browser open

# Open specific URL
scr browser open https://example.com

# With options
scr browser open --headless --viewport 1920x1080
```

Options:
- `--headless` — Run in headless mode
- `--viewport <size>` — Set viewport (e.g., 1920x1080)
- `--browser <name>` — chromium, firefox, webkit

### `scr terminal run <command>`

Execute a shell command.

```bash
scr terminal run "ls -la"
scr terminal run "npm install" --cwd ./project
scr terminal run "git status" --timeout 30000
```

Options:
- `--cwd <path>` — Working directory
- `--timeout <ms>` — Timeout in milliseconds
- `--shell <path>` — Shell to use

### `scr observe`

Capture screen observation.

```bash
# Full observation
scr observe

# Save screenshot
scr observe --output screenshot.png

# Specific region
scr observe --region 100,100,500,400
```

Options:
- `--output <path>` — Save screenshot to file
- `--region <x,y,w,h>` — Observe specific region
- `--format <type>` — png or jpeg
- `--elements` — Include detected elements

### `scr screenshot`

Take a screenshot.

```bash
scr screenshot
scr screenshot --output capture.png
scr screenshot --selector "#main-content"
```

Options:
- `--output <path>` — Output file path
- `--selector <css>` — Screenshot specific element
- `--full-page` — Full page screenshot
- `--quality <0-100>` — Image quality

### `scr verify <expression>`

Verify a condition.

```bash
scr verify "element.visible('#submit')"
scr verify "text.contains('Welcome')"
scr verify "url.matches('/dashboard')"
```

Options:
- `--timeout <ms>` — Verification timeout
- `--interval <ms>` — Check interval

### `scr mcp serve`

Start MCP server.

```bash
scr mcp serve
scr mcp serve --port 3000
scr mcp serve --permissions limited
```

Options:
- `--port <number>` — Server port
- `--permissions <level>` — full, limited, minimal
- `--confirm <mode>` — always, dangerous-only, never
- `--debug` — Enable debug logging

### `scr mcp tools`

List available MCP tools.

```bash
scr mcp tools
scr mcp tools --format json
```

### `scr mcp test`

Test MCP connection.

```bash
scr mcp test
```

### `scr session list`

List active sessions.

```bash
scr session list
```

### `scr session create`

Create a new session.

```bash
scr session create --id my-session
scr session create --ttl 3600
```

Options:
- `--id <string>` — Session ID
- `--ttl <seconds>` — Time to live

### `scr session end <id>`

End a session.

```bash
scr session end my-session
```

### `scr audit export`

Export audit log.

```bash
scr audit export
scr audit export --output audit.json
scr audit export --from 2024-01-01 --to 2024-01-31
```

Options:
- `--output <path>` — Output file
- `--from <date>` — Start date
- `--to <date>` — End date
- `--format <type>` — json, csv

### `scr config show`

Show current configuration.

```bash
scr config show
scr config show --verbose
```

### `scr config init`

Initialize configuration file.

```bash
scr config init
scr config init --force
```

## Global Options

These options work with all commands:

- `--help, -h` — Show help
- `--version, -v` — Show version
- `--config <path>` — Config file path
- `--verbose, -V` — Verbose output
- `--quiet, -q` — Suppress output
- `--debug` — Debug mode

## Examples

### Browser Automation Workflow

```bash
# Open browser
scr browser open https://example.com

# Take screenshot
scr screenshot --output before.png

# Verify page loaded
scr verify "url.matches('example.com')"

# Observe state
scr observe --elements --output observation.json
```

### Terminal Scripting

```bash
# Run multiple commands
scr terminal run "git pull"
scr terminal run "npm install"
scr terminal run "npm run build"

# With working directory
scr terminal run "pytest" --cwd ./tests
```

### Audit Trail

```bash
# Export audit log
scr audit export --output weekly-audit.json

# View recent actions
scr audit export --from today --format json | jq '.[]'
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | Permission denied |
| 4 | Resource not found |
| 5 | Timeout |

## Environment Variables

- `SCR_CONFIG` — Path to config file
- `SCR_DEBUG` — Enable debug mode
- `SCR_LOG_LEVEL` — Logging level (debug, info, warn, error)
- `SCR_AUDIT_PATH` — Audit log directory

## Configuration File

Default locations:
- `./scr.config.json`
- `~/.scr/config.json`
- `/etc/scr/config.json`

Example config:

```json
{
  "appName": "my-scr-app",
  "debug": false,
  "permissions": {
    "browser": ["*"],
    "terminal": ["read-only"]
  },
  "sandbox": {
    "enabled": true
  },
  "audit": {
    "enabled": true,
    "path": "./logs"
  }
}
```

## Scripting

Use in shell scripts:

```bash
#!/bin/bash

set -e

# Check installation
scr doctor

# Run automation
scr browser open https://example.com
scr verify "element.visible('#login')"
scr screenshot --output login-page.png

echo "Automation complete"
```

## Integration with CI/CD

### GitHub Actions

```yaml
- name: Install SCR
  run: pnpm add -g @scr-runtime/runtime

- name: Run browser tests
  run: |
    scr browser open --headless
    scr verify "element.visible('#app')"
```

## Troubleshooting

### Command Not Found

Ensure global installation:

```bash
pnpm add -g @scr-runtime/runtime
```

### Permission Errors

Check filesystem permissions:

```bash
chmod +x $(which scr)
```

### Browser Issues

Install Playwright browsers:

```bash
npx playwright install
```

## Next Steps

- **[SDK Guide](./sdk.md)** — TypeScript SDK
- **[MCP Server](./mcp.md)** — Model Context Protocol
- **[Security](./security.md)** — Security best practices
- **[FAQ](./faq.md)** — Common questions
