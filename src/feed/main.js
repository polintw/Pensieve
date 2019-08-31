const express = require('express');
const main = express.Router();

const focusExcutive = require('./focus.js');
const bannerExcutive = require('./banner.js');
const unitExcutive = require('./unit/execute.js');

main.use('/focus', focusExcutive)
main.use('/banner', bannerExcutive)
main.use('/unit', unitExcutive)

module.exports = main;
