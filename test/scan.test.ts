import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { scan } from '../src/scan.js';

const fixture = (name: string) => new URL(`../fixtures/${name}/`, import.meta.url).pathname;

describe('scan', () => {
  it('accepts a clean fixture', () => {
    const result = scan({ root: fixture('clean') });
    assert.equal(result.issues.length, 0);
    assert.ok(result.variables.some((item) => item.name === 'DATABASE_URL'));
  });

  it('detects code-used undocumented variables', () => {
    const result = scan({ root: fixture('drift') });
    assert.ok(result.issues.some((issue) => issue.code === 'missing-example' && issue.variable === 'API_TOKEN'));
    assert.ok(result.issues.some((issue) => issue.code === 'required-missing' && issue.variable === 'QUEUE_URL'));
  });
});
