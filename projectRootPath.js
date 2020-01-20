const path = require('path');

/**
 * Keep this file as the same level as built server.js
 * to keep __dirname the same in built server.js and non built codes.
 *
 * Docs: https://webpack.js.org/configuration/node/#node__dirname
 */
const projectRootPath = path.resolve(__dirname);

module.exports = projectRootPath;
