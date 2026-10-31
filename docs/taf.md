# Test Receipts

A Test Receipt is one line of proof that your tests ran: when, the result, passed/total. Every CI run on your default branch appends one to `.taf`, on its own `taf-receipts` branch, so the record lives in git and never expires with the CI logs. Red runs get one too.

[faf-taf-git](https://github.com/Wolfe-Jam/faf-taf-git) prints the receipts. faf writes the workflow and reads them back.

## See them

```bash
git fetch origin taf-receipts
faf taf receipts
```

```
TAF receipts — faf-cli · 417 on origin/taf-receipts · times in UTC
  2026-10-31 08:51  PASSED    2301/2302  1 skipped
  2026-10-31 08:40  PASSED    2301/2302  1 skipped
  2026-10-31 07:10  PASSED    2292/2293  1 skipped
  2026-10-31 06:28  PASSED    2282/2283  1 skipped
  2026-10-31 05:07  PASSED    2273/2274  1 skipped
  last 5: 5 PASSED
  as of your last fetch (git fetch origin taf-receipts)
```

Newest first. It reads `origin/taf-receipts`, then a local `taf-receipts`, then a `.taf` in the folder. It never fetches and never writes: fetch when you want the latest. In a partial clone that left the `.taf` out, it says so and how to get it once.

| Option | Does |
|---|---|
| `--limit <n>` | how many to show (default 10) |
| `--json` | the same receipts as JSON: `source`, `project`, `total`, `receipts` |
| `--ref <ref>` | read `.taf` from that git ref only, e.g. `origin/taf-receipts~20` |

Times are in UTC; a time written without a zone is read as UTC. Older hand-written receipts show `—` where they kept no counts.

## Set it up

```bash
faf taf setup            # prints the workflow
faf taf setup --write    # writes .github/workflows/taf.yml
```

`--write` never replaces an existing `taf.yml`: it refuses and exits 1. Commit and push, and the first receipt prints on the next run.

faf picks the recipe from the repo:

| Repo | Test step | Receipt reads |
|---|---|---|
| `package.json` whose `test` script runs Jest or Vitest, or `bun test` with a Bun lockfile | your `test` script, via npm, pnpm, yarn or bun (from the lockfile) | the test output |
| Python (`pyproject.toml`, `setup.py`, `setup.cfg`, `requirements.txt`, `pytest.ini`) | `pytest --junitxml=report.xml` | `report.xml` |
| Go (`go.mod`) | `gotestsum --junitfile report.xml -- ./...` | `report.xml` |
| Anything else, or another JS runner | a `TODO` placeholder to fill in | your choice |

faf-taf-git reads Jest, Vitest, Bun and WJTTC output, and JUnit XML. A runner that writes JUnit XML works with the placeholder: run it, and point `test-output-file` at the report.

A Go repo gets:

```yaml
name: TAF Receipts
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

jobs:
  taf:
    runs-on: ubuntu-latest
    permissions:
      contents: write              # lets the action save receipts
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-go@v7
        with:
          go-version-file: go.mod
      - run: GOTOOLCHAIN=auto go install gotest.tools/gotestsum@v1.13.0
      - name: Run tests
        id: tests
        continue-on-error: true    # keep going, so a failed run still gets a receipt
        run: |
          set -o pipefail
          gotestsum --junitfile report.xml -- ./...
      - name: Print the receipt
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        uses: Wolfe-Jam/faf-taf-git@v2.4.3
        with:
          test-output-file: report.xml
          target-branch: taf-receipts
      - name: Fail the job if the tests failed
        if: steps.tests.outcome == 'failure'
        run: exit 1
```

## How the recipe works

- **Red runs get a receipt.** The test step keeps going on a failure, the receipt prints, then the last step fails the job. Your CI is still red.
- **One branch is recorded,** your default: origin's HEAD; else origin's `main`, `master` or only branch; else the current branch, and faf says it's a guess. Check `branches:` before you commit. Pull requests run the tests and print no receipt.
- **Runs that finish together keep their receipts.** A run whose push loses the race fetches the branch, adds its receipt on top, and pushes again, up to 5 tries. Nothing is force-pushed: the receipts branch only grows.
- **A run that fails before its tests** (install, toolchain), or whose output can't be read, gets no receipt. The job is red.
