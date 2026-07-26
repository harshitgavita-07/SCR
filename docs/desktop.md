# Desktop Application Control

Control native desktop applications on Windows, macOS, and Linux.

## Overview

SCR Runtime provides desktop automation through native OS accessibility APIs:

- **Windows** — UI Automation (UIA)
- **macOS** — Accessibility API (AXAPI)
- **Linux** — AT-SPI (Assistive Technology Service Provider Interface)

## Quick Start

```typescript
import { Runtime } from '@scr/runtime';

const runtime = new Runtime();
await runtime.start();

// Move mouse and click
await runtime.desktop.moveMouse(100, 200);
await runtime.desktop.click();

// Type text
await runtime.desktop.type('Hello, World!');

// Find and focus window
const window = await runtime.desktop.findWindow('Calculator');
await runtime.desktop.focus(window);

await runtime.stop();
```

## Mouse Control

### Movement

```typescript
// Move to absolute position
await runtime.desktop.moveMouse(100, 200);

// Move relative to current position
await runtime.desktop.moveMouseRelative(50, -30);

// Get current position
const pos = await runtime.desktop.getMousePosition();
console.log(`Mouse at: ${pos.x}, ${pos.y}`);
```

### Clicking

```typescript
// Left click at current position
await runtime.desktop.click();

// Left click at specific position
await runtime.desktop.click({ x: 100, y: 200 });

// Double click
await runtime.desktop.doubleClick({ x: 150, y: 150 });

// Right click
await runtime.desktop.rightClick({ x: 200, y: 200 });

// Middle click
await runtime.desktop.middleClick();
```

### Drag and Drop

```typescript
// Drag from one point to another
await runtime.desktop.dragAndDrop(
  { x: 100, y: 100 },
  { x: 300, y: 300 }
);

// With delay
await runtime.desktop.dragAndDrop(
  { x: 100, y: 100 },
  { x: 300, y: 300 },
  { delay: 500 }
);
```

### Scroll

```typescript
// Scroll up
await runtime.desktop.scroll(0, -100);

// Scroll down
await runtime.desktop.scroll(0, 100);

// Scroll at position
await runtime.desktop.scrollAt(100, 100, 0, -50);
```

## Keyboard Control

### Typing

```typescript
// Type text
await runtime.desktop.type('Hello World');

// Type with delay (for slow applications)
await runtime.desktop.type('Slow typing', { delay: 100 });

// Clear field (select all + delete)
await runtime.desktop.hotkey(['Control', 'A']);
await runtime.desktop.press('Backspace');
```

### Key Presses

```typescript
// Single key
await runtime.desktop.press('Enter');
await runtime.desktop.press('Escape');
await runtime.desktop.press('Tab');

// Special keys
await runtime.desktop.press('F1');
await runtime.desktop.press('Home');
await runtime.desktop.press('End');
await runtime.desktop.press('PageUp');
await runtime.desktop.press('PageDown');
```

### Keyboard Shortcuts

```typescript
// Copy
await runtime.desktop.hotkey(['Control', 'C']);

// Paste
await runtime.desktop.hotkey(['Control', 'V']);

// Save
await runtime.desktop.hotkey(['Control', 'S']);

// Switch application
await runtime.desktop.hotkey(['Alt', 'Tab']);

// Screenshot (Windows)
await runtime.desktop.hotkey(['Win', 'Shift', 'S']);
```

## Window Management

### List Windows

```typescript
// Get all open windows
const windows = await runtime.desktop.listWindows();

for (const window of windows) {
  console.log(`${window.title} - ${window.appName}`);
}
```

### Find Windows

```typescript
// Find by title
const window = await runtime.desktop.findWindow('Untitled - Notepad');

// Find by application name
const chromeWindows = await runtime.desktop.findWindowsByApp('Chrome');

// Find by partial title
const windows = await runtime.desktop.findWindowsByTitlePattern(/Document/);
```

### Window Operations

```typescript
// Focus window
await runtime.desktop.focus(window);

// Minimize
await runtime.desktop.minimize(window);

// Maximize
await runtime.desktop.maximize(window);

// Restore
await runtime.desktop.restore(window);

// Close
await runtime.desktop.close(window);

// Resize
await runtime.desktop.resize(window, { width: 800, height: 600 });

// Move
await runtime.desktop.move(window, { x: 100, y: 100 });
```

### Window Information

```typescript
const info = await runtime.desktop.getWindowInfo(window);

console.log(info.title);      // Window title
console.log(info.bounds);     // Position and size
console.log(info.state);      // minimized, maximized, normal
console.log(info.visible);    // Visibility status
```

## Application Control

### Launch Applications

