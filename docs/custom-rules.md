# Custom rules

Custom rules are your own instructions to the AI — what it must always do, or never do, in this repo. Write them once in `project.faf`; faf carries them into every `AGENTS.md` it authors, and never overwrites them.

## Where they go

In `project.faf`, under `ai_instructions.warnings` — a plain list:

```yaml
ai_instructions:
  warnings:
    - "Use full words in identifiers — response, not res."
    - "Never commit straight to main — branch and open a PR."
```

## What you get

`faf export --agents` writes them to the **top** of your `AGENTS.md` Guardrails, verbatim — your rules first, because they're the ones only you know:

```markdown
## Guardrails
- Use full words in identifiers — response, not res.
- Never commit straight to main — branch and open a PR.
- **Ask first:** dependency installs, deletions, migrations, schema changes.
- **Never:** force-push, push to main, commit secrets.
```

## Why it holds

- **Hand-authored wins.** A regen refreshes the facts, never your rules.
- **Versioned in Git.** They live in `project.faf` — reviewed in PRs, travelling with the repo.
- **Projected every run.** Change your stack, the facts update; your rules stay put.

`project.faf` is a committed file in your repo — right alongside the ones you already keep:

```
package.json  ← npm reads this
project.faf   ← AI reads this
README.md     ← humans read this
```

Already have rules written straight into `AGENTS.md` or `CLAUDE.md`? faf's writers are non-destructive — they update a faf-managed block and leave everything else you wrote alone.

## Rules vs conventions

- **Rules** — `ai_instructions.warnings` — hard "don't do this" corrections → **Guardrails**.
- **Conventions** — `ai_instructions.working_style` — "how this repo does things" → the **Conventions** section.

---

**Next:** [Getting started](/getting-started)
