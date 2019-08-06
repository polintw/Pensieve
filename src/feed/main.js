const express = require('express');
const main = express.Router();

const focusExcutive = require('./focus.js');
const bannerExcutive = require('./banner.js');

main.use('/focus', focusExcutive)
main.use('/banner', bannerExcutive)

module.exports = main;
