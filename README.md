# SCR Runtime

> **A production-grade runtime that lets AI agents safely observe and control graphical applications.**

[![npm version](https://img.shields.io/npm/v/@scr-runtime/runtime.svg)](https://www.npmjs.com/package/@scr-runtime/runtime)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-green.svg)](https://nodejs.org)

---

## What is SCR Runtime?

**SCR Runtime is the execution layer for AI.**

Large Language Models can reason. SCR Runtime allows them to *interact* with real computers.

- **Browsers** — Navigate, click, fill forms, extract data
- **Desktop Applications** — Control native apps on Windows, macOS, Linux
- **Terminal** — Execute commands, parse output, manage processes
- **Mobile Devices** — Interact with iOS and Android applications
- **Filesystem** — Read, write, watch files safely
- **Vision** — Observe screens, detect UI elements, verify state

SCR Runtime **executes**. It never plans. It never reasons. It never owns business logic.

It is the runtime between AI and the operating system.

---

## Why SCR Exists

| Before SCR | With SCR |
|------------|----------|
| Every agent framework reinvents screen control | One production-grade runtime |
| Fragile, inconsistent automation APIs | Unified, type-safe interface |
| No verification or safety guarantees | Built-in verification & audit trails |
| Tightly coupled to specific LLM providers | Provider-agnostic execution layer |

Think of SCR Runtime like:

- **Docker** for containers — SCR is for AI-agent-computer interaction
- **Playwright** for testing — SCR is for autonomous agent execution
- **Git** for code — SCR is for agent actions

---

## Features

### 🎯 Core Capabilities

- **Browser Automation** — Chromium, Firefox, WebKit via Playwright
- **Desktop Control** — Native OS accessibility APIs
- **Terminal Execution** — Safe command execution with output capture
- **Filesystem Access** — Sandboxed file operations
- **Screen Observation** — Screenshot, element detection, OCR
- **State Verification** — Assert expected states before/after actions

### 🔒 Production Ready

- **Type Safety** — Full TypeScript support with strict types
- **Event-Driven** — Reactive event system for all state changes
- **Audit Logging** — Complete action history for debugging
- **Permission Model** — Fine-grained access control
- **Sandboxing** — Isolated execution environments
- **Verification** — Pre/post-condition checks on all actions

### 🧩 Extensible

- **Plugin Architecture** — Add custom targets and actions
- **MCP Server** — Model Context Protocol integration
- **CLI Tools** — Debug, inspect, and control from terminal
- **SDK** — Clean, intentional public API

---

## Installation

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 9.0.0 (or npm/yarn)

### Install Package

```bash
pnpm add @scr-runtime/runtime
# or
npm install @scr-runtime/runtime
# or
yarn add @scr-runtime/runtime
```

### Install CLI (Optional)

```bash
pnpm add -g @scr-runtime/runtime
```

### Verify Installation

```bash
scr --version 

```

---

## Quick Start

### 1. Basic Setup

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime({
  appName: 'my-agent',
  debug: true,
});

await runtime.start();
```

### 2. Browser Control

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();

// Navigate and interact
await runtime.browser.goto('https://example.com');
await runtime.browser.click('#submit-button');
await runtime.browser.fill('#email', 'user@example.com');

// Capture state
const screenshot = await runtime.browser.screenshot();
const html = await runtime.browser.content();
```

### 3. Desktop Control

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();

// Click at coordinates
await runtime.desktop.click({ x: 100, y: 200 });

// Type text
await runtime.desktop.type('Hello, World!');

// Find window by title
const window = await runtime.desktop.findWindow('Calculator');
await runtime.desktop.focus(window);
```

### 4. Terminal Execution

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();

// Run command
const result = await runtime.terminal.run('ls -la');
console.log(result.stdout);
console.log(result.exitCode);
```

### 5. Observation & Verification

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();

// Observe current state
const observation = await runtime.observe();
console.log(observation.elements);
console.log(observation.screenshot);

// Verify expected state
await runtime.verify(async () => {
  const button = await runtime.browser.$('#submit');
  return button !== null && await button.isVisible();
});
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Agent / LLM                         │
│         (OpenAI Agents, LangGraph, CrewAI, AutoGen)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Plans / Instructions
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Integration Layer                        │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│    │   SDK    │  │   MCP    │  │   CLI    │  │  Custom  │  │
│    └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Execution Commands
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SCR Runtime Core                        │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Browser  │ │ Desktop  │ │ Terminal │ │ Filesystem   │  │
│  │  Engine   │ │  Engine  │ │  Engine  │ │   Engine     │  │
│  └───────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Observer  │ │ Verifier │ │ Sessions │ │   Memory     │  │
│  └───────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Event Bus & Audit Logger                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ System Calls / APIs
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Operating System Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Chrome  │ │  Native  │ │   Shell  │ │     FS       │  │
│  │  Firefox │ │   Apps   │ │  Bash/Zsh│ │   Storage    │  │
│  │  WebKit  │ │  Windows │ │  PowerShell               │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Runtime Concepts

### Sessions

Every interaction happens within a **Session**. Sessions isolate state, track actions, and enable replay.

```typescript
const session = runtime.createSession({
  id: 'my-session',
  ttl: 3600, // 1 hour
});

await session.start();
// ... perform actions
await session.end();
```

### Actions

Actions are atomic operations. Each action is:

- **Logged** — Recorded in audit trail
- **Verified** — Pre/post conditions checked
- **Reversible** — Can be undone (where applicable)

```typescript
// Action types
await runtime.browser.click(selector);
await runtime.browser.fill(selector, text);
await runtime.desktop.moveMouse(x, y);
await runtime.terminal.run(command);
await runtime.filesystem.read(path);
```

### Observations

Observations capture the current state without modifying it.

```typescript
const observation = await runtime.observe();

// Observation includes:
observation.screenshot;      // Buffer
observation.elements;        // Detected UI elements
observation.text;            // Extracted text (OCR)
observation.activeWindow;    // Focused application
observation.cursorPosition;  // Mouse location
```

### Verification

Verification ensures expected conditions before proceeding.

```typescript
// Simple verification
await runtime.verify(() => 
  runtime.browser.$('#submit').isVisible()
);

// Complex verification with timeout
await runtime.verify(
  async () => {
    const status = await runtime.browser.text('.status');
    return status === 'Complete';
  },
  { timeout: 5000, interval: 500 }
);
```

---

## Examples

See the [`examples/`](./examples/) directory for complete, runnable examples:

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

---

## Integrations

SCR Runtime integrates with popular AI agent frameworks:

### OpenAI Agents SDK

```typescript
import { Agent } from '@openai/agents';
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();
const agent = new Agent({
  tools: [
    runtime.browser.toTool(),
    runtime.terminal.toTool(),
  ],
});
```

### LangGraph

```typescript
import { StateGraph } from '@langchain/langgraph';
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();

const graph = new StateGraph({ /* ... */ });
graph.addNode('execute', async (state) => {
  await runtime.browser.goto(state.url);
  return { result: await runtime.observe() };
});
```

### CrewAI

```typescript
from crewai import Agent, Task
from scr_runtime import ScrToolkit

scr = ScrToolkit()
agent = Agent(
  role='Browser Operator',
  tools=scr.get_tools(),
  goal='Navigate websites and extract information'
)
```

### MCP Clients

SCR Runtime exposes a full MCP server. Connect from Claude Desktop, Cursor, or any MCP client:

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

See [Integrations Guide](./docs/sdk.md) for detailed setup.

---

## CLI Reference

The SCR CLI provides debugging and control utilities:

```bash
# Check installation
scr doctor

# Show version
scr version

# Open browser for inspection
scr browser open https://example.com

# Run terminal command
scr terminal run "ls -la"

# Capture observation
scr observe --output screenshot.png

# Take screenshot
scr screenshot --selector "#main"

# Verify condition
scr verify --expression "element.visible('#submit')"
```

---

## Security

SCR Runtime executes code on your machine. Security is paramount.

### Permission Model

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

### Dangerous Operations

Operations marked as dangerous require explicit confirmation:

- `terminal.run()` — Command execution
- `filesystem.write()` — File modification
- `desktop.click()` — System-wide control

Enable confirmation mode:

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

Run in isolated environments:

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

All actions are logged:

```typescript
runtime.on('action', (event) => {
  console.log(`[${event.timestamp}] ${event.type}: ${JSON.stringify(event.payload)}`);
});

// Export audit log
const log = await runtime.exportAuditLog();
await fs.writeFile('audit.json', log);
```

See [Security Guide](./docs/security.md) for comprehensive documentation.

---

## Roadmap

### v0.1 (Current)

- ✅ Browser automation (Chromium)
- ✅ Basic desktop observation
- ✅ Terminal execution
- ✅ Filesystem access
- ✅ Event system
- ✅ TypeScript SDK

### v0.2

- [ ] Full desktop control (Windows, macOS, Linux)
- [ ] Mobile device support (iOS, Android)
- [ ] Advanced vision (OCR, element detection)
- [ ] MCP server
- [ ] CLI improvements

### v0.3

- [ ] Action replay & time-travel debugging
- [ ] Parallel session support
- [ ] Distributed execution
- [ ] Performance profiling

### v1.0

- [ ] Stable API
- [ ] Production hardening
- [ ] Comprehensive test suite
- [ ] Enterprise features (SSO, RBAC)

See [ROADMAP.md](./ROADMAP.md) for details.

---

## Contributing

We welcome contributions! See our guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
git clone https://github.com/harshitgavita-07/SCR.git
cd runtime
pnpm install
pnpm build
pnpm test
```

### Guidelines

- Follow existing code conventions
- Add tests for new features
- Update documentation
- No breaking changes without deprecation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full details.

---

## FAQ

**Q: Is SCR Runtime an agent framework?**

A: No. SCR Runtime is the *execution layer*. Agent frameworks (LangGraph, CrewAI, etc.) handle planning and reasoning. SCR executes their instructions.

**Q: Can SCR Runtime run headlessly?**

A: Yes. All browser automation supports headless mode. Desktop and terminal features require an active session.

**Q: Is SCR Runtime safe to use?**

A: SCR Runtime includes permission controls, confirmation modes, and sandboxing. However, it executes code on your machine. Use caution with untrusted agents.

**Q: What browsers are supported?**

A: Chromium, Firefox, and WebKit via Playwright backend.

**Q: Does SCR Runtime work with any LLM?**

A: Yes. SCR Runtime is provider-agnostic. Integrate via SDK, MCP, or CLI.

See [FAQ.md](./docs/faq.md) for more questions.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

SCR Runtime builds on incredible open-source projects:

- [Playwright](https://playwright.dev) — Browser automation
- [Model Context Protocol](https://modelcontextprotocol.io) — AI tool integration
- [pino](https://getpino.io) — Fast logging

Inspired by the maintainers of Docker, FastAPI, LangGraph, uv, and Bun.

---

<div align="center">

**SCR Runtime** — The execution layer for AI.

[Documentation](./docs/) • [Examples](./examples/) • [Discussions](https://github.com/harshitgavita-07/SCR/discussions) • [Issues](https://github.com/harshitgavita-07/SCR/issues)

</div>
