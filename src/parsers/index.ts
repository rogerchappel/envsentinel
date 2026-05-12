import { readFileSync } from 'node:fs';
import { basename, relative } from 'node:path';
import type { EnvOccurrence } from '../types.js';
import { parseActions } from './actions.js';
import { parseCodeRefs } from './code.js';
import { parseCompose } from './compose.js';
import { parseDocs } from './docs.js';
import { parseEnvExample } from './env.js';

export function parseFile(root: string, file: string): EnvOccurrence[] {
  const text = readFileSync(file, 'utf8');
  const rel = relative(root, file).replaceAll('\\', '/');
  const base = basename(file);
  const occurrences: EnvOccurrence[] = [];
  if (base === '.env.example' || base === '.env.sample' || rel.endsWith('.env.example') || rel.endsWith('.env.sample')) occurrences.push(...parseEnvExample(rel, text));
  if (/\.mdx?$/.test(file)) occurrences.push(...parseDocs(rel, text));
  if (/\.[cm]?[jt]sx?$/.test(file)) occurrences.push(...parseCodeRefs(rel, text));
  if (/compose.*\.ya?ml$|docker-compose.*\.ya?ml$/i.test(base)) occurrences.push(...parseCompose(rel, text));
  if (rel.startsWith('.github/workflows/') && /\.ya?ml$/.test(file)) occurrences.push(...parseActions(rel, text));
  return occurrences;
}
