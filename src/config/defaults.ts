import type { EnvSentinelConfig, IssueCode, Severity } from '../types.js';

const defaultSeverity: Record<IssueCode, Severity> = {
  'code-undocumented': 'high',
  'documented-unused': 'low',
  'missing-example': 'medium',
  'duplicate-default': 'medium',
  'secret-example': 'high',
  'required-missing': 'high',
  'prefix-unapproved': 'medium'
};

export const defaultConfig = {
  required: [],
  publicPrefixes: ['PUBLIC_', 'NEXT_PUBLIC_', 'VITE_', 'REACT_APP_'],
  ignoreFiles: ['node_modules/**', 'dist/**', 'coverage/**', '.git/**'],
  ignoreVariables: ['NODE_ENV', 'CI'],
  severity: defaultSeverity
} satisfies Required<EnvSentinelConfig>;
