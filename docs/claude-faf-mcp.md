---
title: "Claude FAF (claude-faf-mcp)"
---

# claude-faf-mcp

**Claude FAF** is the name on the MCP registries; `claude-faf-mcp` is the package and the repo. The MCP server for Claude Desktop and Claude Code: persistent project context from `project.faf`, locally over stdio.

## Run it

Claude Desktop, one click: open the `.mcpb` from the [latest release](https://github.com/Wolfe-Jam/claude-faf-mcp/releases/latest). It runs the server bundled inside it, with no npx and no network at start.

Claude Desktop, by config (`claude_desktop_config.json`, then restart):

```json
{ "mcpServers": { "faf": { "command": "npx", "args": ["-y", "claude-faf-mcp"] } } }
```

Claude Code:

```bash
claude mcp add faf -- npx -y claude-faf-mcp
```

Needs Node 22 or later. Then pick the `faf` prompt from your host's prompt list.

## One engine

claude-faf-mcp is built on faf-cli: detection, scoring and every write are faf-cli's own functions, loaded as a dependency. Every score is the always-33 score, the same number `faf score` gives. It never runs a `faf` found on your PATH. See [Scoring](/scoring).

## The goal and six W's

The goal and the six W's (who, what, why, where, when, how) are yours. claude-faf-mcp suggests them and never writes one you haven't confirmed:

- `faf_init`, `faf_auto` and `faf_git` leave them empty and say how many suggestions are waiting.
- `faf_go` shows each empty one with faf-cli's suggestion and where it came from (`README.md § Why`, `package.json description`). Claude asks you; only the answers you confirm are written.
- `faf_readme` lists the suggestions and writes nothing.

## Tools

Fourteen shown by default; `FAF_TOOLS=all` shows 30. Every tool stays callable by name either way.

| Tool | Does |
|---|---|
| `faf_init` | create `project.faf` for the folder; faf-cli detects the stack |
| `faf_auto` | fill `project.faf` from the repo's own files, then write `CLAUDE.md` |
| `faf_go` | the goal and the six W's: suggestions with their source, for you to confirm |
| `faf_score` | AI-readiness 0–100, from faf-cli |
| `faf_doctor` | each problem in `project.faf`, with the tool that fixes it |
| `faf_trust` | validate `project.faf` and return a receipt for its score |
| `faf_bench` | grounding benchmark: cold vs with the `.faf`, graded mechanically |
| `faf_sync` | write `CLAUDE.md` from `project.faf`; options also write `AGENTS.md`, `.cursorrules`, `GEMINI.md`, `copilot-instructions.md` |
| `faf_tri_sync` | write faf's block into the `MEMORY.md` Claude Code loads for this project |
| `faf_setup` | install the SessionStart hook (preview first) |
| `faf_context` | show or set the active project |
| `faf_etch` · `faf_recall` | remember a decision in `soul.fafm`, and read it back |
| `faf_about` | what the `.faf` format is |

### What each tool may change

Every tool carries MCP tool annotations, so your client knows when to ask first:

- **Read only:** `faf`, `faf_about`, `faf_status`, `faf_score`, `faf_trust`, `faf_debug`, `faf_read`, `faf_list`, `faf_readme`, `faf_check`, `faf_context`, `faf_bench`, `faf_dna`, `faf_formats`, `faf_doctor`, `faf_recall`.
- **Can replace a value:** `faf_init`, `faf_auto`, `faf_go`, `faf_human_add`, `faf_etch`.
- **Uses the network:** `faf_git`, only when you ask it to read a repo (git clones it).

Nothing is sent to FAF: no accounts, no telemetry.

---

**Next:** [Scoring](/scoring) — how the 33 slots count
