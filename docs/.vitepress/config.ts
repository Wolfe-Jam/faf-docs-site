import { defineConfig } from 'vitepress'

// docs.faf.one — the FAF manual. Lean, black/white, faf-cli first.
export default defineConfig({
  title: 'FAF',
  titleTemplate: ':title · docs.faf.one',
  description: 'The FAF manual. Facts for devs.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'faf-cli', link: '/getting-started' },
      { text: 'faf.one', link: 'https://faf.one' },
    ],
    sidebar: [
      {
        text: 'faf-cli',
        items: [
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Export', link: '/export' },
          { text: 'Drift', link: '/drift' },
          { text: 'Custom rules', link: '/custom-rules' },
          { text: 'Context guard', link: '/hooks' },
        ],
      },
    ],
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
