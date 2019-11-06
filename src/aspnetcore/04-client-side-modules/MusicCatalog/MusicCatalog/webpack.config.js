const path = require('path');

module.exports = {
  entry: {
    babelpolyfill: 'babel-polyfill',
    search: './Scripts/search.js',
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/js'),
    filename: '[name]-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
            },
          },
        ],
      },
    ],
  },
};
