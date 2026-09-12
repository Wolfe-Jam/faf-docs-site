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
| `--card` | MCP Server Card (`./server-card`) |
| `--all` | every format above |

`CLAUDE.md` isn't here: `faf sync` writes it from `project.faf`, with the same managed block.

## Non-destructive, by design

Every writer wraps its output in a managed block:

```
<!-- faf:start -->
… facts from project.faf …
<!-- faf:end -->
```

- **File doesn't exist** → created, containing just the block.
- **Block already there** → only what's *between* the markers is replaced.
- **File exists, no markers** → the block is **prefixed**; your content is preserved below it, byte for byte. That includes a file that starts with faf's old fingerprint: without markers, it is yours.
- **Re-running with no changes** → the file is untouched — idempotent.
- **A link** → faf writes through a link only between its own context files (`CLAUDE.md` → `AGENTS.md` is fine). A link out of the project, into `.git`, or to any other file is refused, and its target is left as it was.
- **Not UTF-8** → refused and left as it was, never re-encoded.
- **A write fails** (full disk, killed process) → the original stays. faf writes a temp file and renames it into place; a file you edit while faf is writing is left alone.
- **A whole file faf renders** (`--html`, `--card`) → replaced only when it's still exactly what faf wrote. If you edited it, faf leaves it and says so; `--force` replaces it.

faf owns the block. You own everything outside it. Enhance, never replace.

## Under the hood

Every faf-authored file opens with its own fingerprint, so a re-run can tell its own prior output apart from something you wrote by hand:

```
<!-- faf: my-project | TypeScript | backend |  -->
```

The fingerprint says who wrote the file. It never gives faf permission to take a file over — only the markers do. A markerless file is always prefixed.

## As a library

Everything `faf export` does is importable — the same renderers, the same injector, the same repo enrichment. An MCP server or an editor extension writes the same bytes the CLI writes, instead of carrying a copy that drifts.

```ts
import { readFaf, enrichFromRepo, writeAgentsMd } from 'faf-cli';

const data = readFaf(`${dir}/project.faf`);
writeAgentsMd(dir, enrichFromRepo(dir, data));   // exactly `faf export --agents`
```

| Export | Does |
|---|---|
| `renderAgentsMd` · `renderGeminiMd` · `renderCursorrules` · `renderClaudeMd` · `renderCopilotInstructions` | render one target from `.faf` data — returns the string |
| `writeAgentsMd` · `writeGeminiMd` · `writeCursorrules` · `writeClaudeMd` · `writeCopilotInstructions` | render + inject into the file in `dir` |
| `enrichFromRepo(dir, data)` | the repo-facts step `--agents` and `--gemini` run first: commands, key files, secrets location. Hand-authored values win. |
| `injectFafBlock(path, block, start?, end?, { root }?)` · `findFafBlock(text)` | the managed-block injector — whole-line markers at column 0, fenced examples ignored, a file without markers prefixed, never taken over |
| `updateExistingFaf(dir, existing)` · `assembleFreshFaf(dir)` · `writeFaf(path, data, { replace }?)` | what `faf auto` does — update an existing `project.faf` or build a fresh one. `writeFaf` on an existing file merges and keeps comments and exact values; `{ replace: true }` is the explicit overwrite |
| `updateFafFile(path, doc => …)` | edit `project.faf` in place through the YAML document — only what you change moves; a no-op writes nothing |
| `resolveInside(dir, name)` · `safeWriteFile(path, content)` | the write primitive every faf writer uses: refuses links that leave the project, writes a temp file and renames it into place |
| `writeClaudeMemory(dir, data)` · `claudeMemoryStatus(dir)` · `resolveClaudeMemoryPath(dir)` | faf's section in Claude Code's own `MEMORY.md` (`~/.claude/projects/<id>/memory/`) — Claude's notes are kept |
| `authorFafFromRepo(dir)` · `FafDNAManager` · `registryTitle(data)` · `isNonProjectRoot(dir)` · `scoreText(result)` | author a `.faf` from a checkout, read and grow `.faf-dna`, the registry display title, the home/root guard, a score as text ("unknown" when there is none) |

---

**Next:** [Custom rules](/custom-rules) — pin your own instructions so exports carry them forward
