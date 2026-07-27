# Changelog

All notable changes to SCR Runtime will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial v0.1.0 release preparation
- Complete documentation suite
- MCP Server implementation
- CLI tools (scr doctor, scr version, etc.)
- Production examples for browser, desktop, terminal agents

### Changed
- Improved repository structure for production readiness
- Enhanced README with architecture diagram and quick start guide

### Fixed
- Repository cleanup and dead code removal

---

## [0.1.0] - 2024-07-26

### Added

#### Core Runtime
- Browser automation via Playwright backend
- Desktop control capabilities
- Terminal execution with PTY support
- Filesystem operations (read, write, watch)
- Screen observation with screenshot and element detection
- State verification system with assertions and retries
- Session management with isolation and cleanup
- Event system for all state changes
- Structured logging with JSON output

#### SDK
- Clean TypeScript API
- Type-safe interfaces for all runtime modules
- Configuration options for permissions and sandboxing

#### CLI
- `scr doctor` — Check installation and dependencies
- `scr version` — Display version information
- `scr browser open` — Open browser for inspection
- `scr terminal run` — Execute terminal commands
- `scr observe` — Capture screen observation
- `scr screenshot` — Take screenshots
- `scr verify` — Verify conditions
- `scr mcp serve` — Start MCP server

#### MCP Server
- Model Context Protocol integration
- Tools for browser, desktop, terminal, filesystem
- Observation and verification tools
- Session management tools

#### Documentation
- Getting started guide
- Architecture documentation
- Runtime module documentation (browser, desktop, terminal, filesystem)
- Vision and verification guides
- Security documentation
- SDK and CLI references
- MCP integration guide
- FAQ

#### Examples
- Browser agent example
- Desktop agent example
- Terminal agent example
- Coding agent example
- Research agent example

#### Infrastructure
- GitHub Actions CI workflow
- Issue templates (bug report, feature request)
- Contributing guidelines
- Code of Conduct
- Security policy
- MIT License

### Technical Details

- **Package**: @scr-runtime/runtime
- **License**: MIT
- **Node.js**: >= 22.0.0
- **TypeScript**: >= 5.0.0
- **Dependencies**: Playwright, pino, zod, commander

---

## [0.0.1] - 2024-07-01

### Added
- Initial project setup
- Basic runtime structure
- Foundation for browser, desktop, terminal modules

[Unreleased]: https://github.com/harshitgavita-07/SCR/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/harshitgavita-07/SCR/releases/tag/v0.1.0
[0.0.1]: https://github.com/harshitgavita-07/SCR/releases/tag/v0.0.1
