const express = require('express');
const main = express.Router();

const countExecutive = require('./count.js');
const listExecutive = require('./list.js');

main.use('/count', countExecutive)

main.use('/list', listExecutive)

module.exports = main;
