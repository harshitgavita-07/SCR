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
