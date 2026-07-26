# Installation

This guide covers installing SCR Runtime in your project.

## Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 9.0.0 (recommended), npm, or yarn

## Install Package

### Using pnpm (Recommended)

```bash
pnpm add @scr/runtime
```

### Using npm

```bash
npm install @scr/runtime
```

### Using yarn

```bash
yarn add @scr/runtime
```

## Install CLI (Global)

To use the `scr` command-line interface globally:

```bash
pnpm add -g @scr/runtime
# or
npm install -g @scr/runtime
# or
yarn global add @scr/runtime
```

## Verify Installation

Check that SCR Runtime is installed correctly:

```bash
# Check version
scr version

# Run diagnostics
scr doctor
```

Expected output:

```
SCR Runtime v0.1.0
Node.js v22.x.x
Platform: linux x64

✓ Node.js version OK
✓ Package installed
✓ Playwright browsers available
```

## TypeScript Configuration

SCR Runtime requires TypeScript >= 5.0.0. Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Platform-Specific Setup

### Linux

Some desktop features may require additional dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install -y libgtk-3-0 libnotify-dev libnss3 libxss1

# Fedora
sudo dnf install -y gtk3 libnotify nss xorg-x11-server-Xvfb
```

### macOS

No additional setup required. Desktop control uses native Accessibility APIs.

### Windows

No additional setup required. Desktop control uses UI Automation.

## Docker Usage

SCR Runtime can run in Docker containers:

```dockerfile
FROM node:22-bookworm

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnotify-dev \
    libnss3 \
    libxss1 \
    xvfb

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm build

CMD ["node", "dist/index.js"]
```

## Next Steps

- [Getting Started](./getting-started.md) — Quick start guide
- [Architecture](./architecture.md) — Understand how SCR works
- [SDK Reference](./sdk.md) — API documentation
