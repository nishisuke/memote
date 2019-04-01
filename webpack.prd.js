const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: () => {
      let n = new Date()
      return ('0' + (n.getMonth() + 1)).slice(-2)
        + ('0' + n.getDate()).slice(-2)
        + ('0' + n.getHours()).slice(-2)
        + ('0' + n.getMinutes()).slice(-2)
        + '.[contenthash].js'
    },
    path: path.resolve(__dirname, 'prd'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
      template: 'src/tmpl.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/sw.js'),
    }),
  ],
}
