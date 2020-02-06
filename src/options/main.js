const express = require('express');
const main = express.Router();

const belongExcutive = require('./belong.js');

main.use('/belong', belongExcutive)

module.exports = main;
