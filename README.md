# Screen Control Runtime (SCR)

A production-grade runtime that enables AI agents to safely observe and control graphical applications.

## Overview

SCR is infrastructure for autonomous AI agents. It provides a robust, extensible runtime for screen observation, action execution, and state management.

## Features

- **Type-Safe**: Full TypeScript support with strict type checking
- **Modular Architecture**: Composable modules with clear separation of concerns
- **Event-Driven**: Reactive event system for state changes and actions
- **Production Ready**: Comprehensive error handling, logging, and testing
- **Extensible**: Plugin-based architecture for custom targets and actions

## Installation

```bash
pnpm add @scr/runtime
```

## Quick Start

```typescript
import { SCR } from '@scr/runtime';

const scr = new SCR({
  target: 'chromium',
  session: {
    id: 'my-session',
  },
});

await scr.start();
```

## Project Structure

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
├── registry/       # Component registry
├── targets/        # Target implementations
│   └── chromium/   # Chromium browser target
├── sdk/            # Public SDK
├── cli/            # Command-line interface
├── events/         # Event system
└── utils/          # Utility functions
```

## Development

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 9.0.0

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
```

### Format

```bash
pnpm format
```

### Documentation

```bash
pnpm docs
```

## License

MIT
