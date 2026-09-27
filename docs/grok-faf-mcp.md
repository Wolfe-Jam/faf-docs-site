# grok-faf-mcp

**Grok FAF** is the name on the MCP registries; `grok-faf-mcp` is the package and the repo. The MCP server for xAI Grok: persistent project context from `project.faf`, on a URL or locally over stdio.

## Run it

On a URL — add to `~/.grok/config.toml`:

```toml
[mcp_servers.grok-faf-mcp]
url = "https://mcpaas.live/grok/mcp/v1"
```

Restart Grok (or `/mcps r`). Nothing to install.

Locally, when you want the tools that read and write your repo:

```bash
bunx grok-faf-mcp      # or: npx grok-faf-mcp
```

## One number

Every score is the always-33 score — the same number `faf score` gives. Locally, scoring runs the faf-cli this package bundles, in-process; nothing that scores shells out to a `faf` on your PATH. The hosted URL scores and validates with the same kernel. See [Scoring](/scoring).

## Tools

Twelve shown by default on the local server; `FAF_TOOLS=all` exposes the rest. Every tool stays callable by name either way.

| Tool | Does |
|---|---|
| `refresh_faf` · `refresh_fafm` · `refresh_blend` | re-ground a long session on `project.faf`, on the `.fafm` memory, or both |
| `rag_query` · `rag_cache_stats` · `rag_cache_clear` | ask Grok about the project, with a cache |
| `faf_orchestrate_recommendation` | read the drift signals and recommend a refresh — advisory, it never runs one |
| `faf_get_orchestration_policy` | show the policy the orchestrator uses |
| `faf_init` | write `project.faf` for this folder, with the enterprise slots marked, and report its score |
| `faf_score` | AI-readiness 0–100, `populated/active` slots |
| `faf_sync` | write the `.faf` block into `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `GEMINI.md` — your prose below it is kept |
| `faf_trust` | check the file and report its score |

Resources: `claude-faf://context` (the parsed `.faf` + score) and `claude-faf://status` (path, score, slots).

## Local or hosted

The hosted URL serves its own set — scoring, validation, `refresh_faf`, a content-in `faf_orchestrate_recommendation`, souls and search. The live list is at `https://mcpaas.live/grok/mcp/v1/info`. Tools that read or write your files (`faf_init`, `faf_sync`, `refresh_fafm`, `refresh_blend`) run locally only.

## ZEPH

ZEPH is a Zig fast path for `refresh_faf`. It is off by default and turns on with `USE_ZEPH=1`; it stays opt-in until the Zig engine gives the always-33 number on every file.

---

**Next:** [Scoring](/scoring) — how the 33 slots count
