const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    js: './src/main.js',
    css: './src/main.css',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'prd'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      ENV: path.resolve(__dirname, `env/production.js`),
    },
  },
  plugins: [
    new CleanWebpackPlugin(['prd']),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
})
