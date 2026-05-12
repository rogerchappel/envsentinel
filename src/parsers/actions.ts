import type { EnvOccurrence } from '../types.js';
import { location } from '../utils/text.js';

export function parseActions(file: string, text: string): EnvOccurrence[] {
  const occurrences: EnvOccurrence[] = [];
  const regex = /^\s{2,}([A-Z][A-Z0-9_]*)\s*:\s*(.*)$/gm;
  for (const match of text.matchAll(regex)) {
    const name = match[1];
    const value = (match[2] ?? '').trim();
    const prefix = text.slice(Math.max(0, match.index - 80), match.index);
    if (!/env:\s*$/m.test(prefix) && !/env:\s*[\s\S]{0,80}$/m.test(prefix)) continue;
    occurrences.push({ name, value, source: location(file, text, match.index + match[0].indexOf(name), 'actions') });
  }
  return occurrences;
}
