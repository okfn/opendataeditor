const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: ['./src/main.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'application.js',
    library: 'application',
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
      title: 'Frictionless Application',
      favicon: 'assets/favicon.png',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        description:
          'Data management application for Browser and Desktop that provides functionality to describe, extract, validate, and transform tabular data',
      },
    }),
  ],
}

// Development

if (NODE_ENV === 'development') {
  webpackConfig.mode = 'development'
  webpackConfig.devServer = {
    proxy: {
      '/api': {
        target: 'http://localhost:4040',
        pathRewrite: { '^/api': '' },
      },
    },
    static: './dist',
  }
}

// Testing

if (NODE_ENV === 'testing') {
  webpackConfig.mode = 'development'
}

// Production

if (NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
}

// System

module.exports = webpackConfig
