import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Open Data Editor',
      logo: {
        light: '/src/assets/logo-light-orange.png',
        dark: '/src/assets/logo-dark-orange.png',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/frictionlessdata/open-data-editor',
      },
      customCss: ['/src/assets/styles.css'],
      sidebar: [
        {
          label: 'Documentation',
          autogenerate: {directory: 'documentation'},
        },
        {
          label: 'Contributing',
          autogenerate: {directory: 'contributing'},
        }
      ],
    }),
  ],
});
