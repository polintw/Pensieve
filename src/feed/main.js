const express = require('express');
const main = express.Router();

const focusExcutive = require('./focus.js');
const customExcutive = require('./custom/execute.js');

main.use('/focus', focusExcutive)
main.use('/custom', customExcutive)

module.exports = main;
