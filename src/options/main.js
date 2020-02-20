const express = require('express');
const main = express.Router();

const nodesExcutive = require('./nodes/execute.js');

main.use('/nodes', nodesExcutive)

module.exports = main;
