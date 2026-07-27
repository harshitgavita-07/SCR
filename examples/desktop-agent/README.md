# Desktop Agent Example

Demonstrates native desktop application control using SCR Runtime.

## What This Demonstrates

- Window enumeration
- Mouse position tracking
- Desktop screenshots
- Screen observation
- Keyboard input (demo mode)

## Run the Example

```bash
pnpm install
pnpm start
```

## Platform Requirements

### macOS
Grant accessibility permission:
1. System Preferences → Security & Privacy → Privacy
2. Select Accessibility
3. Add your terminal/IDE

### Windows
UI Automation is available by default for most applications.

### Linux
Ensure AT-SPI is running:
```bash
export NO_AT_BRIDGE=1
```

## Code Walkthrough

The example shows:

1. **Runtime initialization** - Start SCR Runtime
2. **Window listing** - Enumerate open windows
3. **Mouse tracking** - Get cursor position
4. **Desktop screenshot** - Capture full screen
5. **Screen observation** - Detect UI elements and text

## Expected Output

```
🚀 Starting Desktop Agent Example

✅ Runtime started

🪟 Listing open windows...
📊 Found 3 windows:
   - Terminal (iTerm2)
   - Browser (Chrome)
   - Editor (VS Code)

🖱️  Getting mouse position...
📍 Mouse at: (500, 300)

📸 Capturing desktop screenshot...
📊 Screenshot size: 234567 bytes

👁️  Observing screen state...
📊 Detected 25 UI elements
📝 Extracted 500 characters of text

✨ Desktop Agent Example completed successfully!

👋 Runtime stopped
```

## Next Steps

- Add window manipulation examples
- Demonstrate application launching
- Show element-based interaction
- Integrate with workflow automation
