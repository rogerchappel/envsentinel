# Safety

EnvSentinel is intentionally offline and conservative.

- It scans contract files and code references; it does not read `.env` by default.
- It does not contact secret stores, package registries, or external APIs during scans.
- It reports file names, line numbers, snippets, and remediation text.
- It treats real-looking example secrets as high severity so they can be rotated and replaced.

If you need to scan generated files, opt in by changing `ignoreFiles` rather than broadening defaults for everyone.
