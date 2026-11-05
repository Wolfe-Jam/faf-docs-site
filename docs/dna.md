# DNA

`.faf-dna` is your project's birth certificate: the score `project.faf` had the first time `faf init` wrote it, recorded once. A project gets one. faf keeps it, and records what happens after.

```bash
faf dna
```

```
🧬 YOUR FAF DNA

   22% → 85% ← 80%

   Birth DNA 22% (born 2025-10-28)  ·  current 80%  ·  growth +58%
```

The line reads birth → peak ← now. Under it, `history` lists every version: the score, the day, and what moved it.

## What records growth

| Command | `.faf-dna` |
|---|---|
| `init` | writes the birth certificate when there is none |
| `init --new`, `init --force` | a fresh `project.faf`; `.faf-dna` is kept as it is |
| `auto`, `go`, `edit` | add a version when the score moves. Never create a `.faf-dna`. |
| `refresh` | adds a version when the score moves; writes the birth certificate when there is none |

A score that doesn't move adds no version.

## Written once

The birth certificate is written once and never replaced. faf writes `.faf-dna` only when there is none: with one there, in any shape, it writes nothing. `init --output sub/x.faf` writes it beside the file, as `sub/.faf-dna`.

## As data

```bash
faf dna --json
```

Birth, certificate, current score, growth, peak, the journey line, every version with its changes, and any earlier lives. The same file gives the same JSON. With no `.faf-dna`, it exits 1 and prints nothing to stdout.

## Keep it in git

Gitignored, `.faf-dna` is lost on a fresh clone, a new machine, or `git clean -X`. `faf init` and `faf dna` say so, naming the rule:

```
faf: .faf-dna is gitignored (.gitignore:2: .faf-dna): a fresh clone loses the birth certificate. Commit it, or put the reason in a # comment above that line.
```

To keep it local on purpose, put the reason in a `#` comment on the line above the rule. faf stays quiet.

Committed, the certificate is permanent: the commit that first added `.faf-dna` is named by the hash of its content, so it can't change without rewriting history. Until then, `faf init` and `faf dna` print the command to run:

```
The birth certificate is not committed yet. Commit it to make it permanent: git add .faf-dna && git commit -m "faf: birth certificate"
```

faf never commits for you.

## Verify

```bash
faf dna --verify
```

Compares the certificate in `.faf-dna` with the one in the commit that first added it: `certificate`, `born`, `birthDNA` and `projectDNA` must be the same. A certificate that was deleted and written again is still checked against the first commit.

| Exit | Means |
|---|---|
| `0` | the same |
| `1` | changed, or `.faf-dna` is gone |
| `2` | can't check: not a git repository, a shallow clone, or not committed yet |

`--json` gives the result as data. A shallow clone (`actions/checkout` defaults to one commit) can't show the first commit, so faf says so rather than report a match; fetch the full history first (`fetch-depth: 0`).

## Protected

A `.faf-dna` faf can't prove it wrote (another tool's file, or one edited by hand) is read and left exactly as it is. faf adds no versions to it, and `faf dna` says the certificate is protected.
