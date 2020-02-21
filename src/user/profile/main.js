const express = require('express');
const main = express.Router();

const sheetExecutive = require('./sheet.js');
const ndBelongExec = require('./nodesBelong.js');

main.use('/sheet', sheetExecutive)

main.use('/nodesBelong', ndBelongExec)

module.exports = main;
