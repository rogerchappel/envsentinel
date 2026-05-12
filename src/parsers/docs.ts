import type { EnvOccurrence } from '../types.js';
import { isEnvName, location, normalizeVarName, uniqueBy } from '../utils/text.js';

export function parseDocs(file: string, text: string): EnvOccurrence[] {
  const occurrences: EnvOccurrence[] = [];
  const regex = /`([A-Z][A-Z0-9_]{1,80})`|\|\s*([A-Z][A-Z0-9_]{1,80})\s*\||\b([A-Z][A-Z0-9_]{2,80})\b/g;
  for (const match of text.matchAll(regex)) {
    const raw = match[1] ?? match[2] ?? match[3] ?? '';
    const name = normalizeVarName(raw);
    if (!isEnvName(name)) continue;
    occurrences.push({ name, source: location(file, text, match.index + match[0].indexOf(raw), 'docs') });
  }
  return uniqueBy(occurrences, (item) => `${item.name}:${item.source.line}`);
}
