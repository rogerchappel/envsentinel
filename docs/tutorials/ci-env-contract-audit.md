# CI Environment Contract Audit

This recipe shows how to use EnvSentinel as a pull request check for environment variable drift. It uses the fixtures in this repository so the workflow is safe to run locally before adapting it to another project.

## Run the Local Demo

```sh
bash demo/env-contract-drift.sh
```

The script builds the CLI, scans `fixtures/clean`, writes a JSON report for `fixtures/drift`, and confirms that `fixtures/secret-example` exits non-zero when `--fail-on high` is enabled.

Generated files:

- `demo/output/clean.md`
- `demo/output/drift.json`
- `demo/output/secret.md`

## Add a Pull Request Check

Use Markdown output when reviewers should read the report directly:

```yaml
- run: npm ci
- run: npm run build
- run: node dist/src/cli.js scan . --out env-report.md --fail-on medium
```

Use JSON output when another tool will parse the report:

```yaml
- run: node dist/src/cli.js scan . --format json --out env-report.json
```

## Start With a Focused Policy

Create `.envsentinel.json` and keep the first policy narrow:

```json
{
  "required": ["DATABASE_URL", "API_TOKEN"],
  "publicPrefixes": ["PUBLIC_", "NEXT_PUBLIC_", "VITE_"],
  "ignoreFiles": ["fixtures/**"],
  "ignoreVariables": ["NODE_ENV", "CI"],
  "severity": {
    "documented-unused": "info",
    "secret-example": "high"
  }
}
```

Raise `--fail-on` only after the report is stable in the repository. For a first rollout, `--fail-on high` catches secret-looking examples without blocking every documentation mismatch.

## Reviewer Notes

EnvSentinel scans checked-in contract surfaces only. It does not read real `.env` files or call external secret stores, so the report should be safe to attach to a pull request when the repository fixtures use placeholders.
