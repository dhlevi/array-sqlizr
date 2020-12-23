const path = require('path');

module.exports = {
  entry: './index.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'array-sqlizr.js',
    path: path.resolve(__dirname, 'dist/lib'),
  },
};