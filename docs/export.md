# Export

`faf export` writes the files your AI actually reads — `AGENTS.md`, `.cursorrules`, `GEMINI.md`, and more — straight from `project.faf`. One source, every surface, always in sync.

## Write one

```bash
faf export --agents     # AGENTS.md
```

## Every target

| Flag | Writes |
|---|---|
| `--agents` | `AGENTS.md` |
| `--cursor` | `.cursorrules` |
| `--gemini` | `GEMINI.md` |
| `--copilot` | `.github/copilot-instructions.md` |
| `--grok` | wires `grok-faf-mcp` into `.grok/config.toml` |
| `--llms` | `llms.txt` (llmstxt.org shape) — the authored 6 Ws only |
| `--conductor` | Conductor config |
| `--html` | `project.html` — a visual render of `project.faf` |
| `--card` | MCP Server Card (`.well-known/mcp/server-card`) |
| `--all` | every format above |

`CLAUDE.md` isn't here — it's bidirectional, not one-way. See [Sync](/getting-started) *(soon)*.

## Non-destructive, by design

Every writer wraps its output in a managed block:

```
<!-- faf:start -->
… facts from project.faf …
<!-- faf:end -->
```

- **File doesn't exist** → created, containing just the block.
- **Block already there** → only what's *between* the markers is replaced.
- **File exists, no markers, hand-written** → the block is **prefixed**; your content is preserved below it, byte for byte.
- **Re-running with no changes** → the file is untouched — idempotent.

faf owns the block. You own everything outside it. Enhance, never replace.

## Under the hood

Every faf-authored file opens with its own fingerprint, so a re-run can tell its own prior output apart from something you wrote by hand:

```
<!-- faf: my-project | TypeScript | backend |  -->
```

That fingerprint is also the safety check: a markerless file that starts with it is faf's own legacy output and gets upgraded in place; a markerless file that doesn't is yours, and only ever gets prefixed.

---

**Next:** [Custom rules](/custom-rules) — pin your own instructions so exports carry them forward
