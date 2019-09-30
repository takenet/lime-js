var webpack = require('webpack');

module.exports = {
  entry: {
    'lime': './src/Lime/Lime.ts',
    'lime.min': './src/Lime/Lime.ts'
  },
  output: {
    path: './dist',
    filename: '[name].js',
    library: 'Lime',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' }
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
  ]
};
