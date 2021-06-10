const express = require('express');
const main = express.Router();

const accumulatedExecutive = require('./accumulated.js');
const nodesExecutive = require('./nodes.js');
const plainExecutive = require('./plain.js');

main.use('/accumulated', accumulatedExecutive)

main.use('/nodes', nodesExecutive)

main.use('/', plainExecutive)

module.exports = main;
