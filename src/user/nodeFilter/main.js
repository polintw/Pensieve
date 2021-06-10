const express = require('express');
const main = express.Router();
const winston = require('../../../config/winston.js');

const accumulationsExecutive = require('./accumulations.js');

main.use('/accumulations', accumulationsExecutive)

module.exports = main;
