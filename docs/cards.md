# Cards

Agents and MCP servers are found through cards — small files other machines read. There are several, they overlap, and they ask the same things in different words. Keep three by hand and you get three that disagree.

`faf cards` writes them all from one file.

## Start here

```bash
npx faf-cli@latest card init
```

It asks seven questions (name, short name, domain, what it does, version, where it runs, what it can do) and a few questions people ask your agent, writes `agent.fafa`, then offers to write the cards it gives: your A2A card or MCP Server Card, and your AI Catalog and ARD entries. Press Enter and you are listed.

For scripts and CI, every answer is a flag and nothing is asked:

```bash
faf card init --name "Weather Agent" --domain example.com \
  --description "Answers questions about the weather anywhere." \
  --set-version 1.2.0 --url https://example.com/a2a \
  --skill "Get forecast: A three-day forecast for a place." \
  --example "Will it rain in Leeds tomorrow?"
```

`--url <url> --protocol mcp` for a remote MCP server; `--package <npm name>` instead of `--url` for an MCP server people install. A "where it runs" that is not an http(s) URL or an npm package name is refused. `card init` never replaces an existing `agent.fafa` unless you pass `--force`.

## BETTER and BEST

| | You have | You get |
|---|---|---|
| **BETTER** | `agent.fafa` | the cards its endpoints allow: A2A card (an A2A URL), MCP Server Card (an MCP URL), registry `server.json` (an MCP URL or a package), AI Catalog, ARD |
| **BEST** | + `project.faf` | the same cards, with FAF context: the A2A card's context extension, the Server Card's and `server.json`'s `_meta` |

BETTER is the `.fafa`, BEST is `project.faf`. `agent.fafa` is your agent's identity: name, domain, what it does, where it runs. It sits behind your cards, the way `package.json` sits behind a build: other machines read the A2A card and the catalog, in formats they already know. `project.faf` is your project's context (`faf init` makes one). Add it and every card carries that context; the cards' names and descriptions still come from `agent.fafa`, so moving up to BEST never changes who your agent is.

No `.fafa`, no agent cards: faf will not invent an agent.

### Or write `agent.fafa` by hand

Seven answers describe an agent or a server. Copy this into your project and change the values; the comments mark each answer.

```yaml
version: "1.0"
agent:
  name: weather-agent                 # short name
  displayName: Weather Agent          # name
  id: urn:air:example.com:agent:weather-agent   # domain + short name
  version: 1.2.0                      # version
  description: Answers questions about the weather anywhere.   # what it does
  homepage: https://example.com
capabilities:                         # what it can do
  - name: Get forecast
    type: tool
    description: A three-day forecast for a place.
endpoints:                            # where it runs
  - protocol: a2a
    transport: http
    location: https://example.com/a2a
metadata:
  cards:
    examples:                         # 2-5 questions people ask it; search finds it by these
      - Will it rain in Leeds tomorrow?
      - What is the forecast for Tokyo this weekend?
```

Then:

```bash
faf cards                          # writes the cards your agent.fafa gives
```

## Write them

```bash
faf cards                          # every card your inputs allow
faf cards --target a2a,catalog     # just these
faf cards --check                  # print them, write nothing
```

## Every target

| Target | Writes | From | What reads it |
|---|---|---|---|
| `a2a` | `.well-known/agent-card.json` | an A2A endpoint in `agent.fafa` | other agents, over A2A |
| `mcp` | `server-card` | a remote MCP URL in `agent.fafa` | MCP clients connecting to a remote server |
| `registry` | patches `server.json` | an MCP URL or package in `agent.fafa` | the MCP Registry |
| `catalog` | `.well-known/ai-catalog.json` | `agent.fafa` | AI Catalog consumers |
| `ard` | `.well-known/ard.json` | `agent.fafa` | agent search engines |

With `project.faf`, each card also carries FAF context. An MCP server's own repo with `project.faf` and no MCP endpoint in its `.fafa` gets its Server Card and registry identity from `project.faf`, as `faf server-card` writes them.

`registry` patches an existing `server.json` — it will not seed one. A card you wrote yourself, or edited since faf wrote it, is left unchanged (`--force` replaces it).

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

`answersToFafa` turns a handful of answers into a `.fafa`; `buildPack` projects it onto the cards you ask for. Pass `faf` (your parsed `project.faf`) for BEST. No filesystem, no Node built-ins, types included. It writes the same cards as `faf cards`.

## What you publish

At BETTER a card carries no FAF context and nothing that points at a `project.faf`: what you publish describes your agent, in the card formats your readers already use. Your catalog lists your `.fafa`, the source the cards come from (`listFafa: false` leaves it out). At BEST each card adds FAF's context, pointing at your `project.faf`.
