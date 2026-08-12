# faf-docs-site

Source for **docs.faf.one** — the FAF manual. Facts for devs.

Built with [VitePress](https://vitepress.dev), served on Cloudflare Pages.

## Develop

```
bun install
bun run docs:dev        # http://localhost:5173
```

## Build

```
bun run docs:build      # → docs/.vitepress/dist
```

## Deploy

Cloudflare Pages, auto on push.

- **Build command:** `bun run docs:build`
- **Output dir:** `docs/.vitepress/dist`
- **Custom domain:** `docs.faf.one`

## Structure

```
docs/
├─ index.md              front door + ToC
├─ getting-started.md    install · run · use
├─ custom-rules.md       pin corrections into AGENTS.md
├─ hooks.md              pre-commit context-regression guard
└─ .vitepress/
   ├─ config.ts          sidebar · search · nav
   └─ theme/             black/white lean overrides
```

faf-cli leads. The rest of FAF lands here over time.
