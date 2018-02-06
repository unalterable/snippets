const path = require('path');

module.exports = {
  entry: { bundle: './javascript-for-bundling/index.js' },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
    ]
  }
};
