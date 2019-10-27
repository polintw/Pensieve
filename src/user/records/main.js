const express = require('express');
const main = express.Router();

const nodesExecutive = require('./nodes.js');

main.use('/nodes', nodesExecutive)

module.exports = main;
