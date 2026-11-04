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
| `package.json` whose `test` script is `node --test` (directly or through another script) | your `test` script, with node's JUnit reporter added through `NODE_OPTIONS` | `report.xml` |
| `package.json` whose `test` script is `mocha` | your `test` script, with mocha's built-in `xunit` reporter added | `report.xml` |
| Python (`pyproject.toml`, `setup.py`, `setup.cfg`, `requirements.txt`, `pytest.ini`) | `pytest --junitxml=report.xml` | `report.xml` |
| Go (`go.mod`) | `gotestsum --junitfile report.xml -- ./...` | `report.xml` |
| Rust (`Cargo.toml`) | `cargo nextest run --profile ci --workspace --no-fail-fast` | `target/nextest/ci/junit.xml` |
| Maven (`pom.xml`) | `mvn -B --fail-at-end test` (`./mvnw` with the wrapper), then a join step | `report.xml` |
| Gradle (`build.gradle`, `build.gradle.kts`, `settings.gradle*`) | `gradle test --continue` (`./gradlew` with the wrapper), then a join step | `report.xml` |
| .NET (`*.sln`, `*.slnx`, `*.csproj`, `*.fsproj` at the top) | `dotnet test` with the JUnit logger, one file per test assembly, then a join step | `report.xml` |
| Anything else, or another JS runner | a `TODO` placeholder to fill in | your choice |

The node:test and mocha steps run your own `test` script, so `pretest` and `posttest` run as they do locally. A script that picks its own reporter, runs after another command (`tsc && mocha`), or hands over to mocha from another script gets the placeholder.

For Python, the recipe also installs your test tools: a `test`, `tests` or `dev` extra in `[project.optional-dependencies]` (`pip install -e ".[test]"`), or a dependency group of that name in `[dependency-groups]` (`pip install --group test`). With `poetry.lock`, `uv.lock` or `pdm.lock`, a comment says to install dev dependencies with that tool.

faf-taf-git reads Jest, Vitest, Bun and WJTTC output, and JUnit XML. A runner that writes JUnit XML works with the placeholder: run it, and point `test-output-file` at the report.

When a repo has files for more than one language, faf picks in this order: `package.json`, Go, Rust, Maven, Gradle, .NET, Python. A Rust or Java repo with a `requirements.txt` gets the Rust or Java recipe.

**Rust.** The recipe installs cargo-nextest and runs every test (`--no-fail-fast`), so the receipt counts the whole suite. nextest writes JUnit only for a profile that asks for it: the workflow writes `.config/nextest.toml` with `[profile.ci.junit]` when the repo has no nextest config. If yours has one without that table, the workflow gets a comment saying to add it (with `path = "junit.xml"`), since there is no report to read without it; your file is never edited. nextest leaves `#[ignore]` tests out of its JUnit file, so their skips are not on the receipt.

**Maven and Gradle** write one XML file per test class, so the recipe adds a step that joins them into `report.xml` (`cat target/surefire-reports/TEST-*.xml > report.xml` for Maven, `cat build/test-results/test/TEST-*.xml > report.xml` for Gradle; a `find` across modules when `pom.xml` has `<modules>` or settings has `include`). One class's file alone can read PASSED for a run that failed. `--fail-at-end` and `--continue` keep a failing module from stopping the others. Java comes from `actions/setup-java` (Temurin 21); without `gradlew`, `gradle/actions/setup-gradle` installs Gradle.

**.NET.** In CI only, the recipe adds the `JunitXml.TestLogger` package to each test project (one that references `Microsoft.NET.Test.Sdk` or sets `<IsTestProject>true`); your project files are not changed in the repo, and a project that already references the logger keeps its own version. `setup-dotnet` installs every SDK channel your projects' `<TargetFramework>` names (`net8.0` gets `8.0.x`), plus your `global.json` when there is one. With more than one solution or project at the top, `dotnet test` is given the solution.

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
        uses: Wolfe-Jam/faf-taf-git@v2.4.6
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
- **A run where every test was skipped** is recorded as `SKIPPED`, not `PASSED`.
