/**
 * Delays execution for a specified duration.
 *
 * @param ms - Duration in milliseconds
 * @returns A promise that resolves after the delay
 *
 * @example
 * ```typescript
 * await delay(1000); // Wait 1 second
 * ```
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes a function with a timeout.
 *
 * @param fn - Function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns A promise that resolves with the function result
 * @throws {Error} If the timeout is exceeded
 *
 * @example
 * ```typescript
 * const result = await withTimeout(() => fetchData(), 5000);
 * ```
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutHandle = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    fn()
      .then((result) => {
        clearTimeout(timeoutHandle);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutHandle);
        reject(error);
      });
  });
}

/**
 * Retries a function with exponential backoff.
 *
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns A promise that resolves with the function result
 * @throws {Error} If all retries fail
 *
 * @example
 * ```typescript
 * const result = await retry(() => fetchData(), {
 *   maxRetries: 3,
 *   initialDelay: 1000,
 * });
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
  } = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
  } = options;

  let lastError: Error | undefined;
  let currentDelay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        await delay(currentDelay);
        currentDelay = Math.min(currentDelay * factor, maxDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Creates a debounced version of a function.
 *
 * @param fn - Function to debounce
 * @param waitMs - Wait time in milliseconds
 * @returns A debounced function
 *
 * @example
 * ```typescript
 * const save = debounce(() => api.save(data), 300);
 * userInput.addEventListener('input', save);
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let timeoutHandle: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    timeoutHandle = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
}

/**
 * Creates a throttled version of a function.
 *
 * @param fn - Function to throttle
 * @param limitMs - Minimum time between calls in milliseconds
 * @returns A throttled function
 *
 * @example
 * ```typescript
 * const handleScroll = throttle(() => updatePosition(), 100);
 * window.addEventListener('scroll', handleScroll);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limitMs: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutHandle: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limitMs) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutHandle) {
      timeoutHandle = setTimeout(() => {
        lastCall = Date.now();
        timeoutHandle = undefined;
        fn(...args);
      }, limitMs - (now - lastCall));
    }
  };
}

/**
 * Runs functions in series, waiting for each to complete.
 *
 * @param fns - Array of functions to run
 * @returns Array of results
 *
 * @example
 * ```typescript
 * const results = await runSeries([
 *   () => fetchUser(),
 *   () => fetchPosts(),
 *   () => fetchComments(),
 * ]);
 * ```
 */
export async function runSeries<T>(
  fns: Array<() => Promise<T>>,
): Promise<Array<T>> {
  const results: Array<T> = [];

  for (const fn of fns) {
    results.push(await fn());
  }

  return results;
}

/**
 * Runs functions in parallel with a concurrency limit.
 *
 * @param fns - Array of functions to run
 * @param limit - Maximum concurrent executions
 * @returns Array of results
 *
 * @example
 * ```typescript
 * const results = await runParallel(
 *   urls.map(url => () => fetchUrl(url)),
 *   5
 * );
 * ```
 */
export async function runParallel<T>(
  fns: Array<() => Promise<T>>,
  limit: number,
): Promise<Array<T>> {
  const results: Array<T> = [];
  const executing: Array<Promise<void>> = [];

  for (const fn of fns) {
    const promise = Promise.resolve().then(async () => {
      const result = await fn();
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
