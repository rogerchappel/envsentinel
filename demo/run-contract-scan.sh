#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/demo/output"

mkdir -p "${OUT_DIR}"

node "${ROOT_DIR}/dist/src/cli.js" scan "${ROOT_DIR}/fixtures/drift" \
  --format markdown \
  --out "${OUT_DIR}/drift-report.md"

node "${ROOT_DIR}/dist/src/cli.js" scan "${ROOT_DIR}/fixtures/clean" \
  --format json \
  --out "${OUT_DIR}/clean-report.json"

test -s "${OUT_DIR}/drift-report.md"
test -s "${OUT_DIR}/clean-report.json"

printf 'Wrote %s\n' "${OUT_DIR}/drift-report.md"
printf 'Wrote %s\n' "${OUT_DIR}/clean-report.json"
