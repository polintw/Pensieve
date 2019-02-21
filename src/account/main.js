const express = require('express');
const main = express.Router();

const settingExecutive = require('./setting.js');
const passwordExecutive = require('./password.js');

main.use('/setting', settingExecutive)

main.use('/password', passwordExecutive)

module.exports = main;
