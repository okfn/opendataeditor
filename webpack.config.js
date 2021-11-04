const path = require('path')
const webpack = require('webpack')
const NODE_ENV = process.env.NODE_ENV || 'development'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: ['./src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'application.js',
    library: 'application',
    libraryTarget: 'umd',
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
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV, DEBUG })],
}

// Development

if (NODE_ENV === 'development') {
  webpackConfig.mode = 'development'
  webpackConfig.devServer = { hot: true }
  webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin())
}

// Testing

if (NODE_ENV === 'testing') {
  webpackConfig.mode = 'development'
}

// Production

if (NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
  webpackConfig.output.filename = 'application.min.js'
}

// System

module.exports = webpackConfig
