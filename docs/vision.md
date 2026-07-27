# Vision & Observation

Observe screens, detect UI elements, and extract visual information.

## Overview

SCR Runtime provides vision capabilities for AI agents to understand what's on screen:

- **Screenshots** — Capture full screen or regions
- **Element Detection** — Identify buttons, inputs, text, images
- **OCR** — Extract text from images
- **Visual Search** — Find images within screenshots

## Quick Start

```typescript
import { Runtime } from '@scr-runtime/runtime';

const runtime = new Runtime();
await runtime.start();

// Observe current state
const observation = await runtime.observe();

console.log(observation.screenshot);  // Buffer
console.log(observation.elements);    // Detected elements
console.log(observation.text);        // OCR text

await runtime.stop();
```

## Basic Observation

### Full Observation

```typescript
const observation = await runtime.observe();

interface Observation {
  screenshot: Buffer;       // Full screenshot
  elements: DetectedElement[]; // Detected UI elements
  text: string;             // Extracted text (OCR)
  activeWindow: WindowInfo; // Currently focused window
  cursorPosition: Position; // Mouse cursor location
  timestamp: number;        // When observation was captured
}
```

### Screenshot Only

```typescript
// Full screen
const screenshot = await runtime.observer.screenshot();

// Save to file
await fs.writeFile('screen.png', screenshot);
```

### Region Observation

```typescript
// Observe specific region
const observation = await runtime.observe({
  region: {
    x: 100,
    y: 100,
    width: 500,
    height: 400,
  },
});
```

## Element Detection

### Detect All Elements

```typescript
const elements = await runtime.observer.detectElements();

for (const element of elements) {
  console.log(`${element.type}: ${element.text}`);
  console.log(`Bounds: ${JSON.stringify(element.bounds)}`);
  console.log(`Confidence: ${element.confidence}`);
}
```

### Element Types

```typescript
interface DetectedElement {
  type: 'button' | 'input' | 'link' | 'text' | 'image' | 'checkbox' | 'dropdown';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  text?: string;
  confidence: number;  // 0-1
}
```

### Filter by Type

```typescript
// Find only buttons
const buttons = await runtime.observer.detectElements({
  types: ['button'],
});

// Find interactive elements
const interactive = await runtime.observer.detectElements({
  types: ['button', 'input', 'link', 'dropdown'],
});
```

### Filter by Confidence

```typescript
// High confidence only
const elements = await runtime.observer.detectElements({
  minConfidence: 0.9,
});
```

## OCR (Optical Character Recognition)

### Extract All Text

```typescript
const text = await runtime.observer.ocr();
console.log(text);
```

### Extract from Region

```typescript
const text = await runtime.observer.ocr({
  region: {
    x: 0,
    y: 0,
    width: 300,
    height: 100,
  },
});
```

### OCR with Options

```typescript
const result = await runtime.observer.ocr({
  language: 'eng',      // Language code
  preserveWhitespace: true,
  includeBoundingBoxes: true,
});

interface OCRResult {
  text: string;
  blocks: {
    text: string;
    bounds: { x: number; y: number; width: number; height: number };
    confidence: number;
  }[];
}
```

### Multiple Languages

```typescript
const text = await runtime.observer.ocr({
  languages: ['eng', 'spa', 'fra'], // English, Spanish, French
});
```

## Visual Search

### Find Image on Screen

```typescript
// Load template image
const template = await fs.readFile('button-template.png');

// Find on screen
const match = await runtime.observer.findImage(template);

if (match) {
  console.log(`Found at: ${match.x}, ${match.y}`);
  console.log(`Confidence: ${match.confidence}`);
}
```

### Search with Options

```typescript
const match = await runtime.observer.findImage(template, {
  threshold: 0.8,       // Match confidence (0-1)
  region: {             // Search area
    x: 0,
    y: 0,
    width: 500,
    height: 500,
  },
});
```

### Find All Occurrences

```typescript
const matches = await runtime.observer.findAllImages(template, {
  threshold: 0.7,
});

console.log(`Found ${matches.length} occurrences`);
```

## Color Detection

### Get Pixel Color

```typescript
const color = await runtime.observer.getColorAt(100, 200);
console.log(color);  // { r: 255, g: 0, b: 0, a: 255 }
```

### Find Color Region

```typescript
// Find all red pixels
const regions = await runtime.observer.findColor({
  r: 255,
  g: 0,
  b: 0,
  tolerance: 30,  // Color variance allowed
});
```

