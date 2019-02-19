const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    js: './src/main.js',
    css: './src/main.css',
  },
  output: {
    filename: chunkData => {
      return chunkData.chunk.name === 'js' ? 'main.js' : 'main.css'
    },
    path: path.resolve(__dirname, 'dev'),
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
  devServer: {
    contentBase: path.resolve(__dirname, 'dev'),
    watchContentBase: true,
    compress: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  resolve: {
    alias: {
      ENV: path.resolve(__dirname, `env/development.js`),
    },
  },
}
