# Review an env contract change before a PR merges

This walkthrough uses the checked-in `fixtures/drift` project to show how
EnvSentinel produces review evidence without reading real `.env` files.

## Scenario

A small service documents `DATABASE_URL`, `PUBLIC_API_BASE`, and `STRIPE_KEY`,
but its code and examples drift apart. Before reviewers approve the PR, they
need a deterministic report that shows which variables are missing, stale, or
unsafe to publish as examples.

## Run the demo

```sh
npm install
npm run build
bash demo/run-contract-scan.sh
```

The script writes:

- `demo/output/drift-report.md` for a reviewer-friendly Markdown report.
- `demo/output/clean-report.json` for a machine-readable passing fixture.

## What to review

Open `demo/output/drift-report.md` and check the finding evidence. The report is
grounded in committed files under `fixtures/drift`, including `.env.example`,
`.envsentinel.json`, and `README.md`.

Use the clean JSON output as a stable CI fixture:

```sh
node dist/src/cli.js scan fixtures/clean --format json --fail-on medium
```

## CI gate

Start with `--fail-on medium` when the team wants missing required variables or
secret-looking example values to block merges:

```sh
node dist/src/cli.js scan . --format markdown --out env-report.md --fail-on medium
```

EnvSentinel scans checked-in contract surfaces only. It does not load `.env`
secret values or call remote services.
