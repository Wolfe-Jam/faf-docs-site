# Scoring

`faf score` reads your `project.faf` and gives it a 0–100% AI-readiness score. The score is deterministic: the same file gets the same number, every time, in every tool that runs the engine.

```bash
faf score           # score + every slot
faf score --json    # the same, for scripts
```

## Always-33

Every `.faf` is scored against the same 33 slots:

| Slots | What they hold |
|---|---|
| project (3) | name, goal, main language |
| human context (6) | who, what, why, where, when, how |
| frontend (4) · backend (5) · universal (3) | the stack |
| enterprise (12) | infra, app and ops |

**Score = filled ÷ active.** A slot is active unless it's marked `slotignored`.

## Your app-type decides what counts

`project.type` is your app-type. `faf init`, `faf auto` and `faf git` detect it and write `slotignored` into every slot it doesn't use — a CLI counts 12 slots, a full-stack app 21. Everything else stays active: filled, or empty.

The slots you don't use stay visible. `faf score` lists all 33:

```text
✪ TROPHY 100% 12/12 slots — project.faf
  ● project.name
  …
  ● stack.cicd
  — stack.monorepo_tool: slotignored
  …
  — monorepo.remote_cache: slotignored
```

## What counts as empty

A missing slot, an empty value, or a placeholder word — `None`, `N/A`, `null`, `unknown`, `TBD`, `TODO`, `not applicable` — counts as empty. Only `slotignored` takes a slot out of the score, and faf writes it from your app-type.

## A file without the enterprise markers

If a `.faf` doesn't mark the 12 enterprise slots, they count as empty: 21 filled is 21 ÷ 33 = 64%. Run `faf auto` — it writes the markers, and the score is what your file actually says.

## Tiers

| Score | Tier |
|---|---|
| 100% | ✪ Trophy |
| 99% | ★ Gold |
| 95% | ◆ Silver |
| 85% | ◇ Bronze |
| 70% | ● Green |
| 55% | ● Yellow |
| 1% | ○ Red |
| 0% | ♡ White |

Trophy is the target: at 100%, AI never has to guess.
