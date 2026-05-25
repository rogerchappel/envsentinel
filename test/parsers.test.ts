import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseCodeRefs } from '../src/parsers/code.js';
import { parseDocs } from '../src/parsers/docs.js';
import { parseEnvExample } from '../src/parsers/env.js';

describe('parsers', () => {
  it('parses dotenv assignments', () => {
    const vars = parseEnvExample('.env.example', 'FOO_BAR=baz\nexport BAZ_QUX="ok"\n');
    assert.deepEqual(vars.map((item) => item.name), ['FOO_BAR', 'BAZ_QUX']);
  });

  it('parses common code references', () => {
    const vars = parseCodeRefs('app.ts', 'process.env.API_TOKEN; process.env [ "WORKER_SECRET" ]; import.meta.env.VITE_URL;');
    assert.deepEqual(vars.map((item) => item.name), ['API_TOKEN', 'WORKER_SECRET', 'VITE_URL']);
  });

  it('parses docs env names', () => {
    const vars = parseDocs('README.md', 'Set `DATABASE_URL` in your shell.');
    assert.equal(vars[0]?.name, 'DATABASE_URL');
  });
});
