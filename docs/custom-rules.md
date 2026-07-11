# Custom rules

The AI made a mistake. You don't want it again. Write one line.

A custom rule is a correction you pin so the AI can't drift back to it. faf keeps your rules; a full regen never touches them.

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

Already have rules written straight into `AGENTS.md` or `CLAUDE.md`? faf's writers are non-destructive — they update a faf-managed block and leave everything else you wrote alone.

## Rules vs conventions

- **Rules** — `ai_instructions.warnings` — hard "don't do this" corrections → **Guardrails**.
- **Conventions** — `ai_instructions.working_style` — "how this repo does things" → the **Conventions** section.

---

**Next:** [Getting started](/getting-started)
