# Getting Started with SCR Runtime

Get up and running with SCR Runtime in under 10 minutes.

## Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 9.0.0 (or npm/yarn)
- **Playwright browsers** (auto-installed)

Verify your setup:

```bash
node --version  # Should be v22 or higher
pnpm --version  # Should be v9 or higher
```

## Installation

### Step 1: Install Package

```bash
pnpm add @scr/runtime
# or
npm install @scr/runtime
# or
yarn add @scr/runtime
```

### Step 2: Install CLI (Optional)

For command-line tools:

```bash
pnpm add -g @scr/runtime
```

### Step 3: Verify Installation

```bash
scr version
# Output: scr-runtime v0.1.0

scr doctor
# Checks installation, permissions, and dependencies
```

## Quick Start

### Create Your First Script

Create a file `agent.ts`:

```typescript
import { Runtime } from '@scr/runtime';

async function main() {
  // Initialize runtime
  const runtime = new Runtime({
    appName: 'my-first-agent',
    debug: true,
  });

  // Start the runtime
  await runtime.start();

  // Browser automation
  await runtime.browser.goto('https://example.com');
  const title = await runtime.browser.title();
  console.log(`Page title: ${title}`);

  // Take a screenshot
  const screenshot = await runtime.browser.screenshot();
  console.log(`Screenshot size: ${screenshot.length} bytes`);

  // Clean up
  await runtime.stop();
}

main().catch(console.error);
```

### Run Your Script

```bash
npx tsx agent.ts
# or
pnpm tsx agent.ts
```

## Next Steps

- **[Architecture](./architecture.md)** — Understand how SCR Runtime works
- **[Browser Automation](./browser.md)** — Control web browsers
- **[Desktop Control](./desktop.md)** — Interact with native applications
- **[Terminal Execution](./terminal.md)** — Run shell commands
- **[Vision & Observation](./vision.md)** — Observe screens and detect elements
- **[Verification](./verification.md)** — Assert expected states

## Examples

Explore complete examples in the [`examples/`](../examples/) directory:

| Example | Description |
|---------|-------------|
| `browser-agent/` | Web scraping and form automation |
| `desktop-agent/` | Native application control |
| `terminal-agent/` | Command-line task automation |
| `coding-agent/` | Code generation and file management |
| `research-agent/` | Multi-step research workflows |

Run an example:

```bash
cd examples/browser-agent
pnpm install
pnpm start
```

## Troubleshooting

### Common Issues

**"Cannot find module '@scr/runtime'"**

Ensure the package is installed:

```bash
pnpm install
```

**"Playwright browsers not found"**

Install Playwright browsers:

```bash
npx playwright install
```

**"Permission denied"**

Check filesystem permissions. SCR Runtime may need access to:

- Browser profiles
- Screenshot directories
- Configuration files

### Get Help

- [FAQ](./faq.md) — Frequently asked questions
- [Discussions](https://github.com/scr/runtime/discussions) — Community support
- [Issues](https://github.com/scr/runtime/issues) — Bug reports
