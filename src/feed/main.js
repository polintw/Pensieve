const express = require('express');
const main = express.Router();

const focusExcutive = require('./focus.js');
const focusExcutive = require('./broads.js');
const customExcutive = require('./custom/execute.js');
const unitExcutive = require('./unit/execute.js');
const optionsExcutive = require('./options/execute.js');

main.use('/focus', focusExcutive)
main.use('/broads', broadsExcutive)
main.use('/custom', customExcutive)
main.use('/unit', unitExcutive)
main.use('/options', optionsExcutive)

module.exports = main;
