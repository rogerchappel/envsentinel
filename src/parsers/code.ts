import type { EnvOccurrence } from '../types.js';
import { location } from '../utils/text.js';

const patterns = [
  /process\.env\.([A-Z][A-Z0-9_]*)/g,
  /process\.env\[['"]([A-Z][A-Z0-9_]*)['"]\]/g,
  /import\.meta\.env\.([A-Z][A-Z0-9_]*)/g,
  /Deno\.env\.get\(['"]([A-Z][A-Z0-9_]*)['"]\)/g
];

export function parseCodeRefs(file: string, text: string): EnvOccurrence[] {
  const occurrences: EnvOccurrence[] = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const name = match[1];
      occurrences.push({ name, source: location(file, text, match.index + match[0].indexOf(name), 'code') });
    }
  }
  return occurrences;
}
