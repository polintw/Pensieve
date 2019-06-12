const express = require('express');
const main = express.Router();

const accumulatedExcutive = require('./accumulated.js');

main.use('/accumulated', accumulatedExcutive)



module.exports = main;
