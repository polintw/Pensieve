const express = require('express');
const main = express.Router();

const focusExecutive = require('./focus.js');


main.use('/focus', focusExecutive)

module.exports = main;
