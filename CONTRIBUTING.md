# Contributing to SCR Runtime

Thank you for your interest in contributing to SCR Runtime! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 9.0.0
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/harshitgavita-07/SCR.git
cd runtime

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint
```

## Development Workflow

### Branch Naming

- `feature/description` — New features
- `fix/description` — Bug fixes
- `docs/description` — Documentation changes
- `refactor/description` — Code refactoring
- `test/description` — Test additions or modifications

### Commit Messages

We follow conventional commits:

```
feat: add browser screenshot capability
fix: resolve memory leak in session cleanup
docs: update installation instructions
refactor: simplify event emitter interface
test: add integration tests for terminal runtime
```

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Make** your changes with tests
4. **Ensure** all tests pass (`pnpm test`)
5. **Run** linting (`pnpm lint`)
6. **Update** documentation as needed
7. **Submit** a pull request

### PR Requirements

- All tests must pass
- Code must be linted
- New features require tests
- Breaking changes must be documented
- Documentation must be updated

## Architecture Guidelines

### What SCR Runtime Is

- An execution layer for AI agents
- A unified interface for browser, desktop, terminal, and filesystem control
- A production-grade runtime with verification and audit capabilities

### What SCR Runtime Is NOT

- An agent framework
- A planning or reasoning system
- A memory or state management system
- An orchestration engine

Keep these boundaries clear when contributing.

## Code Style

### TypeScript

- Use strict mode
- Prefer interfaces over types for public APIs
- Use explicit return types
- Avoid `any`; use `unknown` when necessary

### Naming Conventions

- Classes: `PascalCase` (e.g., `ExecutionEngine`)
- Functions: `camelCase` (e.g., `createRuntime`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_TIMEOUT`)
- Interfaces: `PascalCase` (e.g., `RuntimeConfig`)

### Error Handling

- Use custom error classes for domain-specific errors
- Include context in error messages
- Never swallow errors silently

## Testing

### Test Categories

- **Unit Tests** — Test individual functions and classes
- **Integration Tests** — Test component interactions
- **E2E Tests** — Test complete workflows

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- path/to/test.ts

# Watch mode
pnpm test:watch
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { createScrRuntime } from '../src/runtime';

describe('Runtime', () => {
  it('should create a runtime instance', async () => {
    const runtime = await createScrRuntime({ appName: 'test' });
    expect(runtime).toBeDefined();
    expect(runtime.config.appName).toBe('test');
  });
});
```

## Documentation

### Documentation Requirements

- All public APIs must be documented
- Examples must be runnable
- Documentation must be in `docs/` directory

### Building Documentation

```bash
pnpm docs
```

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** — Breaking changes
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes (backward compatible)

### Release Checklist

- [ ] Update CHANGELOG.md
- [ ] Update version in package.json
- [ ] Run all tests
- [ ] Build and verify
- [ ] Create release tag
- [ ] Publish to npm

## Questions?

- Check existing [issues](https://github.com/harshitgavita-07/SCR/issues)
- Start a [discussion](https://github.com/harshitgavita-07/SCR/discussions)
- Read the [FAQ](./docs/faq.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
