const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'prd'),
  },
  resolve: {
    alias: {
      ENV: path.resolve(__dirname, `env/production.js`),
    },
  },
})
