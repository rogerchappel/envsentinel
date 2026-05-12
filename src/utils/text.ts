import type { SourceKind, SourceLocation } from '../types.js';

export function location(file: string, text: string, index: number, kind: SourceKind, snippetOverride?: string): SourceLocation {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const lastBreak = before.lastIndexOf('\n');
  const column = index - lastBreak;
  const lineText = text.split('\n')[line - 1]?.trim() ?? '';
  return { file, line, column, kind, snippet: snippetOverride ?? lineText };
}

export function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = key(item);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function normalizeVarName(name: string): string {
  return name.trim().replace(/^\$+/, '').replace(/[),.;:'"`\]}]+$/, '');
}

export function isEnvName(name: string): boolean {
  return /^[A-Z][A-Z0-9_]{1,80}$/.test(name) && name.includes('_');
}
