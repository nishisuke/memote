const path = require('path');

module.exports = env => ({
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
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
      ENV: path.resolve(__dirname, `env/${env || 'development'}.js`),
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
    watchContentBase: true,
    compress: true,
    port: 8080,
  },
})
