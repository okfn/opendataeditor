module.exports = {
  stories: ['../docs/**/*.stories.mdx', '../docs/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    config.node = { ...config.node, fs: 'empty' }
    return config
  },
}
