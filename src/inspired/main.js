const express = require('express');
const main = express.Router();

const accumulatedExecutive = require('./accumulated.js');
const plainExecutive = require('./plain.js');

main.use('/accumulated', accumulatedExecutive)

main.use('/', plainExecutive)

module.exports = main;
