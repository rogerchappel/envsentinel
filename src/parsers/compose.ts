import type { EnvOccurrence } from '../types.js';
import { location } from '../utils/text.js';

export function parseCompose(file: string, text: string): EnvOccurrence[] {
  const occurrences: EnvOccurrence[] = [];
  const regex = /^\s*-\s*([A-Z][A-Z0-9_]*)(?:=(.*))?$|^\s{2,}([A-Z][A-Z0-9_]*)\s*:\s*(.*)$/gm;
  for (const match of text.matchAll(regex)) {
    const name = match[1] ?? match[3];
    const value = (match[2] ?? match[4] ?? '').trim();
    occurrences.push({ name, value, source: location(file, text, match.index + match[0].indexOf(name), 'compose') });
  }
  return occurrences;
}
