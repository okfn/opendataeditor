const path = require('path')
const webpack = require('webpack')
const version = require('./package.json').version
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const ENTRY = process.env.ENTRY || 'browser'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: ['./src/client/targets/browser.ts'],
  output: {
    path: path.resolve(__dirname, 'dist/browser'),
    filename: 'browser.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          onlyCompileBundledFiles: true,
          compilerOptions: {
            declaration: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.yaml$/,
        loader: 'yaml-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV, DEBUG }),
    new HtmlWebpackPlugin({
      favicon: 'src/client/targets/assets/favicon.png',
      template: 'src/client/targets/browser.html',
      templateParameters: { version },
    }),
  ],
}

// Development

if (NODE_ENV === 'development') {
  webpackConfig.mode = 'development'
  // https://stackoverflow.com/a/66209788
  webpackConfig.devtool = 'eval-cheap-source-map'
  webpackConfig.devServer = {
    proxy: {
      '/api': {
        target: 'http://localhost:4040',
        pathRewrite: { '^/api': '' },
      },
    },
    static: './dist/browser',
  }
}

// Testing

if (NODE_ENV === 'testing') {
  webpackConfig.mode = 'development'
}

// Production

if (NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
  webpackConfig.plugins[2] = new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|html)$/,
    threshold: 10240,
    minRatio: 0.8,
  })
}

// Metadata

if (ENTRY === 'library') {
  webpackConfig.entry = ['./src/client/targets/library.ts']
  webpackConfig.output.filename = 'library.js'
  webpackConfig.output.library = 'odet'
  webpackConfig.output.path = path.resolve(__dirname, 'dist/library')
  delete webpackConfig.plugins[1]
}

module.exports = webpackConfig
