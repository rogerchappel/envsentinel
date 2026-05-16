import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';

const cli = new URL('../src/cli.js', import.meta.url).pathname;
const fixture = (name: string) => new URL(`../fixtures/${name}/`, `file://${process.cwd()}/test/`).pathname;

function run(args: string[]): string {
  return execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
}

describe('cli', () => {
  it('accepts options before the scan target', () => {
    const output = run(['scan', '--format', 'json', fixture('clean')]);
    const parsed = JSON.parse(output);
    assert.equal(parsed.summary.high, 0);
    assert.ok(parsed.files.includes('.env.example'));
  });

  it('rejects invalid option values before scanning', () => {
    const result = spawnSync(process.execPath, [cli, 'scan', '--fail-on', 'critical', fixture('clean')], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Invalid --fail-on value/);
  });
});
