const express = require('express');
const main = express.Router();

const listExcutive = require('./list.js');
const statusExcutive = require('./status.js');
const settingExcutive = require('./setting/execute.js');

main.use('/list', listExcutive)
main.use('/status', statusExcutive)
main.use('/setting', settingExcutive)

module.exports = main;
