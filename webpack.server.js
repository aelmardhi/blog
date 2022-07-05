const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
module.exports = {
  entry: './server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve('server-build'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /@editorjs/,
        use: 'null-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
          test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
          use: 'file-loader'
      },
      {
        test: /\.css$/i,
        use: [
           MiniCssExtractPlugin.loader,
          "css-loader"],
      }
    ]
  },
  plugins: [].concat([new MiniCssExtractPlugin()]),
};