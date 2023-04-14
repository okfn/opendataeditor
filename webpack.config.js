const path = require('path')
const webpack = require('webpack')
const version = require('./package.json').version
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const ENTRY = process.env.ENTRY || 'application'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: ['./src/application.ts'],
  output: {
    path: path.resolve(__dirname, 'dist/application'),
    filename: 'application.js',
    library: 'frictionlessApplication',
    libraryTarget: 'umd',
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
      favicon: 'assets/favicon.png',
      template: 'src/application.html',
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
    static: './dist/application',
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

if (ENTRY === 'metadata') {
  webpackConfig.entry = ['./src/metadata.ts']
  webpackConfig.output.filename = 'metadata.js'
  webpackConfig.output.library = 'frictionlessMetadata'
  webpackConfig.output.path = path.resolve(__dirname, 'dist/metadata')
  webpackConfig.plugins[1] = new HtmlWebpackPlugin({
    favicon: 'assets/favicon.png',
    template: 'src/metadata.html',
    templateParameters: { version },
  })
}

module.exports = webpackConfig
