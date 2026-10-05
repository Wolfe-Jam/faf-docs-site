# What each command writes

Every faf command, and what it touches: files in your project, files your AI agents load, git and CI, and anything that leaves your machine. Use it to decide what an agent may run on its own, to write sandbox or allowlist rules, or just to know before you run.

Checked against **faf-cli v8.0.1** by running each command in a clean repo and diffing every file, `.git/hooks` and the local git config before and after. `card init` and `cards` re-checked the same way on **v8.2.0**.

## Writes nothing

```
score  check  dna  context  drift  log  diff  convert  search
info  formats  demo  wjttc  share
```

Also read-only: plain `ai`, `hooks`, `taf` and `taf setup` (they print), `bench questions`, `memory ls` / `recall` / `show`, `conductor export` (prints JSON), and `decompile <file>` without `--output`.

**`share` sends nothing.** It packs `project.faf` into a `faf.one/share` link on your machine and prints it; `--copy` puts the link on your clipboard.

Preview first, write later:

```bash
faf migrate --dry-run
faf cards --check
faf server-card --check
faf git <url> --stdout       # clones to a temp dir, prints the .faf
```

## Writes your project files

| Command | Writes |
|---|---|
| `init` | `project.faf`, `.faf-dna` |
| `auto`, `loop`, `go`, `edit`, `migrate`, `recover` | `project.faf` |
| `refresh` | re-scores; recompiles `project.fafb` if you have one |
| `compile` | `project.fafb` |
| `decompile <file> --output <path>` | the file you name |
| `conductor import <path>` | merges into `project.faf` |
| `memory etch`, `memory convert` | `soul.fafm` (or `-f` / `-o`) |
| `git <url>` | `./project.faf`, after a shallow clone to a temp dir |
| `card init` | `agent.fafa`; at a terminal it then offers to write the cards it gives: `.well-known/agent-card.json` (an A2A URL) or `server-card` (an MCP URL), plus `.well-known/ai-catalog.json` and `.well-known/ard.json` |
| `cards` | your card files, as your `agent.fafa` allows: `.well-known/ai-catalog.json`, `.well-known/ard.json`, `.well-known/agent-card.json` (an A2A URL), `server-card` (an MCP URL), and it patches an existing `server.json`; with a `project.faf` the same files carry FAF context |
| `server-card` | patches your existing `server.json` |
| `show` | `project.html`, then opens it in a browser |
| `taf --output <path>` | a score snapshot |
| `bench grade <answers> --cold` / `--faf` | `.faf-bench.json` |

## Writes files your AI agents load

| Command | Writes |
|---|---|
| `export` | `AGENTS.md`, `.cursorrules`, `GEMINI.md`, `.github/copilot-instructions.md`, `project.html` |
| `export --agents` (or `--cursor`, `--gemini`, `--copilot`, `--llms`, `--html`, `--card`) | just that one |
| `sync` | faf's block in `CLAUDE.md` (`--direction pull` writes `project.faf` instead) |
| `export --grok` | adds the grok-faf-mcp server to `.grok/config.toml`, so Grok starts it next session. Opt-in only: never on a bare `export` or `--all`. |

faf writes **only its own marked block** in an instructions file and keeps everything outside it. It won't replace a file it can't prove it wrote unless you pass `--force`.

## Changes git or CI

| Command | Changes |
|---|---|
| `hooks --install` / `--uninstall` | faf's block in `.git/hooks/pre-commit` — see [Context guard](/hooks) |
| `diff --install-driver` / `--uninstall-driver` | a git diff driver: local git config and `.gitattributes` |
| `taf setup --write` | creates `.github/workflows/taf.yml` (never overwrites) |

## Leaves your machine, or your project

| Command | What happens |
|---|---|
| `ai analyze` | sends `project.faf` to the Anthropic API (needs `ANTHROPIC_API_KEY`) |
| `bench … --submit` | posts your bench receipt to the public ledger at `mcpaas.live` (`--endpoint` to change) |
| `git <url>` | fetches the public repo you name |
| `sync` with `FAF_PRO=1` | also writes Claude Code's `MEMORY.md` under `~/.claude/projects/` |
| `pro activate` | opens `faf.one/pro` in your browser |
| `clear` | deletes faf's own cached clones (`faf-git-*` temp dirs) |

Nothing else sends data anywhere.

## Writing rules for faf

If you allow or block faf commands by pattern, note that **options can go before or after a subcommand**, and `--` ends options:

```bash
faf taf --write setup        # same as: faf taf setup --write
faf memory -f soul.fafm etch "note"
faf ai -- analyze
```

Match the flag (`--write`, `--install`, `--grok`, `--submit`), not just the word order. The same CLI runs as `faf` or `faf-cli`, and through `npx`, `bunx`, `pnpm dlx`, `npm exec` and friends.
