# EnvSentinel PRD

Status: in-progress

## Summary

A local environment-contract auditor that compares `.env.example`, docs, schema files, and code references so missing variables fail before runtime. 🛡️

## Source attribution

Created during the twice-daily OSS factory run on 2026-05-13 after the current unbuilt idea pool had fewer than five candidates. Inspired by recurring local-dev setup failures where env vars drift between code, docs, examples, and CI. This is a renamed/reframed deterministic checker, not copied from a specific project. Web search was attempted during selection and was rate-limited by the provider.

## Target users

- OSS maintainers with local setup docs.
- Agents scaffolding apps and CLIs.
- Developers debugging missing environment variables.

## Problem

Environment variable contracts are spread across `.env.example`, README text, CI YAML, Docker Compose, Zod/envsafe schemas, and raw `process.env` reads. Drift causes broken onboarding, flaky CI, and accidental secret examples.

## Goals

- Scan common env declaration and usage sources offline.
- Report undocumented, unused, missing, duplicate, suspicious, or secret-looking example values.
- Emit Markdown/JSON with evidence and suggested fixes.
- Support config for required variables, allowed prefixes, and ignored examples.
- Include fixtures for Node/TypeScript projects and generic env files.

## Non-goals

- Loading real secret values.
- Contacting cloud secret managers.
- Full language-aware static analysis for every ecosystem.

## V1 CLI

```bash
envsentinel scan . --out env-report.md
envsentinel scan fixtures/drift --format json --fail-on medium
envsentinel init
```

## Functional requirements

1. Parse `.env.example`, `.env.sample`, README/docs env tables, `process.env.NAME`, `import.meta.env.NAME`, Docker Compose environment blocks, and GitHub Actions `env`.
2. Detect code-used but undocumented vars, documented but unused vars, missing examples, duplicate/conflicting defaults, and secret-looking example values.
3. Support `.envsentinel.json` config for required vars, public prefixes, ignored files, and severity overrides.
4. Emit deterministic Markdown/JSON with variable, source locations, severity, and remediation.
5. Include fixture-backed tests for clean, drift, docs-only, compose, and secret-example cases.

## Acceptance criteria

- `npm test`, `npm run check`, `npm run build`, and `npm run smoke` pass.
- `bash scripts/validate.sh` passes when present.
- Real CLI smoke scans checked-in fixtures and writes reports.
- README covers quick start, config, examples, safety model, and CI usage.
- Public GitHub repo `rogerchappel/envsentinel` has useful description and topics.
