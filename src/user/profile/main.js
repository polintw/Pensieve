const express = require('express');
const main = express.Router();

const sheetExecutive = require('./sheet.js');
const shNodesExecutive = require('./shNodes.js');

main.use('/sheet', sheetExecutive)
main.use('/sheetsNodes', shNodesExecutive)

module.exports = main;
