#!/usr/bin/env node
/**
 * n8n Environment Variable Documentation Generator
 *
 * Parses all *.config.ts files in packages/@n8n/config/src/configs/ and generates
 * a single markdown reference file documenting every environment variable,
 * its description, default value, and type.
 *
 * Usage (local clone):
 *   node generate-env-docs.js --repo-path /path/to/n8n [--output ./n8n-env-reference.md]
 *
 * Usage (GitHub, no local clone needed):
 *   node generate-env-docs.js --github [--branch master] [--github-token <token>] [--output ./n8n-env-reference.md]
 *
 * GitHub rate limits:
 *   Unauthenticated: 60 API requests/hour (usually enough for one run)
 *   Authenticated:   5,000 requests/hour — use --github-token if you run this frequently
 *   Generate a token at: https://github.com/settings/tokens (no scopes needed for public repos)
 *
 * Requirements:
 *   - Node.js 16+ (no npm dependencies)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    repoPath: null,
    github: false,
    branch: 'master',
    githubToken: null,
    output: path.join(process.cwd(), 'n8n-env-reference.md'),
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--repo-path' && args[i + 1]) {
      opts.repoPath = path.resolve(args[++i]);
    } else if (args[i] === '--github') {
      opts.github = true;
    } else if (args[i] === '--branch' && args[i + 1]) {
      opts.branch = args[++i];
    } else if (args[i] === '--github-token' && args[i + 1]) {
      opts.githubToken = args[++i];
    } else if (args[i] === '--output' && args[i + 1]) {
      opts.output = path.resolve(args[++i]);
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node generate-env-docs.js [source] [options]

Source (pick one):
  --repo-path <path>     Path to the root of a local n8n repository clone
  --github               Fetch source files directly from GitHub (no local clone needed)

GitHub options:
  --branch <name>        Branch to read from (default: master)
  --github-token <token> Personal access token to raise the API rate limit
                         (60 req/hr unauthenticated → 5,000/hr authenticated)
                         No scopes needed for public repos.

Output:
  --output <path>        Output markdown file path (default: ./n8n-env-reference.md)

Examples:
  node generate-env-docs.js --repo-path ~/code/n8n
  node generate-env-docs.js --github
  node generate-env-docs.js --github --branch master --output ./docs/env-vars.md
  node generate-env-docs.js --github --github-token ghp_xxxxxxxxxxxx
      `.trim());
      process.exit(0);
    }
  }

  if (!opts.repoPath && !opts.github) {
    console.error('Error: provide either --repo-path or --github.\n');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  if (opts.repoPath && opts.github) {
    console.error('Error: --repo-path and --github are mutually exclusive.');
    process.exit(1);
  }

  return opts;
}

// ---------------------------------------------------------------------------
// HTTP fetching (Node.js built-in, no dependencies)
// ---------------------------------------------------------------------------

/**
 * Fetch a URL and return the response body as a string.
 * Follows a single redirect automatically.
 *
 * @param {string} url
 * @param {Record<string, string>} [headers]
 * @returns {Promise<string>}
 */
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'n8n-env-docs-generator/1.0',
        ...headers,
      },
    };

    https
      .get(url, options, (res) => {
        // Follow one redirect (GitHub raw URLs sometimes redirect)
        if (res.statusCode === 301 || res.statusCode === 302) {
          res.resume();
          return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// File discovery — local
// ---------------------------------------------------------------------------

/**
 * @param {string} repoPath
 * @returns {{ name: string, localPath: string }[]}
 */
function findLocalConfigFiles(repoPath) {
  const configsDir = path.join(repoPath, 'packages', '@n8n', 'config', 'src', 'configs');

  if (!fs.existsSync(configsDir)) {
    console.error(`Error: configs directory not found at:\n  ${configsDir}`);
    console.error('\nMake sure --repo-path points to the root of the n8n repository.');
    process.exit(1);
  }

  return fs
    .readdirSync(configsDir)
    .filter((f) => f.endsWith('.config.ts') && !f.startsWith('__'))
    .sort()
    .map((f) => ({ name: f, localPath: path.join(configsDir, f) }));
}

// ---------------------------------------------------------------------------
// File discovery — GitHub
// ---------------------------------------------------------------------------

const GITHUB_CONFIGS_PATH = 'packages/%40n8n/config/src/configs';

/**
 * List all *.config.ts files in the n8n configs directory via the GitHub Contents API.
 *
 * @param {{ branch: string, githubToken: string | null }} opts
 * @returns {Promise<{ name: string, downloadUrl: string }[]>}
 */
async function listGitHubConfigFiles(opts) {
  const apiUrl =
    `https://api.github.com/repos/n8n-io/n8n/contents/${GITHUB_CONFIGS_PATH}` +
    `?ref=${encodeURIComponent(opts.branch)}`;

  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (opts.githubToken) headers['Authorization'] = `Bearer ${opts.githubToken}`;

  let body;
  try {
    body = await fetchUrl(apiUrl, headers);
  } catch (err) {
    throw new Error(`Failed to reach GitHub API: ${err.message}`);
  }

  let entries;
  try {
    entries = JSON.parse(body);
  } catch {
    throw new Error('GitHub API returned non-JSON response. Check your token or try again later.');
  }

  if (!Array.isArray(entries)) {
    // GitHub returns an object with a `message` field on errors
    const msg = entries && entries.message ? entries.message : JSON.stringify(entries);
    throw new Error(`GitHub API error: ${msg}`);
  }

  return entries
    .filter(
      (e) =>
        e.type === 'file' && e.name.endsWith('.config.ts') && !e.name.startsWith('__'),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => ({ name: e.name, downloadUrl: e.download_url }));
}

/**
 * Fetch the raw content of multiple GitHub files in parallel.
 *
 * @param {{ name: string, downloadUrl: string }[]} files
 * @param {string | null} githubToken
 * @returns {Promise<{ name: string, content: string }[]>}
 */
async function fetchGitHubFiles(files, githubToken) {
  const headers = {};
  if (githubToken) headers['Authorization'] = `Bearer ${githubToken}`;

  return Promise.all(
    files.map(async ({ name, downloadUrl }) => {
      const content = await fetchUrl(downloadUrl, headers);
      return { name, content };
    }),
  );
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/**
 * Clean up a raw TypeScript type string for display.
 * e.g. "'all' | 'none'" → "string (all | none)"
 *      "boolean"         → "boolean"
 *      "number"          → "number"
 */
function formatType(raw) {
  const t = raw.trim();

  // Primitive passthroughs
  if (['string', 'number', 'boolean'].includes(t)) return t;

  // Union of string literals like "'a' | 'b'"
  const literalUnion = t.match(/^'[^']*'(\s*\|\s*'[^']*')+$/);
  if (literalUnion) {
    const values = t.split('|').map((s) => s.trim().replace(/^'|'$/g, ''));
    return `string (${values.join(' | ')})`;
  }

  // Single string literal like "'sqlite'"
  if (/^'[^']*'$/.test(t)) return 'string';

  // Array literals
  if (t.startsWith('[') || t.includes('[]')) return 'array';

  // Zod-inferred or other types — return as-is
  return t;
}

/**
 * Clean up a raw default value string for display in a markdown table.
 * Tries to evaluate simple arithmetic expressions for readability.
 */
function formatDefault(raw) {
  let val = raw.trim();

  // Remove trailing inline comment  e.g. "3600; // 1h" → "3600"
  val = val.replace(/\s*\/\/.*$/, '').replace(/;$/, '').trim();

  // Evaluate simple arithmetic (integers only, no variables) e.g. "5 * 60 * 1000"
  if (/^[\d\s_*+\-/()]+$/.test(val) && /[*+\-/]/.test(val)) {
    try {
      const cleaned = val.replace(/_/g, '');
      const result = Function(`'use strict'; return (${cleaned})`)();
      if (typeof result === 'number' && isFinite(result)) {
        return `\`${result}\``;
      }
    } catch (_) {
      // ignore eval errors; fall through
    }
  }

  // Remove numeric separators for display e.g. "10_000" → "10000"
  if (/^\d[\d_]+$/.test(val)) {
    return `\`${val.replace(/_/g, '')}\``;
  }

  // Wrap in backticks for code formatting
  return `\`${val}\``;
}

/**
 * Convert a PascalCase class name to a human-friendly section title.
 * e.g. "PostgresSSLConfig" → "PostgreSQL SSL"
 */
function classNameToTitle(name) {
  return name
    .replace(/Config$/, '')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\bSsl\b/g, 'SSL')
    .replace(/\bMfa\b/g, 'MFA')
    .replace(/\bSso\b/g, 'SSO')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bMcp\b/g, 'MCP')
    .replace(/\bDb\b/g, 'DB')
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bSsrf\b/g, 'SSRF')
    .trim();
}