## Motion Detection

### Detect Changes

```typescript
// Take baseline screenshot
const baseline = await runtime.observer.screenshot();

// Wait and compare
await new Promise(r => setTimeout(r, 1000));

const changed = await runtime.observer.detectChange(baseline, {
  threshold: 0.1,  // Percentage of pixels that must change
});

if (changed) {
  console.log('Screen changed!');
  console.log(`Changed regions: ${changed.regions}`);
}
```

### Watch for Changes

```typescript
const watcher = await runtime.observer.watchChanges({
  interval: 500,  // Check every 500ms
  threshold: 0.05,
});

watcher.on('change', (event) => {
  console.log(`Change detected at ${event.timestamp}`);
});

// Later...
await watcher.stop();
```

## Integration with Actions

### Click Detected Element

```typescript
const elements = await runtime.observer.detectElements({ types: ['button'] });
const submitButton = elements.find(e => e.text === 'Submit');

if (submitButton) {
  const centerX = submitButton.bounds.x + submitButton.bounds.width / 2;
  const centerY = submitButton.bounds.y + submitButton.bounds.height / 2;
  
  await runtime.desktop.click({ x: centerX, y: centerY });
}
```

### Read Text Then Act

```typescript
const text = await runtime.observer.ocr();

if (text.includes('Error')) {
  console.log('Error detected on screen');
  // Take corrective action
}
```

### Verify Visual State

```typescript
await runtime.verify(async () => {
  const elements = await runtime.observer.detectElements({ types: ['button'] });
  return elements.some(e => e.text === 'Success');
});
```

## Configuration

### Observer Settings

```typescript
const runtime = new Runtime({
  observer: {
    elementDetection: {
      enabled: true,
      modelPath: './models/element-detector',
      minConfidence: 0.7,
    },
    ocr: {
      enabled: true,
      engine: 'tesseract', // or 'google-cloud-vision'
      defaultLanguage: 'eng',
    },
    screenshot: {
      format: 'png',
      quality: 90,
    },
  },
});
```

## Performance Tips

### Cache Results

```typescript
// Cache element detection
let cachedElements: DetectedElement[] | null = null;
let cacheTime = 0;

async function getElements() {
  const now = Date.now();
  if (cachedElements && now - cacheTime < 1000) {
    return cachedElements;
  }
  
  cachedElements = await runtime.observer.detectElements();
  cacheTime = now;
  return cachedElements;
}
```

### Use Regions

Limit detection to relevant areas:

```typescript
// Instead of full screen
const elements = await runtime.observer.detectElements({
  region: {
    x: 0,
    y: 0,
    width: 400,
    height: 300,
  },
});
```

### Adjust Frequency

```typescript
// Don't observe too frequently
let lastObservation = 0;
const MIN_INTERVAL = 500; // 500ms minimum

async function observeWithRateLimit() {
  const now = Date.now();
  if (now - lastObservation < MIN_INTERVAL) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL - (now - lastObservation)));
  }
  lastObservation = Date.now();
  return runtime.observe();
}
```

## Error Handling

```typescript
try {
  const observation = await runtime.observe();
} catch (error) {
  if (error.message.includes('OCR')) {
    console.log('OCR failed, using fallback');
    // Fallback logic
  } else {
    throw error;
  }
}
```

## Best Practices

### Combine with DOM Knowledge

For browser automation, combine vision with DOM:

```typescript
// Use DOM for precise selection
const element = await runtime.browser.$('#submit');
const box = await element.boundingBox();

// Use vision to verify appearance
const observation = await runtime.observe({
  region: box,
});

if (!observation.elements.some(e => e.type === 'button')) {
  console.warn('Element may not look like a button');
}
```

### Log Observations

```typescript
runtime.on('observation.captured', (event) => {
  console.log(`Observed ${event.elements.length} elements`);
});
```

### Handle Scale Differences

```typescript
// Account for different screen resolutions
const scaleFactor = await runtime.observer.getScaleFactor();
const adjustedBounds = {
  x: bounds.x * scaleFactor,
  y: bounds.y * scaleFactor,
  width: bounds.width * scaleFactor,
  height: bounds.height * scaleFactor,
};
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[Verification](./verification.md)** — State verification
- **[Browser](./browser.md)** — Browser automation
- **[Desktop](./desktop.md)** — Desktop control
