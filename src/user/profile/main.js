const express = require('express');
const main = express.Router();

const sheetExecutive = require('./sheet.js');

main.use('/sheet', sheetExecutive)

module.exports = main;