```typescript
// Launch by path
await runtime.desktop.launch('/Applications/Calculator.app');
await runtime.desktop.launch('C:\\Windows\\System32\\calc.exe');

// Launch by name (searches PATH)
await runtime.desktop.launch('notepad');
await runtime.desktop.launch('calculator');

// Launch with arguments
await runtime.desktop.launch('code', ['--new-window', '.']);
```

### Quit Applications

```typescript
// Quit by name
await runtime.desktop.quit('Calculator');

// Quit by process ID
await runtime.desktop.quitByPid(12345);

// Force quit
await runtime.desktop.quit('Unresponsive App', { force: true });
```

### List Applications

```typescript
// Get running applications
const apps = await runtime.desktop.listApplications();

for (const app of apps) {
  console.log(`${app.name} (PID: ${app.pid})`);
}
```

## Element Detection

### Find UI Elements

```typescript
// Find button by text
const button = await runtime.desktop.findElement({
  role: 'button',
  name: 'Submit',
});

// Find input field
const input = await runtime.desktop.findElement({
  role: 'textfield',
  placeholder: 'Email',
});

// Find by accessibility label
const element = await runtime.desktop.findElementByLabel('Settings Menu');
```

### Element Properties

```typescript
const element = await runtime.desktop.findElement({ role: 'button' });

// Get bounds
const bounds = await element.getBounds();

// Get text
const text = await element.getText();

// Check state
const enabled = await element.isEnabled();
const visible = await element.isVisible();
const focused = await element.isFocused();

// Get children
const children = await element.getChildren();
```

### Element Actions

```typescript
// Click element
await element.click();

// Double click
await element.doubleClick();

// Right click
await element.rightClick();

// Focus
await element.focus();

// Set value (for inputs)
await element.setValue('New value');

// Select (for dropdowns)
await element.select('Option 1');
```

## Screenshots

### Full Screen

```typescript
const screenshot = await runtime.desktop.screenshot();
await fs.writeFile('desktop.png', screenshot);
```

### Specific Region

```typescript
const region = await runtime.desktop.screenshot({
  x: 100,
  y: 100,
  width: 500,
  height: 400,
});
```

### Window Screenshot

```typescript
const window = await runtime.desktop.findWindow('Calculator');
const screenshot = await runtime.desktop.screenshotWindow(window);
```

## Platform-Specific Features

### Windows

```typescript
// Send Win key commands
await runtime.desktop.winKey('E'); // Open Explorer

// Taskbar operations
await runtime.desktop.taskbarClick(0); // First taskbar item

// System tray
const trayIcons = await runtime.desktop.listTrayIcons();
```

### macOS

```typescript
// Menu bar operations
await runtime.desktop.menuBarClick('File');
await runtime.desktop.menuBarSelect('File', 'Save');

// Dock operations
await runtime.desktop.dockClick('Safari');

// Mission Control
await runtime.desktop.missionControl();
```

### Linux

```typescript
// Workspace management
await runtime.desktop.switchWorkspace(2);

// GNOME-specific
await runtime.desktop.openActivities();
```

## Error Handling

```typescript
try {
  const window = await runtime.desktop.findWindow('Nonexistent');
  if (!window) {
    console.log('Window not found');
  }
} catch (error) {
  console.error(`Desktop operation failed: ${error.message}`);
}
```

## Permissions

Desktop control requires accessibility permissions:

### macOS

1. Open System Preferences → Security & Privacy → Privacy
2. Select Accessibility
3. Add your terminal/IDE

### Windows

UI Automation is available by default for most applications.

### Linux

Ensure AT-SPI is running:

```bash
export NO_AT_BRIDGE=1
```

## Best Practices

### Use Accessibility Labels

Prefer accessible elements over coordinates:

```typescript
// Good
const button = await runtime.desktop.findElement({
  role: 'button',
  name: 'Submit',
});
await button.click();

// Fragile
await runtime.desktop.click({ x: 500, y: 300 });
```

### Wait for Elements

```typescript
// Poll for element
async function waitForElement(selector, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const element = await runtime.desktop.findElement(selector);
    if (element) return element;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Element not found');
}
```

### Handle Dynamic Content

```typescript
// Refresh element reference after interaction
let button = await runtime.desktop.findElement({ role: 'button' });
await button.click();

// Element may be stale, re-find it
button = await runtime.desktop.findElement({ role: 'button' });
```

## Integration with Verification

```typescript
// Verify window exists
await runtime.verify(async () => {
  const window = await runtime.desktop.findWindow('Calculator');
  return window !== null;
});

// Verify element is clickable
await runtime.verify(async () => {
  const button = await runtime.desktop.findElement({ role: 'button' });
  return button && await button.isEnabled();
});
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[Terminal](./terminal.md)** — Command-line execution
- **[Vision](./vision.md)** — Screen observation
- **[Security](./security.md)** — Safe automation practices
