const baseConfig = require('./webpack.base.conf.js');
const merge = require('./merge-strategy');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});
