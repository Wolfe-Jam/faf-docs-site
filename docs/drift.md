# Drift

`faf drift` checks whether the files your AI reads have moved ahead of `project.faf`. It compares the modification time of `project.faf` against `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, and `GEMINI.md`.

```bash
faf drift
```

```
drift — context file sync status

  .faf            5d ago
  ! CLAUDE.md     newer   5d ago
  ○ AGENTS.md     older   22d ago
  ○ .cursorrules  missing
  ● GEMINI.md     in sync
```

A **newer** target means someone edited the context file and the `.faf` hasn't caught up. Run [`faf sync`](/getting-started) to reconcile.

## JSON

```bash
faf drift --json
```

A self-describing report — `faf_version` / `project` / `source` header, then one entry per target with `status` (`newer` · `older` · `in-sync` · `missing`), raw `mtime_ms`, and `delta_ms`. No `Date.now()` in the payload; the consumer formats its own "5d ago". With no `project.faf`, `--json` returns `{ error, hint }` and exits `2`.

## As a library

The comparison is a pure function, exported from the package:

```ts
import { computeDrift } from 'faf-cli';

const report = computeDrift('/path/to/project.faf');
// { source, source_mtime_ms, targets: [...], drifted, in_sync, missing }
```

`computeDrift(fafPath, dir?)` takes an explicit path — it never reads `process.cwd()`. An editor extension calls it directly instead of shelling out.
