/**
 * MCP Server for SCR Runtime
 * 
 * Exposes SCR Runtime capabilities through the Model Context Protocol.
 * 
 * Tools:
 * - browser.* - Browser automation
 * - desktop.* - Desktop control
 * - terminal.* - Terminal execution
 * - filesystem.* - File operations
 * - observe.* - Screen observation
 * - verify.* - State verification
 * - sessions.* - Session management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Runtime types (would import from @scr-runtime/runtime in production)
interface ScrRuntime {
  browser: {
    goto(url: string): Promise<void>;
    click(selector: string): Promise<void>;
    fill(selector: string, value: string): Promise<void>;
    screenshot(): Promise<Buffer>;
    content(): Promise<string>;
    title(): Promise<string>;
  };
  desktop: {
    click(x: number, y: number): Promise<void>;
    type(text: string): Promise<void>;
  };
  terminal: {
    run(command: string): Promise<{ stdout: string; stderr: string; exitCode: number }>;
  };
  filesystem: {
    read(path: string): Promise<string>;
    write(path: string, content: string): Promise<void>;
  };
  observe(): Promise<{ elements: unknown[]; screenshot: Buffer; text: string }>;
  verify(condition: () => Promise<boolean>): Promise<boolean>;
}

let runtime: ScrRuntime | null = null;

/**
 * Initialize the MCP server with SCR Runtime tools.
 */
