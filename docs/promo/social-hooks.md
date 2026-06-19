# EnvSentinel Social Hooks

1. Your `.env.example`, README, Docker Compose file, and app code are all environment contracts. EnvSentinel checks them together before the drift reaches production.
2. Tiny demo: `bash demo/env-contract-drift.sh` builds EnvSentinel, writes Markdown and JSON reports, and proves a high-severity secret-looking example fails the check.
3. EnvSentinel is local-first: it scans checked-in contract surfaces and never loads real `.env` secrets.
4. CI idea: start with `--fail-on high`, fix obvious unsafe examples, then tighten the threshold once the report is stable.
