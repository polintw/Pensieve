const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    'server': [
      path.resolve(__dirname, '../../server.js'),
    ]
  },
  output: {
    path: path.resolve(__dirname, '../../'),
    filename: 'serverBuilt.js',
  },
  target: 'node',
  resolve: {
    modules: ['src', 'node_modules']
  },
  externals: [
    nodeExternals(),
    // Need this to avoid error when working with Express
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          path.resolve(__dirname, '../../node_modules/')
        ],
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ],
  },
  devtool: '#source-map',
  node: {
    __dirname: false,
  },
};
