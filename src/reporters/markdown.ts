import type { EnvIssue, ScanResult } from '../types.js';

export function renderMarkdown(result: ScanResult): string {
  const lines = [
    '# EnvSentinel Report',
    '',
    `Root: \`${result.root}\``,
    '',
    '## Summary',
    '',
    `- Variables: ${result.summary.variables}`,
    `- Files scanned: ${result.summary.files}`,
    `- High: ${result.summary.high}`,
    `- Medium: ${result.summary.medium}`,
    `- Low: ${result.summary.low}`,
    `- Info: ${result.summary.info}`,
    '',
    '## Issues',
    ''
  ];
  if (result.issues.length === 0) lines.push('No environment contract drift found.', '');
  else for (const issue of result.issues) lines.push(...renderIssue(issue));
  lines.push('## Variables', '', '| Variable | Examples | Docs | Code | Compose | Actions |', '| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const variable of result.variables) lines.push(`| \`${variable.name}\` | ${variable.examples.length} | ${variable.docs.length} | ${variable.code.length} | ${variable.compose.length} | ${variable.actions.length} |`);
  lines.push('');
  return lines.join('\n');
}

function renderIssue(issue: EnvIssue): string[] {
  const lines = [`### ${issue.severity.toUpperCase()}: ${issue.variable} (${issue.code})`, '', issue.message, '', `Remediation: ${issue.remediation}`, '', 'Evidence:'];
  for (const evidence of issue.evidence) lines.push(`- ${evidence.file}:${evidence.line}:${evidence.column} — \`${evidence.snippet.replaceAll('`', '\\`')}\``);
  lines.push('');
  return lines;
}