/**
 * Convert a filename like "database.config.ts" to a section title "Database".
 */
function fileNameToTitle(filename) {
  return path
    .basename(filename, '.config.ts')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bSso\b/g, 'SSO')
    .replace(/\bMfa\b/g, 'MFA')
    .replace(/\bMcp\b/g, 'MCP')
    .replace(/\bSsrf\b/g, 'SSRF');
}

// ---------------------------------------------------------------------------
// Core parser — line-by-line state machine
// ---------------------------------------------------------------------------

/**
 * @typedef {{ envVar: string, type: string, default: string, description: string }} EnvEntry
 * @typedef {{ name: string, title: string, entries: EnvEntry[] }} ParsedClass
 */

/**
 * Parse the string content of a TypeScript config file.
 * Returns an ordered array of class definitions with their env var entries.
 *
 * @param {string} content  Raw TypeScript source
 * @param {string} fileName Filename (used for error messages only)
 * @returns {ParsedClass[]}
 */
function parseConfigContent(content, fileName) {
  const lines = content.split('\n');

  /** @type {ParsedClass[]} */
  const classes = [];

  /** @type {ParsedClass | null} */
  let currentClass = null;

  /** @type {string[]} Lines of the current JSDoc block */
  let jsdocLines = [];

  /** @type {boolean} Whether we are inside a /** comment block */
  let inJsdoc = false;

  /** @type {string | null} The env var name from the most recent @Env decorator */
  let pendingEnvVar = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // -----------------------------------------------------------------------
    // Class declarations
    // -----------------------------------------------------------------------
    const classMatch = trimmed.match(/^(?:export\s+)?class\s+(\w+)/);
    if (classMatch) {
      currentClass = {
        name: classMatch[1],
        title: classNameToTitle(classMatch[1]),
        entries: [],
      };
      classes.push(currentClass);
      jsdocLines = [];
      inJsdoc = false;
      pendingEnvVar = null;
      continue;
    }

    // -----------------------------------------------------------------------
    // JSDoc comment handling
    // -----------------------------------------------------------------------
    if (!inJsdoc && trimmed.startsWith('/**')) {
      jsdocLines = [];
      // Single-line: /** Some description. */
      const singleLine = trimmed.match(/^\/\*\*\s*(.*?)\s*\*\/\s*$/);
      if (singleLine) {
        if (singleLine[1]) jsdocLines = [singleLine[1]];
      } else {
        inJsdoc = true;
        const afterOpen = trimmed.replace(/^\/\*\*\s*/, '');
        if (afterOpen) jsdocLines.push(afterOpen);
      }
      continue;
    }

    if (inJsdoc) {
      if (trimmed === '*/' || trimmed.endsWith('*/')) {
        const text = trimmed.replace(/\*\/$/, '').replace(/^\*\s?/, '').trim();
        if (text) jsdocLines.push(text);
        inJsdoc = false;
      } else {
        const text = trimmed.replace(/^\*\s?/, '');
        if (text) jsdocLines.push(text);
      }
      continue;
    }

    // -----------------------------------------------------------------------
    // @Env decorator
    // -----------------------------------------------------------------------
    const envMatch = trimmed.match(/^@Env\('([^']+)'/);
    if (envMatch) {
      pendingEnvVar = envMatch[1];
      continue;
    }

    // -----------------------------------------------------------------------
    // Property declaration (only when we have a pending @Env and a class)
    // -----------------------------------------------------------------------
    if (pendingEnvVar && currentClass) {
      const noComment = trimmed.replace(/\s*\/\/.*$/, '');
      const propMatch = noComment.match(/^(\w+)\s*:\s*(.+?)\s*=\s*(.+?)\s*;?\s*$/);
      if (propMatch) {
        const [, , rawType, rawDefault] = propMatch;
        currentClass.entries.push({
          envVar: pendingEnvVar,
          type: formatType(rawType),
          default: formatDefault(rawDefault),
          description: buildDescription(jsdocLines),
        });
        pendingEnvVar = null;
        jsdocLines = [];
        continue;
      }
    }

    // -----------------------------------------------------------------------
    // Reset pending JSDoc on unrelated lines
    // -----------------------------------------------------------------------
    if (
      !inJsdoc &&
      !pendingEnvVar &&
      trimmed !== '' &&
      !trimmed.startsWith('@') &&
      !trimmed.startsWith('*') &&
      !trimmed.startsWith('/')
    ) {
      jsdocLines = [];
    }
  }

  return classes.filter((c) => c.entries.length > 0);
}

