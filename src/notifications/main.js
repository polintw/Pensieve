const express = require('express');
const main = express.Router();

const countExecutive = require('./count.js');

main.use('/count', countExecutive)

module.exports = main;
