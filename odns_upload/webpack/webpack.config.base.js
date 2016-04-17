'use strict';

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'odns-upload',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  }
};
