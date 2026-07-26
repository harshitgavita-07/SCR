# SCR Runtime Roadmap

This document outlines the planned development trajectory for SCR Runtime.

## Vision

SCR Runtime is the execution layer for AI. Our goal is to provide a production-grade, secure, and reliable runtime that allows AI systems to safely interact with computers.

## Guiding Principles

1. **Execution Only** — We execute, observe, and verify. We do not plan, reason, or orchestrate.
2. **Stability Over Features** — Prefer boring, predictable, well-tested code over novel features.
3. **Security First** — Sandboxing, permissions, and audit trails are non-negotiable.
4. **Developer Experience** — Clear APIs, comprehensive documentation, minimal friction.

---

## v0.1 (Current) — Foundation

**Status**: ✅ Complete

### Core Capabilities
- [x] Browser automation (Chromium via Playwright)
- [x] Basic desktop observation
- [x] Terminal execution
- [x] Filesystem access
- [x] Event system
- [x] TypeScript SDK
- [x] CLI tools
- [x] MCP Server
- [x] Documentation suite
- [x] Production examples

### Infrastructure
- [x] GitHub Actions CI
- [x] Issue templates
- [x] Contributing guidelines
- [x] Code of Conduct
- [x] Security policy

---

## v0.2 — Expansion

**Target**: Q4 2024

### Desktop Control
- [ ] Full desktop control on Windows (UI Automation)
- [ ] Full desktop control on macOS (Accessibility API)
- [ ] Full desktop control on Linux (AT-SPI)
- [ ] Window management (focus, resize, minimize)
- [ ] Drag and drop support
- [ ] Hotkey registration

### Vision & Observation
- [ ] OCR integration (Tesseract, cloud APIs)
- [ ] UI element detection
- [ ] Screen region analysis
- [ ] Cursor and selection tracking
- [ ] Active window identification

### Mobile Support
- [ ] iOS device control (via WebDriver)
- [ ] Android device control (via ADB)
- [ ] Mobile app interaction
- [ ] Touch gesture support

### MCP Enhancements
- [ ] Streaming responses
- [ ] Resource subscriptions
- [ ] Prompt templates
- [ ] Authentication hooks
- [ ] Multi-session support

---

## v0.3 — Advanced Features

**Target**: Q1 2025

### Debugging & Replay
- [ ] Action recording
- [ ] Time-travel debugging
- [ ] Session replay
- [ ] Step-through execution
- [ ] Breakpoint support

### Performance
- [ ] Parallel session execution
- [ ] Connection pooling
- [ ] Lazy loading optimizations
- [ ] Memory profiling tools
- [ ] Benchmark suite

### Verification
- [ ] Visual regression testing
- [ ] DOM state comparison
- [ ] Accessibility tree verification
- [ ] Custom assertion builders
- [ ] Retry policies configuration

### Developer Tools
- [ ] Interactive REPL
- [ ] Browser DevTools integration
- [ ] VS Code extension
- [ ] Dashboard UI

---

## v1.0 — Production Stable

**Target**: Q2 2025

### API Stability
- [ ] Frozen public API
- [ ] Deprecation policies
- [ ] Migration guides
- [ ] Long-term support commitment

### Enterprise Features
- [ ] Role-based access control (RBAC)
- [ ] Single sign-on (SSO) integration
- [ ] Audit log export
- [ ] Compliance reporting
- [ ] Multi-tenant isolation

### Reliability
- [ ] 99.9% uptime SLA (cloud deployments)
- [ ] Graceful degradation
- [ ] Automatic recovery
- [ ] Health checks
- [ ] Metrics and monitoring

### Documentation
- [ ] API reference (auto-generated)
- [ ] Video tutorials
- [ ] Integration guides for all major frameworks
- [ ] Security best practices guide
- [ ] Performance tuning guide

---

## Future Considerations (Post-v1.0)

These are exploratory ideas that may or may not be implemented:

- **Distributed Execution** — Run actions across multiple machines
- **Cloud Runtime** — Managed SCR Runtime service
- **Plugin Ecosystem** — Third-party extensions
- **Custom Targets** — User-defined automation backends
- **Real-time Collaboration** — Multiple agents coordinating

---

## Out of Scope

The following will **never** be part of SCR Runtime:

- ❌ Mission planning or goal setting
- ❌ LLM integration or prompt engineering
- ❌ Memory or state persistence between sessions
- ❌ Autonomous agent orchestration
- ❌ Workflow engines
- ❌ Chat interfaces

These belong to higher-level systems like AIOS or agent frameworks.

---

## How to Contribute

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

To influence the roadmap:
1. Open a [discussion](https://github.com/scr/runtime/discussions)
2. Submit a [feature request](https://github.com/scr/runtime/issues/new?template=feature_request.md)
3. Contribute code via pull request

---

## Version Support

| Version | Status      | Support Ends |
|---------|-------------|--------------|
| 0.0.x   | Deprecated  | Immediate    |
| 0.1.x   | Current     | v0.3 release |
| 0.2.x   | Upcoming    | v1.0 release |
| 1.0.x   | LTS         | TBD          |

---

*Last updated: July 2024*
