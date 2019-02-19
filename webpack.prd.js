const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'prd'),
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
