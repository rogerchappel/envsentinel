import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const candidateExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.md', '.mdx', '.yml', '.yaml', '.json', '.env', '.example', '.sample']);

export function listFiles(root: string, ignorePatterns: string[]): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      const rel = relative(root, full).replaceAll('\\', '/');
      if (isIgnored(rel, ignorePatterns)) continue;
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && shouldScan(entry.name)) files.push(full);
    }
  };
  walk(root);
  return files.sort();
}

export function isIgnored(rel: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith('/**')) return rel === pattern.slice(0, -3) || rel.startsWith(pattern.slice(0, -2));
    if (pattern.includes('*')) return new RegExp('^' + pattern.split('*').map(escapeRegex).join('.*') + '$').test(rel);
    return rel === pattern || rel.startsWith(pattern + '/');
  });
}

function shouldScan(name: string): boolean {
  if (name === '.env.example' || name === '.env.sample' || name === '.envsentinel.json') return true;
  return [...candidateExtensions].some((ext) => name.endsWith(ext));
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

export function safeStatSize(file: string): number {
  try { return statSync(file).size; } catch { return 0; }
}
