import type { StorybookConfig } from '@storybook/react-webpack5'
const config: StorybookConfig = {
  stories: ['../demo/**/*.mdx', '../demo/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    config.module!.rules!.push({
      test: /\.yaml$/,
      loader: 'yaml-loader',
    })
    return config
  },
}

export default config
