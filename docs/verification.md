# State Verification

Verify expected states before and after actions with SCR Runtime.

## Overview

Verification ensures your automation is reliable by:

- Checking preconditions before actions
- Validating postconditions after actions
- Waiting for expected states with timeouts
- Providing clear failure messages

## Quick Start

```typescript
import { Runtime } from '@scr/runtime';

const runtime = new Runtime();
await runtime.start();

// Simple verification
await runtime.verify(async () => {
  const button = await runtime.browser.$('#submit');
  return button !== null && await button.isVisible();
});

// Verify with timeout
await runtime.verify(
  async () => {
    const text = await runtime.browser.text('.status');
    return text === 'Complete';
  },
  { timeout: 5000 }
);

await runtime.stop();
```

## Basic Verification

### Simple Conditions

```typescript
// Boolean check
await runtime.verify(() => true);

// Async check
await runtime.verify(async () => {
  const url = await runtime.browser.url();
  return url.includes('/dashboard');
});
```

### With Options

```typescript
await runtime.verify(condition, options);

interface VerifyOptions {
  timeout?: number;      // Max wait time (default: 5000ms)
  interval?: number;     // Check interval (default: 100ms)
  message?: string;      // Custom error message
}
```

### Timeout Behavior

```typescript
// Will retry until condition is true or timeout
await runtime.verify(
  async () => {
    const elements = await runtime.browser.$$('.item');
    return elements.length > 0;
  },
  {
    timeout: 10000,     // Wait up to 10 seconds
    interval: 200,      // Check every 200ms
  }
);
```

## Pre-built Assertions

### Element Assertions

```typescript
// Element visible
await runtime.verifier.elementVisible('#submit');

// Element hidden
await runtime.verifier.elementHidden('.loading');

// Element exists
await runtime.verifier.elementExists('#form');

// Element enabled
await runtime.verifier.elementEnabled('#input');

// Element disabled
await runtime.verifier.elementDisabled('#disabled-button');
```

### Text Assertions

```typescript
// Text contains
await runtime.verifier.textContains('body', 'Welcome');

// Text equals
await runtime.verifier.textEquals('.title', 'Dashboard');

// Text matches regex
await runtime.verifier.textMatches('.count', /\d+/);
```

### URL Assertions

```typescript
// URL contains
await runtime.verifier.urlContains('/dashboard');

// URL matches
await runtime.verifier.urlMatches(/^https:\/\/example\.com\/.*$/);

// URL path equals
await runtime.verifier.urlPathEquals('/users/settings');
```

### Browser Assertions

```typescript
// Page title
await runtime.verifier.titleEquals('Dashboard');
await runtime.verifier.titleContains('My App');

// Tab count
await runtime.verifier.tabCountEquals(1);

// Console errors
await runtime.verifier.noConsoleErrors();
```

### Filesystem Assertions

```typescript
// File exists
await runtime.verifier.fileExists('./config.json');

// Directory exists
await runtime.verifier.directoryExists('./src');

// File content
await runtime.verifier.fileContains('./log.txt', 'ERROR');
```

### Terminal Assertions

```typescript
// Command succeeds
await runtime.verifier.commandSucceeds('git status');

// Command output
await runtime.verifier.commandOutputContains('node --version', 'v');
```

## Pre/Post Condition Verification

### Before Actions

```typescript
// Verify form is ready before submitting
await runtime.verify(async () => {
  const form = await runtime.browser.$('#my-form');
  const submitBtn = await runtime.browser.$('#submit');
  return form && submitBtn && await submitBtn.isEnabled();
});

await runtime.browser.click('#submit');
```

### After Actions

```typescript
await runtime.browser.click('#submit');

// Verify submission succeeded
await runtime.verify(async () => {
  const message = await runtime.browser.text('.success-message');
  return message.includes('submitted');
}, {
  timeout: 5000,
  message: 'Form submission failed',
});
```

## Custom Assertions

### Register Custom Verifier

```typescript
runtime.verifier.register('custom-check', async (context) => {
  // Access runtime through context
  const runtime = context.runtime;
  
  // Custom logic
  const element = await runtime.browser.$('#target');
  const isVisible = element ? await element.isVisible() : false;
  
  return {
    passed: isVisible,
    message: isVisible ? 'Element is visible' : 'Element not visible',
  };
});

// Use custom verifier
await runtime.verify(() => 
  runtime.verifier.assert('custom-check')
);
```

### Parameterized Assertions

```typescript
runtime.verifier.register('element-has-class', async (context, args) => {
  const { selector, className } = args as { selector: string; className: string };
  
  const element = await context.runtime.browser.$(selector);
  if (!element) {
    return { passed: false, message: `Element ${selector} not found` };
  }
  
  const classes = await element.getAttribute('class');
  const hasClass = classes?.includes(className) ?? false;
  
  return {
    passed: hasClass,
    message: hasClass 
      ? `Element has class ${className}`
      : `Element missing class ${className}`,
  };
});

// Usage
await runtime.verify(() => 
  runtime.verifier.assert('element-has-class', {
    selector: '#button',
    className: 'active',
  })
);
```

