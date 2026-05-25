#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { sampleConfig } from './config/load.js';
import { inferFormat, render, type OutputFormat } from './output.js';
import { severityRank } from './rules/issues.js';
import { scan } from './scan.js';
import type { Severity } from './types.js';

const severities = new Set<Severity>(['info', 'low', 'medium', 'high']);
const formats = new Set<OutputFormat>(['json', 'markdown']);

interface Args { command?: string; target: string; out?: string; format?: OutputFormat; failOn?: Severity; config?: string; }

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
  const [command, ...tokens] = argv;
  const args: Args = { command, target: '.' };
  let targetSeen = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '--out') args.out = readOptionValue(tokens, ++i, token);
    else if (token === '--format') {
      const value = readOptionValue(tokens, ++i, token);
      if (!formats.has(value as OutputFormat)) throw new Error(`Invalid --format value: ${value}. Expected json or markdown.`);
      args.format = value as OutputFormat;
    } else if (token === '--fail-on') {
      const value = readOptionValue(tokens, ++i, token);
      if (!severities.has(value as Severity)) throw new Error(`Invalid --fail-on value: ${value}. Expected info, low, medium, or high.`);
      args.failOn = value as Severity;
    } else if (token === '--config') args.config = readOptionValue(tokens, ++i, token);
    else if (token.startsWith('--')) throw new Error(`Unknown option: ${token}`);
    else if (!targetSeen) {
      args.target = token;
      targetSeen = true;
    } else throw new Error(`Unexpected positional argument: ${token}`);
  }

  return args;
}

function readOptionValue(tokens: string[], index: number, option: string): string {
  const value = tokens[index];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}`);
  return value;
}

function init(target: string): number {
  const output = resolve(target, '.envsentinel.json');
  writeFileSync(output, JSON.stringify(sampleConfig, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write(`Wrote ${output}\n`);
  return 0;
}

function help(): void {
  process.stdout.write(`EnvSentinel\n\nUsage:\n  envsentinel scan [path] [--out report.md] [--format json|markdown] [--fail-on info|low|medium|high]\n  envsentinel init [path]\n`);
}

try { process.exitCode = main(process.argv.slice(2)); }
catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
