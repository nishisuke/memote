const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
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
