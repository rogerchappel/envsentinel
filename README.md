# EnvSentinel

EnvSentinel is a local-first CLI that audits environment variable contracts before missing variables reach runtime. It compares `.env.example`, `.env.sample`, README/docs mentions, TypeScript/JavaScript code references, Docker Compose environment blocks, and GitHub Actions `env` entries.

## Quick start

```bash
npm install
npm run build
npx envsentinel scan . --out env-report.md
npx envsentinel scan fixtures/drift --format json --fail-on medium
npx envsentinel init
```

## What it catches

- Code-used variables missing from docs or examples.
- Documented variables that no scanned source uses.
- Required variables absent from the project.
- Conflicting example defaults.
- Secret-looking example values.
- Public/client variable names that do not use approved prefixes.

## Configuration

Create `.envsentinel.json`:

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

## Safety model

EnvSentinel never loads `.env` secrets, calls cloud secret managers, or sends project data over the network. It scans checked-in contract surfaces and reports evidence locations only. Use placeholders such as `changeme`, `example`, or `${TOKEN}` in example files.

## CI usage

```yaml
- run: npm ci
- run: npm run build
- run: node dist/cli.js scan . --fail-on medium --out env-report.md
```

## Examples

```bash
node dist/cli.js scan fixtures/clean --out reports/clean.md
node dist/cli.js scan fixtures/secret-example --fail-on high
```

Reports are deterministic Markdown or JSON, making them easy to diff in pull requests.

For a fixture-backed walkthrough that writes both a clean Markdown report and a
failing drift JSON report, run:

```bash
bash demo/contract-drift-smoke.sh
```

See [the contract drift demo](docs/tutorials/contract-drift-demo.md) for the
review checklist and promotion-safe talking points.

Run the fixture-backed demo to generate passing, drifting, and high-severity reports:

```sh
bash demo/env-contract-drift.sh
```

The walkthrough in [docs/tutorials/ci-env-contract-audit.md](docs/tutorials/ci-env-contract-audit.md) shows how to adapt the same scan pattern into a pull request check.

## Development

```sh
git clone https://github.com/rogerchappel/envsentinel.git
cd envsentinel
npm install
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

## Development

Run the same checks locally before opening a change:

```sh
npm ci
npm run check
npm run build
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

## Release readiness

Before opening a release PR, run the same checks that CI runs:

```sh
npm run release:check
npm pack --dry-run
```

The package smoke keeps the published tarball contents visible before tagging or publishing.
