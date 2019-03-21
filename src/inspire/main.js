const express = require('express');
const main = express.Router();

const plainExecutive = require('./plain.js');
const embeddedExecutive = require('./embedded.js');

main.use('/embedded', embeddedExecutive)

main.use('/', plainExecutive)

module.exports = main;
