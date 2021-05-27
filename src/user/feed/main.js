const express = require('express');
const main = express.Router();

const chainExecutive = require('./chainlist.js');
const focusExecutive = require('./focus.js');
const unitslistExecutive = require('./unitslist.js');

main.use('/chainlist', chainExecutive)

main.use('/unitslist', unitslistExecutive)

main.use('/focus', focusExecutive)

module.exports = main;
