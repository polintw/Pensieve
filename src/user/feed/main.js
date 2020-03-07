const express = require('express');
const main = express.Router();

const fellowExecutive = require('./fellows.js');
const chainExecutive = require('./chainlist.js');

main.use('/fellows', fellowExecutive)

main.use('/chainlist', chainExecutive)

module.exports = main;
