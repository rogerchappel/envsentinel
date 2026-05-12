#!/usr/bin/env bash
set -euo pipefail
rm -rf reports
mkdir -p reports
node dist/src/cli.js scan fixtures/clean --out reports/clean.md
node dist/src/cli.js scan fixtures/drift --format json --out reports/drift.json || true
node dist/src/cli.js scan fixtures/secret-example --fail-on high --out reports/secret.md && {
  echo "expected high severity failure" >&2
  exit 1
} || test "$?" -eq 2
grep -q "EnvSentinel Report" reports/clean.md
grep -q '"issues"' reports/drift.json
echo "smoke ok"
