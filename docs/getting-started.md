# Getting started

faf-cli reads your repo and writes the context file your AI coding agent needs — detected from your real stack, never guessed.

Three steps.

## A — Install it

```
bunx faf
```

No install needed. Or keep it: `npm i -g faf-cli`

## B — Run it

```
faf
```

Detects your stack, writes `project.faf`, scores it 0–100%.

## C — Use it

```
faf export --agents
```

Writes `AGENTS.md` from your `project.faf` — or prefaces an existing one with the facts, non-destructive to your content. Also: `--claude`, `--gemini`, `--cursor`.

---

That's it. Your AI now has context that versions with your code — no re-explaining, no drift.

**Next:** [Custom rules](/custom-rules)
