export type SourceKind = 'example' | 'docs' | 'code' | 'compose' | 'actions' | 'config';
export type Severity = 'info' | 'low' | 'medium' | 'high';
export type IssueCode = 'code-undocumented' | 'documented-unused' | 'missing-example' | 'duplicate-default' | 'secret-example' | 'required-missing' | 'prefix-unapproved';

export interface SourceLocation {
  file: string;
  line: number;
  column: number;
  kind: SourceKind;
  snippet: string;
}

export interface EnvOccurrence {
  name: string;
  value?: string;
  source: SourceLocation;
}

export interface EnvVariableRecord {
  name: string;
  occurrences: EnvOccurrence[];
  examples: EnvOccurrence[];
  docs: EnvOccurrence[];
  code: EnvOccurrence[];
  compose: EnvOccurrence[];
  actions: EnvOccurrence[];
  config: EnvOccurrence[];
}

export interface EnvIssue {
  code: IssueCode;
  variable: string;
  severity: Severity;
  message: string;
  evidence: SourceLocation[];
  remediation: string;
}

export interface EnvSentinelConfig {
  required?: string[];
  publicPrefixes?: string[];
  ignoreFiles?: string[];
  ignoreVariables?: string[];
  severity?: Partial<Record<IssueCode, Severity>>;
}

export interface ScanOptions {
  root: string;
  configPath?: string;
}

export interface ScanResult {
  root: string;
  generatedAt: string;
  variables: EnvVariableRecord[];
  issues: EnvIssue[];
  summary: Record<Severity, number> & { variables: number; files: number };
  files: string[];
  config: Required<EnvSentinelConfig>;
}
