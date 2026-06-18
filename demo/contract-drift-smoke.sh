#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${TMPDIR:-/tmp}/envsentinel-demo"

cd "$repo_root"
rm -rf "$out_dir"
mkdir -p "$out_dir"

npm run build

node dist/src/cli.js scan fixtures/clean --out "$out_dir/clean.md"

set +e
node dist/src/cli.js scan fixtures/drift --format json --fail-on medium > "$out_dir/drift.json"
drift_status=$?
set -e

test "$drift_status" -ne 0
test -s "$out_dir/clean.md"
test -s "$out_dir/drift.json"
grep -q "EnvSentinel" "$out_dir/clean.md"
grep -q '"severity"' "$out_dir/drift.json"

echo "Clean report: $out_dir/clean.md"
echo "Drift report: $out_dir/drift.json"
echo "Expected drift gate exit: $drift_status"
