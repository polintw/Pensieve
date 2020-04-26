const express = require('express');
const main = express.Router();

const fellowExecutive = require('./fellows.js');

main.use('/fellows', fellowExecutive)

module.exports = main;
