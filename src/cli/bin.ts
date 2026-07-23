#!/usr/bin/env node

import { createScrCli } from './cli.js';

const cli = createScrCli();
cli.parse(process.argv);
