const express = require('express');
const main = express.Router();

const settingExecutive = require('./setting.js');

main.use('/setting', settingExecutive)

module.exports = main;
