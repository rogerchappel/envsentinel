# Configuration

EnvSentinel reads `.envsentinel.json` from the scan root unless `--config` points at another file.

| Key | Type | Purpose |
| --- | --- | --- |
| `required` | string[] | Variables that must appear in at least one scanned source. |
| `publicPrefixes` | string[] | Approved prefixes for client/public variable names. |
| `ignoreFiles` | string[] | Simple glob-like paths excluded from scans. |
| `ignoreVariables` | string[] | Variables excluded from issue evaluation. |
| `severity` | object | Overrides by issue code. |

Severity values are `info`, `low`, `medium`, and `high`.
