import { defineConfig, type DefaultTheme } from 'vitepress'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SITE = 'https://docs.faf.one'

// One page's title (its H1) and description (the first paragraph after it).
function pageInfo(md: string): { title: string; description: string } {
  const lines = md.split('\n')
  const h1 = lines.findIndex((l) => l.startsWith('# '))
  const title = h1 >= 0 ? lines[h1].slice(2).trim() : ''
  const para: string[] = []
  for (const l of lines.slice(h1 + 1)) {
    if (!l.trim()) { if (para.length) break; continue }
    if (/^(#|```|\||- |\* |>|<)/.test(l)) { if (para.length) break; continue }
    para.push(l.trim())
  }
  return { title, description: para.join(' ').replace(/\s+/g, ' ') }
}

// llms.txt (llmstxt.org), llms-full.txt and a .md copy of every page, written at
// build time from the sidebar so they can't drift from the site.
function writeLlmsFiles(srcDir: string, outDir: string, sidebar: DefaultTheme.SidebarItem[]) {
  const index = ['# docs.faf.one', '', '> The FAF manual: faf-cli and the FAF MCP servers. `project.faf` is an IANA-registered YAML file (application/vnd.faf+yaml) of a project\'s facts.', '']
  const full: string[] = []
  const pages = [{ text: 'Home', link: '/index' }, ...sidebar]
  for (const group of pages) {
    const items = 'items' in group && group.items ? group.items : [group]
    if ('items' in group && group.items) index.push(`## ${group.text}`, '')
    for (const item of items) {
      if (!item.link || item.link.startsWith('http')) continue
      const slug = item.link.replace(/^\//, '') || 'index'
      const file = join(srcDir, `${slug}.md`)
      if (!existsSync(file)) continue
      const md = readFileSync(file, 'utf8')
      writeFileSync(join(outDir, `${slug}.md`), md)
      const { title, description } = pageInfo(md)
      index.push(`- [${title || item.text}](${SITE}/${slug}.md)${description ? `: ${description}` : ''}`)
      full.push(md.trim(), '')
    }
    index.push('')
  }
  writeFileSync(join(outDir, 'llms.txt'), index.join('\n'))
  writeFileSync(join(outDir, 'llms-full.txt'), full.join('\n'))
}

// docs.faf.one — the FAF manual. Lean, black/white, faf-cli first.
const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'faf-cli',
    items: [
      { text: 'Getting started', link: '/getting-started' },
      { text: 'Scoring', link: '/scoring' },
      { text: 'Export', link: '/export' },
      { text: 'Cards', link: '/cards' },
      { text: 'Compile', link: '/fafb' },
      { text: 'Drift', link: '/drift' },
      { text: 'DNA', link: '/dna' },
      { text: 'Test Receipts', link: '/taf' },
      { text: 'Custom rules', link: '/custom-rules' },
      { text: 'Context guard', link: '/hooks' },
      { text: 'More commands', link: '/more-commands' },
      { text: 'What each command writes', link: '/side-effects' },
    ],
  },
  {
    text: 'claude-faf-mcp',
    items: [
      { text: 'Claude FAF (claude-faf-mcp)', link: '/claude-faf-mcp' },
    ],
  },
  {
    text: 'faf-mcp',
    items: [
      { text: '.FAF Context (faf-mcp)', link: '/faf-mcp' },
    ],
  },
  {
    text: 'Chrome extension',
    items: [
      { text: 'Agent Discovery Check', link: '/agent-discovery-check' },
    ],
  },
  {
    text: 'grok-faf-mcp',
    items: [
      { text: 'Grok FAF (grok-faf-mcp)', link: '/grok-faf-mcp' },
    ],
  },
]

export default defineConfig({
  title: 'FAF',
  titleTemplate: ':title · docs.faf.one',
  description: 'The FAF manual. Facts for devs.',
  cleanUrls: true,
  lastUpdated: true,
  buildEnd(site) {
    writeLlmsFiles(site.srcDir, site.outDir, sidebar)
  },
  themeConfig: {
    nav: [
      { text: 'faf-cli', link: '/getting-started' },
      { text: 'faf.one', link: 'https://faf.one' },
    ],
    sidebar,
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Wolfe-Jam/faf-cli' },
    ],
    footer: {
      message: 'The FAF manual · docs.faf.one',
      copyright: 'MIT · faf.one',
    },
  },
})
