---
title: ".FAF Context (faf-mcp)"
---

# .FAF Context

**.FAF Context** is the name on the MCP registries; `faf-mcp` is the package and the repo. The MCP server for Cursor, VS Code, Windsurf, Cline and every MCP-compatible IDE. It runs locally over stdio and gives the agent persistent project context from `project.faf` — and writes the files each tool reads (`AGENTS.md`, `.cursorrules`, `GEMINI.md`, `CLAUDE.md`) from that one source.

## Run it

```bash
npx faf-mcp      # or: bunx faf-mcp
```

Add it to your IDE's MCP config:

```json
{ "mcpServers": { "faf-mcp": { "command": "npx", "args": ["-y", "faf-mcp"] } } }
```

No env vars, no config file. It works in the directory the IDE opened.

## What it composes

Every tool runs in-process on the faf-cli this package bundles — the same scorer, the same renderers, the same block injector the CLI uses. Nothing shells out to a `faf` on your PATH. `faf_score` in the IDE and `faf score` in the terminal are the same function on the same bytes.

## The goal and six W's

The goal and the six W's (who, what, why, where, when, how) are yours. faf-mcp suggests them and never writes one you haven't confirmed:

- `faf_init` and `faf_auto` leave them empty and say how many suggestions are waiting.
- `faf_go` shows each empty one with faf-cli's suggestion and where it came from (`README.md § Why`, `package.json description`). The agent asks you; only the answers you confirm are written.
- `faf_readme` lists the suggestions and writes nothing. `faf_sync` updates the name and stack from package.json, never the goal.
- `faf_git` still writes the goal from the GitHub description; it moves to faf-cli's pipeline in a later release.

## Tools

Fifteen shown by default; `FAF_TOOLS=all` exposes all twenty-nine. Every tool stays callable by name either way.

| Tool | Does |
|---|---|
| `faf_auto` | zero → context: detect the stack, interrogate the repo, write `project.faf` and `CLAUDE.md` |
| `faf_score` | AI-readiness 0–100 with the slot-by-slot gaps |
| `faf_go` | the goal and six W's: suggestions with their source, for you to confirm |
| `faf_agents` · `faf_cursor` · `faf_gemini` | import / export / sync `AGENTS.md`, `.cursorrules`, `GEMINI.md` |
| `faf_claude` | write `CLAUDE.md` (+ the three above with flags or `all`) from `project.faf` |
| `faf_sync` | reconcile `project.faf` with package.json (name and stack, never the goal) — dry-run lists each change, `apply:true` writes |
| `faf_trust` · `faf_doctor` · `faf_check` | validate, diagnose, quality-check the file |
| `faf_context` · `faf_read` · `faf_write` | read the context, read or write files (`faf_write` never writes `.faf-dna`, stays in the project folder, and replaces an existing `project.faf`, `CLAUDE.md` or `AGENTS.md` only with `overwrite: true`) |
| `faf_git` | author `project.faf` from a GitHub URL |

Resources: `faf://context` (the parsed `.faf` + score) and `faf://status` (score, tier, path).

## Non-destructive, by design

The interop tools write into a managed block — the same block `faf export` uses, with the same whole-line markers. Content you wrote outside it is preserved, byte for byte. See [Export](/export) for the block rules.

---

**Next:** [Export](/export) — the same files from the CLI
