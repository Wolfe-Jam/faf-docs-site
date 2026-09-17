# Cards

Agents and MCP servers are found through cards — small files other machines read. There are several, they overlap, and they ask the same things in different words. Keep three by hand and you get three that disagree.

`faf cards` writes them all from one file.

## What it needs

| File | Holds |
|---|---|
| `project.faf` | your project's context |
| `agent.fafa` | your agent's identity — name, domain, what it does, where it runs |

`faf cards` reads both and projects every card from them. No `.fafa`, no agent cards: faf will not invent an agent.

## Write them

```bash
faf cards                          # every card your inputs allow
faf cards --target a2a,catalog     # just these
faf cards --check                  # print them, write nothing
```

## Every target

| Target | Writes | What reads it |
|---|---|---|
| `a2a` | `.well-known/agent-card.json` | other agents, over A2A |
| `mcp` | `server-card` | MCP clients connecting to a remote server |
| `registry` | patches `server.json` | the MCP Registry |
| `catalog` | `.well-known/ai-catalog.json` | AI Catalog consumers |
| `ard` | `.well-known/ard.json` | agent search engines |

`registry` patches an existing `server.json` — it will not seed one.

## Identifiers are derived, not invented

Every catalog and ARD row is keyed `urn:air:{publisher}:{namespace}:{name}`:

- **publisher** — the domain your `.fafa` declares: `agent.id`'s `urn:air`, else `metadata.cards.domain`, else the host of `agent.homepage`.
- **name** — the handle, from `agent.name`, lowercased and reduced to characters a URN may carry. Never the display name, which is free text and may contain spaces a URN may not.

A `.fafa` that names no domain is refused, in one line. An identifier is a catalog's primary key; faf will not guess one.

## Being found

A catalog says who publishes it:

```json
{
  "specVersion": "1.0",
  "host": { "displayName": "Acme Corp", "identifier": "acme.example" },
  "entries": [ … ]
}
```

`host.displayName` is what lifts a catalog from *minimal* to *discoverable*. An empty one is invalid rather than minimal, so a `.fafa` that names nobody gets no host at all — a minimal catalog that validates beats a discoverable one that does not.

ARD adds the hints search engines index on, read from your `.fafa`:

```yaml
metadata:
  cards:
    keywords: [weather, forecast]        # → tags
    examples:                            # → representativeQueries
      - "what is the weather in Lisbon tomorrow"
      - "will it rain in Berlin this weekend"
```

An entry with no representative queries is valid and unfindable — the semantic index is built from them. `faf cards` says so rather than writing a card nobody can find. Two to five is the recommendation.

## A file you share

The catalog and the ARD manifest may list other publishers' rows. faf edits them as text, and touches only its own:

- A row is faf's when its identifier is **exactly** faf's — never by type or URL.
- On a match, only `url`, `type` and `updatedAt` move. Your copy — titles, tags — stays.
- Any other faf row is appended. Every other byte stays as it was.
- `host` is the one key faf may add, and only when the catalog names none. A host already there is yours.
- A catalog faf cannot edit row by row is refused, unchanged, in one line.

## In a browser

The same projector runs without Node:

```js
import { buildPack } from 'faf-cli/pack';

const pack = buildPack(answers, { cards: ['a2a', 'server_card', 'ai_catalog'] });
```

`answersToFafa` turns a handful of answers into a `.fafa`; `buildPack` projects it onto the cards you ask for. No filesystem, no Node built-ins, types included.

## Neutral by default

A card built through the pack carries no extension and no FAF media type unless you pass one. Your `.fafa` is listed in your own catalog only when you ask for it. What you publish describes your agent, not the format underneath it.
