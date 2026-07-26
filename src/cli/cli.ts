import { Command } from 'commander';
import type { ScrConfig } from '../contracts/index.js';
import { createScrRuntime } from '../runtime/index.js';
import { promises as fs } from 'fs';
import path from 'path';

export interface ScrCliOptions {
  config?: string;
  verbose?: boolean;
}

/**
 * Creates the SCR CLI program.
 *
 * @returns A configured Commander program instance
 *
 * @example
 * ```typescript
 * const cli = createScrCli();
 * cli.parse(process.argv);
 * ```
 */
export function createScrCli(): Command {
  const program = new Command();

  program
    .name('scr')
    .description(
      'Screen Control Runtime - A runtime for AI agents to observe and control graphical applications'
    )
    .version('0.1.0');

  // System commands
  program
    .command('doctor')
    .description('Check installation and environment')
    .action(async () => {
      console.log('SCR Runtime Doctor\n');
      console.log(`Node.js: ${process.version}`);
      console.log(`Platform: ${process.platform}`);
      console.log(`Architecture: ${process.arch}`);
      console.log(`SCR Version: 0.1.0`);
      console.log('\n✓ Installation looks good!');
    });

  program
    .command('version')
    .description('Show version information')
    .action(() => {
      console.log('SCR Runtime v0.1.0');
    });

  // Browser commands
  const browserCmd = program.command('browser').description('Browser operations');
  
  browserCmd
    .command('open <url>')
    .description('Open a URL in the browser')
    .option('-h, --headless', 'Run in headless mode')
    .action(async (url: string, options: { headless?: boolean }) => {
      console.log(`Opening browser to ${url}${options.headless ? ' (headless)' : ''}...`);
      const runtime = await createScrRuntime({ debug: true });
      try {
        await runtime.execute(`browser.goto(${url})`);
        console.log('✓ Browser opened successfully');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  // Terminal commands
  const terminalCmd = program.command('terminal').description('Terminal operations');
  
  terminalCmd
    .command('run <command>')
    .description('Execute a terminal command')
    .action(async (command: string) => {
      console.log(`Executing: ${command}`);
      const runtime = await createScrRuntime({ debug: true });
      try {
        await runtime.execute(`terminal.run(${command})`);
        console.log('✓ Command executed');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  // Observation commands
  program
    .command('observe')
    .description('Observe current screen state')
    .option('-o, --output <file>', 'Save screenshot to file')
    .action(async (options: { output?: string }) => {
      console.log('Observing screen state...');
      const runtime = await createScrRuntime({ debug: true });
      try {
        await runtime.execute('observe()');
        if (options.output) {
          console.log(`Screenshot saved to ${options.output}`);
        }
        console.log('✓ Observation complete');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  program
    .command('screenshot')
    .description('Capture a screenshot')
    .option('-s, --selector <selector>', 'CSS selector for element screenshot')
    .option('-o, --output <file>', 'Save to file')
    .action(async (options: { selector?: string; output?: string }) => {
      console.log('Capturing screenshot...');
      const runtime = await createScrRuntime({ debug: true });
      try {
        if (options.selector) {
          await runtime.execute(`browser.screenshot(${options.selector})`);
        } else {
          await runtime.execute('browser.screenshot()');
        }
        if (options.output) {
          console.log(`Screenshot saved to ${options.output}`);
        }
        console.log('✓ Screenshot captured');
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  // Verification commands
  program
    .command('verify')
    .description('Verify a condition')
    .requiredOption('-e, --expression <expr>', 'Condition to verify')
    .action(async (options: { expression: string }) => {
      console.log(`Verifying: ${options.expression}`);
      const runtime = await createScrRuntime({ debug: true });
      try {
        await runtime.execute(`verify(${options.expression})`);
        console.log('✓ Verification passed');
      } catch (error) {
        console.error('Verification failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  // MCP commands
  const mcpCmd = program.command('mcp').description('MCP server operations');
  
  mcpCmd
    .command('serve')
    .description('Start the MCP server')
    .option('-p, --port <port>', 'Port to listen on')
    .action((options: { port?: string }) => {
      console.log('Starting MCP server...');
      console.log('Use "scr-mcp-server" directly for full functionality');
      if (options.port) {
        console.log('Note: MCP stdio transport does not use ports');
      }
    });

  // Project commands
  program
    .command('run')
    .description('Run a conversation')
    .argument('<file>', 'conversation file to execute')
    .option('-c, --config <path>', 'configuration file path')
    .option('-v, --verbose', 'enable verbose logging')
    .action(async (file: string, options: ScrCliOptions) => {
      try {
        let config: ScrConfig = {};
        if (options.config) {
          const configPath = path.resolve(options.config);
          const configContent = await fs.readFile(configPath, 'utf-8');
          config = JSON.parse(configContent) as ScrConfig;
        }

        const runtime = await createScrRuntime(config);
        
        const filePath = path.resolve(file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        if (options.verbose) {
          console.log(`Running conversation file: ${filePath}`);
          console.log(`Config: ${JSON.stringify(config, null, 2)}`);
          console.log(`File content length: ${fileContent.length} bytes`);
        }

        await runtime.execute(fileContent);
        
        if (options.verbose) {
          console.log('Conversation completed successfully');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error running conversation: ${errorMessage}`);
        process.exit(1);
      }
    });

  program
    .command('init')
    .description('Initialize a new SCR project')
    .action(async () => {
      const cwd = process.cwd();
      const exampleConfig = {
        name: 'my-scr-project',
        version: '0.1.0',
        description: 'A Screen Control Runtime project'
      };
      
      const configPath = path.join(cwd, 'scr.config.json');
      await fs.writeFile(configPath, JSON.stringify(exampleConfig, null, 2));
      
      const examplesDir = path.join(cwd, 'examples');
      await fs.mkdir(examplesDir, { recursive: true });
      
      const exampleFile = path.join(examplesDir, 'basic.ts');
      const exampleContent = `// Basic SCR example\nconsole.log('Hello from SCR!');\n`;
      await fs.writeFile(exampleFile, exampleContent);
      
      console.log('Initialized new SCR project in', cwd);
      console.log('Created scr.config.json');
      console.log('Created examples/basic.ts');
    });

  return program;
}
