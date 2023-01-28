module.exports = {
  stories: ['../demo/**/*.stories.mdx', '../demo/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    config.node = { ...config.node, fs: 'empty' }
    config.module.rules.push({
      test: /\.yaml$/,
      loader: 'yaml-loader',
    })
    return config
  },
}
