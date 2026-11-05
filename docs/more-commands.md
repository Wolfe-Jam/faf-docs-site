# More commands

The rest of faf-cli: history, benchmarks, test audits, and small tools. Each one reads `project.faf` (found the way every command finds it) unless it says otherwise. What each one writes is in [What each command writes](/side-effects).

## log

The `project.faf` score at every commit that changed it.

```bash
faf log            # newest first, 20 commits
faf log -n 4       # the last 4
faf log --all      # every commit
faf log --reverse  # oldest first
faf log --json     # the timeline as data
```

```
   55%   +34  2026-02-10  9fc1f60d  ● YELLOW  feat: faf 6ws command + install hang fix
   21%   +21  2026-02-08  81d42559  ○ RED  fix: Remove legacy .faf warning for clean demo output
    0%   -55  2026-02-08  5b2f12d8  ♡  fix: Always update project.faf (not legacy .faf) in readme command
```

Three commits from faf-cli's own history: the score, the change from the commit before, the date, the commit and the tier. It reads git history only. Nothing is written.

## bench

Measures how well an AI answers questions about your project without `project.faf`, then with it. The questions come from your populated slots, so `project.faf` is the answer key, and grading is mechanical: no judge.

```bash
faf bench                 # the steps, for you or your agent
faf bench questions       # the questions (--json for data)
```

```
faf bench — 12 questions  qset 4d6fc2ab0d71

   1. What is the project's name?
   2. What is the project's goal — what is it for?
   3. What is the primary programming language?
   …
```

Run it twice in fresh AI sessions, saving the answers as JSON (`{"1": "...", "2": "..."}`):

1. **Cold:** the AI answers from the repository without reading `project.faf`, `CLAUDE.md`, `AGENTS.md` or any `.faf` file.
   `faf bench grade cold.json --cold --tokens <used> --model <name>`
2. **With faf:** the AI reads `project.faf` first.
   `faf bench grade faf.json --faf --tokens <used> --model <name>`

With both runs graded, faf prints the pair: cold against with-faf, with the tokens each used. The runs are kept in `.faf-bench.json`. `--submit` sends the paired receipt to the public bench ledger (`--endpoint` to change where).

## wjttc

Audits a test suite by tier: Brake, Engine, Aero, Tyre and Pit. A test takes its tier from a marker in its own name or in a parent block's name, such as `describe('BRAKE: …')`. It reads TypeScript and JavaScript, Python, Rust, Go and Zig tests.

```bash
faf wjttc                  # tests/ by default
faf wjttc --path spec      # another folder
faf wjttc --strict         # exit 1 if any test has no tier
faf wjttc --json           # for CI
```

```
faf wjttc — vendor-neutral test audit
  Files scanned: 164
  Tests found:   1973
  Tiers:
    ● BRAKE    693  (35%)
    ● ENGINE   808  (41%)
    …
```

Blocks with modifiers count too (`describe.skipIf(…)`, `test.each(…)`, `it.only`). `fixtures/` and `__fixtures__/` folders are test data and are skipped.

## context

The filled slots as `slot: value` lines, ready to paste into an AI prompt.

```bash
faf context
```

```
project.name: faf-cli
project.main_language: TypeScript
human_context.who: Developers and teams using AI coding assistants
stack.build: Bun (bun build) + tsc
…
```

Empty and `slotignored` slots are left out.

## convert

Prints `project.faf` as YAML, or as JSON with `--json`. Nothing is written.

```bash
faf convert
faf convert --json
```

## search

Finds slots and file formats by name.

```bash
faf search typescript
faf search hosting --slots     # slots only
faf search yaml --formats      # formats only
```

```
formats — 1 match

  TypeScript .ts, .tsx, .mts, .cts [web]
```

## share

A `faf.one/share` link that carries your `project.faf`. The link is built on your machine, and nothing is sent anywhere.

```bash
faf share          # print the link
faf share --copy   # and copy it to the clipboard
faf share --raw    # the encoded string only
```

## conductor

Moves context between `project.faf` and a Conductor config.

```bash
faf conductor export          # print the config, as JSON, from project.faf
faf conductor import <path>   # read a config file or folder into project.faf
```

`import` takes `name`, `description` and `language` from a `.json` or `.yaml` file, or from the first files that have them in a folder. It merges them into an existing `project.faf`, or creates one.

## clear

Deletes the temporary clones `faf git <url>` leaves behind (`faf-git-*` folders in your system's temp folder).

```bash
faf clear
```

## info

The faf-cli version, the scoring kernel version and the IANA media type.

```bash
faf info
```

```
faf v<version>
kernel <version>  IANA application/vnd.faf+yaml
```

## demo

A walkthrough on a sample project in a temporary folder of its own, removed at the end. Your project is never touched.

```bash
faf demo
```
