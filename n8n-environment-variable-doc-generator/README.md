# n8n Environment Variable Doc Generator

Reads all `*.config.ts` files from `packages/@n8n/config/src/configs/` in the n8n source code and outputs a single markdown file documenting every environment variable, its description, default value, and type.

No npm install required. Node.js 16+ only.

---

## Usage

**From a local clone of n8n:**
```bash
node generate-env-docs.js --repo-path /path/to/n8n
```

**Directly from GitHub (no local clone needed):**
```bash
node generate-env-docs.js --github
```

---

## Options

| Flag | Description | Default |
|---|---|---|
| `--repo-path <path>` | Path to the root of a local n8n clone | — |
| `--github` | Fetch source files from GitHub instead of local disk | — |
| `--branch <name>` | Branch to read when using `--github` | `master` |
| `--github-token <token>` | GitHub personal access token (raises rate limit from 60 to 5,000 req/hr) | — |
| `--output <path>` | Path for the generated markdown file | `./n8n-env-reference.md` |

`--repo-path` and `--github` are mutually exclusive. One is required.

---

## GitHub Token

A token is optional for one-off runs against a public repo. If you run the script frequently or in CI, generate one at:

**GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)**

No scopes are required.

---

## Output

The generated file contains:
- A table of contents
- One section per config file (e.g. Database, Logging, Endpoints)
- Subsections per class when a file defines more than one
- A table per section with columns: Variable, Description, Default, Type

To regenerate after n8n updates, re-run the same command. The timestamp in the output file header will update automatically.
