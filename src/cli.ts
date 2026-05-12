#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { sampleConfig } from './config/load.js';
import { inferFormat, render } from './output.js';
import { severityRank } from './rules/issues.js';
import { scan } from './scan.js';
import type { Severity } from './types.js';

interface Args { command?: string; target: string; out?: string; format?: string; failOn?: Severity; config?: string; }

function main(argv: string[]): number {
  const args = parseArgs(argv);
  if (!args.command || args.command === 'help' || args.command === '--help') { help(); return 0; }
  if (args.command === 'init') return init(args.target);
  if (args.command !== 'scan') throw new Error(`Unknown command: ${args.command}`);
  const result = scan({ root: args.target, configPath: args.config });
  const format = inferFormat(args.out, args.format);
  const content = render(result, format);
  if (args.out) {
    const output = resolve(args.out);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, content);
  } else process.stdout.write(content);
  if (args.failOn && result.issues.some((issue) => severityRank(issue.severity) >= severityRank(args.failOn!))) return 2;
  return 0;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { command: argv[0], target: argv[1] && !argv[1].startsWith('--') ? argv[1] : '.' };
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--out') args.out = argv[++i];
    else if (arg === '--format') args.format = argv[++i];
    else if (arg === '--fail-on') args.failOn = argv[++i] as Severity;
    else if (arg === '--config') args.config = argv[++i];
  }
  return args;
}

function init(target: string): number {
  const output = resolve(target, '.envsentinel.json');
  writeFileSync(output, JSON.stringify(sampleConfig, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write(`Wrote ${output}\n`);
  return 0;
}

function help(): void {
  process.stdout.write(`EnvSentinel\n\nUsage:\n  envsentinel scan [path] [--out report.md] [--format json|markdown] [--fail-on low|medium|high]\n  envsentinel init [path]\n`);
}

try { process.exitCode = main(process.argv.slice(2)); }
catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
