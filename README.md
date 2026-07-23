<div align="center">

# 🖥️ Screen Control Runtime (SCR)

**A production-grade runtime that lets AI agents safely observe and control graphical applications.**

[![npm version](https://img.shields.io/npm/v/@scr-runtime/runtime.svg?style=flat-square)](https://www.npmjs.com/package/@scr-runtime/runtime)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-f69220.svg?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Built with Playwright](https://img.shields.io/badge/built%20with-Playwright-2EAD33.svg?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

[Quick Start](#-quick-start) • [Architecture](#-architecture) • [Project Structure](#-project-structure) • [Development](#-development) • [Contributing](#-contributing)

</div>

---

## Overview

**SCR** is infrastructure for autonomous AI agents. It turns natural-language or programmatic instructions into **verified, replayable action sequences** on real graphical interfaces — browser today, desktop and mobile next.

It's built to be the shared execution layer underneath any agent or client: Claude, ChatGPT, Codex, Folk, or your own MCP-based agent — not tied to a single model or product.

## ✨ Features

| | |
|---|---|
| 🔒 **Type-Safe** | Full TypeScript support with strict type checking end to end |
| 🧩 **Modular Architecture** | Composable modules with clear separation of concerns (planner, engine, observer, verifier) |
| ⚡ **Event-Driven** | Reactive event system for state changes and executed actions |
| 🛡️ **Production Ready** | Comprehensive error handling, structured logging, and test coverage |
| 🔌 **Extensible** | Plugin-based architecture for custom targets and custom actions |
| 🌐 **Cross-Platform** | Chromium today; Android, Desktop, iOS Simulator, and Cloud VM backends on the roadmap |

## 📦 Installation

```bash
pnpm add @scr-runtime/runtime
```

<details>
<summary>Using npm or yarn instead</summary>

```bash
npm install @scr-runtime/runtime
# or
yarn add @scr-runtime/runtime
```

</details>

## 🚀 Quick Start

```typescript
import { SCR } from '@scr-runtime/runtime';

const scr = new SCR({
  target: 'chromium',
  session: {
    id: 'my-session',
  },
});

await scr.start();
```

## 🏗️ Architecture

SCR turns an instruction into a verified action through a single pipeline:

```
Instruction ──▶ Planner ──▶ Execution Engine ──▶ Execution Backend ──▶ Observer ──▶ Verifier
                    ▲                                                                  │
                    └──────────────────────── feedback / retry ──────────────────────┘
```

- **Planner** — turns high-level instructions into a concrete, ordered action plan
- **Execution Engine** — runs the plan against a session, handling retries and errors
- **Execution Backend** — the target-specific driver (Chromium first, more coming)
- **Observer** — captures the resulting screen/DOM state
- **Verifier** — confirms the action had the intended effect before moving on

## 📁 Project Structure

```
src/
├── contracts/      # Type definitions and interfaces
├── runtime/        # Core runtime implementation
├── engine/         # Execution engine
├── planner/        # Action planning
├── observer/       # Screen observation
├── verifier/       # State verification
├── actions/        # Action implementations
├── sessions/       # Session management
├── memory/         # Memory and state persistence
├── registry/        # Component registry
├── targets/        # Target implementations
│   └── chromium/   # Chromium browser target
├── sdk/            # Public SDK
├── cli/            # Command-line interface
├── events/         # Event system
└── utils/          # Utility functions
```

## 🛠️ Development

### Prerequisites

- Node.js `>= 22.0.0`
- pnpm `>= 9.0.0`

### Setup

```bash
pnpm install
```

### Common commands

| Command | Description |
|---|---|
| `pnpm build` | Build the project |
| `pnpm test` | Run the test suite |
| `pnpm lint` | Lint the codebase |
| `pnpm format` | Format code with Prettier |
| `pnpm docs` | Generate documentation |

## 🗺️ Roadmap

- [x] Chromium execution backend
- [ ] Android backend
- [ ] Desktop backend
- [ ] Remote browser / desktop backend
- [ ] iOS Simulator backend
- [ ] Cloud VM scaling

## 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss any significant change before submitting a PR.

## 📄 License

Released under the [MIT License](./LICENSE).
