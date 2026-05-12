import { resolve } from 'node:path';
import type { EnvOccurrence, ScanOptions, ScanResult, Severity } from './types.js';
import { loadConfig } from './config/load.js';
import { listFiles, safeStatSize } from './utils/files.js';
import { parseFile } from './parsers/index.js';
import { buildRecords } from './rules/records.js';
import { evaluateIssues } from './rules/issues.js';

export function scan(options: ScanOptions): ScanResult {
  const root = resolve(options.root);
  const config = loadConfig(root, options.configPath);
  const files = listFiles(root, config.ignoreFiles).filter((file) => safeStatSize(file) <= 512_000);
  const occurrences: EnvOccurrence[] = [];
  for (const file of files) occurrences.push(...parseFile(root, file));
  const variables = buildRecords(occurrences);
  const issues = evaluateIssues(variables, config);
  return {
    root,
    generatedAt: new Date(0).toISOString(),
    variables,
    issues,
    summary: summarize(variables.length, files.length, issues),
    files: files.map((file) => file.slice(root.length + 1).replaceAll('\\', '/')).sort(),
    config
  };
}

function summarize(variables: number, files: number, issues: { severity: Severity }[]): ScanResult['summary'] {
  const summary = { info: 0, low: 0, medium: 0, high: 0, variables, files };
  for (const issue of issues) summary[issue.severity] += 1;
  return summary;
}
