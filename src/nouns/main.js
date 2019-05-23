const express = require('express');
const main = express.Router();

const basicExcutive = require('./basic.js');
const exploreExecutive = require('./explore.js');
const searchExecutive = require('./search/execute.js');

main.use('/basic', basicExcutive)

main.use('/search', searchExecutive)

main.use('/explore', exploreExecutive)

module.exports = main;
