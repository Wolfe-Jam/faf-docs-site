# Agent Discovery Check

A Chrome extension. Click it on any site and it shows whether that site publishes what AI agents look for, and whether each file meets its spec.

Free and open source. [Chrome Web Store](https://chromewebstore.google.com/detail/lnecebepmpjpilldfmndnaofbfjkjlkm) · [Source](https://github.com/Wolfe-Jam/faf-chrome-extension)

## What it checks

One row per surface:

| Row | Where it looks |
|---|---|
| AI Catalog | `/.well-known/ai-catalog.json` |
| MCP Server Card | the card the catalog lists |
| llms.txt | `/llms.txt` |
| WebMCP tools | the tools the page registers for agents |

On a GitHub repository page it also checks for `AGENTS.md` and `project.faf`.

Each catalog, Server Card and WebMCP tool is checked against its spec. Every check is tagged MUST or SHOULD and links to the spec it comes from. There is no score.

## What a row says

| Status | Meaning |
|---|---|
| Published | the file is there and was read. If checks failed, the row says how many, for example "Published · 2 issues". |
| Not published | the site has no such file at the standard address |
| Unreadable | the site answered but the file could not be read: an error, a redirect, or no answer in time. Click Check again. |
| Skipped | the check does not apply, or an earlier step it needs did not succeed |

## Use it

1. Install it from the Chrome Web Store.
2. Open a site.
3. Click the icon.

It runs only when you click, and only on that tab. Click Check again to run it again.

## What it requests

- The files above, from the site you clicked on. When the site's AI Catalog lists an MCP Server Card, it also requests that card and checks the catalog's links. The card can be on another host.
- Up to 30 requests per click, plus any preflight request the browser sends to the card's host.
- GET, HEAD and OPTIONS only. No cookies. Redirects are not followed.
- Another host is told only the address of the site you clicked on.

Results appear in the popup. Nothing is stored and nothing is sent to FAF. There is no analytics. See the [privacy policy](https://faf.one/privacy).

## Permissions

`activeTab` and `scripting`. No host permissions: the extension has no access to a site until you click it.

## Questions and bugs

[Open an issue on GitHub](https://github.com/Wolfe-Jam/faf-chrome-extension/issues), or email team@faf.one.

## History

Version 2.0.0 replaced Stack Grabber, an earlier extension under the same name in the store. Stack Grabber is retired.
