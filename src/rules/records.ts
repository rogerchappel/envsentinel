import type { EnvOccurrence, EnvVariableRecord, SourceKind } from '../types.js';

export function buildRecords(occurrences: EnvOccurrence[]): EnvVariableRecord[] {
  const map = new Map<string, EnvVariableRecord>();
  for (const occurrence of occurrences) {
    let record = map.get(occurrence.name);
    if (!record) {
      record = { name: occurrence.name, occurrences: [], examples: [], docs: [], code: [], compose: [], actions: [], config: [] };
      map.set(occurrence.name, record);
    }
    record.occurrences.push(occurrence);
    bucket(record, occurrence.source.kind).push(occurrence);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function bucket(record: EnvVariableRecord, kind: SourceKind): EnvOccurrence[] {
  if (kind === 'example') return record.examples;
  if (kind === 'docs') return record.docs;
  if (kind === 'code') return record.code;
  if (kind === 'compose') return record.compose;
  if (kind === 'actions') return record.actions;
  return record.config;
}
