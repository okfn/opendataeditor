import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Open Data Editor',
      logo: {
        light: '/src/assets/logo-light.png',
        dark: '/src/assets/logo-dark.png',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/frictionlessdata/open-data-editor',
      },
      customCss: ['/src/assets/styles.css'],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {label: 'Example Guide', link: '/guides/example/'},
          ],
        },
        {
          label: 'Reference',
          autogenerate: {directory: 'reference'},
        },
      ],
    }),
  ],
});
