const webpackMerge = require('webpack-merge');

module.exports = webpackMerge.strategy(
  {
    'module.rules': 'append',
    plugins: 'append',
  },
);
