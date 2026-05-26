import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';

const cli = new URL('../src/cli.js', import.meta.url).pathname;
const fixture = (name: string) => new URL(`../fixtures/${name}/`, `file://${process.cwd()}/test/`).pathname;

function runText(args: string[]): string {
  return execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
}

function run(args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', cwd: process.cwd() });
}

describe('cli', () => {
  it('prints help with all fail-on severities', () => {
    const output = runText(['--help']);
    assert.match(output, /--fail-on info\|low\|medium\|high/);
    assert.match(output, /envsentinel/i);
    assert.match(output, /scan/i);
    assert.match(output, /init/i);
  });

  it('accepts options before the scan target', () => {
    const output = runText(['scan', '--format', 'json', fixture('clean')]);
    const parsed = JSON.parse(output);
    assert.equal(parsed.summary.high, 0);
    assert.ok(parsed.files.includes('.env.example'));
  });

  it('rejects invalid option values before scanning', () => {
    const result = spawnSync(process.execPath, [cli, 'scan', '--fail-on', 'critical', fixture('clean')], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Invalid --fail-on value/);
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
    assert.ok(existsSync(resolve(target, '.envsentinel.json')));
  });
});
