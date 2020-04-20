const express = require('express');
const main = express.Router();

const fellowExecutive = require('./fellows.js');
const chainExecutive = require('./chainlist.js');
const unitslistExecutive = require('./unitslist.js');

main.use('/fellows', fellowExecutive)

main.use('/chainlist', chainExecutive)

main.use('/unitslist', unitslistExecutive)

module.exports = main;
