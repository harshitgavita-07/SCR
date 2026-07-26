# Browser Agent Example

Demonstrates web scraping and form automation using SCR Runtime.

## What This Demonstrates

- Browser navigation
- Element querying
- Screenshot capture
- Content extraction
- State verification
- Screen observation

## Run the Example

```bash
pnpm install
pnpm start
```

## Code Walkthrough

The example shows:

1. **Runtime initialization** - Start SCR Runtime
2. **Navigation** - Go to a webpage
3. **Content extraction** - Get title, HTML, text
4. **Screenshots** - Capture visual state
5. **Element queries** - Find and inspect elements
6. **Verification** - Assert expected conditions
7. **Observation** - Full screen analysis

## Expected Output

```
🚀 Starting Browser Agent Example

✅ Runtime started

📍 Navigating to example.com...
📄 Page title: Example Domain

📸 Capturing screenshot...
📊 Screenshot size: 12345 bytes

📝 Extracting page content...
📄 Content length: 1234 characters
📝 Text preview: Example Domain...

🔍 Querying elements...
📌 H1 text: Example Domain

✅ Verifying page loaded correctly...
✅ Verification passed

👁️  Observing screen state...
📊 Detected 5 UI elements
📝 Extracted 100 characters of text

✨ Browser Agent Example completed successfully!

👋 Runtime stopped
```

## Next Steps

- Modify the URL to scrape different sites
- Add form filling demonstrations
- Implement multi-page workflows
- Integrate with an AI agent framework
