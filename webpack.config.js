var path = require('path');

module.exports = {
  entry: './src/Lime/Lime.ts',
  output: {
    filename: 'lime.js',
    library: 'Lime',
    libraryTarget: 'this'
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' }
    ]
  }

};
