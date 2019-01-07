const express = require('express');
const main = express.Router();

const basicExcutive = require('./basic.js');
const searchExecutive = require('./search/execute.js');

main.use('/basic', basicExcutive)

main.use('/search', searchExecutive)

module.exports = main;
