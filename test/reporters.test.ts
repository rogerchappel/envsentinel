import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderJson, renderMarkdown, scan } from '../src/index.js';

const fixture = (name: string) => new URL(`../fixtures/${name}/`, import.meta.url).pathname;

describe('reporters', () => {
  it('renders deterministic markdown', () => {
    const markdown = renderMarkdown(scan({ root: fixture('secret-example') }));
    assert.match(markdown, /EnvSentinel Report/);
    assert.match(markdown, /secret-example/);
  });

  it('renders parseable json', () => {
    const json = renderJson(scan({ root: fixture('docs-only') }));
    const parsed = JSON.parse(json);
    assert.equal(parsed.summary.variables, 1);
  });
});
