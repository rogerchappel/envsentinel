import type { EnvOccurrence } from '../types.js';
import { location } from '../utils/text.js';

export function parseEnvExample(file: string, text: string): EnvOccurrence[] {
  const occurrences: EnvOccurrence[] = [];
  const lines = text.split('\n');
  let offset = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = /^export\s+([A-Z][A-Z0-9_]*)\s*=\s*(.*)$|^([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/.exec(trimmed);
      if (match) {
        const name = match[1] ?? match[3];
        const rawValue = match[2] ?? match[4] ?? '';
        occurrences.push({ name, value: unquote(rawValue.trim()), source: location(file, text, offset + line.indexOf(name), 'example', trimmed) });
      }
    }
    offset += line.length + 1;
  }
  return occurrences;
}

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, '');
}
