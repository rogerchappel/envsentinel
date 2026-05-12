import type { EnvIssue, EnvOccurrence, EnvSentinelConfig, EnvVariableRecord, IssueCode, Severity } from '../types.js';
import { looksSecretLike } from './secrets.js';

export function evaluateIssues(records: EnvVariableRecord[], config: Required<EnvSentinelConfig>): EnvIssue[] {
  const ignored = new Set(config.ignoreVariables);
  const issues: EnvIssue[] = [];
  const byName = new Map(records.map((record) => [record.name, record]));
  for (const required of config.required) {
    if (!byName.has(required)) issues.push(issue('required-missing', required, config, `Required variable ${required} is absent from all scanned sources.`, [], 'Add it to .env.example and document the intended usage.'));
  }
  for (const record of records) {
    if (ignored.has(record.name)) continue;
    const declarationCount = record.examples.length + record.docs.length + record.compose.length + record.actions.length;
    if (record.code.length > 0 && declarationCount === 0) issues.push(issue('code-undocumented', record.name, config, `${record.name} is used in code but not declared in examples, docs, compose, or CI env.`, record.code, 'Add the variable to .env.example and setup documentation.'));
    if (record.docs.length > 0 && record.code.length === 0 && record.examples.length === 0 && record.compose.length === 0 && record.actions.length === 0) issues.push(issue('documented-unused', record.name, config, `${record.name} appears only in documentation.`, record.docs, 'Remove stale documentation or add the matching code/config declaration.'));
    if (record.code.length > 0 && record.examples.length === 0) issues.push(issue('missing-example', record.name, config, `${record.name} has no .env example entry.`, record.code, 'Add a safe placeholder to .env.example or .env.sample.'));
    for (const occurrence of record.examples) if (looksSecretLike(record.name, occurrence.value)) issues.push(issue('secret-example', record.name, config, `${record.name} example value looks like a real secret.`, [occurrence], 'Replace it with a non-sensitive placeholder such as changeme.'));
    const examplesWithValue = record.examples.filter((item) => item.value !== undefined);
    const distinctDefaults = new Set(examplesWithValue.map((item) => item.value));
    if (distinctDefaults.size > 1) issues.push(issue('duplicate-default', record.name, config, `${record.name} has conflicting example defaults.`, examplesWithValue, 'Keep one canonical default across example files.'));
    if (isProbablyPublic(record.name) && !config.publicPrefixes.some((prefix) => record.name.startsWith(prefix))) issues.push(issue('prefix-unapproved', record.name, config, `${record.name} looks client-exposed but does not use an approved public prefix.`, record.occurrences, `Rename it with one of: ${config.publicPrefixes.join(', ')}.`));
  }
  return issues.sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || a.variable.localeCompare(b.variable) || a.code.localeCompare(b.code));
}

function issue(code: IssueCode, variable: string, config: Required<EnvSentinelConfig>, message: string, evidence: EnvOccurrence[], remediation: string): EnvIssue {
  return { code, variable, severity: config.severity[code] ?? 'medium', message, evidence: evidence.map((item) => item.source), remediation };
}

function isProbablyPublic(name: string): boolean {
  return /PUBLIC|CLIENT|BROWSER/.test(name);
}

export function severityRank(severity: Severity): number {
  return { info: 0, low: 1, medium: 2, high: 3 }[severity];
}
