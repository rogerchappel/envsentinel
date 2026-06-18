# Contract Drift Demo

This demo shows how EnvSentinel turns a fixture-backed environment contract check
into review evidence.

## Scenario

- `fixtures/clean` contains matching `.env.example`, README mentions, and code
  references.
- `fixtures/drift` intentionally diverges so the CLI can produce a failing JSON
  report for review.

## Run it

```sh
npm install
bash demo/contract-drift-smoke.sh
```

The script builds the CLI, writes a Markdown report for the clean fixture, writes
a JSON report for the drift fixture, and asserts that the drift gate exits
non-zero.

## Review checklist

- Attach the Markdown report when showing the happy path.
- Attach the JSON report when wiring EnvSentinel into CI or release checks.
- Keep example values as placeholders such as `example`, `changeme`, or
  `${TOKEN}` so fixtures never contain real secrets.
