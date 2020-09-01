const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'lime': './src/Lime/Lime.ts',
    'lime.min': './src/Lime/Lime.ts'
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'Lime',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' }
    ]
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
      })
    ]
  }
};
