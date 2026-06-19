#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

rm -rf demo/output
mkdir -p demo/output

npm run build >/dev/null

node dist/src/cli.js scan fixtures/clean --out demo/output/clean.md
node dist/src/cli.js scan fixtures/drift --format json --out demo/output/drift.json

if node dist/src/cli.js scan fixtures/secret-example --fail-on high --out demo/output/secret.md; then
  echo "Expected secret-example to fail at high severity." >&2
  exit 1
fi

grep -q "EnvSentinel Report" demo/output/clean.md
grep -q '"issues"' demo/output/drift.json
grep -q "secret" demo/output/secret.md

printf 'Wrote demo/output/clean.md, demo/output/drift.json, and demo/output/secret.md\n'