## Verification Strategies

### Polling Strategy

```typescript
// Default: polls until condition is true
await runtime.verify(async () => {
  const items = await runtime.browser.$$('.item');
  return items.length >= 5;
}, {
  timeout: 10000,
  interval: 200,
});
```

### Immediate Check

```typescript
// Check once, no retry
await runtime.verify(async () => {
  // ...
}, {
  timeout: 0,  // No waiting
});
```

### Event-Based Verification

```typescript
// Wait for specific event
const verifyPromise = runtime.verify(async () => {
  return state === 'complete';
});

// Trigger state change
await runtime.browser.click('#start');

// Wait for verification
await verifyPromise;
```

## Error Handling

### Custom Error Messages

```typescript
try {
  await runtime.verify(
    async () => {
      const text = await runtime.browser.text('.status');
      return text === 'Success';
    },
    {
      message: 'Expected status to be "Success" but it was not',
      timeout: 5000,
    }
  );
} catch (error) {
  console.error(`Verification failed: ${error.message}`);
}
```

### Verification Errors

```typescript
import { ScrError, ScrErrorCode } from '@scr/runtime';

try {
  await runtime.verify(() => false);
} catch (error) {
  if (error instanceof ScrError && error.code === ScrErrorCode.TIMEOUT) {
    console.log('Verification timed out');
  }
}
```

### Continue on Failure

```typescript
// Don't throw, just return result
const result = await runtime.verifySafe(async () => {
  // ...
});

if (!result.passed) {
  console.log(`Verification failed: ${result.message}`);
}
```

## Integration Patterns

### Page Object Pattern

```typescript
class LoginPage {
  constructor(private runtime: Runtime) {}
  
  async verifyLoaded() {
    await this.runtime.verify(async () => {
      const heading = await this.runtime.browser.text('h1');
      return heading === 'Login';
    });
  }
  
  async verifyLoginSuccess() {
    await this.runtime.verify(async () => {
      const url = await this.runtime.browser.url();
      return url.includes('/dashboard');
    });
  }
}
```

### Test Helper Pattern

```typescript
async function expectNavigation(runtime: Runtime, expectedUrl: string) {
  await runtime.browser.click('a[href]');
  
  await runtime.verify(
    async () => {
      const url = await runtime.browser.url();
      return url.includes(expectedUrl);
    },
    { message: `Navigation to ${expectedUrl} failed` }
  );
}
```

### Assertion Chain Pattern

```typescript
await runtime
  .verifier
  .chain()
  .elementVisible('#form')
  .elementEnabled('#submit')
  .textContains('h1', 'Checkout')
  .verify();
```

## Best Practices

### Be Specific

```typescript
// Good: Specific assertion
await runtime.verify(async () => {
  const text = await runtime.browser.text('.status');
  return text === 'Order confirmed #12345';
});

// Bad: Too vague
await runtime.verify(async () => {
  const text = await runtime.browser.text('.status');
  return text.length > 0;
});
```

### Reasonable Timeouts

```typescript
// Network operations: longer timeout
await runtime.verify(checkNetworkResult, { timeout: 15000 });

// UI updates: shorter timeout
await runtime.verify(checkUIState, { timeout: 3000 });

// Instant checks: no timeout
await runtime.verify(checkLocalState, { timeout: 0 });
```

### Clear Error Messages

```typescript
await runtime.verify(
  async () => { /* ... */ },
  {
    message: 'Expected login form to be visible after navigating to /login',
  }
);
```

### Combine with Observations

```typescript
// If verification fails, capture state for debugging
try {
  await runtime.verify(checkCondition);
} catch (error) {
  const observation = await runtime.observe();
  await fs.writeFile('failure-screenshot.png', observation.screenshot);
  throw error;
}
```

## Performance Considerations

### Avoid Over-Verification

```typescript
// Don't verify after every single action
await runtime.browser.fill('#name', 'John');
await runtime.browser.fill('#email', 'john@example.com');
await runtime.browser.fill('#phone', '555-1234');

// Verify once after related actions
await runtime.verify(async () => {
  const name = await runtime.browser.inputValue('#name');
  const email = await runtime.browser.inputValue('#email');
  return name === 'John' && email === 'john@example.com';
});
```

### Cache When Possible

```typescript
let cachedState: AppState | null = null;

async function verifyAppState(expected: Partial<AppState>) {
  if (!cachedState) {
    cachedState = await getAppState();
  }
  
  return Object.entries(expected).every(
    ([key, value]) => cachedState?.[key] === value
  );
}
```

## Next Steps

- **[Runtime API](./runtime.md)** — Complete API reference
- **[Browser](./browser.md)** — Browser automation
- **[Vision](./vision.md)** — Screen observation
- **[Security](./security.md)** — Safe automation practices
