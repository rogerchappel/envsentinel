import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';

const cli = resolve('dist/src/cli.js');

function run(args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', cwd: process.cwd() });
}

describe('CLI', () => {
  it('prints help with --help', () => {
    const result = run(['--help']);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /envsentinel/i);
    assert.match(result.stdout, /scan/i);
    assert.match(result.stdout, /init/i);
  });

  it('scan clean fixture exits zero', () => {
    const result = run(['scan', 'fixtures/clean']);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /EnvSentinel Report/i);
  });

  it('scan drift fixture reports missing variables', () => {
    const result = run(['scan', 'fixtures/drift']);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /missing-example|missing|undefined/i);
  });

  it('scan --format json returns parseable json', () => {
    const result = run(['scan', 'fixtures/clean', '--format', 'json']);
    assert.equal(result.status, 0, result.stderr);
    const body = JSON.parse(result.stdout);
    assert.ok(body.issues !== undefined || body.findings !== undefined || body.result !== undefined);
  });

  it('init writes sample config to a temp directory', () => {
    const target = mkdtempSync(`${tmpdir()}/envsentinel-cli-`);
    const result = run(['init', target]);
    assert.equal(result.status, 0, result.stderr);
    const configPath = resolve(target, '.envsentinel.json');
    assert.ok(existsSync(configPath));
  });
});
