# SCR Runtime Architecture

Understand how SCR Runtime is designed and where it fits in your stack.

## Core Philosophy

**SCR Runtime executes. It never plans. It never reasons. It never owns business logic.**

SCR Runtime is the execution layer between AI agents and the operating system. Think of it like:

- **Docker** for containers — SCR is for AI-agent-computer interaction
- **Playwright** for testing — SCR is for autonomous agent execution
- **Git** for code — SCR is for agent actions

## System Overview

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

## Layers Explained

### 1. AI Agent Layer (External)

This is where planning and reasoning happen. Examples:

- OpenAI Agents SDK
- LangGraph workflows
- CrewAI agents
- AutoGen conversations
- Custom LLM applications

**SCR does not live here.** SCR provides tools/capabilities to this layer.

### 2. Integration Layer

How agents connect to SCR Runtime:

| Interface | Use Case |
|-----------|----------|
| **SDK** | Programmatic access from TypeScript/JavaScript |
| **MCP Server** | Standard protocol for AI tool integration |
| **CLI** | Debugging, scripting, ad-hoc operations |
| **Custom** | Build your own adapter |

### 3. SCR Runtime Core

The heart of SCR Runtime. Contains:

#### Execution Engines

- **Browser Engine** — Chromium, Firefox, WebKit via Playwright
- **Desktop Engine** — Native OS accessibility APIs
- **Terminal Engine** — Safe command execution
- **Filesystem Engine** — Sandboxed file operations

#### Supporting Modules

- **Observer** — Screen capture, element detection, OCR
- **Verifier** — Pre/post-condition checking
- **Sessions** — Isolated execution contexts
- **Memory** — State persistence across actions

#### Infrastructure

- **Event Bus** — Reactive event system
- **Audit Logger** — Complete action history
- **Permission Manager** — Access control

### 4. Operating System Layer

Where actual execution happens:

- Browsers (Chrome, Firefox, Safari)
- Native applications (via OS APIs)
- Shell environments (bash, zsh, PowerShell)
- Filesystem storage

## Module Dependencies

```
@scr-runtime/runtime (main export)
├── @scr/contracts (types and interfaces)
├── @scr-runtime/runtime/core (runtime implementation)
├── @scr/engine (execution engines)
├── @scr/observer (screen observation)
├── @scr/verifier (state verification)
├── @scr/sessions (session management)
├── @scr/memory (state persistence)
├── @scr/actions (action implementations)
├── @scr/registry (component registry)
├── @scr/targets/* (target-specific implementations)
│   └── chromium (Playwright-based browser)
├── @scr/sdk (public API surface)
├── @scr/cli (command-line interface)
└── @scr/events (event system)
```

## Data Flow

### Typical Action Flow

```
1. Agent decides to "click submit button"
         │
         ▼
2. SDK receives: runtime.browser.click('#submit')
         │
         ▼
3. Runtime validates permissions
         │
         ▼
4. Session logs action start
         │
         ▼
5. Browser engine executes click via Playwright
         │
         ▼
6. Verifier checks post-condition (e.g., form submitted)
         │
         ▼
7. Event emitted: action.completed
         │
         ▼
8. Result returned to agent
```

### Observation Flow

```
1. Agent requests: runtime.observe()
         │
         ▼
2. Observer captures screenshot
         │
         ▼
3. Element detection runs (optional)
         │
         ▼
4. OCR extracts text (optional)
         │
         ▼
5. Observation object constructed
         │
         ▼
6. Result returned to agent
```

## Key Design Decisions

### Composition Over Inheritance

SCR Runtime uses composition to build capabilities:

```typescript
// Each capability is independent
const runtime = {
  browser: new BrowserEngine(),
  desktop: new DesktopEngine(),
  terminal: new TerminalEngine(),
  observer: new Observer(),
  verifier: new Verifier(),
};
```

### Event-Driven Architecture

All state changes emit events:

```typescript
runtime.on('action.started', (event) => {
  console.log(`Starting: ${event.action}`);
});

runtime.on('action.completed', (event) => {
  console.log(`Completed: ${event.action}`);
});

runtime.on('verification.failed', (event) => {
  console.error(`Verification failed: ${event.reason}`);
});
```

### Session Isolation

Each session maintains isolated state:

```typescript
const session1 = runtime.createSession({ id: 'user-1' });
const session2 = runtime.createSession({ id: 'user-2' });

// Actions in session1 don't affect session2
await session1.browser.goto('https://example.com');
await session2.browser.goto('https://other.com');
```

### Verification by Default

Actions can include pre/post conditions:

```typescript
await runtime.browser.click('#submit', {
  verify: async () => {
    const status = await runtime.browser.text('.status');
    return status === 'Submitted';
  },
  timeout: 5000,
});
```

## Extension Points

### Custom Targets

Implement a new target:

```typescript
import { Target } from '@scr-runtime/runtime';

class CustomTarget implements Target {
  async initialize(): Promise<void> { /* ... */ }
  async execute(action: Action): Promise<Result> { /* ... */ }
  async observe(): Promise<Observation> { /* ... */ }
}
```

### Custom Actions

Define new action types:

```typescript
interface CustomAction extends Action {
  type: 'custom:my-action';
  payload: { /* ... */ };
}
```

### Custom Verifiers

Add verification logic:

```typescript
runtime.verifier.register('my-check', async (context) => {
  // Custom verification logic
  return true;
});
```

## Performance Considerations

### Concurrency

- Sessions run concurrently but are isolated
- Browser contexts can be parallelized
- Desktop and terminal are single-threaded (OS limitation)

### Resource Management

- Always call `runtime.stop()` or use `try/finally`
- Browser contexts consume memory — close when done
- Screenshots are buffers — stream for large images

### Caching

- Observer caches element locations
- Memory module caches frequently accessed state
- Configure TTL for cache entries

## Security Boundaries

```
┌─────────────────────────────────────┐
│          Untrusted Agent            │
├─────────────────────────────────────┤
│      Permission Gate (SDK)          │
├─────────────────────────────────────┤
│      Confirmation Mode (Optional)   │
├─────────────────────────────────────┤
│      Sandbox Boundary               │
├─────────────────────────────────────┤
│        SCR Runtime Core             │
├─────────────────────────────────────┤
│         Operating System            │
└─────────────────────────────────────┘
```

See [Security](./security.md) for detailed security documentation.

## Next Steps

- **[Runtime API](./runtime.md)** — Detailed API reference
- **[SDK Guide](./sdk.md)** — Using the TypeScript SDK
- **[CLI Reference](./cli.md)** — Command-line tools
- **[MCP Integration](./mcp.md)** — Model Context Protocol server