/**
 * Convenience wrapper: read a local file then parse it.
 *
 * @param {string} filePath
 * @returns {ParsedClass[]}
 */
function parseConfigFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parseConfigContent(content, path.basename(filePath));
}

/**
 * Collapse multi-line JSDoc into a single clean description string.
 * Strips @example, @warning tags for brevity.
 */
function buildDescription(lines) {
  const result = [];
  let skipBlock = false;

  for (const line of lines) {
    if (/^@(example|warning|deprecated)\b/.test(line)) {
      skipBlock = true;
      continue;
    }
    if (/^@\w+/.test(line)) skipBlock = false;
    if (skipBlock) continue;
    result.push(line);
  }

  return result
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|'); // escape pipes so they don't break markdown tables
}

// ---------------------------------------------------------------------------
// Markdown generation
// ---------------------------------------------------------------------------

/**
 * @param {{ fileName: string, title: string, classes: ParsedClass[] }[]} sections
 * @param {{ github: boolean, branch: string, repoPath: string | null }} opts
 * @returns {string}
 */
function generateMarkdown(sections, opts) {
  const lines = [];
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const regenCmd = opts.github
    ? `node generate-env-docs.js --github --branch ${opts.branch}`
    : 'node generate-env-docs.js --repo-path /path/to/n8n';

  const sourceNote = opts.github
    ? `GitHub (\`n8n-io/n8n\`, branch: \`${opts.branch}\`)`
    : `local clone at \`${opts.repoPath}\``;

  // Header
  lines.push('# n8n Environment Variable Reference');
  lines.push('');
  lines.push(
    `> **Auto-generated** from ${sourceNote} — do not edit by hand.`,
  );
  lines.push(`> Regenerate with: \`${regenCmd}\``);
  lines.push(`> Last generated: ${timestamp}`);
  lines.push('');
  lines.push(
    'This document lists every environment variable recognised by n8n, grouped by ' +
      'the area of functionality it controls. Set these variables in your ' +
      '`docker-compose.yml`, `.env` file, or shell environment before starting n8n.',
  );
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  for (const section of sections) {
    const anchor = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    lines.push(`- [${section.title}](#${anchor})`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sections
  for (const section of sections) {
    lines.push(`## ${section.title}`);
    lines.push('');

    for (const cls of section.classes) {
      if (section.classes.length > 1) {
        lines.push(`### ${cls.title}`);
        lines.push('');
      }

      lines.push('| Variable | Description | Default | Type |');
      lines.push('|---|---|---|---|');

      for (const entry of cls.entries) {
        const desc = entry.description || '—';
        lines.push(`| \`${entry.envVar}\` | ${desc} | ${entry.default} | ${entry.type} |`);
      }

      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();

  /** @type {{ name: string, content: string }[]} */
  let fileItems;

  if (opts.github) {
    console.log(`Source: GitHub — n8n-io/n8n, branch "${opts.branch}"`);
    if (!opts.githubToken) {
      console.log(
        'Tip: add --github-token <token> to raise the rate limit from 60 to 5,000 req/hr.',
      );
    }

    console.log('Fetching file list from GitHub API...');
    const files = await listGitHubConfigFiles(opts);
    console.log(`Found ${files.length} config files. Fetching contents...`);

    fileItems = await fetchGitHubFiles(files, opts.githubToken);
  } else {
    console.log(`Source: local — ${opts.repoPath}`);
    const localFiles = findLocalConfigFiles(opts.repoPath);
    console.log(`Found ${localFiles.length} config files.`);
    fileItems = localFiles.map(({ name, localPath }) => ({
      name,
      content: fs.readFileSync(localPath, 'utf8'),
    }));
  }

  const sections = [];

  for (const { name, content } of fileItems) {
    const title = fileNameToTitle(name);
    const classes = parseConfigContent(content, name);

    if (classes.length === 0) {
      console.log(`  [skip] ${name} — no @Env entries found`);
      continue;
    }

    const totalVars = classes.reduce((sum, c) => sum + c.entries.length, 0);
    console.log(`  [ok]   ${name} — ${totalVars} var(s) across ${classes.length} class(es)`);

    sections.push({ fileName: name, title, classes });
  }

  const totalVars = sections.reduce(
    (sum, s) => sum + s.classes.reduce((s2, c) => s2 + c.entries.length, 0),
    0,
  );
  console.log(`\nTotal: ${totalVars} environment variables documented.`);

  const markdown = generateMarkdown(sections, opts);
  fs.writeFileSync(opts.output, markdown, 'utf8');
  console.log(`Output written to: ${opts.output}`);
}

main().catch((err) => {
  console.error(`\nFatal error: ${err.message}`);
  if (err.message.includes('rate limit') || err.message.includes('403')) {
    console.error('You may have hit the GitHub API rate limit. Use --github-token to increase it.');
  }
  process.exit(1);
});
