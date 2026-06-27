# EnvSentinel social hooks

## Short posts

1. Your `.env.example` can drift away from the code long before runtime fails.
   EnvSentinel scans examples, docs, JS/TS references, Docker Compose, and
   GitHub Actions env blocks, then writes a local Markdown or JSON report.

2. PR review idea: make env contract drift visible before deploy. EnvSentinel is
   a local-first CLI that flags missing, stale, conflicting, and secret-looking
   environment variable examples.

3. If a variable is required in code but absent from docs, reviewers should see
   it. EnvSentinel turns that mismatch into deterministic evidence you can diff
   in CI.

## Demo angle

Run `bash demo/run-contract-scan.sh` to generate a drift report from the
committed fixtures and a clean JSON report for CI automation examples.

Additional angles:

1. Your `.env.example`, README, Docker Compose file, and app code are all
   environment contracts. EnvSentinel checks them together before the drift
   reaches production.
2. Tiny demo: `bash demo/env-contract-drift.sh` builds EnvSentinel, writes
   Markdown and JSON reports, and proves a high-severity secret-looking example
   fails the check.
3. EnvSentinel is local-first: it scans checked-in contract surfaces and never
   loads real `.env` secrets.
4. CI idea: start with `--fail-on high`, fix obvious unsafe examples, then
   tighten the threshold once the report is stable.