function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'scr-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // Browser tools
        {
          name: 'browser_goto',
          description: 'Navigate to a URL in the browser',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'URL to navigate to' },
            },
            required: ['url'],
          },
        },
        {
          name: 'browser_click',
          description: 'Click an element on the page',
          inputSchema: {
            type: 'object',
            properties: {
              selector: { type: 'string', description: 'CSS selector of element to click' },
            },
            required: ['selector'],
          },
        },
        {
          name: 'browser_fill',
          description: 'Fill a form field with text',
          inputSchema: {
            type: 'object',
            properties: {
              selector: { type: 'string', description: 'CSS selector of input field' },
              value: { type: 'string', description: 'Text to fill' },
            },
            required: ['selector', 'value'],
          },
        },
        {
          name: 'browser_screenshot',
          description: 'Capture a screenshot of the current page',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'browser_content',
          description: 'Get the HTML content of the current page',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'browser_title',
          description: 'Get the title of the current page',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        // Desktop tools
        {
          name: 'desktop_click',
          description: 'Click at specific coordinates on the desktop',
          inputSchema: {
            type: 'object',
            properties: {
              x: { type: 'number', description: 'X coordinate' },
              y: { type: 'number', description: 'Y coordinate' },
            },
            required: ['x', 'y'],
          },
        },
        {
          name: 'desktop_type',
          description: 'Type text at the current cursor position',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Text to type' },
            },
            required: ['text'],
          },
        },
        // Terminal tools
        {
          name: 'terminal_run',
          description: 'Execute a terminal command',
          inputSchema: {
            type: 'object',
            properties: {
              command: { type: 'string', description: 'Command to execute' },
            },
            required: ['command'],
          },
        },
        // Filesystem tools
        {
          name: 'filesystem_read',
          description: 'Read a file from the filesystem',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Path to file' },
            },
            required: ['path'],
          },
        },
        {
          name: 'filesystem_write',
          description: 'Write content to a file',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Path to file' },
              content: { type: 'string', description: 'Content to write' },
            },
            required: ['path', 'content'],
          },
        },
        // Observation tools
        {
          name: 'observe',
          description: 'Observe the current screen state',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        // Verification tools
        {
          name: 'verify',
          description: 'Verify a condition about the current state',
          inputSchema: {
            type: 'object',
            properties: {
              expression: { type: 'string', description: 'Condition to verify' },
            },
            required: ['expression'],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        // Browser tools
        case 'browser_goto': {
          const { url } = z.object({ url: z.string() }).parse(args);
          await runtime!.browser.goto(url);
          return { content: [{ type: 'text', text: `Navigated to ${url}` }] };
        }
        case 'browser_click': {
          const { selector } = z.object({ selector: z.string() }).parse(args);
          await runtime!.browser.click(selector);
          return { content: [{ type: 'text', text: `Clicked ${selector}` }] };
        }
        case 'browser_fill': {
          const { selector, value } = z.object({ selector: z.string(), value: z.string() }).parse(args);
          await runtime!.browser.fill(selector, value);
          return { content: [{ type: 'text', text: `Filled ${selector} with "${value}"` }] };
        }
        case 'browser_screenshot': {
          const screenshot = await runtime!.browser.screenshot();
          return {
            content: [
              {
                type: 'image',
                data: screenshot.toString('base64'),
                mimeType: 'image/png',
              },
            ],
          };
        }
        case 'browser_content': {
          const content = await runtime!.browser.content();
          return { content: [{ type: 'text', text: content }] };
        }
        case 'browser_title': {
          const title = await runtime!.browser.title();
          return { content: [{ type: 'text', text: title }] };
        }

        // Desktop tools
        case 'desktop_click': {
          const { x, y } = z.object({ x: z.number(), y: z.number() }).parse(args);
          await runtime!.desktop.click(x, y);
          return { content: [{ type: 'text', text: `Clicked at (${x}, ${y})` }] };
        }
        case 'desktop_type': {
          const { text } = z.object({ text: z.string() }).parse(args);
          await runtime!.desktop.type(text);
          return { content: [{ type: 'text', text: `Typed "${text}"` }] };
        }

        // Terminal tools
        case 'terminal_run': {
          const { command } = z.object({ command: z.string() }).parse(args);
          const result = await runtime!.terminal.run(command);
          return {
            content: [
              {
                type: 'text',
                text: `Exit Code: ${result.exitCode}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
              },
            ],
          };
        }

        // Filesystem tools
        case 'filesystem_read': {
          const { path } = z.object({ path: z.string() }).parse(args);
          const content = await runtime!.filesystem.read(path);
          return { content: [{ type: 'text', text: content }] };
        }
        case 'filesystem_write': {
          const { path, content } = z.object({ path: z.string(), content: z.string() }).parse(args);
          await runtime!.filesystem.write(path, content);
          return { content: [{ type: 'text', text: `Wrote ${content.length} bytes to ${path}` }] };
        }

        // Observation tools
        case 'observe': {
          const observation = await runtime!.observe();
          return {
            content: [
              {
                type: 'text',
                text: `Detected ${observation.elements.length} elements\nExtracted ${observation.text.length} characters`,
              },
              {
                type: 'image',
                data: observation.screenshot.toString('base64'),
                mimeType: 'image/png',
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Start the MCP server.
 */
async function main(): Promise<void> {
  console.error('Starting SCR MCP Server...');

  // Initialize runtime (in production, this would import from @scr-runtime/runtime)
  // For now, we'll use a placeholder that demonstrates the pattern
  runtime = await initializeRuntime();

  const server = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error('SCR MCP Server running on stdio');
}

/**
 * Initialize SCR Runtime instance.
 * This is a placeholder - in production, import from @scr-runtime/runtime
 */
async function initializeRuntime(): Promise<ScrRuntime> {
  // Placeholder implementation
  // In production: import { createScrRuntime } from '@scr-runtime/runtime';
  return {
    browser: {
      goto: async (url: string) => {
        console.error(`[Runtime] browser.goto(${url})`);
      },
      click: async (selector: string) => {
        console.error(`[Runtime] browser.click(${selector})`);
      },
      fill: async (selector: string, value: string) => {
        console.error(`[Runtime] browser.fill(${selector}, ${value})`);
      },
      screenshot: async () => Buffer.from([]),
      content: async () => '',
      title: async () => '',
    },
    desktop: {
      click: async (x: number, y: number) => {
        console.error(`[Runtime] desktop.click(${x}, ${y})`);
      },
      type: async (text: string) => {
        console.error(`[Runtime] desktop.type(${text})`);
      },
    },
    terminal: {
      run: async (command: string) => ({
        stdout: '',
        stderr: '',
        exitCode: 0,
      }),
    },
    filesystem: {
      read: async (path: string) => '',
      write: async (path: string, content: string) => {},
    },
    observe: async () => ({ elements: [], screenshot: Buffer.from([]), text: '' }),
    verify: async () => true,
  };
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
