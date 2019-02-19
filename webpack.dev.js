const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

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
  resolve: {
    alias: {
      ENV: path.resolve(__dirname, `env/development.js`),
    },
  },
})
