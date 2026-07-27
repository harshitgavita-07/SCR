# Frequently Asked Questions

Common questions about SCR Runtime.

## General

### What is SCR Runtime?

SCR Runtime is a production-grade execution layer for AI agents. It allows AI systems to safely observe and control graphical applications including browsers, desktop apps, terminals, and mobile devices.

### Is SCR Runtime an agent framework?

**No.** SCR Runtime is the *execution layer*, not an agent framework. It does not:

- Plan actions
- Make decisions
- Store memory
- Manage workflows

Agent frameworks like LangGraph, CrewAI, or AutoGen handle planning and reasoning. SCR Runtime executes their instructions.

### Who should use SCR Runtime?

- **AI developers** building autonomous agents
- **Test engineers** needing browser/desktop automation
- **RPA teams** automating business processes
- **Researchers** studying human-computer interaction

### What platforms are supported?

- **Operating Systems**: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+)
- **Node.js**: Version 22 or higher
- **Browsers**: Chromium, Firefox, WebKit

## Installation

### How do I install SCR Runtime?

```bash
pnpm add @scr-runtime/runtime
# or
npm install @scr-runtime/runtime
# or
yarn add @scr-runtime/runtime
```

### Do I need to install Playwright separately?

Playwright is a dependency. Browsers are installed automatically on first use, or you can pre-install:

```bash
npx playwright install
```

### Can I use SCR Runtime without Node.js?

Currently, SCR Runtime requires Node.js. Python bindings are planned for a future release.

## Usage

### How do I get started?

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();
await runtime.start();

await runtime.browser.goto('https://example.com');
await runtime.browser.click('#button');

await runtime.stop();
```

See [Getting Started](./getting-started.md) for a complete guide.

### Can SCR Runtime run headlessly?

Yes. Browser automation fully supports headless mode:

```typescript
const runtime = new Runtime({
  browser: {
    launchOptions: { headless: true },
  },
});
```

Desktop and terminal features require an active session.

### Does SCR Runtime work with any LLM?

Yes. SCR Runtime is provider-agnostic. Connect via:

- **SDK** — Direct TypeScript/JavaScript integration
- **MCP** — Model Context Protocol for Claude, etc.
- **CLI** — Shell-based integration

### How do I integrate with LangGraph?

```typescript
import { StateGraph } from '@langchain/langgraph';
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();

const graph = new StateGraph({ /* ... */ });
graph.addNode('browse', async (state) => {
  await runtime.browser.goto(state.url);
  return { content: await runtime.observe() };
});
```

See [Integrations](./integrations.md) for more examples.

## Security

### Is SCR Runtime safe to use?

SCR Runtime includes security features:

- Permission controls
- Confirmation modes
- Sandboxing
- Audit logging

However, it executes code on your machine. Use caution with untrusted agents.

### How do I restrict what SCR can do?

Use permissions:

```typescript
const runtime = new Runtime({
  permissions: {
    browser: ['navigate', 'observe'], // No clicks
    terminal: ['read-only'], // No execution
    filesystem: {
      allow: ['./data/*'],
      deny: ['/**'],
    },
  },
});
```

See [Security Guide](./security.md) for details.

### Can SCR Runtime access my files?

Only within configured permissions. By default, access is restricted to the current directory. Configure explicit paths for broader access.

### Does SCR Runtime send data externally?

No. SCR Runtime runs locally. No telemetry or external communication unless explicitly configured (e.g., proxy settings).

## Capabilities

### What browsers does SCR Runtime support?

All Playwright-supported browsers:

- Chromium (Chrome, Edge, Brave)
- Firefox
- WebKit (Safari)

### Can SCR Runtime control mobile devices?

Mobile support is planned for v0.2. Currently supports:

- iOS Simulator (macOS)
- Android Emulator

Physical device support coming soon.

### Does SCR Runtime support OCR?

Yes. Built-in OCR extracts text from screenshots:

```typescript
const text = await runtime.observer.ocr();
```

### Can SCR Runtime detect UI elements?

Yes. Element detection identifies buttons, inputs, links, and more:

```typescript
const elements = await runtime.observer.detectElements();
```

## Troubleshooting

### "Cannot find module '@scr-runtime/runtime'"

Ensure installation:

```bash
pnpm install
```

Check `node_modules` exists.

### "Playwright browsers not found"

Install browsers:

```bash
npx playwright install
```

### "Permission denied" on desktop operations

**macOS**: Grant accessibility permission in System Preferences → Security & Privacy → Privacy → Accessibility.

**Windows**: Run as administrator if needed.

**Linux**: Ensure AT-SPI is running.

### Browser automation is slow

Try:

1. Use headless mode
2. Reduce screenshot quality
3. Increase network timeout
4. Check system resources

### Elements not found

Selectors may be wrong or timing issues:

```typescript
// Wait for element
await runtime.browser.waitForSelector('#target');

// Verify it exists
const element = await runtime.browser.$('#target');
if (!element) {
  console.log('Element not found');
}
```

## Performance

### How fast is SCR Runtime?

Typical latencies:

- Browser click: ~50-200ms
- Screenshot: ~100-500ms
- Terminal command: varies by command
- OCR: ~500-2000ms

### Can SCR Runtime run multiple sessions?

Yes. Sessions are isolated:

```typescript
const session1 = runtime.createSession({ id: 's1' });
const session2 = runtime.createSession({ id: 's2' });
```

Resource limits apply. See configuration options.

### How much memory does SCR Runtime use?

Base runtime: ~50MB
Per browser context: ~100-200MB
Per session: ~10-50MB

Configure limits:

```typescript
const runtime = new Runtime({
  limits: {
    maxConcurrentSessions: 5,
  },
});
```

## Development

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

Quick start:

```bash
git clone https://github.com/harshitgavita-07/SCR.git
cd runtime
pnpm install
pnpm build
pnpm test
```

### Where's the source code?

Available at: https://github.com/harshitgavita-07/SCR

### How do I report bugs?

Open an issue: https://github.com/harshitgavita-07/SCR/issues

Include:
- SCR Runtime version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior

### Is there a changelog?

See [CHANGELOG.md](../CHANGELOG.md) for version history.

## Licensing

### What license is SCR Runtime under?

MIT License. Free for personal and commercial use.

### Can I use SCR Runtime commercially?

Yes. MIT license permits commercial use.

### Do I need to open-source my project?

No. You can use SCR Runtime in proprietary software.

## Roadmap

### What's coming next?

**v0.2** (Next):
- Full desktop control
- Mobile device support
- Advanced vision (OCR improvements)
- MCP server enhancements

**v0.3**:
- Action replay / time-travel debugging
- Parallel sessions
- Distributed execution

**v1.0**:
- Stable API
- Production hardening
- Enterprise features

See [ROADMAP.md](../ROADMAP.md) for details.

### How can I request features?

Open a discussion: https://github.com/harshitgavita-07/SCR/discussions

## Support

### Where can I get help?

- **Documentation**: This docs folder
- **Discussions**: https://github.com/harshitgavita-07/SCR/discussions
- **Issues**: https://github.com/harshitgavita-07/SCR/issues
- **Email**: maintainers@scr.dev (for enterprise)

### Is there a community?

Join our GitHub Discussions for community support and feature requests.

### Do you offer enterprise support?

Yes. Contact maintainers@scr.dev for enterprise support options.

## Next Steps

- **[Getting Started](./getting-started.md)** — Quick start guide
- **[Architecture](./architecture.md)** — How SCR works
- **[Security](./security.md)** — Security best practices
- **[Examples](../examples/)** — Code examples
