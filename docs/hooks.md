# Context guard

A pre-commit hook that catches a **context regression** — when the `project.faf` you're about to commit scores *lower* than the one already in `HEAD`. It warns before the drop lands in Git; with `--strict`, it blocks the commit.

## Install it

```bash
faf hooks --install            # warn on regression (default)
faf hooks --install --strict   # block the commit on regression
faf hooks --uninstall          # remove faf's hook block
```

Opt-in only — nothing is wired on `npm install`. You run the command; faf writes the hook.

## What you get

On every commit that stages a `.faf`, faf scores it against `HEAD` and prints the delta:

```
⚠ faf: context 92% → 85% (−7) — context regression
```

- **Default (warn):** the line shows, the commit proceeds.
- **`--strict`:** a regression exits non-zero and stops the commit until you fix the context or re-stage.

The guard only runs when a `.faf` is actually staged — commits that don't touch your context are left alone.

## Why it's safe

- **Fails open.** If the guard errors — no git, no `faf` on `PATH`, a crash — your commit still goes through. A guard must never break a commit because it broke.
- **Never clobbers.** It appends a sentinel-marked block to your `pre-commit`; an existing hook is preserved, and `--uninstall` removes only faf's block.
- **Defers to hook managers.** If `core.hooksPath` is set (husky, lefthook, pre-commit), faf won't touch it — it prints the one line to add yourself.
- **Version-checked.** Install refuses if the `faf` on your `PATH` is too old to run the guard (needs faf ≥ 7.0) — so a `--strict` hook can never block commits against a stale binary.

## Under the hood

The hook is a few lines: when a `.faf` is staged and `faf` is on `PATH`, it calls `faf hooks-run`, which does the scoring. Warn mode ends in `|| true` (never blocks); `--strict` ends in `|| exit 1`.

It guards the file the AI reads:

```
package.json  ← npm reads this
project.faf   ← AI reads this — the guard watches its score
README.md     ← humans read this
```
