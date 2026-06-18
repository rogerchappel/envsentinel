# EnvSentinel Contract Drift Video Brief

## Hook

"Your README, `.env.example`, Docker Compose file, and code can silently describe
different configuration contracts. EnvSentinel catches that drift locally."

## Grounded demo beats

1. Open `fixtures/clean` and point out the matching example, README, and code
   references.
2. Run `bash demo/contract-drift-smoke.sh`.
3. Show the clean Markdown report path printed by the script.
4. Show the drift JSON report and the expected non-zero gate.
5. Close on the safety model: no `.env` secret loading and no network calls.

## Avoid claims

- Do not claim secret detection is exhaustive.
- Do not claim EnvSentinel replaces runtime validation.
- Do not mention external users or adoption metrics.
