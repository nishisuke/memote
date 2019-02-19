const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dev'),
    watchContentBase: true,
    compress: true,
    port: 8080,
  },
  plugins: [
    new CleanWebpackPlugin(['dev']),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  resolve: {
    alias: {
      ENV: path.resolve(__dirname, `env/development.js`),
    },
  },
})
