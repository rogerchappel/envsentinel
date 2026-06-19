# EnvSentinel Video Brief

## Angle

Show a fast local audit that finds environment variable drift before a missing or unsafe variable reaches runtime.

## Demo Beats

1. Open with the problem: README, `.env.example`, Docker Compose, GitHub Actions, and application code often describe different environment contracts.
2. Run `bash demo/env-contract-drift.sh`.
3. Show `demo/output/clean.md` as the passing baseline.
4. Open `demo/output/drift.json` and point out that the output is machine-readable for CI or agent workflows.
5. Run or show the `fixtures/secret-example` scan with `--fail-on high` and explain that secret-looking example values can block a pull request.

## Commands

```sh
npm install
bash demo/env-contract-drift.sh
node dist/src/cli.js scan fixtures/drift --format json --out demo/output/drift.json
```

## Boundaries To Mention

- EnvSentinel scans checked-in examples, docs, code references, Compose files, and Actions env blocks.
- It does not load real `.env` files.
- It does not call cloud secret managers or send data over the network.
