const express = require('express');
const main = express.Router();

const belongExcutive = require('./belong.js');
const matchNodesExcutive = require('./matchNodes/execute.js');

main.use('/belong', belongExcutive)
main.use('/matchNodes', matchNodesExcutive)

module.exports = main;
