# n8n Environment Variable Reference

> **Auto-generated** from GitHub (`n8n-io/n8n`, branch: `master`) — do not edit by hand.
> Regenerate with: `node generate-env-docs.js --github --branch master`
> Last generated: 2026-03-24 21:25:12 UTC

This document lists every environment variable recognised by n8n, grouped by the area of functionality it controls. Set these variables in your `docker-compose.yml`, `.env` file, or shell environment before starting n8n.

## Table of Contents

- [Ai Assistant](#ai-assistant)
- [Ai Builder](#ai-builder)
- [Ai](#ai)
- [Auth](#auth)
- [Cache](#cache)
- [Chat Hub](#chat-hub)
- [Credentials](#credentials)
- [Data Table](#data-table)
- [Database](#database)
- [Deployment](#deployment)
- [Diagnostics](#diagnostics)
- [Dynamic Banners](#dynamic-banners)
- [Endpoints](#endpoints)
- [Event Bus](#event-bus)
- [Executions](#executions)
- [External Hooks](#external-hooks)
- [Generic](#generic)
- [Hiring Banner](#hiring-banner)
- [License](#license)
- [Logging](#logging)
- [MFA](#mfa)
- [Multi Main Setup](#multi-main-setup)
- [Nodes](#nodes)
- [Personalization](#personalization)
- [Public API](#public-api)
- [Redis](#redis)
- [Runners](#runners)
- [Scaling Mode](#scaling-mode)
- [Security](#security)
- [Sentry](#sentry)
- [SSO](#sso)
- [SSRF Protection](#ssrf-protection)
- [Tags](#tags)
- [Templates](#templates)
- [User Management](#user-management)
- [Version Notifications](#version-notifications)
- [Workflow History Compaction](#workflow-history-compaction)
- [Workflow History](#workflow-history)
- [Workflows](#workflows)

---

## Ai Assistant

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_AI_ASSISTANT_BASE_URL` | Base URL of the AI assistant service. When set, requests are sent to this URL instead of the default provider endpoint. | `''` | string |

---

## Ai Builder

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_AI_ANTHROPIC_KEY` | API key for the Anthropic (Claude) provider used by the AI workflow builder. When set, enables AI-powered workflow and node building. | `''` | string |

---

## Ai

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_AI_ENABLED` | Whether AI features (such as AI nodes and AI assistant) are enabled globally. | `false` | boolean |
| `N8N_AI_TIMEOUT_MAX` | Maximum time in milliseconds to wait for an HTTP response from an AI service. Matches the maximum workflow execution timeout, EXECUTIONS_TIMEOUT_MAX (1 hour) so AI calls do not outlive executions. Default: 3600000 (1 hour). | `3600000` | number |
| `N8N_AI_ALLOW_SENDING_PARAMETER_VALUES` | Whether workflow and node parameter values may be sent to AI providers. When false, only structure or placeholders are sent. | `true` | boolean |
| `N8N_AI_PERSIST_BUILDER_SESSIONS` | Whether to persist AI workflow builder sessions to the database. | `false` | boolean |

---

## Auth

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SECURE_COOKIE` | Whether to set the `Secure` flag on the n8n authentication cookie (recommended for HTTPS). | `true` | boolean |
| `N8N_SAMESITE_COOKIE` | Value for the `SameSite` attribute on the n8n authentication cookie (`strict`, `lax`, or `none`). | `'lax'` | Samesite |

---

## Cache

### Memory

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_CACHE_MEMORY_MAX_SIZE` | Maximum size of the in-memory cache in bytes. Default: 3 MiB. | `3145728` | number |
| `N8N_CACHE_MEMORY_TTL` | Time to live in milliseconds for entries in the memory cache. Default: 1 hour. | `3600000` | number |

### Redis

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_CACHE_REDIS_KEY_PREFIX` | Key prefix for cache entries stored in Redis. | `'cache'` | string |
| `N8N_CACHE_REDIS_TTL` | Time to live in milliseconds for Redis cache entries. Set to 0 to disable expiry. Default: 1 hour. | `3600000` | number |

### Cache

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_CACHE_BACKEND` | Cache backend: `memory`, `redis`, or `auto` (choose based on deployment). | `'auto'` | CacheBackend |

---

## Chat Hub

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_CHAT_HUB_EXECUTION_CONTEXT_TTL` | Time to live in seconds for execution context in Chat Hub. Maximum duration for a single non-streaming Workflow Agent execution, including wait time. After this TTL, responses from those executions are no longer captured or sent to the client. | `3600` | number |
| `N8N_CHAT_HUB_STREAM_STATE_TTL` | Time to live in seconds for stream state in Chat Hub. Inactive streams are cleaned up after this duration. | `300` | number |
| `N8N_CHAT_HUB_MAX_BUFFERED_CHUNKS` | Maximum number of response chunks to buffer per stream for reconnection in Chat Hub. | `1000` | number |

---

## Credentials

### Credentials Overwrite

| Variable | Description | Default | Type |
|---|---|---|---|
| `CREDENTIALS_OVERWRITE_DATA` | JSON object of prefilled credential data (overwrites). End users cannot view or edit these values. Format: `{ "CREDENTIAL_NAME": { "PARAMETER": "VALUE" } }`. | `'{}'` | string |
| `CREDENTIALS_OVERWRITE_ENDPOINT` | Endpoint of an internal API that returns overwritten credential definitions. When set, overwrites are loaded from this endpoint. | `''` | string |
| `CREDENTIALS_OVERWRITE_ENDPOINT_AUTH_TOKEN` | Token used to authenticate requests to the credentials overwrite endpoint. | `''` | string |
| `CREDENTIALS_OVERWRITE_PERSISTENCE` | Whether to persist credential overwrites so they survive restarts. | `false` | boolean |
| `N8N_SKIP_CREDENTIAL_OVERWRITE` | Comma-separated list of credential types for which overwrites are skipped when the credential has been customized (any overwrite field has a user-set value differing from the overwrite). | `[]` | CommaSeparatedStringArray<string> |

### Credentials

| Variable | Description | Default | Type |
|---|---|---|---|
| `CREDENTIALS_DEFAULT_NAME` | Default name suggested when creating new credentials. | `'My credentials'` | string |

---

## Data Table

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_DATA_TABLES_MAX_SIZE_BYTES` | Maximum total size in bytes allowed for data tables. Default: 50 MiB. | `52428800` | number |
| `N8N_DATA_TABLES_SIZE_CHECK_CACHE_DURATION_MS` | Duration in milliseconds to cache data table size checks. Reduces database load when validating size repeatedly. | `5000` | number |
| `N8N_DATA_TABLES_CLEANUP_INTERVAL_MS` | Interval in milliseconds between cleanup runs for orphaned upload files. Default: 60000 milliseconds. | `60000` | number |
| `N8N_DATA_TABLES_FILE_MAX_AGE_MS` | Age in milliseconds after which an uploaded file is treated as orphaned and deleted during cleanup. Default: 2 minutes. | `120000` | number |

---

## Database

### Logging

| Variable | Description | Default | Type |
|---|---|---|---|
| `DB_LOGGING_ENABLED` | Whether database logging is enabled. | `false` | boolean |
| `DB_LOGGING_OPTIONS` | Database logging verbosity. Only applies when `DB_LOGGING_MAX_EXECUTION_TIME` is greater than 0. | `'error'` | DbLoggingOptions |
| `DB_LOGGING_MAX_EXECUTION_TIME` | Only log queries that run longer than this many milliseconds. Set to 0 to disable slow-query logging. | `0` | number |

### Postgres SSL

| Variable | Description | Default | Type |
|---|---|---|---|
| `DB_POSTGRESDB_SSL_ENABLED` | Whether to use SSL/TLS for the Postgres connection. Defaults to true if any of the SSL cert/key/CA environment variables are set. | `false` | boolean |
| `DB_POSTGRESDB_SSL_CA` | Path or contents of the CA certificate for Postgres SSL. | `''` | string |
| `DB_POSTGRESDB_SSL_CERT` | Path or contents of the client certificate for Postgres SSL. | `''` | string |
| `DB_POSTGRESDB_SSL_KEY` | Path or contents of the client private key for Postgres SSL. | `''` | string |
| `DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED` | Whether to reject Postgres connections when the server certificate cannot be verified. | `true` | boolean |

### Postgres

| Variable | Description | Default | Type |
|---|---|---|---|
| `DB_POSTGRESDB_DATABASE` | Postgres database name. | `'n8n'` | string |
| `DB_POSTGRESDB_HOST` | Postgres database host. | `'localhost'` | string |
| `DB_POSTGRESDB_PASSWORD` | Postgres database password. | `''` | string |
| `DB_POSTGRESDB_PORT` | Postgres database port. | `5432` | number |
| `DB_POSTGRESDB_USER` | Postgres user name. | `'postgres'` | string |
| `DB_POSTGRESDB_SCHEMA` | Postgres schema to use. | `'public'` | string |
| `DB_POSTGRESDB_POOL_SIZE` | Maximum number of connections in the Postgres connection pool. | `2` | number |
| `DB_POSTGRESDB_CONNECTION_TIMEOUT` | Timeout in milliseconds when establishing a new Postgres connection. | `20000` | number |
| `DB_POSTGRESDB_IDLE_CONNECTION_TIMEOUT` | Time in milliseconds after which an idle connection in the pool is closed. | `30000` | number |
| `DB_POSTGRESDB_STATEMENT_TIMEOUT` | Maximum time in milliseconds for a single query. Queries exceeding this are cancelled. Set to 0 to disable. | `300000` | number |

### Sqlite

| Variable | Description | Default | Type |
|---|---|---|---|
| `DB_SQLITE_DATABASE` | Path to the SQLite database file. | `'database.sqlite'` | string |
| `DB_SQLITE_POOL_SIZE` | Number of connections in the SQLite connection pool. Must be at least 1. | `3` | number |
| `DB_SQLITE_VACUUM_ON_STARTUP` | Whether to run SQLite VACUUM on startup to reclaim space and optimize the file. | `false` | boolean |

### Database

| Variable | Description | Default | Type |
|---|---|---|---|
| `DB_TYPE` | Database type: `sqlite` or `postgresdb`. | `'sqlite'` | DbType |
| `DB_TABLE_PREFIX` | Prefix prepended to all n8n table names (useful for shared databases). | `''` | string |
| `DB_PING_INTERVAL_SECONDS` | Interval in seconds between health-check pings to the database. | `2` | number |

---

## Deployment

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_DEPLOYMENT_TYPE` | Deployment type identifier (for example, `default`, `cloud`). Used for telemetry and feature behavior. | `'default'` | string |

---

## Diagnostics

### Post Hog

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_DIAGNOSTICS_POSTHOG_API_KEY` | PostHog project API key for product analytics. | `'phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo'` | string |
| `N8N_DIAGNOSTICS_POSTHOG_API_HOST` | PostHog API host URL. | `'https:` | string |

### Diagnostics

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_DIAGNOSTICS_ENABLED` | Whether anonymous diagnostics and telemetry are enabled for this instance. | `true` | boolean |
| `N8N_DIAGNOSTICS_CONFIG_FRONTEND` | Telemetry endpoint config for the frontend (format: key;baseUrl). | `'1zPn9bgWPzlQc0p8Gj1uiK6DOTn;https:` | string |
| `N8N_DIAGNOSTICS_CONFIG_BACKEND` | Telemetry endpoint config for the backend (format: key;baseUrl). | `'1zPn7YoGC3ZXE9zLeTKLuQCB4F6;https:` | string |

---

## Dynamic Banners

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_DYNAMIC_BANNERS_ENDPOINT` | URL to fetch dynamic banner content from (for example, in-app announcements). | `'https:` | string |
| `N8N_DYNAMIC_BANNERS_ENABLED` | Whether to fetch and show dynamic banners (for example, announcements) from the endpoint. | `true` | boolean |

---

## Endpoints

### Prometheus Metrics

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_METRICS` | Whether to enable the `/metrics` endpoint to expose Prometheus metrics. | `false` | boolean |
| `N8N_METRICS_PREFIX` | Prefix for Prometheus metric names. | `'n8n_'` | string |
| `N8N_METRICS_INCLUDE_DEFAULT_METRICS` | Whether to expose system and Node.js metrics. See: https://www.npmjs.com/package/prom-client | `true` | boolean |
| `N8N_METRICS_INCLUDE_WORKFLOW_ID_LABEL` | Whether to include a label for workflow ID on workflow metrics. | `false` | boolean |
| `N8N_METRICS_INCLUDE_NODE_TYPE_LABEL` | Whether to include a label for node type on node metrics. | `false` | boolean |
| `N8N_METRICS_INCLUDE_CREDENTIAL_TYPE_LABEL` | Whether to include a label for credential type on credential metrics. | `false` | boolean |
| `N8N_METRICS_INCLUDE_API_ENDPOINTS` | Whether to expose metrics for API endpoints. See: https://www.npmjs.com/package/express-prom-bundle | `false` | boolean |
| `N8N_METRICS_INCLUDE_API_PATH_LABEL` | Whether to include a label for the path of API endpoint calls. | `false` | boolean |
| `N8N_METRICS_INCLUDE_API_METHOD_LABEL` | Whether to include a label for the HTTP method of API endpoint calls. | `false` | boolean |
| `N8N_METRICS_INCLUDE_API_STATUS_CODE_LABEL` | Whether to include a label for the status code of API endpoint calls. | `false` | boolean |
| `N8N_METRICS_INCLUDE_CACHE_METRICS` | Whether to include metrics for cache hits and misses. | `false` | boolean |
| `N8N_METRICS_INCLUDE_MESSAGE_EVENT_BUS_METRICS` | Whether to include metrics derived from n8n's internal events | `false` | boolean |
| `N8N_METRICS_INCLUDE_QUEUE_METRICS` | Whether to include metrics for jobs in scaling mode. Not supported in multi-main setup. | `false` | boolean |
| `N8N_METRICS_QUEUE_METRICS_INTERVAL` | How often (in seconds) to update queue metrics. | `20` | number |
| `N8N_METRICS_ACTIVE_WORKFLOW_METRIC_INTERVAL` | How often (in seconds) to update active workflow metric | `60` | number |
| `N8N_METRICS_INCLUDE_WORKFLOW_NAME_LABEL` | Whether to include a label for workflow name on workflow metrics. | `false` | boolean |
| `N8N_METRICS_INCLUDE_WORKFLOW_EXECUTION_DURATION` | Whether to include a histogram metric for workflow execution duration. | `true` | boolean |
| `N8N_METRICS_INCLUDE_WORKFLOW_STATISTICS` | Whether to include workflow execution statistics as metrics. | `false` | boolean |
| `N8N_METRICS_WORKFLOW_STATISTICS_INTERVAL` | How often (in seconds) to update workflow statistics metrics. | `300` | number |

### Endpoints

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_PAYLOAD_SIZE_MAX` | Maximum request payload size in MiB for the API. | `16` | number |
| `N8N_FORMDATA_FILE_SIZE_MAX` | Maximum size in MiB for a single file in multipart/form-data webhook payloads. | `200` | number |
| `N8N_ENDPOINT_REST` | Path segment for REST API endpoints. | `'rest'` | string |
| `N8N_ENDPOINT_FORM` | Path segment for form endpoints. | `'form'` | string |
| `N8N_ENDPOINT_FORM_TEST` | Path segment for test form endpoints. | `'form-test'` | string |
| `N8N_ENDPOINT_FORM_WAIT` | Path segment for waiting form endpoints. | `'form-waiting'` | string |
| `N8N_ENDPOINT_WEBHOOK` | Path segment for webhook endpoints. | `'webhook'` | string |
| `N8N_ENDPOINT_WEBHOOK_TEST` | Path segment for test webhook endpoints. | `'webhook-test'` | string |
| `N8N_ENDPOINT_WEBHOOK_WAIT` | Path segment for waiting webhook endpoints. | `'webhook-waiting'` | string |
| `N8N_ENDPOINT_MCP` | Path segment for MCP endpoints. | `'mcp'` | string |
| `N8N_ENDPOINT_MCP_TEST` | Path segment for test MCP endpoints. | `'mcp-test'` | string |
| `N8N_MCP_BUILDER_ENABLED` | Whether to enable workflow builder tools in the MCP server. | `true` | boolean |
| `N8N_DISABLE_UI` | Whether to disable n8n's UI (frontend). | `false` | boolean |
| `N8N_DISABLE_PRODUCTION_MAIN_PROCESS` | Whether to disable production webhooks on the main process, when using webhook-specific processes. | `false` | boolean |
| `N8N_ADDITIONAL_NON_UI_ROUTES` | Colon-separated list of path segments that should not serve the UI (for example, health or webhook-only routes). | `''` | string |

---

## Event Bus

### Log Writer

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_EVENTBUS_LOGWRITER_KEEPLOGCOUNT` | Number of event log files to retain; older files are rotated out. | `3` | number |
| `N8N_EVENTBUS_LOGWRITER_MAXFILESIZEINKB` | Maximum size in KB of a single event log file before rotation. Default: 10 MB. | `10240` | number |
| `N8N_EVENTBUS_LOGWRITER_LOGBASENAME` | Base filename for event log files (extension and rotation suffix are added). | `'n8nEventLog'` | string |

### Event Bus

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_EVENTBUS_CHECKUNSENTINTERVAL` | Interval in milliseconds to check for and resend unsent event-bus messages. Set to 0 to disable (may rarely allow duplicate sends when non-zero). | `0` | number |
| `N8N_EVENTBUS_RECOVERY_MODE` | After a crash: `extensive` recovers full execution details; `simple` only marks executions as crashed. | `'extensive'` | RecoveryMode |

---

## Executions

### Pruning Intervals

| Variable | Description | Default | Type |
|---|---|---|---|
| `EXECUTIONS_DATA_PRUNE_HARD_DELETE_INTERVAL` | How often (minutes) execution data should be hard-deleted. | `15` | number |
| `EXECUTIONS_DATA_PRUNE_SOFT_DELETE_INTERVAL` | How often (minutes) execution data should be soft-deleted. | `60` | number |

### Concurrency

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_CONCURRENCY_PRODUCTION_LIMIT` | Max production executions allowed to run concurrently. `-1` means unlimited. Default for scaling mode is taken from the worker's `--concurrency` flag. | `-1` | number |
| `N8N_CONCURRENCY_EVALUATION_LIMIT` | Max evaluation executions allowed to run concurrently. `-1` means unlimited. | `-1` | number |

### Queue Recovery

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_EXECUTIONS_QUEUE_RECOVERY_INTERVAL` | How often (minutes) to check for queue recovery. | `180` | number |
| `N8N_EXECUTIONS_QUEUE_RECOVERY_BATCH` | Size of batch of executions to check for queue recovery. | `100` | number |

### Recovery

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_WORKFLOW_AUTODEACTIVATION_MAX_LAST_EXECUTIONS` | Number of last executions to check when determining if a workflow should be deactivated when all of the last N executions have crashed. | `3` | number |
| `N8N_WORKFLOW_AUTODEACTIVATION_ENABLED` | Whether to automatically deactivate workflows that have all their last executions crashed. | `false` | boolean |

### Executions

| Variable | Description | Default | Type |
|---|---|---|---|
| `EXECUTIONS_MODE` | Whether to run executions in regular mode (in-process) or scaling mode (in workers). | `'regular'` | ExecutionMode |
| `EXECUTIONS_TIMEOUT` | How long (seconds) a workflow execution may run for before timeout. On timeout, the execution will be forcefully stopped. `-1` for unlimited. Currently unlimited by default - this default will change in a future version. | `-1` | number |
| `EXECUTIONS_TIMEOUT_MAX` | Upper bound in seconds for execution timeout. Default: 1 hour. | `3600` | number |
| `EXECUTIONS_DATA_PRUNE` | Whether to delete past executions on a rolling basis. | `true` | boolean |
| `EXECUTIONS_DATA_MAX_AGE` | How old (hours) a finished execution must be to qualify for soft-deletion. | `336` | number |
| `EXECUTIONS_DATA_PRUNE_MAX_COUNT` | Max number of finished executions to keep in database. Does not necessarily prune to the exact max number. `0` for unlimited. | `10000` | number |
| `EXECUTIONS_DATA_HARD_DELETE_BUFFER` | How old (hours) a finished execution must be to qualify for hard-deletion. This buffer by default excludes recent executions as the user may need them while building a workflow. | `1` | number |
| `EXECUTIONS_DATA_SAVE_ON_ERROR` | Whether to save execution data for failed production executions. This default can be overridden at a workflow level. | `'all'` | string (all | none) |
| `EXECUTIONS_DATA_SAVE_ON_SUCCESS` | Whether to save execution data for successful production executions. This default can be overridden at a workflow level. | `'all'` | string (all | none) |
| `EXECUTIONS_DATA_SAVE_ON_PROGRESS` | Whether to save execution data as each node executes. This default can be overridden at a workflow level. | `false` | boolean |
| `EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS` | Whether to save execution data for manual executions. This default can be overridden at a workflow level. | `true` | boolean |

---

## External Hooks

| Variable | Description | Default | Type |
|---|---|---|---|
| `EXTERNAL_HOOK_FILES_SEPARATOR` | Separator character for EXTERNAL_HOOK_FILES. Defaults to ':'. Use ';' on Windows. | `':'` | string |
| `EXTERNAL_HOOK_FILES` | Paths to files that define external lifecycle hooks. Separated by EXTERNAL_HOOK_FILES_SEPARATOR. | `[]` | ColonSeparatedStringArray |

---

## Generic

| Variable | Description | Default | Type |
|---|---|---|---|
| `GENERIC_TIMEZONE` | Default timezone for the instance. Can be overridden per workflow. | `'America/New_York'` | string |
| `N8N_RELEASE_TYPE` | Release channel (for example, stable, beta, nightly). Affects update checks and some defaults. | `'dev'` | ReleaseChannel |
| `N8N_GRACEFUL_SHUTDOWN_TIMEOUT` | Seconds to wait for graceful shutdown (for example, finishing executions) before the process exits. | `30` | number |

---

## Hiring Banner

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_HIRING_BANNER_ENABLED` | Whether to show the hiring/recruitment message in the browser devtools console. | `true` | boolean |

---

## License

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_LICENSE_SERVER_URL` | URL of the license server used to validate and refresh licenses. | `'https:` | string |
| `N8N_LICENSE_AUTO_RENEW_ENABLED` | Whether to automatically renew licenses before they expire. | `true` | boolean |
| `N8N_LICENSE_ACTIVATION_KEY` | Activation key used to activate or upgrade the instance license. | `''` | string |
| `N8N_LICENSE_DETACH_FLOATING_ON_SHUTDOWN` | Whether to release floating entitlements back to the pool when the instance shuts down. | `true` | boolean |
| `N8N_LICENSE_TENANT_ID` | Tenant identifier for the license SDK (for example, self-hosted, sandbox, embed, cloud). | `1` | number |
| `N8N_LICENSE_CERT` | Ephemeral license certificate. See: https://github.com/n8n-io/license-management?tab=readme-ov-file#concept-ephemeral-entitlements | `''` | string |

---

## Logging

### Cron Logging

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_LOG_CRON_ACTIVE_INTERVAL` | Interval in minutes to log currently active cron jobs. Set to `0` to disable. | `0` | number |

### File Logging

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_LOG_FILE_COUNT_MAX` | Max number of log files to keep, or max number of days to keep logs for. Once the limit is reached, the oldest log files will be rotated out. If using days, append a `d` suffix. Only for `file` log output. | `100` | number |
| `N8N_LOG_FILE_SIZE_MAX` | Max size (in MiB) for each log file. Only for `file` log output. | `16` | number |
| `N8N_LOG_FILE_LOCATION` | Location of the log files inside `~/.n8n`. Only for `file` log output. | `'logs/n8n.log'` | string |

### Logging

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_LOG_LEVEL` | Minimum level of logs to output. Logs with this or higher level will be output; logs with lower levels will not. Exception: `silent` disables all logging. | `'info'` | LogLevel |
| `N8N_LOG_OUTPUT` | Where to output logs to. Options are: `console` or `file` or both in a comma separated list. | `['console']` | CommaSeparatedStringArray<'console' | 'file'> |
| `N8N_LOG_FORMAT` | What format the logs should have. `text` is only printing the human readable messages. `json` is printing one JSON object per line containing the message, level, timestamp and all the metadata. | `'text'` | string (text | json) |
| `N8N_LOG_SCOPES` | Scopes to filter logs by. Nothing is filtered by default. Supported log scopes: - `concurrency` - `external-secrets` - `license` - `multi-main-setup` - `pruning` - `pubsub` - `push` - `redis` - `scaling` - `waiting-executions` - `task-runner-js` - `task-runner-py` - `workflow-activation` - `insights` - `chat-hub` | `[]` | CommaSeparatedStringArray<LogScope> |

---

## MFA

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_MFA_ENABLED` | Whether multi-factor authentication (MFA) is enabled for the instance. | `true` | boolean |

---

## Multi Main Setup

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_MULTI_MAIN_SETUP_ENABLED` | Whether to enable multi-main setup when using scaling mode (requires license). | `false` | boolean |
| `N8N_MULTI_MAIN_SETUP_KEY_TTL` | Time to live in seconds for the leader lock key; the current leader must renew before this expires. | `10` | number |
| `N8N_MULTI_MAIN_SETUP_CHECK_INTERVAL` | Interval in seconds between leader eligibility checks in multi-main setup. | `3` | number |

---

## Nodes

| Variable | Description | Default | Type |
|---|---|---|---|
| `NODES_INCLUDE` | Node types to load. If empty, all available nodes are loaded. Example: `["n8n-nodes-base.hackerNews"]`. | `[]` | JsonStringArray |
| `NODES_EXCLUDE` | Node types to exclude from loading. Default excludes `ExecuteCommand` and `LocalFileTrigger` for security. Set to an empty array to allow all node types. | `['n8n-nodes-base.executeCommand', 'n8n-nodes-base.localFileTrigger']` | JsonStringArray |
| `NODES_ERROR_TRIGGER_TYPE` | Node type name used as the default error trigger when workflow execution fails. | `'n8n-nodes-base.errorTrigger'` | string |
| `N8N_PYTHON_ENABLED` | Whether to enable Python execution on the Code node. | `true` | boolean |

---

## Personalization

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_PERSONALIZATION_ENABLED` | Whether to enable personalization features. | `true` | boolean |

---

## Public API

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_PUBLIC_API_DISABLED` | When true, the public API is disabled and its routes are not registered. | `false` | boolean |
| `N8N_PUBLIC_API_ENDPOINT` | URL path segment for the Public API (for example, /api/v1/...). | `'api'` | string |
| `N8N_PUBLIC_API_SWAGGERUI_DISABLED` | When true, the Swagger UI for the Public API is not served. | `false` | boolean |

---

## Redis

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_REDIS_KEY_PREFIX` | Key prefix for all Redis keys used by n8n (avoids clashes when sharing a Redis instance). | `'n8n'` | string |

---

## Runners

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_RUNNERS_MODE` | How the task runner runs: `internal` (child process of n8n) or `external` (separate process). | `'internal'` | TaskRunnerMode |
| `N8N_RUNNERS_PATH` | URL path segment where the task runner service is exposed (for example, `/runners`). | `'/runners'` | string |
| `N8N_RUNNERS_AUTH_TOKEN` | Shared secret used to authenticate runner processes with the broker. | `''` | string |
| `N8N_RUNNERS_BROKER_PORT` | Port the task runner broker listens on for runner connections. | `5679` | number |
| `N8N_RUNNERS_BROKER_LISTEN_ADDRESS` | IP address the task runner broker binds to. | `'127.0.0.1'` | string |
| `N8N_RUNNERS_MAX_PAYLOAD` | Maximum size in bytes of a payload sent to a runner. Default: 1 GiB. | `1073741824` | number |
| `N8N_RUNNERS_MAX_OLD_SPACE_SIZE` | Node.js `--max-old-space-size` value in MB for the runner process. Empty lets Node choose based on memory. | `''` | string |
| `N8N_RUNNERS_MAX_CONCURRENCY` | Maximum number of tasks a single runner can execute concurrently. | `10` | number |
| `N8N_RUNNERS_TASK_TIMEOUT` | How long (in seconds) a task is allowed to take for completion, else the task will be aborted. (In internal mode, the runner will also be restarted.) Must be greater than 0. Kept high for backwards compatibility - n8n v3 will reduce this to `60` | `300` | number |
| `N8N_RUNNERS_TASK_REQUEST_TIMEOUT` | How long (in seconds) a task request can wait for a runner to become available before timing out. This prevents workflows from hanging indefinitely when no runners are available. Must be greater than 0. | `60` | number |
| `N8N_RUNNERS_HEARTBEAT_INTERVAL` | Interval in seconds between heartbeats from runner to broker; missing heartbeats abort the task (and restart the runner in internal mode). Must be > 0. | `30` | number |
| `N8N_RUNNERS_INSECURE_MODE` | Whether to disable all security measures in the task runner. **Discouraged for production use.** Set to `true` for compatibility with modules that rely on insecure JS features. | `false` | boolean |

---

## Scaling Mode

### Health

| Variable | Description | Default | Type |
|---|---|---|---|
| `QUEUE_HEALTH_CHECK_ACTIVE` | Whether to enable worker health endpoints: `/healthz` (liveness) and `/healthz/readiness` (DB and Redis ready). | `false` | boolean |
| `QUEUE_HEALTH_CHECK_PORT` | Port the worker HTTP server listens on for health checks. | `5678` | number |
| `N8N_WORKER_SERVER_ADDRESS` | IP address the worker server binds to. Use `::` for all interfaces. | `'::'` | string |

### Redis

| Variable | Description | Default | Type |
|---|---|---|---|
| `QUEUE_BULL_REDIS_DB` | Redis database for Bull queue. | `0` | number |
| `QUEUE_BULL_REDIS_HOST` | Redis host for Bull queue. | `'localhost'` | string |
| `QUEUE_BULL_REDIS_PASSWORD` | Password to authenticate with Redis. | `''` | string |
| `QUEUE_BULL_REDIS_PORT` | Port for Redis to listen on. | `6379` | number |
| `QUEUE_BULL_REDIS_TIMEOUT_THRESHOLD` | Max cumulative timeout (in milliseconds) of connection retries before process exit. | `10000` | number |
| `QUEUE_BULL_REDIS_SLOT_REFRESH_TIMEOUT` | Slot refresh timeout (in milliseconds) before a timeout occurs while refreshing slots from the cluster. | `1000` | number |
| `QUEUE_BULL_REDIS_SLOT_REFRESH_INTERVAL` | Slot refresh interval (in milliseconds) between every automatic slot refresh. | `5000` | number |
| `QUEUE_BULL_REDIS_USERNAME` | Redis username. Redis 6.0 or higher required. | `''` | string |
| `QUEUE_BULL_REDIS_CLUSTER_NODES` | Redis cluster startup nodes, as comma-separated list of `{host}:{port}` pairs. @example 'redis-1:6379,redis-2:6379' | `''` | string |
| `QUEUE_BULL_REDIS_TLS` | Whether to enable TLS on Redis connections. | `false` | boolean |
| `QUEUE_BULL_REDIS_DNS_LOOKUP_STRATEGY` | DNS resolution strategy for Redis hostnames on initial client connection. - `LOOKUP` (default): Use system DNS resolver to resolve hostnames to IP addresses. - `NONE`: Disable DNS resolution and pass hostnames directly to Redis client. DNS lookups can be error prone, especially in combination with TLS certificates. Especially AWS Elasticache cluster connections often lead to invalid certificate errors due to hostname/ip mismatches. For AWS ElastiCache clusters with TLS, it is recommended to set this option to `NONE`. @see https://github.com/redis/ioredis?tab=readme-ov-file#special-note-aws-elasticache-clusters-with-tls | `'LOOKUP'` | string (LOOKUP | NONE) |
| `QUEUE_BULL_REDIS_DUALSTACK` | Whether to enable dual-stack hostname resolution for Redis connections. | `false` | boolean |
| `QUEUE_BULL_REDIS_KEEP_ALIVE` | Whether to enable TCP keep-alive on Redis connections. | `false` | boolean |
| `QUEUE_BULL_REDIS_KEEP_ALIVE_DELAY` | TCP keep-alive initial delay in milliseconds. | `5000` | number |
| `QUEUE_BULL_REDIS_KEEP_ALIVE_INTERVAL` | TCP keep-alive interval in milliseconds. | `5000` | number |
| `QUEUE_BULL_REDIS_RECONNECT_ON_FAILOVER` | Whether to reconnect to Redis on READONLY errors i.e., failover events. | `true` | boolean |

### Settings

| Variable | Description | Default | Type |
|---|---|---|---|
| `QUEUE_WORKER_LOCK_DURATION` | How long (in milliseconds) is the lease period for a worker processing a job. | `60000` | number |
| `QUEUE_WORKER_LOCK_RENEW_TIME` | How often (in milliseconds) a worker must renew the lease. | `10000` | number |
| `QUEUE_WORKER_STALLED_INTERVAL` | How often (in milliseconds) Bull must check for stalled jobs. `0` to disable. | `30000` | number |

### Bull

| Variable | Description | Default | Type |
|---|---|---|---|
| `QUEUE_BULL_PREFIX` | Prefix for Bull keys on Redis. @example 'bull:jobs:23' | `'bull'` | string |
| `QUEUE_WORKER_TIMEOUT` | — | `30` | number |

---

## Security

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_RESTRICT_FILE_ACCESS_TO` | Dirs that the `ReadWriteFile` and `ReadBinaryFiles` nodes are allowed to access. Separate multiple dirs with semicolon `;`. Set to an empty string to disable restrictions (insecure, not recommended for production). | `'~/.n8n-files'` | string |
| `N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES` | Whether to block nodes from accessing files at dirs internally used by n8n: - `~/.n8n` - `~/.cache/n8n/public` - any dirs specified by `N8N_CONFIG_FILES`, `N8N_CUSTOM_EXTENSIONS`, `N8N_BINARY_DATA_STORAGE_PATH`, `N8N_UM_EMAIL_TEMPLATES_INVITE`, and `UM_EMAIL_TEMPLATES_PWRESET`. | `true` | boolean |
| `N8N_BLOCK_FILE_PATTERNS` | Regex patterns for files and folders that `ReadWriteFile` and `ReadBinaryFiles` nodes cannot access. Separate multiple patterns with semicolons. Default blocks `.git`. Set to empty to disable pattern-based blocking. | `'^(.*\\/)*\\.git(\\/.*)*$'` | string |
| `N8N_SECURITY_AUDIT_DAYS_ABANDONED_WORKFLOW` | In a [security audit](https://docs.n8n.io/hosting/securing/security-audit/), how many days for a workflow to be considered abandoned if not executed. | `90` | number |
| `N8N_CONTENT_SECURITY_POLICY` | Set [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers as [helmet.js](https://helmetjs.github.io/#content-security-policy) nested directives object. Example: { "frame-ancestors": ["http://localhost:3000"] } | `'{}'` | string |
| `N8N_CONTENT_SECURITY_POLICY_REPORT_ONLY` | Whether to set the `Content-Security-Policy-Report-Only` header instead of `Content-Security-Policy`. | `false` | boolean |
| `N8N_CROSS_ORIGIN_OPENER_POLICY` | Configuration for the `Cross-Origin-Opener-Policy` header. | `'same-origin'` | z.infer<typeof crossOriginOpenerPolicySchema> |
| `N8N_INSECURE_DISABLE_WEBHOOK_IFRAME_SANDBOX` | Whether to disable HTML sandboxing for webhooks. The sandboxing mechanism uses CSP headers now, but the name is kept for backwards compatibility. | `false` | boolean |
| `N8N_GIT_NODE_DISABLE_BARE_REPOS` | Whether to disable bare repositories support in the Git node. | `true` | boolean |
| `N8N_AWS_SYSTEM_CREDENTIALS_ACCESS_ENABLED` | Whether to allow access to AWS system credentials, e.g. in awsAssumeRole credentials | `false` | boolean |
| `N8N_GIT_NODE_ENABLE_HOOKS` | Whether to enable hooks (like pre-commit hooks) for the Git node. | `false` | boolean |
| `N8N_GIT_NODE_ENABLE_ALL_CONFIG_KEYS` | Whether to enable arbitrary git config keys. | `false` | boolean |

---

## Sentry

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SENTRY_DSN` | Sentry DSN (data source name) for the backend. | `''` | string |
| `N8N_FRONTEND_SENTRY_DSN` | Sentry DSN (data source name) for the frontend. | `''` | string |
| `N8N_SENTRY_TRACES_SAMPLE_RATE` | Sample rate for Sentry traces (0.0 to 1.0). This determines whether tracing is enabled and what percentage of transactions are traced. @default 0 (disabled) | `0` | number |
| `N8N_SENTRY_PROFILES_SAMPLE_RATE` | Sample rate for Sentry profiling (0.0 to 1.0). This determines whether profiling is enabled and what percentage of transactions are profiled. @default 0 (disabled) | `0` | number |
| `N8N_SENTRY_EVENT_LOOP_BLOCK_THRESHOLD` | Threshold in milliseconds for event loop block detection. When the event loop is blocked for longer than this threshold, Sentry will report it. @default 500 | `500` | number |
| `ENVIRONMENT` | Environment of the n8n instance. | `''` | string |
| `DEPLOYMENT_NAME` | Name of the deployment, e.g. cloud account name. | `''` | string |

---

## SSO

### Saml

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SSO_SAML_LOGIN_ENABLED` | Whether SAML-based single sign-on is enabled. | `false` | boolean |
| `N8N_SSO_SAML_LOGIN_LABEL` | Label shown on the login button for SAML (for example, "Sign in with SAML"). | `''` | string |

### Oidc

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SSO_OIDC_LOGIN_ENABLED` | Whether OIDC-based single sign-on is enabled. | `false` | boolean |

### Ldap

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SSO_LDAP_LOGIN_ENABLED` | Whether LDAP-based single sign-on is enabled. | `false` | boolean |
| `N8N_SSO_LDAP_LOGIN_LABEL` | Label shown on the login button for LDAP (for example, "Sign in with LDAP"). | `''` | string |

### Provisioning

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SSO_SCOPES_PROVISION_INSTANCE_ROLE` | Whether to set the user's instance role from an SSO claim during login. | `false` | boolean |
| `N8N_SSO_SCOPES_PROVISION_PROJECT_ROLES` | Whether to set project–role mappings from an SSO claim during login. | `false` | boolean |
| `N8N_SSO_SCOPES_NAME` | Name of the OAuth scope to request for SSO provisioning. | `'n8n'` | string |
| `N8N_SSO_SCOPES_INSTANCE_ROLE_CLAIM_NAME` | Name of the SSO claim that contains the user's instance role (for provisioning). | `'n8n_instance_role'` | string |
| `N8N_SSO_SCOPES_PROJECTS_ROLES_CLAIM_NAME` | Name of the SSO claim that contains project–role mappings (for provisioning). | `'n8n_projects'` | string |

### SSO

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SSO_JUST_IN_TIME_PROVISIONING` | Whether to automatically create user accounts when someone signs in via SSO for the first time. | `true` | boolean |
| `N8N_SSO_REDIRECT_LOGIN_TO_SSO` | Whether the login screen redirects directly to SSO instead of showing email/password. | `true` | boolean |

---

## SSRF Protection

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SSRF_PROTECTION_ENABLED` | Whether SSRF protection is enabled for nodes making HTTP requests to user-controllable targets. | `false` | boolean |
| `N8N_SSRF_BLOCKED_IP_RANGES` | Comma-separated CIDR ranges to block. Use `default` to include the standard set, optionally with custom ranges (for example: `default,100.0.0.0/8`). | `[...SSRF_DEFAULT_BLOCKED_IP_RANGES]` | array |
| `N8N_SSRF_ALLOWED_IP_RANGES` | Comma-separated CIDR ranges to allow (takes precedence over the block list). | `[]` | CommaSeparatedStringArray<string> |
| `N8N_SSRF_ALLOWED_HOSTNAMES` | Comma-separated hostname patterns to allow. Supports wildcards: *.n8n.internal | `[]` | CommaSeparatedStringArray<string> |
| `N8N_SSRF_DNS_CACHE_MAX_SIZE` | Maximum DNS cache size in bytes (LRU eviction). Default: 1 MB. | `1048576` | number |

---

## Tags

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_WORKFLOW_TAGS_DISABLED` | When true, workflow tags are disabled (no tagging UI or filtering by tag). | `false` | boolean |

---

## Templates

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_TEMPLATES_ENABLED` | Whether to enable loading and showing workflow templates. | `true` | boolean |
| `N8N_TEMPLATES_HOST` | Base URL for the workflow templates API. | `'https:` | string |
| `N8N_DYNAMIC_TEMPLATES_HOST` | Base URL for fetching dynamic (contextual) templates. | `'https:` | string |

---

## User Management

### Smtp Auth

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SMTP_USER` | SMTP login username | `''` | string |
| `N8N_SMTP_PASS` | SMTP login password | `''` | string |
| `N8N_SMTP_OAUTH_SERVICE_CLIENT` | SMTP OAuth Service Client | `''` | string |
| `N8N_SMTP_OAUTH_PRIVATE_KEY` | SMTP OAuth Private Key | `''` | string |

### Smtp

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_SMTP_HOST` | SMTP server host | `''` | string |
| `N8N_SMTP_PORT` | SMTP server port | `465` | number |
| `N8N_SMTP_SSL` | Whether to use SSL for SMTP | `true` | boolean |
| `N8N_SMTP_STARTTLS` | Whether to use STARTTLS for SMTP when SSL is disabled | `true` | boolean |
| `N8N_SMTP_SENDER` | How to display sender name | `''` | string |

### Email

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_EMAIL_MODE` | Email delivery method: `smtp` or empty (disabled). | `'smtp'` | EmailMode |

### User Management

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_USER_MANAGEMENT_JWT_SECRET` | JWT secret to use. If unset, n8n will generate its own. | `''` | string |
| `N8N_USER_MANAGEMENT_JWT_DURATION_HOURS` | How long (in hours) before the JWT expires. | `168` | number |
| `N8N_INVITE_LINKS_EMAIL_ONLY` | Security Control: Invite Link Exposure Prevention When enabled, prevents exposure of invite URLs in API responses to users with 'user:create' permission, mitigating account takeover risks via invite link leakage (e.g., compromised admin accounts, network interception). | `false` | boolean |
| `N8N_USER_MANAGEMENT_JWT_REFRESH_TIMEOUT_HOURS` | How long (in hours) before expiration to automatically refresh it. - `0` means 25% of `N8N_USER_MANAGEMENT_JWT_DURATION_HOURS`. - `-1` means it will never refresh. This forces users to log back in after expiration. | `0` | number |

---

## Version Notifications

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_VERSION_NOTIFICATIONS_ENABLED` | Whether to check for and show in-app notifications about new n8n versions. | `true` | boolean |
| `N8N_VERSION_NOTIFICATIONS_ENDPOINT` | URL used to fetch current n8n version information. | `'https:` | string |
| `N8N_VERSION_NOTIFICATIONS_WHATS_NEW_ENABLED` | Whether to fetch and show "What's New" content. Requires version notifications to be enabled. | `true` | boolean |
| `N8N_VERSION_NOTIFICATIONS_WHATS_NEW_ENDPOINT` | URL used to fetch "What's New" articles. | `'https:` | string |
| `N8N_VERSION_NOTIFICATIONS_INFO_URL` | URL linked from the versions panel (for example, upgrade instructions). | `'https:` | string |

---

## Workflow History Compaction

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_WORKFLOW_HISTORY_OPTIMIZING_MINIMUM_AGE_HOURS` | Minimum age in hours before a workflow version is eligible for optimization. Versions compacted are those with `createdAt` between `optimizingMinimumAgeHours - optimizingTimeWindowHours` and `optimizingMinimumAgeHours`. | `0.25` | number |
| `N8N_WORKFLOW_HISTORY_OPTIMIZING_TIME_WINDOW_HOURS` | Time window in hours used when selecting versions to optimize. Optimization runs roughly every `optimizingTimeWindowHours / 2` hours. | `2` | number |
| `N8N_WORKFLOW_HISTORY_TRIMMING_MINIMUM_AGE_DAYS` | Minimum age in days before a workflow version is eligible for trimming. Versions trimmed are those with `createdAt` between `trimmingMinimumAgeDays - trimmingTimeWindowDays` and `trimmingMinimumAgeDays`. | `7` | number |
| `N8N_WORKFLOW_HISTORY_TRIMMING_TIME_WINDOW_DAYS` | Time window in days used when selecting versions to trim. Trimming runs once per day. | `2` | number |
| `N8N_WORKFLOW_HISTORY_COMPACTION_BATCH_SIZE` | Maximum number of workflow versions to process per workflow before waiting `batchDelayMs` before the next workflow. | `100` | number |
| `N8N_WORKFLOW_HISTORY_COMPACTION_BATCH_DELAY_MS` | Delay in milliseconds after processing `batchSize` versions before moving to the next workflow. | `1000` | number |
| `N8N_WORKFLOW_HISTORY_COMPACTION_TRIM_ON_START_UP` | Whether to run a trim pass on startup (for example, to fix existing history or for development). | `false` | boolean |

---

## Workflow History

| Variable | Description | Default | Type |
|---|---|---|---|
| `N8N_WORKFLOW_HISTORY_PRUNE_TIME` | How long in hours to keep workflow history versions before pruning. Use `-1` to keep forever. | `-1` | number |

---

## Workflows

| Variable | Description | Default | Type |
|---|---|---|---|
| `WORKFLOWS_DEFAULT_NAME` | Default name suggested when creating a new workflow. | `'My workflow'` | string |
| `N8N_WORKFLOW_CALLER_POLICY_DEFAULT_OPTION` | Default policy for which workflows are allowed to call this workflow (for example, same owner, any, none). | `'workflowsFromSameOwner'` | CallerPolicy |
| `N8N_WORKFLOW_ACTIVATION_BATCH_SIZE` | Number of workflows to activate in parallel during startup. | `1` | number |
| `N8N_WORKFLOWS_INDEXING_ENABLED` | Whether to build and maintain workflow dependency indexes (for example, for subworkflow callers). | `true` | boolean |
| `N8N_WORKFLOW_INDEX_BATCH_SIZE` | Number of workflows to process per batch during dependency indexing on startup. Defaults to 10. | `10` | number |
| `N8N_USE_WORKFLOW_PUBLICATION_SERVICE` | Whether to use the workflow publication service. Still under development. | `false` | boolean |

---
