import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Open Data Editor',
      social: {
        github: 'https://github.com/frictionlessdata/open-data-editor',
      },
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
