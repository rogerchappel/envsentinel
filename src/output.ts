import type { ScanResult } from './types.js';
import { renderJson } from './reporters/json.js';
import { renderMarkdown } from './reporters/markdown.js';

export type OutputFormat = 'markdown' | 'json';

export function render(result: ScanResult, format: OutputFormat): string {
  return format === 'json' ? renderJson(result) : renderMarkdown(result);
}

export function inferFormat(out?: string, explicit?: string): OutputFormat {
  if (explicit === 'json' || explicit === 'markdown') return explicit;
  if (out?.endsWith('.json')) return 'json';
  return 'markdown';
}
