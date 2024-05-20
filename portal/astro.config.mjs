import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  site: 'https://opendataeditor.okfn.org',
  srcDir: '.',
  outDir: 'build',
  integrations: [
    starlight({
      title: 'Open Data Editor',
      logo: {
        light: '/assets/logo-light.svg',
        dark: '/assets/logo-dark.svg',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/okfn/opendataeditor',
      },
      favicon: 'favicon.ico',
      customCss: ['typeface-hk-grotesk/index.css', '/assets/styles.css'],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 5 },
      sidebar: [
        {
          label: 'Documentation',
          autogenerate: { directory: 'documentation' },
        },
        {
          label: 'Contributing',
          autogenerate: { directory: 'contributing' },
        },
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            src: 'https://plausible.io/js/script.js',
            'data-domain': 'opendataeditor.okfn.org',
            defer: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon-16x16.png',
            sizes: '16x16',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon-32x32.png',
            sizes: '32x32',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
            sizes: '180x180',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/android-chrome-192x192.png',
            sizes: '192x192',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/android-chrome-512x512.png',
            sizes: '512x512',
          },
        },
      ],
    }),
  ],
})
