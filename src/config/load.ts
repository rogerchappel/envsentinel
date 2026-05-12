import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defaultConfig } from './defaults.js';
import type { EnvSentinelConfig } from '../types.js';

export function loadConfig(root: string, configPath?: string): Required<EnvSentinelConfig> {
  const target = configPath ? resolve(root, configPath) : join(root, '.envsentinel.json');
  if (!existsSync(target)) return structuredClone(defaultConfig);
  const parsed = JSON.parse(readFileSync(target, 'utf8')) as EnvSentinelConfig;
  return {
    required: parsed.required ?? defaultConfig.required,
    publicPrefixes: parsed.publicPrefixes ?? defaultConfig.publicPrefixes,
    ignoreFiles: [...defaultConfig.ignoreFiles, ...(parsed.ignoreFiles ?? [])],
    ignoreVariables: [...defaultConfig.ignoreVariables, ...(parsed.ignoreVariables ?? [])],
    severity: { ...defaultConfig.severity, ...(parsed.severity ?? {}) }
  };
}

export const sampleConfig: Required<EnvSentinelConfig> = defaultConfig;
